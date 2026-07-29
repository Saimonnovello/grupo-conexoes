// =======================================
// PEGA O ID DA URL
// =======================================

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

// =======================================
// CARREGA O RELATÓRIO
// =======================================

async function carregarRelatorio() {

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("Erro ao carregar relatório.");
        return;
    }

    // Dados principais

    document.getElementById("data_gc").value = data.data_gc;

    document.getElementById("status").value = data.status;

    // Coordenador

    if (data.coordenador.includes("Rafael"))
        document.getElementById("rafael").checked = true;

    if (data.coordenador.includes("Giovani"))
        document.getElementById("giovani").checked = true;

    if (data.coordenador.includes("Paulo"))
        document.getElementById("paulo").checked = true;

    const r = data.respostas;

    // Respostas

    document.getElementById("lider").value = r.lider || "";

    document.getElementById("anfitrioes").value = r.anfitrioes || "";

    document.getElementById("horas_chegaram").value = r.horas_chegaram || "";

    document.getElementById("lideres_atrasados").value = r.lideres_atrasados || "";

    document.getElementById("como_casa").value = r.como_casa || "";

    document.getElementById("estava_familia").value = r.estava_familia || "";

    document.getElementById("que_GC").value = r.que_GC || "";

    document.getElementById("que_comunhao").value = r.que_comunhao || "";

    document.getElementById("foi_comunhao").value = r.foi_comunhao || "";

    document.getElementById("quem_oracao").value = r.quem_oracao || "";

    document.getElementById("leu_material").value = r.leu_material || "";

    document.getElementById("horas_ministracao").value = r.horas_ministracao || "";

    document.getElementById("Ministro_Noite").value = r.ministro_noite || "";

    document.getElementById("Como_durante").value = r.como_durante || "";

    document.getElementById("qual_gelo").value = r.qual_gelo || "";

    document.getElementById("como_tema").value = r.como_tema || "";

    document.getElementById("qual_interacao").value = r.qual_interacao || "";

    document.getElementById("Que_finalizado").value = r.que_finalizado || "";

    document.getElementById("que_liberada").value = r.que_liberada || "";

    document.getElementById("quantos_hoje").value = r.quantos_hoje || "";

    document.getElementById("quantos_fixos").value = r.quantos_fixos || "";

    document.getElementById("quantos_nomes").value = r.quantos_nomes || "";

    document.getElementById("quantas_nomes").value = r.quantas_nomes || "";

    document.getElementById("quem_faltou").value = r.quem_faltou || "";

    document.getElementById("porque_faltou").value = r.porque_faltou || "";

    document.getElementById("observacoes").value = r.observacoes || "";

    // Foto e vídeo

    if (r.foto_video === "sim") {

        document.getElementById("sim").checked = true;

    } else {

        document.getElementById("nao").checked = true;

    }

}

carregarRelatorio();


// =======================================
// ATUALIZAR RELATÓRIO
// =======================================

async function atualizarRelatorio() {

    const coordenador =
        document.querySelector(
            'input[name="coordenador"]:checked'
        )?.nextElementSibling?.textContent || "";

    const fotoVideo =
        document.querySelector(
            'input[name="foto_video"]:checked'
        )?.id || "";

    const respostas = {

        lider: document.getElementById("lider").value,
        anfitrioes: document.getElementById("anfitrioes").value,
        horas_chegaram: document.getElementById("horas_chegaram").value,
        lideres_atrasados: document.getElementById("lideres_atrasados").value,
        como_casa: document.getElementById("como_casa").value,
        estava_familia: document.getElementById("estava_familia").value,
        que_GC: document.getElementById("que_GC").value,
        que_comunhao: document.getElementById("que_comunhao").value,
        foi_comunhao: document.getElementById("foi_comunhao").value,
        quem_oracao: document.getElementById("quem_oracao").value,
        leu_material: document.getElementById("leu_material").value,
        horas_ministracao: document.getElementById("horas_ministracao").value,
        ministro_noite: document.getElementById("Ministro_Noite").value,
        como_durante: document.getElementById("Como_durante").value,
        qual_gelo: document.getElementById("qual_gelo").value,
        como_tema: document.getElementById("como_tema").value,
        qual_interacao: document.getElementById("qual_interacao").value,
        que_finalizado: document.getElementById("Que_finalizado").value,
        que_liberada: document.getElementById("que_liberada").value,
        foto_video: fotoVideo,
        quantos_hoje: document.getElementById("quantos_hoje").value,
        quantos_fixos: document.getElementById("quantos_fixos").value,
        quantos_nomes: document.getElementById("quantos_nomes").value,
        quantas_nomes: document.getElementById("quantas_nomes").value,
        quem_faltou: document.getElementById("quem_faltou").value,
        porque_faltou: document.getElementById("porque_faltou").value,
        observacoes: document.getElementById("observacoes").value

    };

    const { data, error } = await supabaseClient
    .from("relatorios")
    .update({
        data_gc: document.getElementById("data_gc").value,
        coordenador: coordenador,
        respostas: respostas,
        status: document.getElementById("status").value
    })
    .eq("id", Number(id))
    .select();

    console.log("ID:", id);
    console.log("Dados retornados:", data);
    console.log("Erro:", error);

    if (error) {

        console.error(error);

        alert("Erro ao atualizar relatório.");

        return;

    }

    alert("Relatório atualizado com sucesso!");

    window.location.href = "relatorios.html";

}


// =======================================
// PERMISSÕES
// =======================================

const tipo = localStorage.getItem("tipoUsuario");

if (tipo !== "admin") {

    document.getElementById("menuUsuarios").style.display = "none";

}


