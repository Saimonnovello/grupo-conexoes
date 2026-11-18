
async function carregarRelatorio() {

    const id = localStorage.getItem("relatorioSelecionado");

    if (!id) {
        console.error("Nenhum relatório selecionado.");
        return;
    }

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao carregar relatório:", error);
        return;
    }

    // ==========================================
    // CONFERÊNCIA INDIVIDUAL DOS RESPONSÁVEIS
    // ==========================================

    const usuarioLogado = localStorage.getItem("usuarioLogado");

    const responsaveis = [
        {
            login: "Rafael",
            coluna: "visto_rafael_em",
            nome: "Rafael"
        },
        {
            login: "Pr.Paulo",
            coluna: "visto_paulo_em",
            nome: "Pastor Paulo"
        },
        {
            login: "pr.thiago",
            coluna: "visto_thiago_em",
            nome: "Pastor Thiago"
        },
        {
            login: "Pr.Giovani",
            coluna: "visto_giovani_em",
            nome: "Pastor Giovani"
        }
    ];

    const responsavel = responsaveis.find(
        pessoa => pessoa.login === usuarioLogado
    );

    // Registra a primeira visualização de cada responsável.
    if (responsavel && !data[responsavel.coluna]) {

        const agora = new Date().toISOString();

        const { error: erroConferencia } = await supabaseClient
            .from("relatorios")
            .update({
                [responsavel.coluna]: agora
            })
            .eq("id", id)
            .is(responsavel.coluna, null);

        if (erroConferencia) {
            console.error(
                "Erro ao registrar conferência:",
                erroConferencia
            );
        }

        // Busca novamente o registro salvo no banco.
        const { data: atualizado, error: erroLeitura } =
            await supabaseClient
                .from("relatorios")
                .select(responsavel.coluna)
                .eq("id", id)
                .single();

        if (erroLeitura) {
            console.error("Erro ao consultar conferência:", erroLeitura);
        } else if (atualizado) {
            data[responsavel.coluna] = atualizado[responsavel.coluna];
        }
    }

    // ==========================================
    // DADOS DO RELATÓRIO
    // ==========================================

    const div = document.getElementById("dadosRelatorio");

    const r = data.respostas || {};

    const [ano, mes, dia] = data.data_gc.split("-");
    const dataBR = `${dia}/${mes}/${ano}`;

    // ==========================================
    // MONTAR LISTA DE CONFERÊNCIA
    // ==========================================

    const htmlConferencia = responsaveis.map(pessoa => {

        const dataVisualizacao = data[pessoa.coluna];

        return `
            <div class="resposta" style="margin-top:15px;">

                <strong>
                    ${dataVisualizacao ? "✅" : "⏳"}
                    ${pessoa.nome}
                </strong>

                <div style="color:${dataVisualizacao ? "#16a34a" : "#d97706"}; font-weight:bold;">
                    ${dataVisualizacao ? "CONFERIDO" : "PENDENTE"}
                </div>

                <small>
                    ${dataVisualizacao
                        ? new Date(dataVisualizacao).toLocaleString("pt-BR")
                        : "Ainda não visualizou este relatório."}
                </small>

            </div>
        `;

    }).join("");

    // ==========================================
    // EXIBIR RELATÓRIO COMPLETO
    // ==========================================

    div.innerHTML = `

    <div class="info-relatorio">

        <h2>📅 ${dataBR}</h2>

        <h3>👤 ${data.coordenador}</h3>

    </div>

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

    <hr>

    <div class="pergunta">

        <div class="titulo-pergunta">
            🔍 Conferência do relatório
        </div>

        ${htmlConferencia}

    </div>

    `;

}


// ==========================================
// SALVAR STATUS DO RELATÓRIO
// ==========================================

async function salvarStatusRelatorio() {

    const id = localStorage.getItem("relatorioSelecionado");

    const campoStatus = document.getElementById("novoStatus");

    if (!id || !campoStatus) {
        alert("Não foi possível identificar o relatório ou o status.");
        return;
    }

    const novoStatus = campoStatus.value;

    const confirmar = confirm(
        `Deseja alterar o status para "${novoStatus}"?`
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("relatorios")
        .update({ status: novoStatus })
        .eq("id", id);

    if (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Não foi possível salvar. Verifique as permissões do Supabase.");
        return;
    }

    alert("Status atualizado com sucesso!");

    location.reload();
}


carregarRelatorio();
