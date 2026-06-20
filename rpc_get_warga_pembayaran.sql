-- Menghapus fungsi lama jika ada
DROP FUNCTION IF EXISTS get_warga_pembayaran_lokasi();

-- Membuat fungsi RPC untuk mengambil data warga, koordinat, dan status pembayaran terakhir
CREATE OR REPLACE FUNCTION get_warga_pembayaran_lokasi()
RETURNS TABLE (
  warga_id uuid,
  nama_warga text,
  alamat text,
  lat double precision,
  lng double precision,
  status_bayar text,
  jumlah_bayar numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id as warga_id,
    p.nama_lengkap as nama_warga,
    w.alamat,
    ST_Y(w.location::geometry) as lat,
    ST_X(w.location::geometry) as lng,
    COALESCE(
      (SELECT pb.status_bayar FROM pembayaran pb WHERE pb.warga_id = w.id ORDER BY pb.created_at DESC LIMIT 1), 
      'Belum'
    ) as status_bayar,
    COALESCE(
      (SELECT pb.jumlah FROM pembayaran pb WHERE pb.warga_id = w.id ORDER BY pb.created_at DESC LIMIT 1), 
      0
    ) as jumlah_bayar
  FROM warga w
  JOIN profiles p ON w.user_id = p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
