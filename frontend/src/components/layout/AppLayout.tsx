import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./AppLayout.module.css";
import ScrollToAnchor from "../ScrollToAnchor.tsx";
import { useAuth } from "../../lib/auth";

export default function AppLayout() {
    const location = useLocation();
    const isNotesPage = location.pathname.startsWith('/my-notes');
    const { user, isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // Fecha ao navegar
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // Trava scroll quando drawer aberto
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const avatarNode = isAuthenticated && user ? (
        <Link to="/my-notes" className={styles.avatarLink}>
            {user.pictureUrl
                ? <img src={user.pictureUrl} alt={user.name} className={styles.avatar} />
                : <span className={styles.avatarFallback}>{user.name[0]}</span>
            }
            <span className={styles.avatarName}>{user.name.split(' ')[0]}</span>
        </Link>
    ) : (
        <Link to="/my-notes">My Notes</Link>
    );

    return (
        <div className={styles.shell} style={isNotesPage ? { backgroundColor: '#FDF9F4' } : {}}>
            <ScrollToAnchor />

            {!isNotesPage && (
                <header className={styles.header}>

                    {/* ── Pill nav — desktop ── */}
                    <nav className={styles.nav} aria-label="Primary">
                        <div className={styles.dropdown}>
                            <Link to="/modules/#modules">
                                <button className={styles.dropdownToggle}>Modules ▾</button>
                            </Link>
                            <div className={styles.dropdownMenu}>
                                <Link to="/modules/introduction-to-convection">Intro to Convection</Link>
                                <Link to="/modules/external-flow">External Flow</Link>
                                <Link to="/modules/internal-flow">Internal Flow</Link>
                                <Link to="/modules/free-convection">Free Convection</Link>
                                <Link to="/modules/boiling">Boiling</Link>
                                <Link to="/modules/condensation">Condensation</Link>
                                <Link to="/modules/heat-exchangers">Heat Exchangers</Link>
                            </div>
                        </div>

                        <Link to="/formularies">Formularies</Link>
                        <Link to="/solvers">Solvers</Link>
                        <Link to="/calculations">Calculations</Link>
                        {avatarNode}
                    </nav>

                    {/* ── Hamburger — mobile ── */}
                    <button
                        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        <span /><span /><span />
                    </button>
                </header>
            )}

            {/* ── Mobile drawer ── */}
            {!isNotesPage && (
                <div
                    className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
                    onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
                    aria-hidden={!menuOpen}
                >
                    <div className={styles.mobileDrawer}>
                        <span className={styles.mobileSectionLabel}>Modules</span>
                        <Link className={styles.mobileSubLink} to="/modules/introduction-to-convection">Intro to Convection</Link>
                        <Link className={styles.mobileSubLink} to="/modules/external-flow">External Flow</Link>
                        <Link className={styles.mobileSubLink} to="/modules/internal-flow">Internal Flow</Link>
                        <Link className={styles.mobileSubLink} to="/modules/free-convection">Free Convection</Link>
                        <Link className={styles.mobileSubLink} to="/modules/boiling">Boiling</Link>
                        <Link className={styles.mobileSubLink} to="/modules/condensation">Condensation</Link>
                        <Link className={styles.mobileSubLink} to="/modules/heat-exchangers">Heat Exchangers</Link>

                        <span className={styles.mobileSectionLabel}>Content</span>
                        <Link to="/formularies">Formularies</Link>
                        <Link to="/solvers">Solvers</Link>
                        <Link to="/calculations">Calculations</Link>

                        <span className={styles.mobileSectionLabel}>Account</span>
                        {avatarNode}
                    </div>
                </div>
            )}

            <main
                className={styles.main}
                style={isNotesPage ? { padding: 0, margin: 0, height: '100vh', width: '100vw', maxWidth: 'none', display: 'flex' } : {}}
            >
                <Outlet />
            </main>

            {!isNotesPage && (
                <footer className={styles.footer}>
                    <p>© 2026 HeatSphere. All rights reserved.</p>
                    <p className={styles.techStack}>Powered by .NET & React/TypeScript</p>
                    <p>
                        Made by{" "}
                        <a href="https://github.com/guilhermedoprado" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                            Guilherme do Prado
                        </a>
                    </p>
                    <p className={styles.credits}>Pictures by Freepik</p>
                </footer>
            )}
        </div>
    );
}
