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

        const status = relatorio.status === "Pendente"
            ? '<span class="status-pendente">🟡 Pendente</span>'
            : '<span class="status-concluido">🟢 Concluído</span>';

        tabela.innerHTML += `
            <tr>

                <td>${dataBR}</td>

                <td>${relatorio.coordenador}</td>

                <td>${status}</td>

                <td>

                    <button class="btn-ver"
                        onclick="verRelatorio('${relatorio.id}')">
                        👁 Ver
                    </button>

                    <button class="btn-editar"
                        onclick="editarRelatorio('${relatorio.id}')">
                        ✏️ Editar
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

function editarRelatorio(id) {

    window.location.href = `editar-relatorio.html?id=${id}`;

}

carregarRelatorios();

const tipo = localStorage.getItem("tipoUsuario");

if (tipo !== "admin") {

    const menu = document.getElementById("menuUsuarios");

    if (menu) {
        menu.style.display = "none";
    }

}