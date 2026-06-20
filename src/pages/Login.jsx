import { useState } from 'react';
import { supabase } from '../supabase';
import { MapPin, ArrowRight, UserPlus } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [role, setRole] = useState('warga');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErrorMsg(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama_lengkap: namaLengkap,
            role: role
          }
        }
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Pendaftaran berhasil! Jika auto-confirm aktif, silakan langsung Masuk.');
        setIsLogin(true); // Switch back to login view automatically
        setPassword(''); // Clear password field for security
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="glass-panel login-card">
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <MapPin size={40} color="var(--primary-color)" />
            </div>
          </div>
          <h2>{isLogin ? 'Masuk ke WebGIS' : 'Daftar Akun WebGIS'}</h2>
          <p>Sistem Informasi Geografis Pengelolaan Sampah</p>
        </div>
        
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Nama Anda" 
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label>Pilih Peran (Role)</label>
                <select 
                  className="input-field" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="warga">Warga</option>
                  <option value="transporter">Transporter / Petugas Kebersihan</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {errorMsg && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
              {successMsg}
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang')}
            {isLogin ? <ArrowRight size={18} /> : <UserPlus size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <span 
            style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </span>
        </div>
      </div>
    </div>
  );
}
