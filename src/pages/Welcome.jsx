import { useNavigate } from 'react-router-dom';
import { Leaf, Recycle, ShieldCheck, ArrowRight, MapPin, CheckCircle, Globe2, Trash, Coins, Users } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Animated Background Orbs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-15%',
        width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
        animation: 'orbFloat1 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-15%',
        width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
        animation: 'orbFloat2 10s ease-in-out infinite'
      }} />
      <div style={{
        position: 'fixed', top: '40%', right: '10%',
        width: '25vw', height: '25vw', maxWidth: '300px', maxHeight: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
        animation: 'orbFloat1 12s ease-in-out infinite reverse'
      }} />

      {/* Navbar Landing */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)' }}>
          <div style={{ background: 'linear-gradient(135deg,#38bdf8,#10b981)', borderRadius: '10px', padding: '0.4rem', display: 'flex' }}>
            <Globe2 size={22} color="white" />
          </div>
          WebSampahku
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', border: '1.5px solid var(--border-glass)', color: 'var(--text-main)', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#38bdf8'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-glass)'}
          >
            Masuk
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', background: 'linear-gradient(135deg,#38bdf8,#0284c7)' }}
          >
            Mulai Sekarang
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(4rem, 10vw, 8rem) 1.5rem clamp(3rem, 8vw, 6rem)',
        minHeight: '80vh'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)',
          color: '#38bdf8', borderRadius: '99px', padding: '0.4rem 1rem',
          fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem',
          animation: 'fadeInDown 0.6s ease-out'
        }}>
          <CheckCircle size={14} /> Sistem Pengelolaan Sampah Cerdas
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 900, lineHeight: '1.1', letterSpacing: '-2px',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #38bdf8 0%, #10b981 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'fadeInUp 0.7s ease-out 0.1s both'
        }}>
          WebSampahku
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-muted)', maxWidth: '580px', lineHeight: '1.7',
          marginBottom: '2.5rem',
          animation: 'fadeInUp 0.7s ease-out 0.2s both'
        }}>
          Platform GIS terpadu untuk pelaporan, pengangkutan, dan pengawasan sampah secara transparan dan efisien dalam satu ekosistem digital.
        </p>

        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeInUp 0.7s ease-out 0.3s both'
        }}>
          <button
            onClick={() => navigate('/login')}
            className="btn"
            style={{
              fontSize: '1.05rem', padding: '0.9rem 2.5rem',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              boxShadow: '0 12px 30px -8px rgba(56,189,248,0.5)',
              gap: '0.6rem'
            }}
          >
            Mulai Sekarang <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Stats */}
        <div style={{
          display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center',
          marginTop: '3.5rem',
          animation: 'fadeInUp 0.7s ease-out 0.4s both'
        }}>
          {[
            { value: '3 Peran', label: 'Warga, Transporter, Admin' },
            { value: 'Real-time', label: 'Peta & Notifikasi Langsung' },
            { value: 'Aman', label: 'Sistem Login Terenkripsi' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, color: 'var(--text-main)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 4rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Dirancang untuk Semua Pihak
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
            Setiap peran punya tampilan dan fitur yang dirancang khusus untuk kebutuhannya.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            {
              icon: <Leaf size={32} color="#10b981" />,
              color: '#10b981',
              bg: 'rgba(16,185,129,0.08)',
              title: 'Warga Aktif',
              desc: 'Lapor lokasi tumpukan sampah langsung dari peta digital, pantau status pengangkutan, dan bayar iuran bulanan dengan sekali klik.',
              features: ['Lapor via Peta GIS', 'Pantau status sampah', 'Bayar iuran digital']
            },
            {
              icon: <Recycle size={32} color="#f59e0b" />,
              color: '#f59e0b',
              bg: 'rgba(245,158,11,0.08)',
              title: 'Transporter Sigap',
              desc: 'Terima notifikasi sampah baru, navigasi ke lokasi pengangkutan, dan konfirmasi pengangkutan selesai langsung dari dashboard.',
              features: ['Peta rute navigasi', 'Konfirmasi pengangkutan', 'Riwayat tugas harian']
            },
            {
              icon: <ShieldCheck size={32} color="#8b5cf6" />,
              color: '#8b5cf6',
              bg: 'rgba(139,92,246,0.08)',
              title: 'Admin Terpusat',
              desc: 'Kelola semua pengguna, pantau laporan dari seluruh warga, verifikasi pembayaran iuran, dan akses statistik lengkap.',
              features: ['Manajemen pengguna', 'Verifikasi iuran warga', 'Dashboard statistik']
            },
          ].map((card, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease', cursor: 'default' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>{card.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>{card.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {card.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: card.color, fontWeight: 500 }}>
                    <CheckCircle size={14} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 4rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Cara Kerja Sistem
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '01', icon: <Users size={24} color="#38bdf8" />, title: 'Daftar Akun', desc: 'Warga, Transporter atau Admin mendaftar sesuai perannya.' },
            { step: '02', icon: <MapPin size={24} color="#10b981" />, title: 'Lapor Sampah', desc: 'Warga tandai lokasi sampah di peta interaktif.' },
            { step: '03', icon: <Trash size={24} color="#f59e0b" />, title: 'Pengangkutan', desc: 'Transporter navigasi dan angkut sampah ke lokasi.' },
            { step: '04', icon: <Coins size={24} color="#8b5cf6" />, title: 'Verifikasi', desc: 'Admin verifikasi iuran dan pantau statistik.' },
          ].map((step, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '0.75rem' }}>LANGKAH {step.step}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>{step.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>{step.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 4rem)', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Siap Bergabung?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Bergabunglah bersama komunitas kami dan ambil peran nyata dalam menjaga kebersihan lingkungan sekitar Anda.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn"
            style={{ fontSize: '1.1rem', padding: '1rem 3rem', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', boxShadow: '0 12px 30px -8px rgba(56,189,248,0.5)', gap: '0.6rem' }}
          >
            Daftar Sekarang <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2025 WebSampahku · Sistem Informasi Geografis Pengelolaan Sampah
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(30px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
