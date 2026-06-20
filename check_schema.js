import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data: pData, error: pErr } = await supabase.from('pengangkutan').select('*').limit(1);
  console.log("Pengangkutan:", pData, pErr);

  const { data: bData, error: bErr } = await supabase.from('pembayaran').select('*').limit(1);
  console.log("Pembayaran:", bData, bErr);
}
checkSchema();
