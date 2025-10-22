import type { Metadata } from "next";
import Link from "next/link";
import { Merriweather, Noto_Serif, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, NAVIGATION_ITEMS } from "@/lib/constants";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap"
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap"
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
  display: "swap"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${sourceSerif.variable} ${notoSerif.variable} ${merriweather.variable}`}
    >
      <body className="bg-surface text-ink font-serif antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-ink-subtle">{APP_NAME}</p>
              <h1 className="text-2xl font-semibold text-ink">档案式阅读体验原型</h1>
            </div>
            <nav className="flex gap-5 text-base text-ink-subtle">
              {NAVIGATION_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-ink"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-ink/10 pt-6 text-xs uppercase tracking-[0.3em] text-ink-subtle">
            {APP_NAME} · {new Date().getFullYear()}
          </footer>
        </div>
      </body>
    </html>
  );
}
