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
    "quantas_nomes",
    
];

    for (const id of campos) {
    const campo = document.getElementById(id);

    if (!campo.value.trim()) {
        alert("Preencha todos os campos antes de salvar.");
        campo.focus();
        return;
    }
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

    console.log("Enviando:", respostas);

    const { data, error } = await supabaseClient
        .from("relatorios")
        .insert([
            {
                data_gc: document.getElementById("data_gc").value,
                coordenador: coordenador,
                respostas: respostas
            }
        ]);

    if (error) {
        console.error("Erro Supabase:", error);
        alert("Erro ao salvar relatório");
        return;
    }

    console.log("Salvo:", data);
    alert("Relatório salvo com sucesso!");

    location.reload();
}