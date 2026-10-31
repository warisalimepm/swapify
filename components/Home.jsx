import { useState } from 'react';
import Card from './Card';
import ProposeSwapModal from './ProposeSwapModal';
import { supabase } from '../supabase';

function Home({ openItems, closedTrades, offers, showToast }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmitOffer = async (itemId, formData) => {
    try {
      const name = formData.name?.trim();
      const contact = formData.contact?.trim();
      const proposal = formData.proposal?.trim();

      if (!name || !contact || !proposal) {
        showToast('error', 'Missing info', 'Please complete all offer fields before submitting.');
        return;
      }

      const { error } = await supabase.from('offers').insert({
        item_id: itemId,
        name,
        contact,
        proposal,
        status: 'pending',
      });

      if (error) throw error;

      showToast('success', 'Offer submitted', 'Your offer was sent successfully.');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error submitting offer:', error);
      showToast('error', 'Offer failed', 'Your offer could not be sent right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Swap Board</h1>
        <p className="mt-2 text-gray-600">Browse open trades and send your offer.</p>
      </div>

      {openItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {openItems.map(item => (
            <Card
              key={item.id}
              type="open"
              {...item}
              offers={offers[item.id] || []}
              onProposeSwap={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500">
          No open items yet.
        </div>
      )}

      {closedTrades.length > 0 && (
        <div className="pt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Recent Trades</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {closedTrades.map(item => (
              <Card key={item.id} type="closed" {...item} />
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <ProposeSwapModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSubmitOffer}
        />
      )}
    </section>
  );
}

export default Home;