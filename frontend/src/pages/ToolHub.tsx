import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './ToolHub.module.css';

type ModuleDto = { name: string };

const ToolHub = () => {
  const { slug } = useParams<{ slug: string }>();

  const [moduleName, setModuleName] = useState<string>('');

    const formatSlug = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    (async () => {

        const res = await fetch(`/api/modules/${slug}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as ModuleDto;
        setModuleName(data.name);
    })();

    return () => controller.abort();
  }, [slug]);
  
  const tools = [
    { id: 'calculation-sheets', name: 'Calculation Sheets', desc: 'Step-by-step worked examples', icon: '📊' },
    { id: 'formulary', name: 'Formulary', desc: 'All correlations organized', icon: '📐' },
    { id: 'solvers', name: 'Solvers', desc: 'Interactive calculators', icon: '⚙️' },
    { id: 'case-studies', name: 'Case Studies', desc: 'Real-world engineering scenarios', icon: '🔬' },
  ];

  const moduleLabel = moduleName || (slug ? formatSlug(slug) : 'Module');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={`/modules/${slug}`} className={styles.backLink}>
          ← {moduleLabel}
        </Link>

        <h1 className={styles.title}>Tools</h1>
      </header>

      <div className={styles.diamond}>
        {tools.map((tools, idx) => (
          <Link
            key={tools.id}
            to={`./${tools.id}`}
            className={`${styles.card} ${styles[`card${idx + 1}`]}`}
          >
            <div className={styles.icon}>{tools.icon}</div>
            <h3 className={styles.cardTitle}>{tools.name}</h3>
            <p className={styles.cardDesc}>{tools.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolHub;
