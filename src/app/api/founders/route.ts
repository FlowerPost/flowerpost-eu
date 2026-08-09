import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { sendFoundersClubConfirmation } from '@/lib/email';

const TOTAL_SPOTS = 50;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_ATTEMPTS = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashIp(ip: string) {
  // Don't store raw IPs (GDPR) — a salted hash is enough to rate limit.
  const salt = process.env.RATE_LIMIT_SALT ?? 'flowerpost-default-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

async function checkRateLimit(ipHash: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const now = Date.now();

  const { data: existing } = await supabase
    .from('founders_club_rate_limit')
    .select('attempt_count, window_start')
    .eq('ip_hash', ipHash)
    .maybeSingle();

  if (!existing) {
    await supabase
      .from('founders_club_rate_limit')
      .insert({ ip_hash: ipHash, attempt_count: 1, window_start: new Date().toISOString() });
    return true;
  }

  const windowStart = new Date(existing.window_start).getTime();
  const windowExpired = now - windowStart > RATE_LIMIT_WINDOW_MS;

  if (windowExpired) {
    await supabase
      .from('founders_club_rate_limit')
      .update({ attempt_count: 1, window_start: new Date().toISOString() })
      .eq('ip_hash', ipHash);
    return true;
  }

  if (existing.attempt_count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  await supabase
    .from('founders_club_rate_limit')
    .update({ attempt_count: existing.attempt_count + 1 })
    .eq('ip_hash', ipHash);
  return true;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Невалидна заявка.' }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === 'string'
    ? (body as { email: string }).email.trim().toLowerCase()
    : '';

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Моля, въведи валиден имейл адрес.' }, { status: 400 });
  }

  const ipHash = hashIp(getClientIp(req));

  const withinLimit = await checkRateLimit(ipHash);
  if (!withinLimit) {
    return NextResponse.json(
      { error: 'Твърде много опити. Опитай отново по-късно.' },
      { status: 429 }
    );
  }

  const supabase = getSupabaseServerClient();

  const { data: inserted, error: insertError } = await supabase
    .from('founders_club')
    .insert({ email })
    .select('position_number')
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      // Unique violation — email already registered.
      const { count } = await supabase
        .from('founders_club')
        .select('*', { count: 'exact', head: true });
      return NextResponse.json(
        {
          error: 'Този имейл вече е регистриран в Founders\' Club.',
          totalSpots: TOTAL_SPOTS,
          takenSpots: count ?? 0,
        },
        { status: 409 }
      );
    }

    console.error('Founders club insert failed:', insertError);
    return NextResponse.json({ error: 'Възникна грешка. Опитай отново.' }, { status: 500 });
  }

  const positionNumber = inserted.position_number as number;

  const { count: takenSpots } = await supabase
    .from('founders_club')
    .select('*', { count: 'exact', head: true });

  try {
    await sendFoundersClubConfirmation(email, positionNumber);
  } catch (emailError) {
    // Registration succeeded even if the confirmation email fails to send.
    console.error('Founders club confirmation email failed:', emailError);
  }

  return NextResponse.json({
    success: true,
    positionNumber,
    totalSpots: TOTAL_SPOTS,
    takenSpots: takenSpots ?? positionNumber,
  });
}

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { count } = await supabase
    .from('founders_club')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    totalSpots: TOTAL_SPOTS,
    takenSpots: count ?? 0,
  });
}
