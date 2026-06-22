const tipo = localStorage.getItem("tipoUsuario");

if (tipo !== "admin") {
    alert("Acesso negado!");
    window.location.href = "PAGINA-INICIO.HTML";
}

async function criarUsuario() {

    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    const { error } = await supabaseClient
        .from("usuarios")
        .insert([
            {
                id: crypto.randomUUID(),
                nome: nome,
                senha: senha
            }
        ]);

    if (error) {
        console.error(error);
        alert("Erro ao criar usuário");
    } else {
        alert("Usuário criado com sucesso!");
    }
}

async function verificarAdmin() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    const { data } = await supabaseClient
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

    if(data.tipo !== "admin"){

        alert("Acesso negado");

        window.location.href =
            "PAGINA-INICIO.HTML";
    }
}

verificarAdmin();