import styles from "./FAQ.module.css";

const SOLVERS = [
  { name: "Linear Interpolation",                                    code: "linear-interpolation" },
  { name: "Heat Transfer Rate (Newton's Law)",                        code: "heat-transfer-rate" },
  { name: "Cylinder Cross-Flow (Churchill-Bernstein)",                code: "churchill-bernstein-1" },
  { name: "Cylinder Cross-Flow (Churchill-Bernstein) Extended",       code: "churchill-bernstein-2" },
  { name: "Flat Plate (Churchill–Ozoe)",                              code: "churchill-ozoe" },
  { name: "Internal Flow — Avg. Temperature (q'' constant)",          code: "internal-flow-avg-temp-q-const" },
  { name: "Internal Flow — Avg. Temperature (Ts constant)",           code: "internal-flow-avg-temp-ts-const" },
  { name: "Cross Flow — Energy Balance (Ts constant)",                code: "cross-flow-energy-balance-ts-const" },
  { name: "Fin — Parameters m and M",                                 code: "fin-parameters" },
  { name: "Fin — Excess Temperature θ and θb",                        code: "fin-excess-temp" },
  { name: "Fin — Heat Transfer Case A (Convective Tip)",              code: "fin-heat-transfer-case-a" },
  { name: "Fin — Heat Transfer Case B (Adiabatic Tip)",               code: "fin-heat-transfer-case-b" },
  { name: "Fin — Heat Transfer Case C (Prescribed Temperature)",      code: "fin-heat-transfer-case-c" },
  { name: "Fin — Heat Transfer Case D (Infinite Fin)",                code: "fin-heat-transfer-case-d" },
  { name: "Fin — Temperature Distribution Case A",                    code: "fin-temp-dist-case-a" },
  { name: "Fin — Temperature Distribution Case B",                    code: "fin-temp-dist-case-b" },
  { name: "Fin — Temperature Distribution Case C",                    code: "fin-temp-dist-case-c" },
  { name: "Fin — Temperature Distribution Case D",                    code: "fin-temp-dist-case-d" },
  { name: "Fin — Efficiency (Rectangular Profile, Eq. 3.94)",         code: "fin-rect-profile-efficiency" },
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
    a: "Inside any Markdown note, type \\ followed by the solver name. A live interactive calculator will be embedded inline — no extra syntax needed. You can also browse all available solvers by typing \\ and waiting for the autocomplete palette to appear.",
    code: "\\fin-heat-transfer-case-a",
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
