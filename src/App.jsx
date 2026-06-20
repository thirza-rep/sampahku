import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import { Map, LogOut } from 'lucide-react';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {session && (
          <nav className="navbar glass-panel">
            <div className="nav-brand">
              <Map size={28} color="#38bdf8" />
              WebSampahku
            </div>
            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }} onClick={handleLogout}>
              <LogOut size={18} /> Keluar
            </button>
          </nav>
        )}
        
        <Routes>
          <Route path="/" element={!session ? <Welcome /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
