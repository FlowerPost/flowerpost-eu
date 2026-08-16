export function Footer() {
  return (
    <footer className="border-t border-ink/10 px-8 py-20 text-bordeaux md:px-14 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <div className="tf-headline mb-3 text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            FLOWERPOST
          </div>
          <div className="tf-mono text-bordeaux">Bulgaria</div>
        </div>

        <div className="tf-mono text-stone">
          © {new Date().getFullYear()} Flowerpost · Всички права запазени
        </div>
      </div>
    </footer>
  );
}
