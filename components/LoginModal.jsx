import { useState } from "react";
//changed the login modal to using password and email instead of pin for better security and user experience
function LoginModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Update: handleSubmit now uses email and password for login instead of pin
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Email and Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border mb-3 rounded hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            type="email"
            placeholder="Email(required)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="transition-all duration-200 w-full p-2 border mb-3 rounded hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            type="password"
            placeholder="Password(required)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:bg-red-300-transparent hover:text-red-700 hover:shadow-lg">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M18.3 5.7 6.4 17.6l1.4 1.4L19.7 7.1l-1.4-1.4ZM6.4 5.7l11.9 11.9-1.4 1.4L5 7.1l1.4-1.4Z"/>
              </svg>
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-yellow-300 hover:to-yellow400-700 hover:shadow-xl">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3Zm-6 7v7h12v-7H6Z"/>
                </svg>
              </span>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginModal;