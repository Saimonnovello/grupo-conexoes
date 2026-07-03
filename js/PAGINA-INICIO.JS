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