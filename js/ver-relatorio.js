async function carregarRelatorio() {

    const id = localStorage.getItem("relatorioSelecionado");

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    const div = document.getElementById("dadosRelatorio");

    const r = data.respostas;

    const [ano, mes, dia] = data.data_gc.split("-");
    const dataBR = `${dia}/${mes}/${ano}`;

    div.innerHTML = `
    <div class="info-relatorio">

        <h2>📅 ${dataBR}</h2>

        <h3>👤 ${data.coordenador}</h3>

    </div>

<hr>

<hr>

<div class="pergunta">
    <div class="titulo-pergunta">👤 3 - Quem é o líder?</div>
    <div class="resposta">${r.lider || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🏠 4 - Quem são os anfitriões?</div>
    <div class="resposta">${r.anfitrioes || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🕒 5 - Que horas os líderes chegaram?</div>
    <div class="resposta">${r.horas_chegaram || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">⏰ 6 - Os líderes chegaram atrasados?</div>
    <div class="resposta">${r.lideres_atrasados || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🏡 7 - Como estava a casa?</div>
    <div class="resposta">${r.como_casa || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">👨‍👩‍👧‍👦 8 - Como estava a família?</div>
    <div class="resposta">${r.estava_familia || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🕗 9 - Que horas iniciaram o GC?</div>
    <div class="resposta">${r.que_GC || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🍞 10 - Que horas começou a comunhão?</div>
    <div class="resposta">${r.que_comunhao || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🙏 11 - Como foi a comunhão?</div>
    <div class="resposta">${r.foi_comunhao || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🙌 12 - Quem fez a oração?</div>
    <div class="resposta">${r.quem_oracao || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">📖 13 - Quem leu o material?</div>
    <div class="resposta">${r.leu_material || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🎤 14 - Que horas começou a ministração?</div>
    <div class="resposta">${r.horas_ministracao || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🎙️ 15 - Ministro da noite?</div>
    <div class="resposta">${r.ministro_noite || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">✨ 16 - Como foi o ministro durante a ministração?</div>
    <div class="resposta">${r.como_durante || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🎯 17 - Qual dinâmica quebra-gelo foi feita?</div>
    <div class="resposta">${r.qual_gelo || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">💬 18 - Como foi a receptividade do tema?</div>
    <div class="resposta">${r.como_tema || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">📚 19 - Qual foi o horário da interação da Palavra?</div>
    <div class="resposta">${r.qual_interacao || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">✅ 20 - Que horas foi finalizado?</div>
    <div class="resposta">${r.que_finalizado || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🚪 21 - Que horas a casa foi liberada?</div>
    <div class="resposta">${r.que_liberada || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">📷 22 - Foi feito foto e vídeo?</div>
    <div class="resposta">${r.foto_video || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🙋 23 - Quantos visitantes houve?</div>
    <div class="resposta">${r.quantos_hoje || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">👥 24 - Quantos membros fixos?</div>
    <div class="resposta">${r.quantos_fixos || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🧑‍🤝‍🧑 25 - Quantos jovens?</div>
    <div class="resposta">${r.quantos_nomes || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">🧒 26 - Quantas crianças?</div>
    <div class="resposta">${r.quantas_nomes || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">❌ 27 - Quem faltou?</div>
    <div class="resposta">${r.quem_faltou || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">❓ 28 - Por que faltou?</div>
    <div class="resposta">${r.porque_faltou || "-"}</div>
</div>

<div class="pergunta">
    <div class="titulo-pergunta">📝 29 - Observações</div>
    <div class="resposta">${r.observacoes || "-"}</div>
</div>
`;
}
carregarRelatorio();






