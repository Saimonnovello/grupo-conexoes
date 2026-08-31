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

    // ADMIN PODE VER TODOS
    if (tipoUsuario === "admin") {
        return query;
    }

    // USUÁRIO NORMAL VÊ SOMENTE OS SEUS
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

        const status = relatorio.status === "Pendente"
            ? '<span class="status-pendente">🟡 Pendente</span>'
            : '<span class="status-concluido">🟢 Concluído</span>';

        tabela.innerHTML += `
            <tr>
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

    if (badge) {
        badge.textContent = data.length;
    }

    const lista = document.getElementById("listaNotificacoes");

    if (!lista) return;

    lista.innerHTML = "";

    data.forEach(relatorio => {

        const tempo = tempoDecorrido(relatorio.created_at);

        lista.innerHTML += `

            <div class="item-notificacao">

                <strong>
                    ${relatorio.status === "Pendente" ? "🟡" : "🟢"}
                    ${relatorio.status}
                </strong>

                <div>${relatorio.coordenador}</div>

                <span>${tempo}</span>

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

    const segundos = Math.floor((agora - criado) / 1000);

    if (segundos < 60) {
        return "Agora";
    }

    const minutos = Math.floor(segundos / 60);

    if (minutos < 60) {
        return `há ${minutos} min`;
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
        return `há ${horas} hora${horas > 1 ? "s" : ""}`;
    }

    const dias = Math.floor(horas / 24);

    if (dias < 30) {
        return `há ${dias} dia${dias > 1 ? "s" : ""}`;
    }

    const meses = Math.floor(dias / 30);

    if (meses < 12) {
        return `há ${meses} mês${meses > 1 ? "es" : ""}`;
    }

    const anos = Math.floor(meses / 12);

    return `há ${anos} ano${anos > 1 ? "s" : ""}`;

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
            event: "*",
            schema: "public",
            table: "relatorios"
        },

        () => {

            console.log("Alteração recebida pelo Realtime");

            carregarTotalRelatorios();

            carregarUltimosRelatorios();

            carregarPendentes();

            carregarNotificacoes();

            carregarRelatoriosMes();

        }

    )

    .subscribe();

