import { Link, useParams } from 'react-router-dom';
import styles from './ToolPage.module.css';

const ToolPage = () => {
  const { slug, toolsSlug } = useParams<{ slug: string; toolsSlug: string }>();

  // 1. Defina o conteúdo específico por Módulo e por Ferramenta
  const moduleContent: Record<string, any> = {
    // --- Módulo: Internal Flow ---
    'external-flow': {
      'solvers': [
        { id: 'pipe-flow-solver', name: 'Internal Pipe Flow', status: 'soon' },
        { id: 'cilinder-flow-solver', name: 'Cylinder Flow', status: 'available' }
      ],
      'case-studies': [
        { id: 'cilinder-cross-flow', name: 'Cylinder Cross Flow', status: 'available' },
        { id: 'hvac-duct-sizing', name: 'HVAC Duct Sizing', status: 'soon' }
      ]
      // Adicione outros tipos se necessário (formulary, sheets)
    },

    // --- Módulo: Heat Exchangers ---
    'heat-exchangers': {
      'solvers': [
        { id: 'lmtd-calculator', name: 'LMTD Calculator', status: 'soon' }
      ],
      'case-studies': [
        { id: 'shell-tube-rating', name: 'Shell & Tube Rating', status: 'available' },
        { id: 'steam-condenser-design', name: 'Steam Condenser Design', status: 'soon' },
      ]
    },

    // --- Módulo: Condensation ---
    'condensation': {
      'solvers': [
        { id: 'vertical-plate-condensation', name: 'Vertical Plate Film Condensation', status: 'soon' }
      ],
      'case-studies': [
        { id: 'power-plant-condenser', name: 'Power Plant Surface Condenser', status: 'soon' }
      ]
    }
  };

  // 2. Metadados GENÉRICOS das ferramentas (Título, Tagline)
  const toolMeta: Record<string, any> = {
    'calculation-sheets': { title: 'Calculation Sheets', tagline: 'Structured templates' },
    'formulary': { title: 'Formulary', tagline: 'Correlations & Equations' },
    'solvers': { title: 'Solvers', tagline: 'Interactive calculators' },
    'case-studies': { title: 'Case Studies', tagline: 'Real-world scenarios' }
  };

  // 3. Lógica de Resolução
  // Pega itens específicos do módulo OU array vazio se não existir
  const items = moduleContent[slug || '']?.[toolsSlug || ''] || [];
  
  // Pega títulos genéricos
  const meta = toolMeta[toolsSlug || ''] || { title: 'Tools', tagline: '' };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={`/modules/${slug}/tools`} className={styles.backLink}>
          ← Tools
        </Link>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.tagline}>{meta.tagline}</p>
        
        {/* Debug (Opcional: remova depois) */}
        {/* <p style={{fontSize: 12, color: '#999'}}>Module: {slug} | Tool: {toolsSlug}</p> */}
      </header>

      <section className={styles.catalog}>
        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item: any) => (
              <Link
                key={item.id}
                to={`./${item.id}`}
                className={`${styles.card} ${item.status === 'soon' ? styles.cardDisabled : ''}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  {item.status === 'soon' && <span className={styles.badge}>Coming Soon</span>}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Estado Vazio Elegante
          <div className={styles.emptyState}>
            <p>No {meta.title.toLowerCase()} available for this module yet.</p>
            <Link to={`/modules/${slug}/tools`} className={styles.linkButton}>Check other tools</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default ToolPage;
