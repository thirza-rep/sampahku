-- Jalankan ini di SQL Editor Supabase untuk otomatis membuat profil setelah pengguna mendaftar (Register).
-- Fungsi ini akan membaca pilihan "Role" dan "Nama" dari form React dan menyimpannya ke tabel profiles.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, nama_lengkap)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'warga'), -- Ambil role dari data form, default 'warga'
    COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', NEW.email) -- Ambil nama dari form
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Menghapus trigger lama jika sudah pernah dibuat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Membuat trigger baru yang berjalan otomatis setiap kali ada akun baru terdaftar
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
