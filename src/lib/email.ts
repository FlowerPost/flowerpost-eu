import { Resend } from 'resend';

function foundersClubEmailHtml(positionNumber: number) {
  return `
  <div style="background:#F5F5DC;padding:40px 20px;font-family:Georgia,serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:2px solid #A0522D;padding:40px;text-align:center;">
      <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#8A9A5B;text-transform:uppercase;margin:0 0 16px;">
        Founders' Club
      </p>
      <h1 style="font-size:28px;color:#A0522D;margin:0 0 16px;">
        Добре дошъл в ритуала
      </h1>
      <p style="font-size:15px;color:rgba(160,82,45,0.8);line-height:1.6;margin:0 0 24px;">
        Ти си основател номер <strong>${positionNumber}</strong> от общо 50 места.
        Запазихме мястото ти — очаквай новини за първата доставка съвсем скоро.
      </p>
      <div style="display:inline-block;padding:12px 24px;background:#A0522D;color:#F5F5DC;font-family:'Courier New',monospace;font-weight:bold;font-size:13px;letter-spacing:1px;">
        МЯСТО № ${positionNumber}
      </div>
      <p style="font-family:'Courier New',monospace;font-size:11px;color:rgba(160,82,45,0.5);margin:32px 0 0;">
        FlowerPost · От фермата до твоята ваза
      </p>
    </div>
  </div>`;
}

export async function sendFoundersClubConfirmation(email: string, positionNumber: number) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromAddress) {
    console.warn(
      'RESEND_API_KEY or RESEND_FROM_EMAIL not configured — skipping confirmation email.'
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: `Ти си основател №${positionNumber} във FlowerPost`,
    html: foundersClubEmailHtml(positionNumber),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { skipped: false };
}
