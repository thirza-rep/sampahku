-- Jalankan ini di SQL Editor Supabase untuk membuat fungsi RPC
-- Fungsi ini akan menggabungkan tabel sampah dan warga, 
-- lalu mengekstrak titik koordinat dari tipe data PostGIS Geography (location) 
-- agar mudah dibaca oleh React (sebagai 'lat' dan 'lng').

CREATE OR REPLACE FUNCTION public.get_sampah_lokasi()
RETURNS TABLE (
  sampah_id UUID,
  warga_id UUID,
  jenis_sampah TEXT,
  berat_kg DECIMAL,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  nama_warga TEXT,
  alamat TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as sampah_id,
    s.warga_id,
    s.jenis_sampah,
    s.berat_kg,
    s.status,
    s.created_at,
    p.nama_lengkap as nama_warga,
    w.alamat,
    ST_Y(w.location::geometry) as lat,
    ST_X(w.location::geometry) as lng
  FROM sampah s
  JOIN warga w ON s.warga_id = w.id
  JOIN profiles p ON w.user_id = p.id;
END;
$$;
