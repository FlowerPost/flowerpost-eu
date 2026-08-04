import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/forms.functions";
import { track } from "@/lib/analytics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function NewsletterForm({ className = "" }: { className?: string }) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Необходимо е съгласие за получаване на имейли.");
      return;
    }
    setState("loading");
    try {
      const res = await subscribe({ data: { email, consent: true } });
      if (res.ok) {
        setState("done");
        track("newsletter_signup");
      } else {
        setState("idle");
        setError(res.error);
      }
    } catch {
      setState("idle");
      setError("Въведи валиден имейл адрес.");
    }
  }

  if (state === "done") {
    return (
      <p className={`text-sm text-foreground ${className}`}>
        Благодарим. Ще ти пишем само когато има какво да кажем.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-3 ${className}`} noValidate>
      <div className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="твоят@имейл.bg"
          aria-label="Имейл за бюлетин"
          className="h-10 rounded-none bg-background"
        />
        <Button type="submit" size="sm" variant="secondary" className="h-10 rounded-none px-4" disabled={state === "loading"}>
          {state === "loading" ? "…" : "Запиши ме"}
        </Button>
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
          aria-label="Съгласие за бюлетин"
        />
        <span>Съгласявам се да получавам имейли и приемам Политиката за поверителност.</span>
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
