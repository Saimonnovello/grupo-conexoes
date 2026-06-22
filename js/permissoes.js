async function carregarPermissoes() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { data } = await supabaseClient
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

    if (data.tipo !== "admin") {

        const menuUsuarios =
            document.getElementById("menuUsuarios");

        if (menuUsuarios) {
            menuUsuarios.style.display = "none";
        }
    }
}

carregarPermissoes();