import { useState } from 'react';

function AddItemModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [rating, setRating] = useState('3');
  const [description, setDescription] = useState('');
  const [accepts, setAccepts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, image_url, rating, description, accepts });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[min(96vw,28rem)] max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl shadow-slate-900/30">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">Add New Item💀</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none ring-0 transition focus:border-blue-400 focus:bg-white" />
          <input
            type="url"
            placeholder="https://.../image.jpg"
            value={image_url}
            onChange={e => setImageUrl(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
          />
          <select value={rating} onChange={e => setRating(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white" />
          <input type="text" placeholder="Accepts (e.g. Toys or books)" value={accepts} onChange={e => setAccepts(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white" />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-2xl bg-gray-200 px-4 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M18.3 5.7 6.4 17.6l1.4 1.4L19.7 7.1l-1.4-1.4ZM6.4 5.7l11.9 11.9-1.4 1.4L5 7.1l1.4-1.4Z"/>
              </svg>
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/>
                </svg>
              </span>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;