async function carregarTotalRelatorios() {

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("id");

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("totalRelatorios").textContent = data.length;
}

carregarTotalRelatorios();

const tipoUsuario = localStorage.getItem("tipoUsuario");

if (tipoUsuario !== "admin") {
    document.getElementById("menuUsuarios").style.display = "none";
}