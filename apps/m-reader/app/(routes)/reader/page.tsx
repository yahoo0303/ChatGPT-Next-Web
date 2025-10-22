import { TableOfContents } from "@/components/TableOfContents";
import { Toolbar } from "@/components/Toolbar";

const SAMPLE_SECTIONS = [
  { id: "introduction", title: "导言" },
  { id: "timeline", title: "时间线" },
  { id: "files", title: "档案文件" },
  { id: "annotations", title: "批注" }
];

export default function ReaderPage() {
  return (
    <section className="grid gap-reader-gutter lg:grid-cols-[320px_1fr]">
      <TableOfContents items={SAMPLE_SECTIONS} />
      <div className="flex flex-col gap-6">
        <Toolbar />
        <article className="rounded-reader bg-surface-muted px-8 py-10 shadow-sheet">
          <h2 className="mb-4 text-2xl font-semibold text-ink">阅读器工作区</h2>
          <p className="leading-relaxed text-ink-subtle">
            解析器和排版逻辑将在后续迭代中接入。当前版本提供布局外壳，以便并行构建后续功能。
          </p>
        </article>
      </div>
    </section>
  );
}
