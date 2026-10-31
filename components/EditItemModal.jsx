import { useState, useEffect } from 'react';

function EditItemModal({ item, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [rating, setRating] = useState('3');
  const [description, setDescription] = useState('');
  const [accepts, setAccepts] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setImageUrl(item.image_url);
      setRating(item.rating.toString());
      setDescription(item.description);
      setAccepts(item.accepts);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, image_url, rating, description, accepts });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border mb-3" />
          <input type="url" placeholder="Image URL" value={image_url} onChange={e => setImageUrl(e.target.value)} required className="w-full p-2 border mb-3" />
          <select value={rating} onChange={e => setRating(e.target.value)} className="w-full p-2 border mb-3">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border mb-3 h-24" />
          <input type="text" placeholder="Accepts (e.g. Toys or books)" value={accepts} onChange={e => setAccepts(e.target.value)} required className="w-full p-2 border mb-4" />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded">Update Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
 