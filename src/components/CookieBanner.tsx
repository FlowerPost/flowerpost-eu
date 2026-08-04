import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { readConsent, writeConsent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (a: boolean, m: boolean) => {
    writeConsent({ analytics: a, marketing: m });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Съгласие за бисквитки"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
    >
      <div className="container-fp py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Използваме бисквитки, за да работи сайтът и — само с твое съгласие — за анонимна
            статистика. Повече в{" "}
            <Link to="/biskvitki" className="underline underline-offset-4 hover:text-foreground">
              Политиката за бисквитките
            </Link>
            .
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="ghost" size="sm" className="rounded-none" onClick={() => setDetails((v) => !v)}>
              Настройки
            </Button>
            <Button variant="outline" size="sm" className="rounded-none" onClick={() => decide(false, false)}>
              Само необходими
            </Button>
            <Button size="sm" className="rounded-none" onClick={() => decide(true, true)}>
              Приемам всички
            </Button>
          </div>
        </div>

        {details && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Необходими бисквитки — винаги активни.</p>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={analytics} onCheckedChange={(v) => setAnalytics(v === true)} />
              <span>Аналитични (анонимна статистика за ползването)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={marketing} onCheckedChange={(v) => setMarketing(v === true)} />
              <span>Маркетингови (ремаркетинг и кампании)</span>
            </label>
            <Button size="sm" className="rounded-none" onClick={() => decide(analytics, marketing)}>
              Запази избора
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
