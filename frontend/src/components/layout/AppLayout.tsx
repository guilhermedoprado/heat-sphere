import {Link, Outlet, useLocation } from "react-router-dom";
import styles from "./AppLayout.module.css";
import ScrollToAnchor from "../ScrollToAnchor.tsx";

export default function AppLayout() {
    const location = useLocation();

    const isNotesPage = location.pathname.startsWith('/my-notes');

    return (
        <div className={styles.shell}>
            <ScrollToAnchor />
            {!isNotesPage && (
            <header className={styles.header}>
                <nav className={styles.nav} aria-label="Primary">
                    <div className={styles.dropdown}>
                        <Link to="/modules/#modules">
                        <button className={styles.dropdownToggle}>
                            Modules ▾
                        </button>
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
                    <Link to="/my-notes">My Notes</Link>
                    <Link to="/formularies">Formularies</Link>
                    <Link to="/solvers">Solvers</Link>
                    <Link to="/calculations">Calculations</Link>
                    <Link to="/case-studies">Case Studies</Link>
                </nav>
            </header>
            )}

            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <p>© 2026 HeatSphere. All rights reserved.</p>
                <p className={styles.techStack}>Powered by .NET & React/TypeScript</p>
                <p>
                    Made by <a href="https://github.com/guilhermedoprado" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Guilherme do Prado</a>
                </p>
                <p className={styles.credits}>Pictures by Freepik</p>
            </footer>
        </div>
    );
}
