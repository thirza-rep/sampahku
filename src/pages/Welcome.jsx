import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Leaf, Recycle, ShieldCheck, ArrowRight, Globe } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Main Content */}
      <div className="glass-panel" style={{
        maxWidth: '800px',
        width: '100%',
        padding: '3rem 2rem',
        borderRadius: '24px',
        zIndex: 1,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '1.5rem',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
          }}>
            <Globe size={64} color="#38bdf8" />
          </div>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #38bdf8, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}>
          WebSampahku
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem auto',
          lineHeight: '1.6'
        }}>
          Sistem Informasi Geografis pintar untuk tata kelola sampah yang modern, transparan, dan ramah lingkungan. Bergabunglah bersama kami menjaga kebersihan ruang hidup Anda!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          textAlign: 'left'
        }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <Leaf size={28} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Warga Aktif</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Lapor tumpukan sampah & bayar iuran digital dengan mudah.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <Recycle size={28} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Pengangkut Sigap</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Temukan titik penjemputan sampah warga lewat Peta Digital.</p>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <ShieldCheck size={28} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Admin Terpusat</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kelola semua proses, iuran, dan pengguna dalam satu dashboard.</p>
          </div>
        </div>

        <button 
          className="btn"
          onClick={() => navigate('/login')}
          style={{
            fontSize: '1.2rem',
            padding: '1rem 3rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4)'
          }}
        >
          Mulai Sekarang <ArrowRight size={20} />
        </button>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
