-- 1. Fungsi Mengambil Semua User (Hanya bisa diakses jika pemanggil adalah admin)
CREATE OR REPLACE FUNCTION admin_get_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  role JSONB,
  nama_lengkap JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Validasi apakah user yang login memiliki role 'admin'
  IF (auth.jwt() -> 'user_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Admin yang dapat melihat data pengguna.';
  END IF;

  RETURN QUERY 
  SELECT 
    u.id, 
    u.email, 
    u.raw_user_meta_data->'role', 
    u.raw_user_meta_data->'nama_lengkap', 
    u.created_at 
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fungsi Mengubah Data User (Update Role/Nama/Password)
CREATE OR REPLACE FUNCTION admin_update_user(target_user_id UUID, new_role TEXT, new_nama TEXT, new_password TEXT DEFAULT NULL)
RETURNS void AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Admin yang dapat merubah data pengguna.';
  END IF;

  -- Update metadata pengguna (role dan nama)
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
      jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb(new_role)),
      '{nama_lengkap}', to_jsonb(new_nama)
  )
  WHERE id = target_user_id;

  -- Jika admin memberikan password baru, perbarui password tersebut.
  -- Kita menggunakan ekstensi pgcrypto bawaan Supabase untuk meng-hash password.
  IF new_password IS NOT NULL AND trim(new_password) != '' THEN
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fungsi Menghapus User Permanen (Penyederhanaan Tabel yang Ada Saja)
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS void AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Akses Ditolak: Hanya Admin yang dapat menghapus pengguna.';
  END IF;

  -- Jangan biarkan admin menghapus dirinya sendiri
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Akses Ditolak: Anda tidak dapat menghapus akun Anda sendiri.';
  END IF;

  -- Hapus dependensi di public.pembayaran
  DELETE FROM public.pembayaran WHERE warga_id IN (SELECT id FROM public.warga WHERE user_id = target_user_id);
  
  -- Hapus dependensi di public.sampah
  DELETE FROM public.sampah WHERE warga_id IN (SELECT id FROM public.warga WHERE user_id = target_user_id);

  -- Hapus record profil warga
  DELETE FROM public.warga WHERE user_id = target_user_id;

  -- Hapus identitas autentikasi eksternal jika ada (Email/Provider)
  DELETE FROM auth.identities WHERE user_id = target_user_id;
  DELETE FROM auth.sessions WHERE user_id = target_user_id;
  DELETE FROM auth.mfa_factors WHERE user_id = target_user_id;

  -- Terakhir, hapus entitas auth.users
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
