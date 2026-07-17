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


// ==========================
// PERMISSÕES
// ==========================

const tipoUsuario = localStorage.getItem("tipoUsuario");

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


// ==========================
// MODO ESCURO
// ==========================

const temaBtn = document.querySelector(".tema-btn");

const tema = localStorage.getItem("tema");

if (tema === "dark") {
    document.body.classList.add("dark");
}

temaBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
    } else {
        localStorage.setItem("tema", "light");
    }

};


// ==========================
// ÚLTIMOS RELATÓRIOS
// ==========================

async function carregarUltimosRelatorios() {

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        console.error(error);
        return;
    }

    const tabela = document.getElementById("listaInicio");
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

const sino = document.querySelector(".notificacao");
const painel = document.getElementById("painelNotificacoes");
const badge = document.getElementById("badgeNotificacao");



if(localStorage.getItem("notificacoesLidas") == "nao"){

    badge.style.display = "flex";

}else{

    badge.style.display = "none";

}

// Ao entrar na página considera as notificações como lidas


sino.onclick = () => {

    painel.classList.toggle("ativo");

    badge.style.display = "none";

    localStorage.setItem("notificacoesLidas","sim");

}




async function carregarNotificacoes(){

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("status, coordenador, created_at")
        .order("created_at",{ascending:false})
        .limit(20);

    if(error){
        console.log(error);
        return;
    }

    document.getElementById("badgeNotificacao").textContent = data.length;

    const lista = document.getElementById("listaNotificacoes");

    lista.innerHTML = "";

    data.forEach(relatorio=>{

      const tempo = tempoDecorrido(relatorio.created_at);

        lista.innerHTML += `
            <div class="item-notificacao">

                <strong>
                    ${relatorio.status=="Pendente" ? "🟡" : "🟢"}
                    ${relatorio.status}
                </strong>

                <div>${relatorio.coordenador}</div>

                <span>${tempo}</span>

            </div>
        `;

    });

}




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

        console.log("Novo relatório recebido pelo Realtime");

        carregarTotalRelatorios();

        carregarUltimosRelatorios();

        carregarPendentes();

        carregarNotificacoes();

    }

)

.subscribe();


function tempoDecorrido(data) {

    const agora = new Date();
    const criado = new Date(data);

    const segundos = Math.floor((agora - criado) / 1000);

    if (segundos < 60)
        return "Agora";

    const minutos = Math.floor(segundos / 60);

    if (minutos < 60)
        return `há ${minutos} min`;

    const horas = Math.floor(minutos / 60);

    if (horas < 24)
        return `há ${horas} hora${horas > 1 ? "s" : ""}`;

    const dias = Math.floor(horas / 24);

    if (dias < 30)
        return `há ${dias} dia${dias > 1 ? "s" : ""}`;

    const meses = Math.floor(dias / 30);

    if (meses < 12)
        return `há ${meses} mês${meses > 1 ? "es" : ""}`;

    const anos = Math.floor(meses / 12);

    return `há ${anos} ano${anos > 1 ? "s" : ""}`;

}





carregarNotificacoes();


async function carregarPendentes() {

    const { count, error } = await supabaseClient
        .from("relatorios")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pendente");

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("pendentes").textContent = count;

}


carregarPendentes();





if(localStorage.getItem("notificacoesLidas") == "sim"){

    badge.style.display = "none";

}else{

    badge.style.display = "flex";

}




async function carregarRelatoriosMes() {

    const hoje = new Date();

    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    console.log("Mês atual:", mesAtual);
    console.log("Ano atual:", anoAtual);

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("data_gc");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);

    let total = 0;

    data.forEach(relatorio => {

        const [ano, mes] = relatorio.data_gc.split("-").map(Number);

        console.log(relatorio.data_gc, ano, mes);

        if (ano === anoAtual && mes === mesAtual) {
            total++;
        }

    });

    console.log("Total:", total);

    document.getElementById("relatoriosMes").textContent = total;

}

carregarRelatoriosMes();