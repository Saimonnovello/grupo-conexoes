async function carregarRelatorios() {

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tabela = document.getElementById("listaRelatorios");

    tabela.innerHTML = "";

    data.forEach(relatorio => {

        const [ano, mes, dia] = relatorio.data_gc.split("-");
        const dataBR = `${dia}/${mes}/${ano}`;

        tabela.innerHTML += `
            <tr>
                <td>${dataBR}</td>
                <td>${relatorio.coordenador}</td>
                <td>
                    <button onclick="verRelatorio(${relatorio.id})">
                        Ver
                    </button>
                </td>
            </tr>
        `;
    });
}

function verRelatorio(id) {
    localStorage.setItem("relatorioSelecionado", id);
    window.location.href = "ver-relatorio.html";
}

carregarRelatorios();

const tipo = localStorage.getItem("tipo");

if (tipo !== "admin") {
    document.getElementById("menuUsuarios").style.display = "none";
}