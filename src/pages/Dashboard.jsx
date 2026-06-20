import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';
import Map from '../components/Map';
import { Trash2, PlusCircle, X, CheckCircle, Navigation, Sun, Moon, Edit } from 'lucide-react';

export default function Dashboard({ session }) {
  const [role, setRole] = useState(null);
  const [nama, setNama] = useState('');
  const [sampahList, setSampahList] = useState([]);
  const [wargaList, setWargaList] = useState([]); // Untuk Admin Oversight
  const [usersList, setUsersList] = useState([]); // Untuk Admin User Management
  const [loading, setLoading] = useState(true);
  
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark';
  });
  
  // Admin Tabs: 'sampah' | 'oversight'
  const [adminTab, setAdminTab] = useState('sampah');

  // Form Lapor State
  const [isLaporMode, setIsLaporMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [jenisSampah, setJenisSampah] = useState('');
  const [berat, setBerat] = useState('');


  // User Management Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState('create');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('warga');
  const [userNama, setUserNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.from('profiles').select('role, nama_lengkap').eq('id', user.id).single();
          if (!error && data) {
            setRole(data.role);
            setNama(data.nama_lengkap);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, [session]);

  // Handle Theme switching
  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('app_theme', 'light');
    }
  }, [isDark]);

  const fetchData = async () => {
    // Menghindari sinkronisasi state ganda yang diblokir oleh Linter
    await Promise.resolve();
    setLoading(true);
    
    // Fetch Sampah
    const { data: sData, error: sErr } = await supabase.rpc('get_sampah_lokasi');
    if (!sErr && sData) setSampahList(sData);

    // Fetch Warga Oversight and Users if Admin
    if (role === 'admin') {
      const { data: wData, error: wErr } = await supabase.rpc('get_warga_pembayaran_lokasi');
      if (!wErr && wData) setWargaList(wData);
      else if (wErr) console.log("Oversight belum tersedia (jalankan SQL RPC).");
      
      const { data: uData, error: uErr } = await supabase.rpc('admin_get_users');
      if (!uErr && uData) setUsersList(uData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (role) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleLaporSampah = () => setIsLaporMode(true);

  // Warga: Bayar Iuran
  const handleBayarIuran = async () => {
    if (!window.confirm("Kirim pembayaran iuran bulan ini (Rp 20.000)?")) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: wData } = await supabase.from('warga').select('id').eq('user_id', user.id).single();
      if (!wData) return alert("Anda belum mendaftarkan lokasi rumah (Lapor minimal 1x).");

      const { error } = await supabase.from('pembayaran').insert({
        warga_id: wData.id,
        jumlah: 20000,
        status_bayar: 'Belum'
      });
      if (error) throw error;
      alert("Pembayaran berhasil dikirim dan menunggu verifikasi Admin.");
    } catch (err) {
      console.error(err);
      alert("Gagal membayar: " + err.message);
    }
  };

  // Admin: Verifikasi Pembayaran (Bypass via RPC WargaList untuk simplicity)
  const handleVerifikasiIuran = async (wargaId) => {
    try {
      // Cari baris pembayaran terakhir yang pending (Belum)
      const { data: pData } = await supabase
        .from('pembayaran')
        .select('id')
        .eq('warga_id', wargaId)
        .eq('status_bayar', 'Belum')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (pData) {
        await supabase.from('pembayaran').update({ status_bayar: 'Sudah' }).eq('id', pData.id);
        alert("Pembayaran berhasil diverifikasi menjadi Sudah Lunas!");
        fetchData();
      } else {
        alert("Tidak ada pembayaran yang butuh verifikasi untuk warga ini.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Admin: User Management Handlers ---
  const handleOpenCreateUser = () => {
    setUserModalMode('create');
    setEditingUserId(null);
    setUserEmail('');
    setUserPassword('');
    setUserRole('warga');
    setUserNama('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u) => {
    setUserModalMode('edit');
    setEditingUserId(u.id);
    setUserEmail(u.email);
    setUserPassword(''); // Password cannot be viewed, so leave empty
    setUserRole(u.role || 'warga');
    setUserNama(u.nama_lengkap || '');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (userModalMode === 'create') {
        // Create secondary client so we don't log out the admin
        const tempClient = createClient("https://guglipcudxmvizjwaywv.supabase.co", "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee", {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        const { error } = await tempClient.auth.signUp({
          email: userEmail,
          password: userPassword,
          options: { data: { role: userRole, nama_lengkap: userNama } }
        });
        if (error) throw error;
        alert("Pengguna berhasil dibuat!");
      } else {
        const { error } = await supabase.rpc('admin_update_user', {
          target_user_id: editingUserId,
          new_role: userRole,
          new_nama: userNama,
          new_password: userPassword
        });
        if (error) throw error;
        alert("Pengguna berhasil diperbarui!");
      }
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan pengguna: " + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini SECARA PERMANEN?")) return;
    try {
      const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });
      if (error) throw error;
      alert("Pengguna berhasil dihapus.");
      fetchData();
    } catch (err) {
      alert("Gagal menghapus pengguna: " + err.message);
    }
  };
  // ---------------------------------------

  const submitLaporan = async (e) => {
    e.preventDefault();
    if (!selectedLocation) return alert("Pilih lokasi penjemputan di peta terlebih dahulu!");
    setSubmitLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const postgisPoint = `POINT(${selectedLocation.lng} ${selectedLocation.lat})`;
      
      let wargaId = null;
      const { data: existingWarga } = await supabase.from('warga').select('id').eq('user_id', user.id).single();
      
      if (existingWarga) {
        wargaId = existingWarga.id;
        await supabase.from('warga').update({ alamat, location: postgisPoint }).eq('id', wargaId);
      } else {
        const { data: newWarga, error: wargaErr } = await supabase
          .from('warga')
          .insert({ user_id: user.id, alamat: alamat || 'Rumah', location: postgisPoint })
          .select()
          .single();
        if (wargaErr) throw wargaErr;
        wargaId = newWarga.id;
      }

      const { error: sampahErr } = await supabase.from('sampah').insert({
        warga_id: wargaId,
        jenis_sampah: jenisSampah,
        berat_kg: parseFloat(berat),
        status: 'Menunggu'
      });

      if (sampahErr) throw sampahErr;
      alert("Laporan berhasil dikirim!");
      setIsLaporMode(false);
      setSelectedLocation(null);
      setJenisSampah(''); setBerat(''); setAlamat('');
      fetchData();
    } catch (err) {
      alert("Gagal mengirim laporan: " + err.message);
    }
    setSubmitLoading(false);
  };

  const handleCancelSampah = async (sampahId) => {
    if (!window.confirm("Yakin ingin membatalkan laporan ini?")) return;
    try {
      await supabase.from('sampah').update({ status: 'Dibatalkan' }).eq('id', sampahId);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleAmbilSampah = async (sampahId) => {
    if (!window.confirm("Konfirmasi bahwa sampah ini sudah Anda ambil?")) return;
    try {
      await supabase.from('sampah').update({ status: 'Selesai' }).eq('id', sampahId);
      fetchData();
    } catch (err) { console.error(err); }
  };

  // Dynamic Theme Colors based on Role
  useEffect(() => {
    if (role === 'admin') document.documentElement.style.setProperty('--role-color', '#8b5cf6'); // Purple
    else if (role === 'transporter') document.documentElement.style.setProperty('--role-color', '#10b981'); // Emerald Green
    else if (role === 'warga') document.documentElement.style.setProperty('--role-color', '#0ea5e9'); // Sky Blue
  }, [role]);

  // Switch Peta: Kalau Admin pilih tab 'oversight', tampilkan wargaList. Kalau tidak, sampahList.
  const mapMarkers = (role === 'admin' && adminTab === 'oversight') ? wargaList : sampahList;

  return (
    <div className="main-content">
      {/* HEADER BARU YANG PROFESIONAL */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Dashboard</h2>
          <span>Sistem Informasi Geografis Pengelolaan Sampah</span>
        </div>
        <div className="header-actions">
          <div className="role-badge">
            Role: {role || 'Memuat...'}
          </div>
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)} title="Ganti Tema">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ height: 'calc(100vh - 190px)' }}>
        <div className="glass-panel side-panel" style={{ borderRadius: '0 0 0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>Halo, <span style={{ color: 'var(--role-color)' }}>{nama || 'Pengguna'}</span>!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Semoga hari Anda menyenangkan.</p>
            </div>
            
            {role === 'warga' && !isLaporMode && (
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <button className="btn" onClick={handleBayarIuran} style={{ padding: '0.4rem', fontSize: '0.8rem', background: '#8b5cf6' }}>
                  $ Bayar Iuran
                </button>
                <button className="btn" onClick={handleLaporSampah} style={{ padding: '0.4rem', fontSize: '0.8rem' }}>
                  <PlusCircle size={14} /> Lapor Sampah
                </button>
              </div>
            )}
            
            {isLaporMode && (
              <button className="btn" onClick={() => setIsLaporMode(false)} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                <X size={16} />
              </button>
            )}
          </div>
          
          {role === 'admin' && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              <button 
                onClick={() => { setAdminTab('sampah'); setLoading(true); fetchData(); }}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: adminTab === 'sampah' ? '#38bdf8' : 'var(--glass-badge-bg)', color: adminTab === 'sampah' ? 'white' : 'var(--text-main)' }}>
                Laporan Sampah
              </button>
              <button 
                onClick={() => { setAdminTab('oversight'); setLoading(true); fetchData(); }}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: adminTab === 'oversight' ? '#8b5cf6' : 'var(--glass-badge-bg)', color: adminTab === 'oversight' ? 'white' : 'var(--text-main)' }}>
                Oversight Warga
              </button>
              <button 
                onClick={() => { setAdminTab('users'); setLoading(true); fetchData(); }}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: adminTab === 'users' ? '#f59e0b' : 'var(--glass-badge-bg)', color: adminTab === 'users' ? 'white' : 'var(--text-main)' }}>
                Manajemen Pengguna
              </button>
            </div>
          )}
          
          {isLaporMode ? (
            <div style={{ marginTop: '1.5rem', background: 'var(--glass-badge-bg)', padding: '1rem', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Form Lapor Penjemputan</h4>
              <form onSubmit={submitLaporan}>
                <div className="form-group">
                  <label>Jenis Sampah</label>
                  <input type="text" className="input-field" placeholder="Organik / Plastik" value={jenisSampah} onChange={e => setJenisSampah(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Berat Estimasi (Kg)</label>
                  <input type="number" step="0.1" className="input-field" placeholder="Misal: 2.5" value={berat} onChange={e => setBerat(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Alamat Detail / Patokan</label>
                  <textarea className="input-field" placeholder="Gang Mawar No 12 (Pagar Hitam)" value={alamat} onChange={e => setAlamat(e.target.value)} required rows="2" />
                </div>
                {!selectedLocation && <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '1rem' }}>⚠️ Silakan klik titik rumah Anda di peta terlebih dahulu!</p>}
                {selectedLocation && <p style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '1rem' }}>✅ Lokasi terpilih: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>}
                <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitLoading || !selectedLocation}>
                  {submitLoading ? 'Menyimpan...' : 'Kirim Laporan'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              
              {role === 'admin' && adminTab === 'oversight' ? (
                <>
                  <h4 style={{ color: 'var(--text-main)' }}>Distribusi Warga & Pembayaran</h4>
                  {loading ? <div style={{ color: 'var(--text-muted)' }}>Memuat...</div> : wargaList.map((item) => (
                    <div key={item.warga_id} className="glass-panel" style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#8b5cf6' }}>{item.nama_warga}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alamat: {item.alamat}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: item.status_bayar === 'Sudah' ? '#d1fae5' : '#fef3c7', color: item.status_bayar === 'Sudah' ? '#059669' : '#d97706' }}>
                          Iuran: {item.status_bayar}
                        </span>
                        {item.status_bayar === 'Belum' && (
                          <button onClick={() => handleVerifikasiIuran(item.warga_id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }}/> Verifikasi
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : role === 'admin' && adminTab === 'users' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: 'var(--text-main)' }}>Manajemen Pengguna</h4>
                    <button className="btn" onClick={handleOpenCreateUser} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      <PlusCircle size={14} /> Tambah User
                    </button>
                  </div>
                  {loading ? <div style={{ color: 'var(--text-muted)' }}>Memuat...</div> : usersList.map((u) => (
                    <div key={u.id} className="glass-panel" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{u.nama_lengkap || 'Anonim'}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{u.email}</p>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--glass-badge-bg)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                            {u.role || 'warga'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditUser(u)} style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h4 style={{ color: 'var(--text-main)' }}>Data Laporan Sampah</h4>
                  {loading ? <div style={{ color: 'var(--text-muted)' }}>Memuat...</div> : sampahList.map((item) => (
                    <div key={item.sampah_id} className="glass-panel" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trash2 size={16} color={item.status === 'Selesai' ? '#10b981' : item.status === 'Dibatalkan' ? '#ef4444' : '#38bdf8'} />
                            {item.jenis_sampah} ({item.berat_kg} kg)
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pelapor: {item.nama_warga || 'Anonim'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Status: <span style={{ color: item.status === 'Selesai' ? '#10b981' : item.status === 'Dibatalkan' ? '#ef4444' : '#f59e0b' }}>{item.status}</span>
                          </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                          {role === 'transporter' && item.status === 'Menunggu' && (
                            <>
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Navigation size={14} /> Rute
                              </a>
                              <button 
                                onClick={() => handleAmbilSampah(item.sampah_id)}
                                style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                                Ambil
                              </button>
                            </>
                          )}
                          {role === 'admin' && item.status !== 'Dibatalkan' && item.status !== 'Selesai' && (
                            <button 
                              onClick={() => handleCancelSampah(item.sampah_id)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                              Batalkan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="glass-panel map-panel">
          <Map 
            markers={mapMarkers} 
            isSelectingLocation={isLaporMode}
            onLocationSelect={(coords) => setSelectedLocation(coords)}
          />
        </div>
      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', background: 'var(--bg-card-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>{userModalMode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}</h3>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                  disabled={userModalMode === 'edit'} // Email cannot be changed here easily in supabase without email confirmation
                />
              </div>
              <div className="form-group">
                <label>
                  Password 
                  {userModalMode === 'edit' && <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px'}}>(Kosongkan jika tidak diubah)</span>}
                </label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={userPassword} 
                  onChange={(e) => setUserPassword(e.target.value)} 
                  required={userModalMode === 'create'} 
                  placeholder={userModalMode === 'edit' ? "Ketik sandi baru..." : ""}
                />
              </div>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={userNama} 
                  onChange={(e) => setUserNama(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Peran (Role)</label>
                <select 
                  className="input-field" 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="warga">Warga</option>
                  <option value="transporter">Transporter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
