import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "@/components/ui/sonner";
import { BRAND } from "@/lib/config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-4 text-foreground">Тази страница я няма</h1>
        <hr className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-sm text-muted-foreground">
          Възможно е връзката да е стара или адресът да е сгрешен.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Към началото
          </Link>
          <Link
            to="/poruchaj"
            className="inline-flex items-center justify-center border border-input px-6 py-3 text-sm tracking-wide transition-colors hover:bg-accent"
          >
            Поръчай кутия
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="display-md text-foreground">Страницата не се зареди</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Нещо се обърка при нас. Опитай отново или се върни към началото.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Опитай отново
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-input px-6 py-3 text-sm tracking-wide transition-colors hover:bg-accent"
          >
            Към началото
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND.name} — подаръчна кутия с рози` },
      {
        name: "description",
        content:
          "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна.",
      },
      { name: "author", content: BRAND.name },
      { property: "og:site_name", content: BRAND.name },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "bg_BG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#fbf8f2" },
      { title: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка" },
      { property: "og:title", content: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка" },
      { name: "twitter:title", content: "FLOWERPOST — подаръчна кутия с рози и ръчно изписана картичка" },
      { property: "og:description", content: "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна." },
      { name: "twitter:description", content: "Премиум подаръчна кутия със свежи рози, персонализирано послание и ръчно изписано име. Безплатна доставка в София, куриер за цялата страна." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5TYqoKmG57O885wTcxRiP1sDZGD3/social-images/social-1785869855579-social-image.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5TYqoKmG57O885wTcxRiP1sDZGD3/social-images/social-1785869855579-social-image.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.name,
          url: `https://${BRAND.domain}`,
          email: BRAND.email,
          address: { "@type": "PostalAddress", addressLocality: "София", addressCountry: "BG" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/vhod");

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          {!bare && <Header />}
          <main className="flex-1">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          {!bare && <Footer />}
        </div>
        {!bare && <CookieBanner />}
        <Toaster position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
