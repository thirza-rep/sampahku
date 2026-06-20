import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraint() {
  // Try inserting 'Belum'
  let res1 = await supabase.from('pembayaran').insert({ warga_id: '00000000-0000-0000-0000-000000000000', jumlah: 20000, status_bayar: 'Belum' });
  console.log("Belum:", res1.error?.message);

  // Try inserting 'Sudah'
  let res2 = await supabase.from('pembayaran').insert({ warga_id: '00000000-0000-0000-0000-000000000000', jumlah: 20000, status_bayar: 'Sudah' });
  console.log("Sudah:", res2.error?.message);
}

checkConstraint();
