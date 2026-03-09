import styles from "./FAQ.module.css";

const SOLVERS = [
  { name: "Heat Transfer Rate",             code: "transf-calor" },
  { name: "Cylinder Cross Flow (Nu)",        code: "corr-cilindro-cruzado" },
  { name: "Mean Temperature — Const. q″",   code: "temp-media-const-q" },
  { name: "Mean Temperature — Const. Tₛ",   code: "temp-media-const-ts" },
  { name: "Cross Flow Energy Balance",       code: "bal-energia-cruzado" },
  { name: "Fin Parameters",                  code: "parametros-parede-aleta" },
  { name: "Fin Heat Transfer — Case A",      code: "transf-aleta-a" },
  { name: "Fin Heat Transfer — Case B",      code: "transf-aleta-b" },
  { name: "Fin Heat Transfer — Case C",      code: "transf-aleta-c" },
  { name: "Fin Heat Transfer — Case D",      code: "transf-aleta-d" },
  { name: "Fin Temp. Distribution — Case A", code: "dist-temp-aleta-a" },
  { name: "Fin Temp. Distribution — Case B", code: "dist-temp-aleta-b" },
  { name: "Fin Temp. Distribution — Case C", code: "dist-temp-aleta-c" },
  { name: "Fin Temp. Distribution — Case D", code: "dist-temp-aleta-d" },
  { name: "Theta Definition",                code: "def-theta" },
  { name: "Flat Fin Efficiency",             code: "efic-aleta" },
];

const ITEMS = [
  {
    q: "What is HeatSphere?",
    a: "HeatSphere is a study platform built around convective heat transfer. It gives you structured content, interactive tools, and a personal workspace — all in one place.",
  },
  {
    q: "What can I do here?",
    a: null,
    list: [
      "Write and organize notes in Markdown, with support for LaTeX equations and PDF imports.",
      "Access chapter formularies with all key equations rendered beautifully — exportable as PDF.",
      "Drop interactive solvers directly into any note using a simple code block syntax.",
      "Work through step-by-step calculations that walk you through real problems from scratch.",
    ],
  },
  {
    q: "How do solvers work?",
    a: "Inside any Markdown note, open a fenced code block with the prefix solver: followed by the solver name. The editor will replace it with a live, interactive calculator.",
    code: "```solver:transf-aleta-c",
  },
  {
    q: "Available solvers",
    a: null,
    table: true,
  },
  {
    q: "What about Calculations?",
    a: "Calculations are fully worked problems — each one walks through a real exercise step by step, showing every assumption, formula, and numerical result. Coming soon.",
  },
];

export default function FAQ() {
  return (
    <section className={styles.faq}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>

        <div className={styles.list}>
          {ITEMS.map((item) => (
            <div key={item.q} className={styles.item}>
              <h3 className={styles.question}>{item.q}</h3>

              {item.a && !item.code && (
                <p className={styles.answer}>{item.a}</p>
              )}

              {item.list && (
                <ul className={styles.featureList}>
                  {item.list.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}

              {item.code && (
                <>
                  <p className={styles.answer}>{item.a}</p>
                  <pre className={styles.codeBlock}><code>{item.code}</code></pre>
                </>
              )}

              {item.table && (
                <div className={styles.tableWrap}>
                  <table className={styles.solverTable}>
                    <thead>
                      <tr>
                        <th>Solver</th>
                        <th>Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SOLVERS.map((s) => (
                        <tr key={s.code}>
                          <td>{s.name}</td>
                          <td><code className={styles.inlineCode}>{s.code}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
