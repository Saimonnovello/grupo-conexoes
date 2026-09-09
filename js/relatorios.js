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

    // ==========================================
    // ADMINISTRADORES
    // VÊEM TODOS
    // ==========================================

    if (tipoUsuario === "admin") {
        return query;
    }


    // ==========================================
    // PASTOR RAFA
    // VÊ UILL + MATHEUS + GUILHERME
    // ==========================================

    if (usuarioLogado === "Rafael") {

        return query.in("usuario_criador", [
            "Uiliam",
            "Matheus",
            "Guilherme"
        ]);
    }


    // ==========================================
    // PASTOR PAULO
    // VÊ PAULO + MARCIEL
    // ==========================================

    if (usuarioLogado === "Pr.Paulo") {

        return query.in("usuario_criador", [
            "PauloM",
            "Marciel"
        ]);
    }


    // ==========================================
    // USUÁRIO NORMAL
    // VÊ SOMENTE OS PRÓPRIOS
    // ==========================================

    return query.eq(
        "usuario_criador",
        usuarioLogado
    );
}


// ==========================================
// CARREGAR RELATÓRIOS
// ==========================================

async function carregarRelatorios() {

    let consulta = supabaseClient
        .from("relatorios")
        .select("*");

    // Aplica as regras de acesso
    consulta = aplicarFiltroRelatorios(consulta);

    // Ordena pelos mais recentes
    consulta = consulta.order("id", {
        ascending: false
    });


    const { data, error } = await consulta;


    if (error) {

        console.error(
            "Erro ao carregar relatórios:",
            error
        );

        return;
    }


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const tabela =
        document.getElementById(
            "listaRelatorios"
        );

    const cards =
        document.getElementById(
            "cardsRelatorios"
        );


    if (!tabela) {
        console.error(
            "Elemento listaRelatorios não encontrado."
        );
        return;
    }


    // Limpa tabela
    tabela.innerHTML = "";


    // Limpa cards
    if (cards) {
        cards.innerHTML = "";
    }


    // ==========================================
    // VERIFICAR SE É CELULAR
    // ==========================================

    const celular =
        window.innerWidth <= 768;


    // ==========================================
    // MOSTRAR RELATÓRIOS
    // ==========================================

    data.forEach(relatorio => {


        // ==========================================
        // DATA
        // ==========================================

        let dataBR = "-";

        if (relatorio.data_gc) {

            const partes =
                relatorio.data_gc.split("-");

            if (partes.length === 3) {

                const [ano, mes, dia] = partes;

                dataBR =
                    `${dia}/${mes}/${ano}`;
            }
        }


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


        } else if (
            relatorio.status === "Conferido"
        ) {

            status = `
                <span class="status-conferido">
                    🔍 Conferido
                </span>
            `;


        } else if (
            relatorio.status === "Concluído"
        ) {

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

                    <h3>
                        📋 Relatório
                    </h3>


                    <p>
                        <strong>
                            📅 Data:
                        </strong>
                        <br>
                        ${dataBR}
                    </p>


                    <p>
                        <strong>
                            👤 Coordenador:
                        </strong>
                        <br>
                        ${relatorio.coordenador || "-"}
                    </p>


                    <p>
                        <strong>
                            Status:
                        </strong>
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
                    <td colspan="4" style="text-align:center;">
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

    localStorage.setItem(
        "relatorioSelecionado",
        id
    );

    window.location.href =
        "ver-relatorio.html";
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

    const menu =
        document.getElementById(
            "menuUsuarios"
        );

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

window.addEventListener(
    "resize",
    carregarRelatorios
);