export async function getItemValue(item) {
  const query = item?.title?.trim() || item?.query?.trim() || '';

  if (!query) {
    return {
      query: '',
      low: 0,
      high: 0,
      examples: [],
      error: 'Please enter an item name to estimate its value.'
    };
  }

  try {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=6`);
    if (!res.ok) throw new Error('DummyJSON fetch failed');

    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      const rating = Number(item?.rating) || 3;
      const base = rating * 20;
      const bonus = Math.min((item?.description?.length || 0) / 10, 20);
      return {
        query,
        low: Math.round(base - 10),
        high: Math.round(base + bonus + 10),
        examples: ['No exact matches – estimated from rating & description'],
        error: null
      };
    }

    const prices = products
      .map(p => p.price || 0)
      .filter(p => p > 0);

    if (prices.length === 0) {
      return {
        query,
        low: 10,
        high: 30,
        examples: ['Matches found but no prices – fallback'],
        error: null
      };
    }

    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const examples = products.slice(0, 3).map(p => `${p.title.slice(0, 40)}... at $${p.price}`);

    return {
      query,
      low: Math.round(low),
      high: Math.round(high),
      examples,
      error: null
    };
  } catch (err) {
    console.error('DummyJSON error', err);
    return {
      query,
      low: 0,
      high: 0,
      examples: [],
      error: 'Unable to estimate value right now. Please try again.'
    };
  }
}

export function ValueHelperDisplay({ value }) {
  if (!value) return null;

  const hasError = Boolean(value.error);

  return (
    <>
      <style>{`
        .value-helper-card {
          position: relative;
          width: min(520px, 92vw);
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.96));
          border: 1px solid rgba(148, 163, 184, 0.28);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
          padding: 20px 22px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          overflow: hidden;
        }

        .value-helper-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 28px 60px rgba(37, 99, 235, 0.18);
          border-color: rgba(59, 130, 246, 0.32);
        }

        .value-helper-card::before {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #2563eb, #14b8a6, #a78bfa);
        }

        .value-helper-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(37, 99, 235, 0.08);
          color: #1d4ed8;
          font-weight: 700;
        }

        .value-helper-title {
          margin: 14px 0 8px;
          font-size: clamp(1.3rem, 2vw, 1.7rem);
          line-height: 1.2;
          color: #0f172a;
          font-weight: 800;
        }

        .value-helper-range {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 14px 0 16px;
          color: #334155;
          font-size: 0.95rem;
        }

        .value-helper-price {
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          font-weight: 900;
          color: #0f172a;
        }

        .value-helper-list {
          margin: 0;
          padding-left: 18px;
          color: #475569;
          display: grid;
          gap: 8px;
          line-height: 1.5;
        }

        .value-helper-list li::marker {
          color: #2563eb;
        }

        .value-helper-error {
          position: fixed;
          top: 28px;
          right: 28px;
          z-index: 2000;
          width: min(360px, calc(100vw - 32px));
          border-radius: 18px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #fff1f2, #fee2e2);
          border: 1px solid rgba(239, 68, 68, 0.28);
          box-shadow: 0 24px 50px rgba(127, 29, 29, 0.18);
          color: #7f1d1d;
          animation: popup-in 0.25s ease;
        }

        .value-helper-error-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-size: 0.72rem;
        }

        .value-helper-error-message {
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @keyframes popup-in {
          0% { opacity: 0; transform: translateY(-12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {hasError ? (
        <div className="value-helper-error" role="alert" aria-live="assertive">
          <div className="value-helper-error-header">
            <span>Value Helper Error</span>
            <span>⚠️</span>
          </div>
          <div className="value-helper-error-message">{value.error}</div>
        </div>
      ) : (
        <div className="value-helper-card">
          <div className="value-helper-badge">Value Helper</div>
          <h3 className="value-helper-title">Estimated value for “{value.query}”</h3>

          <div className="value-helper-range">
            <span>Range</span>
            <span className="value-helper-price">${value.low}</span>
            <span>to</span>
            <span className="value-helper-price">${value.high}</span>
          </div>

          <ul className="value-helper-list">
            {(value.examples || []).map((ex, i) => (
              <li key={`${ex}-${i}`}>{ex}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
//
//
//