
// ==========================================
// DADOS DO USUÁRIO LOGADO
// ==========================================

const usuarioLogado = localStorage.getItem("usuarioLogado");
const tipoUsuario = localStorage.getItem("tipoUsuario");

console.log("Usuário logado:", usuarioLogado);
console.log("Tipo:", tipoUsuario);


// ==========================================
// APLICAR FILTRO DE RELATÓRIOS
// ==========================================

function aplicarFiltroRelatorios(query) {

    if (tipoUsuario === "admin") {
        return query;
    }

    if (usuarioLogado === "Rafael") {
        return query.in("usuario_criador", [
            "Uiliam",
            "Matheus",
            "Guilherme",
            "Saimon"
        ]);
    }

    if (usuarioLogado === "Pr.Paulo") {
        return query.in("usuario_criador", [
            "PauloM",
            "Marciel",
            "Leonardo",
            "Jesiel"
        ]);
    }

    return query.eq("usuario_criador", usuarioLogado);
}


// ==========================================
// VERIFICAR SE O RELATÓRIO ESTÁ ATRASADO
// ==========================================

function verificarPrazoAtrasado(relatorio) {

    if (relatorio.prazo_status === "Preenchido com atraso") {
        return true;
    }

    if (
        relatorio.preenchido_em &&
        relatorio.prazo_limite
    ) {
        return new Date(relatorio.preenchido_em) >
               new Date(relatorio.prazo_limite);
    }

    return false;
}


// ==========================================
// EXIBIR IDENTIFICAÇÃO DO PRAZO
// ==========================================

function mostrarPrazo(relatorio) {

    if (verificarPrazoAtrasado(relatorio)) {
        return `
            <span style="
                display: inline-block;
                background: #fee2e2;
                color: #b91c1c;
                padding: 7px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
            ">
                🔴 Preenchido com atraso
            </span>
        `;
    }

    return `
        <span style="
            color: #16a34a;
            font-size: 13px;
            font-weight: bold;
        ">
            No prazo
        </span>
    `;
}


// ==========================================
// ADICIONAR CABEÇALHO PRAZO NA TABELA
// ==========================================

function adicionarColunaPrazo() {

    const tabela = document.getElementById("listaRelatorios");

    if (!tabela) return;

    const linhaCabecalho = tabela.closest("table")
        ?.querySelector("thead tr");

    if (!linhaCabecalho) return;

    const cabecalhos = Array.from(
        linhaCabecalho.querySelectorAll("th")
    );

    const jaExiste = cabecalhos.some(
        th => th.textContent.trim().toLowerCase() === "prazo"
    );

    if (jaExiste) return;

    const cabecalhoLider = cabecalhos.find(
        th => th.textContent.trim().toLowerCase() === "líder"
    );

    if (cabecalhoLider) {
        const novoCabecalho = document.createElement("th");
        novoCabecalho.textContent = "Prazo";

        cabecalhoLider.insertAdjacentElement(
            "afterend",
            novoCabecalho
        );
    }
}


// ==========================================
// CARREGAR RELATÓRIOS
// ==========================================

async function carregarRelatorios() {

    let consulta = supabaseClient
        .from("relatorios")
        .select("*");

    consulta = aplicarFiltroRelatorios(consulta);

    consulta = consulta.order("id", {
        ascending: false
    });

    const { data, error } = await consulta;

    if (error) {
        console.error("Erro ao carregar relatórios:", error);
        return;
    }

    const tabela = document.getElementById("listaRelatorios");
    const cards = document.getElementById("cardsRelatorios");

    if (!tabela) {
        console.error("Elemento listaRelatorios não encontrado.");
        return;
    }

    tabela.innerHTML = "";

    if (cards) {
        cards.innerHTML = "";
    }

    adicionarColunaPrazo();

    const celular = window.innerWidth <= 768;

    data.forEach(relatorio => {

        // ==========================================
        // DATA
        // ==========================================

        let dataBR = "-";

        if (relatorio.data_gc) {
            const partes = relatorio.data_gc.split("-");

            if (partes.length === 3) {
                const [ano, mes, dia] = partes;
                dataBR = `${dia}/${mes}/${ano}`;
            }
        }


        // ==========================================
        // PRAZO
        // ==========================================

        const prazo = mostrarPrazo(relatorio);


        // ==========================================
        // STATUS
        // ==========================================

        let status = "";

        if (relatorio.status === "Enviado") {
            status = `
                <span class="status-enviado">
                    📤 Enviado
                </span>
            `;
        } else if (relatorio.status === "Conferido") {
            status = `
                <span class="status-conferido">
                    🔍 Conferido
                </span>
            `;
        } else if (relatorio.status === "Concluído") {
            status = `
                <span class="status-concluido">
                    ✅ Concluído
                </span>
            `;
        } else {
            status = `
                <span>
                    ${relatorio.status || "Sem status"}
                </span>
            `;
        }


        // ==========================================
        // CELULAR
        // ==========================================

        if (celular && cards) {

            cards.innerHTML += `
                <div class="card-relatorio">

                    <h3>📋 Relatório</h3>

                    <p>
                        <strong>📅 Data:</strong>
                        <br>
                        ${dataBR}
                    </p>

                    <p>
                        <strong>👤 Coordenador:</strong>
                        <br>
                        ${relatorio.coordenador || "-"}
                    </p>

                    <p>
                        <strong>👨‍💼 Líder:</strong>
                        <br>
                        ${relatorio.usuario_criador || "Não informado"}
                    </p>

                    <p>
                        <strong>⏰ Prazo:</strong>
                        <br>
                        ${prazo}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        <br>
                        ${status}
                    </p>

                    <div class="card-acoes">

                        <button
                            class="btn-ver"
                            onclick="verRelatorio('${relatorio.id}')"
                        >
                            👁 Ver
                        </button>

                        <button
                            class="btn-editar"
                            onclick="editarRelatorio('${relatorio.id}')"
                        >
                            ✏️ Editar
                        </button>

                    </div>

                </div>
            `;


        // ==========================================
        // COMPUTADOR
        // ==========================================

        } else {

            tabela.innerHTML += `
                <tr>

                    <td>
                        ${dataBR}
                    </td>

                    <td>
                        ${relatorio.coordenador || "-"}
                    </td>

                    <td>
                        <strong>
                            ${relatorio.usuario_criador || "Não informado"}
                        </strong>
                    </td>

                    <td>
                        ${prazo}
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td>

                        <button
                            class="btn-ver"
                            onclick="verRelatorio('${relatorio.id}')"
                        >
                            👁 Ver
                        </button>

                        <button
                            class="btn-editar"
                            onclick="editarRelatorio('${relatorio.id}')"
                        >
                            ✏️ Editar
                        </button>

                    </td>

                </tr>
            `;
        }

    });


    // ==========================================
    // NENHUM RELATÓRIO
    // ==========================================

    if (data.length === 0) {

        if (celular && cards) {

            cards.innerHTML = `
                <div class="card-relatorio">
                    <h3>📋 Nenhum relatório</h3>
                    <p>
                        Não há relatórios disponíveis
                        para este usuário.
                    </p>
                </div>
            `;

        } else {

            tabela.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        📋 Nenhum relatório encontrado.
                    </td>
                </tr>
            `;
        }
    }

}


// ==========================================
// VER RELATÓRIO
// ==========================================

function verRelatorio(id) {

    localStorage.setItem("relatorioSelecionado", id);

    window.location.href = "ver-relatorio.html";
}


// ==========================================
// EDITAR RELATÓRIO
// ==========================================

function editarRelatorio(id) {

    window.location.href =
        `editar-relatorio.html?id=${id}`;
}


// ==========================================
// MENU USUÁRIOS
// SOMENTE ADMIN
// ==========================================

if (tipoUsuario !== "admin") {

    const menu = document.getElementById("menuUsuarios");

    if (menu) {
        menu.style.display = "none";
    }
}


// ==========================================
// INICIAR
// ==========================================

carregarRelatorios();


// ==========================================
// ATUALIZAR AO REDIMENSIONAR
// ==========================================

window.addEventListener("resize", carregarRelatorios);
