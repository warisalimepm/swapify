import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';
import { supabase } from './supabase';
import { AuthProvider, useAuth } from './AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user ?? null;
  const isLoggedIn = !!session;

  const [openItems, setOpenItems] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [offers, setOffers] = useState({});
  const [showLogin, setShowLogin] = useState(false);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const ownerUid = '306b49ad-a7da-4a2b-89cc-4c3847cf0a55';

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Refetch data whenever user logs in to ensure latest data is shown
  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
      fetchOffers();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const openChannel = supabase.channel('open-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.open` }, payload => {
        fetchItems();
      })
      .subscribe();

    const closedChannel = supabase.channel('closed-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.closed` }, payload => {
        fetchItems();
      })
      .subscribe();

    const offersChannel = supabase.channel('offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, payload => {
        fetchOffers();
      })
      .subscribe();

    fetchItems();
    fetchOffers(); 

    return () => {
      supabase.removeChannel(openChannel);
      supabase.removeChannel(closedChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data: open, error: errOpen } = await supabase
        .from('items')
        .select('*')
        .eq('owner_uid', ownerUid)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data: closed, error: errClosed } = await supabase
        .from('items')
        .select('*')
        .eq('owner_uid', ownerUid)
        .eq('status', 'closed')
        .order('created_at', { ascending: false });

      if (errOpen) console.error('Error fetching open items:', errOpen);
      if (errClosed) console.error('Error fetching closed items:', errClosed);

      setOpenItems(open || []);
      setClosedTrades(closed || []);
    } catch (error) {
      console.error('Fetch items failed:', error);
    } finally {
      setLoading(false);
    }
  };


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

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setShowLogin(false);
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} />

      <main className="flex-grow p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
          <Routes>
            <Route path="/" element={<Home openItems={openItems} closedTrades={closedTrades} offers={offers} setMessage={setMessage} />} />
            <Route path="/admin" element={isLoggedIn ? <Admin openItems={openItems} offers={offers} user={user} setMessage={setMessage} onRefresh={() => { fetchItems(); fetchOffers(); }} /> : <Navigate to="/" />} />
          </Routes>
          )}
        </div>
      </main>

      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSubmit={handleLogin} />}
      {message && (
        <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
          {message}
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