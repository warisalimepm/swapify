function Card({ type, image_url, title, rating, description, accepts, date, summary, onProposeSwap, onEdit, isOwner = false, offers = [] }) {
  const tags = accepts ? accepts.split(/[;,|]/).map(tag => tag.trim()).filter(Boolean) : [];
  const hasValidImage = typeof image_url === 'string' && /^https?:\/\//i.test(image_url.trim());

  const renderOfferText = (value, fallback) => (value && String(value).trim()) || fallback;

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]">
      {hasValidImage ? (
        <img src={image_url} alt={title} className="h-52 w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">
          No image available
        </div>
      )}

      <div className="p-6">
        <h3 className="mb-3 text-xl font-semibold text-slate-800">{title}</h3>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-slate-500">Condition:</span>
          <span className="text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (i < rating ? '★' : '☆'))}
          </span>
        </div>

        <p className="mb-4 text-sm leading-6 text-slate-700">{description}</p>

        {type === 'open' && (
          <>
            <div className="mb-5">
              <span className="mb-2 block text-sm text-slate-500">Swap for:</span>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? tags.map((tag, index) => (
                  <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {tag}
                  </span>
                )) : <span className="text-sm text-slate-500">No trade preference listed</span>}
              </div>
            </div>

            {!isOwner && (
              <button
                onClick={onProposeSwap}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M7 7h7.6l-2.3-2.3 1.4-1.4L20.5 8l-6.8 6.7-1.4-1.4 2.3-2.3H7a3 3 0 0 0-3 3v1h2v-1a1 1 0 0 1 1-1Zm10 10H9.4l2.3 2.3-1.4 1.4L3.5 16l6.8-6.7 1.4 1.4-2.3 2.3H17a3 3 0 0 1 3 3v1h-2v-1a1 1 0 0 0-1-1Z"/>
                  </svg>
                </span>
                Propose Swap
              </button>
            )}

            {isOwner && (
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={onEdit}
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Edit Item
                </button>

                <h4 className="text-lg font-semibold text-slate-800">Offers ({offers.length})</h4>
                {offers.length > 0 ? (
                  offers.map(offer => (
                    <div key={offer.id} className="mb-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                      <strong>{renderOfferText(offer.name, 'Missing proposer name')}</strong> – {renderOfferText(offer.contact, 'Missing contact info')}<br />
                      {renderOfferText(offer.proposal, 'No proposal details submitted')}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No offers yet</p>
                )}
              </div>
            )}
          </>
        )}

        {type === 'closed' && (
          <>
            <p className="mb-2 text-sm text-slate-500">Date: {date}</p>
            <p className="text-sm leading-6 text-slate-700">{summary}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Card;