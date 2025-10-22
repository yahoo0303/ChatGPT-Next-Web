import Link from "next/link";
import { APP_NAME, HOME_INTRO, READER_ROUTE } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-prose flex-col gap-6">
      <h2 className="text-3xl font-semibold text-ink">欢迎来到 {APP_NAME}</h2>
      <p className="text-lg leading-relaxed text-ink-subtle">{HOME_INTRO}</p>
      <Link
        href={READER_ROUTE}
        className="inline-flex w-fit items-center gap-2 rounded-reader bg-accent px-5 py-3 text-base font-medium text-surface shadow-sheet transition hover:bg-accent-soft hover:text-ink"
      >
        进入阅读器
      </Link>
    </section>
  );
}
