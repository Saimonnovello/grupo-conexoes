
function calcularPrazo(dataGC) {

    if (!dataGC) return null;

    const [ano, mes, dia] = dataGC.split("-").map(Number);

    // Cria a data no horário local.
    const data = new Date(ano, mes - 1, dia);

    const diaSemana = data.getDay();

    // Terça, quarta e sábado.
    if (![2, 3, 6].includes(diaSemana)) {
        return null;
    }

    // Prazo: meio-dia do dia seguinte ao GC.
    const prazo = new Date(ano, mes - 1, dia + 1, 12, 0, 0, 0);

    return prazo;
}


// ==========================================
// AVISO AUTOMÁTICO NA TELA NOVO RELATÓRIO
// ==========================================

function atualizarAvisoPrazo() {

    const campoData = document.getElementById("data_gc");
    const aviso = document.getElementById("avisoPrazo");

    if (!campoData || !aviso) return;

    const prazo = calcularPrazo(campoData.value);

    if (!campoData.value) {
        aviso.innerHTML = "📅 Selecione a data do GC para consultar o prazo.";
        aviso.style.color = "#64748b";
        return;
    }

    if (!prazo) {
        aviso.innerHTML =
            "⚠️ Prazo não definido para esse dia. Os prazos previstos são para GC de terça, quarta e sábado.";
        aviso.style.color = "#d97706";
        return;
    }

    const diaSemana = new Date(
        ...campoData.value.split("-").map(Number).map((v, i) => i === 1 ? v - 1 : v)
    ).getDay();

    const dias = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ];

    const nomeDia = dias[prazo.getDay()];

    aviso.innerHTML = `
        ⏰ <strong>Prazo para preencher:</strong><br>
        Até ${nomeDia}, às 12h.
    `;

    aviso.style.color = "#2563eb";
}



// ==========================================
// SALVAR RELATÓRIO
// ==========================================

async function salvarRelatorio() {

    const campos = [
        "data_gc",
        "lider",
        "anfitrioes",
        "horas_chegaram",
        "lideres_atrasados",
        "como_casa",
        "estava_familia",
        "que_GC",
        "que_comunhao",
        "foi_comunhao",
        "quem_oracao",
        "leu_material",
        "horas_ministracao",
        "Ministro_Noite",
        "Como_durante",
        "qual_gelo",
        "como_tema",
        "qual_interacao",
        "Que_finalizado",
        "que_liberada",
        "quantos_hoje",
        "quantos_fixos",
        "quantos_nomes",
        "quantas_nomes"
    ];

    for (const id of campos) {

        const campo = document.getElementById(id);

        if (!campo || !campo.value.trim()) {
            alert("Preencha todos os campos antes de salvar.");

            if (campo) campo.focus();

            return;
        }
    }

    const dataGC = document.getElementById("data_gc").value;

    const prazo = calcularPrazo(dataGC);

    const agora = new Date();

    let prazoStatus;

    if (!prazo) {
        prazoStatus = "Prazo não definido";
    } else if (agora <= prazo) {
        prazoStatus = "No prazo";
    } else {
        prazoStatus = "Preenchido com atraso";
    }

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

    const usuarioLogado = localStorage.getItem("usuarioLogado");

    const { data, error } = await supabaseClient
        .from("relatorios")
        .insert([
            {
                data_gc: dataGC,
                coordenador: coordenador,
                usuario_criador: usuarioLogado,
                respostas: respostas,
                status: document.getElementById("status").value,

                prazo_status: prazoStatus,
                prazo_limite: prazo ? prazo.toISOString() : null,
                preenchido_em: agora.toISOString()
            }
        ])
        .select();

    if (error) {
        console.error("Erro Supabase:", error);
        alert("Erro ao salvar relatório. Verifique o console.");
        return;
    }

    console.log("Relatório salvo:", data);

    if (prazoStatus === "Preenchido com atraso") {
        alert("Relatório salvo! Atenção: ele foi preenchido com atraso.");
    } else {
        alert("Relatório salvo com sucesso!");
    }

    location.reload();
}


// ==========================================
// MENU DE USUÁRIOS
// ==========================================

const tipo = localStorage.getItem("tipo");

const menuUsuarios = document.getElementById("menuUsuarios");

if (tipo !== "admin" && menuUsuarios) {
    menuUsuarios.style.display = "none";
}
