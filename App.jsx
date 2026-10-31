import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';
import { supabase } from './supabase';
import { AuthProvider, useAuth } from './components/AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user ?? null;
  const isLoggedIn = !!session;

  const [openItems, setOpenItems] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [offers, setOffers] = useState({}); // Updated in L4: Offers now fully synced with Supabase instead of partial local state
  const [showLogin, setShowLogin] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragState, setDragState] = useState(null);

  const ownerUid = user?.id ?? 'test-owner';
  const legacyOwnerUid = '5a45954e-ce4b-44e6-92d2-c3dae1912349';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const dismissToast = (id) => {
    setToasts(current => current.map(toast => (
      toast.id === id ? { ...toast, closing: true } : toast
    )));

    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 260);
  };

  const showToast = (type, title, message = '') => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { id, type, title, message, closing: false, x: 0, y: 0, dragging: false }]);
    setTimeout(() => dismissToast(id), 5000);
  };

  const handleToastPointerDown = (id, event) => {
    if (event.button !== 0) return;

    const toast = toasts.find(item => item.id === id);
    if (!toast) return;

    event.preventDefault();
    setToasts(current => current.map(item => item.id === id ? { ...item, dragging: true } : item));
    setDragState({
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: toast.x ?? 0,
      originY: toast.y ?? 0,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (event) => {
      const boundsX = window.innerWidth * 0.7;
      const boundsY = window.innerHeight * 0.6;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;

      setToasts(current => current.map(toast => {
        if (toast.id !== dragState.id) return toast;
        return {
          ...toast,
          x: clamp(dragState.originX + dx, -boundsX, boundsX),
          y: clamp(dragState.originY + dy, -boundsY, boundsY),
        };
      }));
    };

    const handlePointerUp = () => {
      setToasts(current => current.map(toast => {
        if (toast.id !== dragState.id) return toast;
        return { ...toast, dragging: false, x: 0, y: 0 };
      }));
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState]);

  // Updated in L4: Added real-time subscription for offers table to complete full data flow
  useEffect(() => {
    const itemsChannel = supabase.channel('items-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
        fetchItems();
      })
      .subscribe();

    const offersChannel = supabase.channel('offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, () => {
        fetchOffers();
      })
      .subscribe();

    fetchItems();
    fetchOffers();

    return () => {
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(offersChannel);
    };
  }, [user?.id]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const allItems = data || [];
      setOpenItems(allItems.filter(item => item.status === 'open'));
      setClosedTrades(allItems.filter(item => item.status === 'closed'));
    } catch (error) {
      console.error('Fetch items failed:', error);
      setOpenItems([]);
      setClosedTrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Updated in L4: Added async function to fetch and group offers from Supabase for full persistence
  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        return;
      }

      const grouped = {};
      data.forEach(offer => {
        if (!grouped[offer.item_id]) grouped[offer.item_id] = [];
        grouped[offer.item_id].push(offer);
      });
      setOffers(grouped);
    } catch (error) {
      console.error('Fetch offers failed:', error);
    }
  };

  // Update: Change handleLogin to use email/password auth
  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      showToast('error', 'Invalid credentials', 'Please check your email and password and try again.');
    } else {
      setShowLogin(false);
      showToast('success', 'Login Successful', 'You are now signed in.');
      navigate('/admin');
    }
  };

  // Added: handleLogout using signOut
  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('success', 'Logged out', 'You have been signed out successfully.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} />

      <main className="flex-grow p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="loading-spinner" role="status" aria-label="Loading" />
              </div>
            </div>
          ) : (
          <Routes>
            <Route path="/" element={<Home openItems={openItems} closedTrades={closedTrades} offers={offers} showToast={showToast} />} />
            <Route path="/admin" element={isLoggedIn ? <Admin openItems={openItems} offers={offers} user={user} showToast={showToast} onRefresh={() => { fetchItems(); fetchOffers(); }} /> : <Navigate to="/" />} />
          </Routes>
          )}
        </div>
      </main>

      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSubmit={handleLogin} />}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-20 z-50 flex w-[min(92vw,340px)] flex-col gap-3">
          {toasts.map((toast) => {
            const typeStyles = {
              success: 'border-green-300 bg-green-600',
              error: 'border-red-300 bg-red-600',
              info: 'border-blue-300 bg-blue-600',
            };

            const Icon = toast.type === 'error' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.5]" aria-hidden="true">
                <path d="M12 8v5m0 4h.01M6.9 19h10.2a2 2 0 0 0 1.8-2.9L13.8 4.8a2 2 0 0 0-3.6 0L5.1 16.1a2 2 0 0 0 1.8 2.9Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : toast.type === 'info' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.5]" aria-hidden="true">
                <path d="M12 16v-5m0-3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.5]" aria-hidden="true">
                <path d="M5 12.5 9.2 16.7 19 6.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );

            return (
              <div
                key={toast.id}
                onPointerDown={(event) => handleToastPointerDown(toast.id, event)}
                onClick={() => {
                  if (!toast.dragging && toast.x === 0 && toast.y === 0) {
                    dismissToast(toast.id);
                  }
                }}
                className={`toast-card cursor-grab overflow-hidden rounded-2xl border text-white shadow-[0_18px_46px_rgba(15,23,42,0.18)] ${toast.dragging ? 'cursor-grabbing' : 'cursor-grab'} ${typeStyles[toast.type]} ${toast.closing ? 'translate-x-6 opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}
                style={{
                  transform: `translate(${toast.x ?? 0}px, ${toast.y ?? 0}px)`,
                  transition: toast.dragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1.05), opacity 0.25s ease, transform 0.25s ease',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/20">
                    {Icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notice'}</div>
                    <div className="text-base font-semibold">{toast.title}</div>
                    {toast.message && <div className="mt-1 text-sm text-white/90">{toast.message}</div>}
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-white/20">
                  <div className="toast-progress h-full w-full origin-left rounded-full bg-white" style={{ animationDuration: '5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

export { getItemValue, ValueHelperDisplay } from '../V4LU3_H3LP3R_C0D3.jsx';