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
    <h2>Data: ${dataBR}</h2>
    <h3>Coordenador: ${data.coordenador}</h3>

<hr>

<p><strong>3 - Quem é o líder?</strong><br>${r.lider}</p>

<p><strong>4 - Quem são os anfitriões?</strong><br>${r.anfitrioes}</p>

<p><strong>5 - Que horas os líderes chegaram?</strong><br>${r.horas_chegaram}</p>

<p><strong>6 - Os líderes chegaram atrasados?</strong><br>${r.lideres_atrasados}</p>

<p><strong>7 - Como estava a casa?</strong><br>${r.como_casa}</p>

<p><strong>8 - Como estava a família?</strong><br>${r.estava_familia}</p>

<p><strong>9 - Que horas iniciaram o GC?</strong><br>${r.que_GC}</p>

<p><strong>10 - Que horas começou a comunhão?</strong><br>${r.que_comunhao}</p>

<p><strong>11 - Como foi a comunhão?</strong><br>${r.foi_comunhao}</p>

<p><strong>12 - Quem fez a oração?</strong><br>${r.quem_oracao}</p>

<p><strong>13 - Quem leu o material?</strong><br>${r.leu_material}</p>

<p><strong>14 - Que horas começou a ministração?</strong><br>${r.horas_ministracao}</p>

<p><strong>15 - Ministro da noite?</strong><br>${r.ministro_noite}</p>

<p><strong>16 - Como foi o ministro durante a ministração?</strong><br>${r.como_durante}</p>

<p><strong>17 - Qual dinâmica quebra-gelo foi feita?</strong><br>${r.qual_gelo}</p>

<p><strong>18 - Como foi a receptividade do tema?</strong><br>${r.como_tema}</p>

<p><strong>19 - Qual foi o horário da interação da Palavra?</strong><br>${r.qual_interacao}</p>

<p><strong>20 - Que horas foi finalizado?</strong><br>${r.que_finalizado}</p>

<p><strong>21 - Que horas a casa foi liberada?</strong><br>${r.que_liberada}</p>

<p><strong>22 - Foi feito foto e vídeo?</strong><br>${r.foto_video}</p>

<p><strong>23 - Quantos visitantes houve?</strong><br>${r.quantos_hoje}</p>

<p><strong>24 - Quantos membros fixos?</strong><br>${r.quantos_fixos}</p>

<p><strong>25 - Quantos jovens?</strong><br>${r.quantos_nomes}</p>

<p><strong>26 - Quantas crianças?</strong><br>${r.quantas_nomes}</p>

<p><strong>27 - Quem faltou?</strong><br>${r.quem_faltou}</p>

<p><strong>28 - Por que faltou?</strong><br>${r.porque_faltou}</p>

<p><strong>29 - Observações</strong><br>${r.observacoes}</p>
`;
}
carregarRelatorio();