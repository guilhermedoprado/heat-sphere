type SlashItem = { key: string; label: string };

type Props = {
    items:    SlashItem[];
    onSelect: (key: string) => void;
    position: { top: number; left: number };  // ← sem anchorRef, só coordenadas
};

export function SlashCommandMenu({ items, onSelect, position }: Props) {
    if (items.length === 0) return null;

    return (
        <div style={{
            position:     "fixed",
            top:          position.top,
            left:         position.left,
            background:   "#fff",
            border:       "1px solid #e6d8c0",
            borderRadius: "8px",
            boxShadow:    "0 4px 20px rgba(0,0,0,0.15)",
            zIndex:       9999,
            maxHeight:    "320px",
            overflowY:    "auto",
            minWidth:     "420px",
            fontFamily:   "'Inter', sans-serif",
        }}>
            <div style={{
                padding:       "0.4rem 0.9rem",
                fontSize:      "0.7rem",
                color:         "#aaa",
                fontWeight:    600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderBottom:  "1px solid #f5ede0",
            }}>
                <code style={{ background: "#f5ede0", padding: "0.1rem 0.3rem", borderRadius: 4 }}>\</code> Solvers — {items.length} resultado{items.length !== 1 ? "s" : ""}
            </div>

            {items.map(({ key, label }) => (
                <div
                    key={key}
                    onClick={() => onSelect(key)}
                    style={{
                        padding:       "0.55rem 1rem",
                        cursor:        "pointer",
                        borderBottom:  "1px solid #f5ede0",
                        display:       "flex",
                        flexDirection: "column",
                        gap:           "0.1rem",
                        background:    "white",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF9F4")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                    <span style={{ fontWeight: 700, color: "#c15a01", fontSize: "0.88rem" }}>
                        {label}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#bbb", fontFamily: "monospace" }}>
                        solver:{key}
                    </span>
                </div>
            ))}
        </div>
    );
}
