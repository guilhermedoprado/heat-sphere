import katex from "katex";

type MathProps = {
  math: string;
  className?: string;
};

function renderMath(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math, {
      displayMode,
      strict: false,
      throwOnError: false,
      output: "html",
    });
  } catch {
    return `<span class="katex-error">${math}</span>`;
  }
}

export function InlineMath({ math, className }: MathProps) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderMath(math, false) }} />;
}

export function BlockMath({ math, className }: MathProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMath(math, true) }} />;
}
