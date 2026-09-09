// ==========================================
// DADOS DO USUÁRIO LOGADO
// ==========================================

const usuarioLogado = localStorage.getItem("usuarioLogado");
const tipoUsuario = localStorage.getItem("tipoUsuario");

console.log("Usuário logado:", usuarioLogado);
console.log("Tipo:", tipoUsuario);


// ==========================================
// FUNÇÃO PARA FILTRAR RELATÓRIOS
// ==========================================

function aplicarFiltroUsuario(query) {

    // Administradores continuam vendo tudo
    if (tipoUsuario === "admin") {
        return query;
    }

    // Pastor Rafa vê Uill, Matheus e Guilherme
    if (usuarioLogado === "Rafael") {
        return query.in("usuario_criador", [
            "Uiliam",
            "Matheus",
            "Guilherme"
        ]);
    }

    // Pastor Paulo vê Paulo e Marciel
    if (usuarioLogado === "Pr.Paulo") {
        return query.in("usuario_criador", [
            "PauloM",
            "Marciel"
        ]);
    }

    // Usuário comum vê somente os próprios relatórios
    return query.eq("usuario_criador", usuarioLogado);
}


// ==========================================
// TOTAL DE RELATÓRIOS
// ==========================================

async function carregarTotalRelatorios() {

    let query = supabaseClient
        .from("relatorios")
        .select("id");

    query = aplicarFiltroUsuario(query);

    const { data, error } = await query;

    if (error) {
        console.error("Erro total relatórios:", error);
        return;
    }

    document.getElementById("totalRelatorios").textContent = data.length;
}

carregarTotalRelatorios();


// ==========================================
// PERMISSÕES DO MENU
// ==========================================

const menuDesktop = document.getElementById("menuUsuarios");
const menuMobile = document.getElementById("usuariosMobile");

if (tipoUsuario !== "admin") {

    if (menuDesktop) {
        menuDesktop.style.display = "none";
    }

    if (menuMobile) {
        menuMobile.style.display = "none";
    }

}


// ==========================================
// MODO ESCURO
// ==========================================

const temaBtn = document.querySelector(".tema-btn");

const tema = localStorage.getItem("tema");

if (tema === "dark") {
    document.body.classList.add("dark");
}

if (temaBtn) {

    temaBtn.onclick = function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("tema", "dark");
        } else {
            localStorage.setItem("tema", "light");
        }

    };

}


// ==========================================
// ÚLTIMOS RELATÓRIOS
// ==========================================

async function carregarUltimosRelatorios() {

    let query = supabaseClient
        .from("relatorios")
        .select("*");

    query = aplicarFiltroUsuario(query);

    const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        console.error("Erro últimos relatórios:", error);
        return;
    }

    const tabela = document.getElementById("listaInicio");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(relatorio => {

        const [ano, mes, dia] = relatorio.data_gc.split("-");
        const dataBR = `${dia}/${mes}/${ano}`;

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

} else {

    status = `
        <span class="status-concluido">
            ✅ Concluído
        </span>
    `;

}

        tabela.innerHTML += `
                <td>${dataBR}</td>
                <td>${relatorio.coordenador}</td>
                <td>${status}</td>
            </tr>
        `;

    });

}

carregarUltimosRelatorios();


// ==========================================
// NOTIFICAÇÕES
// ==========================================

const sino = document.querySelector(".notificacao");
const painel = document.getElementById("painelNotificacoes");
const badge = document.getElementById("badgeNotificacao");

if (sino && painel && badge) {

    sino.onclick = () => {

        painel.classList.toggle("ativo");

        badge.style.display = "none";

        localStorage.setItem(
            "notificacoesLidas",
            "sim"
        );

        // Atualiza os tempos das notificações
        carregarNotificacoes();

    };

}

if (badge) {

    if (localStorage.getItem("notificacoesLidas") === "nao") {
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }

}


if (sino && painel && badge) {

    sino.onclick = () => {

        painel.classList.toggle("ativo");

        badge.style.display = "none";

        localStorage.setItem("notificacoesLidas", "sim");

    };

}


// ==========================================
// CARREGAR NOTIFICAÇÕES
// ==========================================

async function carregarNotificacoes() {

    let query = supabaseClient
        .from("relatorios")
        .select("status, coordenador, created_at");

    query = aplicarFiltroUsuario(query);

    const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error("Erro notificações:", error);
        return;
    }

    const lista = document.getElementById("listaNotificacoes");

    if (!lista) return;

    lista.innerHTML = "";

    data.forEach(relatorio => {

        const tempo = tempoDecorrido(relatorio.created_at);

        let emojiStatus = "";

        if (relatorio.status === "Enviado") {

            emojiStatus = "📤";

        } else if (relatorio.status === "Conferido") {

            emojiStatus = "🔍";

        } else if (relatorio.status === "Concluído") {

            emojiStatus = "✅";

        } else {

            emojiStatus = "📋";

        }

        lista.innerHTML += `

            <div class="item-notificacao">

                <strong>
                    ${emojiStatus} ${relatorio.status}
                </strong>

                <div>
                    ${relatorio.coordenador}
                </div>

                <span>
                    ${tempo}
                </span>

            </div>

        `;

    });

}

carregarNotificacoes();


// ==========================================
// TEMPO DECORRIDO
// ==========================================

function tempoDecorrido(data) {
    const agora = new Date();
    const criado = new Date(data);

    const diferencaSegundos = Math.floor((agora - criado) / 1000);

    // Menos de 1 minuto
    if (diferencaSegundos < 60) {
        return "Agora";
    }

    const minutosTotais = Math.floor(diferencaSegundos / 60);

    const dias = Math.floor(minutosTotais / 1440);
    const horas = Math.floor((minutosTotais % 1440) / 60);
    const minutos = minutosTotais % 60;

    // Menos de 24 horas
    if (dias === 0) {
        if (horas === 0) {
            return `${minutos} min`;
        }

        if (minutos === 0) {
            return `${horas} hora${horas > 1 ? "s" : ""}`;
        }

        return `${horas} hora${horas > 1 ? "s" : ""} e ${minutos} min`;
    }

    // 24 horas ou mais
    if (horas === 0 && minutos === 0) {
        return `${dias} dia${dias > 1 ? "s" : ""}`;
    }

    if (horas === 0) {
        return `${dias} dia${dias > 1 ? "s" : ""} e ${minutos} min`;
    }

    if (minutos === 0) {
        return `${dias} dia${dias > 1 ? "s" : ""} e ${horas} hora${horas > 1 ? "s" : ""}`;
    }

    return `${dias} dia${dias > 1 ? "s" : ""}, ${horas} hora${horas > 1 ? "s" : ""} e ${minutos} min`;
}

// ==========================================
// RELATÓRIOS PENDENTES
// ==========================================

async function carregarPendentes() {

    let query = supabaseClient
        .from("relatorios")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", "Pendente");

    query = aplicarFiltroUsuario(query);

    const { count, error } = await query;

    if (error) {
        console.error("Erro pendentes:", error);
        return;
    }

    const campoPendentes = document.getElementById("pendentes");

    if (campoPendentes) {
        campoPendentes.textContent = count || 0;
    }

}

carregarPendentes();


// ==========================================
// RELATÓRIOS DESTE MÊS
// ==========================================

async function carregarRelatoriosMes() {

    const hoje = new Date();

    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    let query = supabaseClient
        .from("relatorios")
        .select("data_gc");

    query = aplicarFiltroUsuario(query);

    const { data, error } = await query;

    if (error) {
        console.error("Erro relatórios do mês:", error);
        return;
    }

    let total = 0;

    data.forEach(relatorio => {

        if (!relatorio.data_gc) return;

        const [ano, mes] = relatorio.data_gc
            .split("-")
            .map(Number);

        if (ano === anoAtual && mes === mesAtual) {
            total++;
        }

    });

    const campoMes = document.getElementById("relatoriosMes");

    if (campoMes) {
        campoMes.textContent = total;
    }

}

carregarRelatoriosMes();


// ==========================================
// REALTIME
// ==========================================

supabaseClient
    .channel("dashboard")

    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "relatorios"
        },

        (payload) => {

            console.log("🔔 NOVO RELATÓRIO:", payload);

            // Marca que existe uma nova notificação
            localStorage.setItem(
                "notificacoesLidas",
                "nao"
            );

            // Mostra a bolinha vermelha
            if (badge) {

                badge.textContent = "1";
                badge.style.display = "flex";

            }

            // Atualiza os dados da tela
            carregarTotalRelatorios();
            carregarUltimosRelatorios();
            carregarNotificacoes();
            carregarRelatoriosMes();

        }

    )

    .subscribe((status) => {

        console.log(
            "Status Realtime:",
            status
        );

    });

