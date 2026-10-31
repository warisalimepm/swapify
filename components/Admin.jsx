import { useState } from 'react';
import { supabase } from '../supabase';
import Card from './Card';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

function Admin({ openItems, offers, user , setMessage, onRefresh}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Update: Use user.id for owner_uid in insert
  const handleAddItem = async (newItem) => {
    try {
      const { error } = await supabase
        .from('items')
        .insert({
          owner_uid: user.id,
          status: 'open',
          title: newItem.title,
          description: newItem.description,
          accepts: newItem.accepts,
          rating: Number(newItem.rating),
          image_url: newItem.image_url,
        });

        if (error) throw error;
    setShowAddModal(false);
    setMessage('Item added successfully!');
    if (onRefresh) onRefresh(); // Refresh data after adding item
  } catch (error) {
    console.error('Error adding item:', error.message);
    alert('Failed to add item. Check console for details.');
  }};

  const handleEditItem = async (updatedItem) => {
  try {
    const { error } = await supabase
      .from('items')
      .update({
        title: updatedItem.title,
        description: updatedItem.description,
        accepts: updatedItem.accepts,
        rating: Number(updatedItem.rating),
        image_url: updatedItem.image_url,
      })
      .eq('id', selectedItem.id);
    if (error) throw error;
    setShowEditModal(false);
    setMessage('Item updated successfully!');
    if (onRefresh) onRefresh(); // Refresh data after editing item
  } catch (error) {
    console.error('Error updating item:', error.message);
    alert('Failed to update item.');
  }
};

  // Added: handleDecline for updating offer status
  const handleDecline = async (itemId, offerId) => {
    try {
      const { error } = await supabase.from('offers').update({ status: 'declined' }).eq('id', offerId);
      if (error) throw error;
      setMessage('Offer declined!');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Failed to decline offer.');
    }
  };

  // Added: handleAccept with transactional logic (decline others, accept one, close item)
  const handleAccept = async (itemId, offerId) => {
    try {
      const { data: item, error: itemError } = await supabase.from('items').select('*').eq('id', itemId).single();
      if (itemError || item.status !== 'open') {
        alert('Item already closed or error fetching.');
        return;
      }

      const { error: declineError } = await supabase
        .from('offers')
        .update({ status: 'declined' })
        .eq('item_id', itemId)
        .neq('id', offerId)
        .eq('status', 'pending');

      if (declineError) throw declineError;

      const { data: acceptedOffer, error: acceptError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select('*')
        .single();

      if (acceptError) throw acceptError;

      const summary = `Swapped with ${acceptedOffer.name} for ${acceptedOffer.proposal}`;
      const { error: closeError } = await supabase
        .from('items')
        .update({ status: 'closed', closed_at: new Date().toISOString(), summary })
        .eq('id', itemId);

      if (closeError) throw closeError;
      setMessage('Trade accepted and item closed!'); 
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Failed to accept offer.');
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Admin Dashboard – Manage Items & Offers</h2>
      <p className="text-gray-600 mb-6">Admin mode: Add items, manage offers.</p>

      <button onClick={() => setShowAddModal(true)} className="mb-6 bg-blue-500 text-white px-6 py-3 rounded">
        Add New Item
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openItems.map(item => (
          <Card
            key={item.id}
            type="open"
            {...item}
            isOwner={true}
            offers={offers[item.id] || []}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onEdit={() => { setSelectedItem(item); setShowEditModal(true); }}
          />
        ))}
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSubmit={handleAddItem} />}
      {showEditModal && (<EditItemModal item={selectedItem} onClose={() => setShowEditModal(false)} onSubmit={handleEditItem} />)}
    </section>
  );
}

export default Admin;