const supabaseUrl = "https://eexabruklzfqrprlqspx.supabase.co";

const supabaseKey = "sb_publishable_9ikY_zHtU-woST4vfJ37Ew_yfj3-6Eq";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Cliente criado:");
console.log(supabaseClient);
