import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://guglipcudxmvizjwaywv.supabase.co", "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee");

async function run() {
  const { data, error } = await supabase.from('warga').select('*').limit(1);
  console.log("Warga error:", error);
  const { data: pData, error: pErr } = await supabase.from('pembayaran').select('*').limit(1);
  console.log("Pembayaran error:", pErr);
  const { data: sData, error: sErr } = await supabase.from('sampah').select('*').limit(1);
  console.log("Sampah error:", sErr);
  const { data: pengData, error: pengErr } = await supabase.from('pengangkutan').select('*').limit(1);
  console.log("Pengangkutan error:", pengErr);
  const { data: tData, error: tErr } = await supabase.from('transporter').select('*').limit(1);
  console.log("Transporter error:", tErr);
}
run();
