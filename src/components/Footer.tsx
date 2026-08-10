export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-ink px-8 py-20 text-ribbon md:px-14 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <div className="tf-headline mb-3 text-ivory" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            FLOWERPOST
          </div>
          <div className="tf-mono text-gold">Bulgaria</div>
        </div>

        <div className="tf-mono text-mist">
          © {new Date().getFullYear()} Flowerpost · Всички права запазени
        </div>
      </div>
    </footer>
  );
}
