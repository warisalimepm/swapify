import { Link } from 'react-router-dom';

function Navbar({ className = '', isLoggedIn, onLogout, onLoginClick }) {
  return (
    <nav className={`bg-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="./logo.png" alt="Swapify logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <span className="text-2xl font-bold tracking-tight">Swapify</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-blue-700 hover:shadow-xl"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3Zm-6 7v7h12v-7H6Z"/>
                </svg>
              </span>
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-blue-700 hover:shadow-xl"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3Zm-6 7v7h12v-7H6Z"/>
                </svg>
              </span>
              Owner Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;