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




async function carregarRelatorios() {

    const usuarioLogado = localStorage.getItem("usuarioLogado");

const tipoUsuario = localStorage.getItem("tipoUsuario");

let consulta = supabaseClient
    .from("relatorios")
    .select("*")
    .order("id", { ascending: false });


// =======================================
// ADMIN VÊ TODOS
// =======================================

if (tipoUsuario !== "admin") {

    consulta = consulta.eq(
        "usuario_criador",
        usuarioLogado
    );

}


// EXECUTA CONSULTA

const { data, error } = await consulta;

    if (error) {
        console.error(error);
        return;
    }

    const tabela = document.getElementById("listaRelatorios");
    const cards = document.getElementById("cardsRelatorios");

    tabela.innerHTML = "";

    if(cards){
        cards.innerHTML = "";
    }

    const celular = window.innerWidth <= 768;

    data.forEach(relatorio => {

        const [ano, mes, dia] = relatorio.data_gc.split("-");
        const dataBR = `${dia}/${mes}/${ano}`;

        const status = relatorio.status === "Pendente"
            ? '<span class="status-pendente">🟡 Pendente</span>'
            : '<span class="status-concluido">🟢 Concluído</span>';

        // ===== CELULAR =====
        if(celular && cards){

            cards.innerHTML += `
                <div class="card-relatorio">

                    <h3>📋 Relatório</h3>

                    <p><strong>📅 Data:</strong><br>${dataBR}</p>

                    <p><strong>👤 Coordenador:</strong><br>${relatorio.coordenador}</p>

                    <p><strong>Status:</strong><br>${status}</p>

                    <div class="card-acoes">

                        <button class="btn-ver"
                            onclick="verRelatorio('${relatorio.id}')">
                            👁 Ver
                        </button>

                        <button class="btn-editar"
                            onclick="editarRelatorio('${relatorio.id}')">
                            ✏️ Editar
                        </button>

                    </div>

                </div>
            `;

        }

        // ===== COMPUTADOR =====
        else{

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

        }

    });

}


carregarRelatorios();

window.addEventListener("resize", carregarRelatorios);