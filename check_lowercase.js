import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function signInAndCheck() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'warga@webgis.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.log("Login err:", authErr);
    return;
  }
  
  // To avoid RLS, we are now logged in as warga
  // We need to know a valid warga_id for this user
  const { data: wData } = await supabase.from('warga').select('id').eq('user_id', authData.user.id).single();
  const wId = wData.id;

  let resLower = await supabase.from('pembayaran').insert({ warga_id: wId, jumlah: 20000, status_bayar: 'belum' });
  console.log("belum (lowercase):", resLower.error?.message || "SUCCESS");

  let resUpper = await supabase.from('pembayaran').insert({ warga_id: wId, jumlah: 20000, status_bayar: 'Belum' });
  console.log("Belum (Capital):", resUpper.error?.message || "SUCCESS");
}

signInAndCheck();
