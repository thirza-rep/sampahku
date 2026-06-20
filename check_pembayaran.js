import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://guglipcudxmvizjwaywv.supabase.co";
const supabaseKey = "sb_publishable_V2L-Tjqe28qYyKp4-nk_Gg_HCqFAXee";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPembayaranError() {
  const { error } = await supabase.from('pembayaran').insert({ invalid_col: 1 });
  console.log("Error shows schema:", error);
}

checkPembayaranError();
