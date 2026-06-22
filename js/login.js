async function entrar() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .eq("nome", usuario)
        .eq("senha", senha)
        .single();

    if (error || !data) {
        alert("Usuário ou senha incorretos!");
        return;
    }

    // 🔥 salva dados do usuário logado
    localStorage.setItem("usuarioLogado", data.nome);
    localStorage.setItem("tipoUsuario", data.tipo); // 👈 ESSA É A NOVA LINHA

    // redireciona
    window.location.href = "PAGINA-INICIO.HTML";
}