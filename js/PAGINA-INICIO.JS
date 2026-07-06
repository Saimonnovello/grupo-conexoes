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

sino.onclick = () => {

    painel.classList.toggle("ativo");

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

        const minutos = Math.floor(
            (Date.now() - new Date(relatorio.created_at)) / 60000
        );

        lista.innerHTML += `
            <div class="item-notificacao">

                <strong>
                    ${relatorio.status=="Pendente" ? "🟡" : "🟢"}
                    ${relatorio.status}
                </strong>

                <div>${relatorio.coordenador}</div>

                <span>há ${minutos} minuto(s)</span>

            </div>
        `;

    });

}




supabaseClient
.channel("notificacoes")

.on(
    "postgres_changes",
    {
        event:"INSERT",
        schema:"public",
        table:"relatorios"
    },

    payload=>{

        carregarNotificacoes();

    }

)

.subscribe();

carregarNotificacoes();