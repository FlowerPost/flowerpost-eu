export function Footer() {
  return (
    <footer className="bg-ink px-8 py-16 text-ribbon md:px-14">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="tf-headline mb-2 text-ivory" style={{ fontSize: "1.5rem" }}>
            FLOWERPOST
          </div>
          <div className="tf-mono text-gold">Bulgaria</div>
        </div>

        <div className="tf-mono text-ribbon/70">
          © {new Date().getFullYear()} Flowerpost · Всички права запазени
        </div>
      </div>
    </footer>
  );
}
