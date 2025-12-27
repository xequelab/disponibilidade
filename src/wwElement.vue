<template>
  <div class="disponibilidade-semanal" :style="cssVars">
    <div v-for="dia in diasSemana" :key="dia.index" class="dia-container">
      <!-- Header do Dia -->
      <div
        class="dia-header"
        :class="{
          'dia-selecionado': diasSemanaEscolhidos[dia.index],
          'dia-expandido': expandedDays.has(dia.index)
        }"
        @click="toggleDiaExpansion(dia.index)"
      >
        <div class="dia-header-left">
          <div class="checkbox-wrapper" @click.stop="toggleDiaSelection(dia.index)">
            <div class="checkbox" :class="{ checked: diasSemanaEscolhidos[dia.index] }">
              <svg v-if="diasSemanaEscolhidos[dia.index]" class="checkmark" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
          </div>

          <span class="dia-label">{{ dia.label }}</span>
          <span v-if="diasSemanaEscolhidos[dia.index]" class="disponivel-badge">{{ content.labelDisponivelBadge || '(Disponível)' }}</span>
        </div>

        <button
          v-if="diasSemanaEscolhidos[dia.index]"
          class="expand-button"
          type="button"
          @click.stop="toggleDiaExpansion(dia.index)"
        >
          <svg class="expand-icon" :class="{ rotated: expandedDays.has(dia.index) }" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
      </div>

      <!-- Conteúdo do Dia (Blocos de Horário) -->
      <div
        v-if="diasSemanaEscolhidos[dia.index] && expandedDays.has(dia.index)"
        class="dia-conteudo"
      >
        <!-- Barra de ações -->
        <div class="acoes-dia">
          <button
            class="copiar-dia-button"
            type="button"
            @click="copiarDia(dia.index)"
            title="Copiar horários deste dia para outros dias"
          >
            <svg viewBox="0 0 24 24" class="copy-icon">
              <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
            </svg>
            Copiar para outros dias
          </button>
        </div>

        <!-- Blocos de Horário -->
        <div class="blocos-horarios">
          <div
            v-for="blocoNum in quantidadeBlocosPorDia[dia.index]"
            :key="blocoNum"
            class="bloco-horario-wrapper"
          >
            <div class="bloco-horario">
              <div class="bloco-campos">
                <div class="horario-field">
                  <label class="field-label">{{ content.labelHorarioInicio || 'Horário de início' }}</label>
                  <div class="time-input-wrapper">
                    <input
                      type="time"
                      class="time-input"
                      :value="getBlocoInicio(dia.key, blocoNum)"
                      @input="(e) => updateBlocoInicio(dia.key, blocoNum, e.target.value)"
                      @change="(e) => formatTimeInput(dia.key, blocoNum, 'inicio', e.target.value)"
                    />
                    <svg class="clock-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" />
                    </svg>
                  </div>
                </div>

                <div class="horario-field">
                  <label class="field-label">{{ content.labelHorarioTermino || 'Horário de Término' }}</label>
                  <div class="time-input-wrapper">
                    <input
                      type="time"
                      class="time-input"
                      :value="getBlocoTermino(dia.key, blocoNum)"
                      @input="(e) => updateBlocoTermino(dia.key, blocoNum, e.target.value)"
                      @change="(e) => formatTimeInput(dia.key, blocoNum, 'termino', e.target.value)"
                    />
                    <svg class="clock-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Botão de remover bloco ou espaçador -->
              <button
                v-if="blocoNum > 1"
                class="remove-block-button"
                type="button"
                @click="removeBloco(dia.index, blocoNum)"
                title="Remover bloco"
              >
                <svg viewBox="0 0 24 24" class="remove-icon">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
              </button>
              <div v-else class="remove-block-spacer"></div>
            </div>

            <!-- Mensagem de Erro -->
            <div v-if="getErroBloco(dia.key, blocoNum)" class="bloco-erro">
              {{ getErroBloco(dia.key, blocoNum) }}
            </div>
          </div>

          <!-- Botão de adicionar bloco -->
          <button
            v-if="quantidadeBlocosPorDia[dia.index] < 6"
            class="add-block-button"
            type="button"
            @click="addBloco(dia.index)"
          >
            <svg viewBox="0 0 24 24" class="add-icon">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Adicionar bloco
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Cópia -->
    <div v-if="modalCopiarDia.visivel" class="modal-overlay" @click="fecharModalCopia">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Copiar horários</h3>
          <button class="modal-close-button" type="button" @click="fecharModalCopia">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Selecione os dias para os quais deseja copiar a configuração de <strong>{{ diasSemana.find(d => d.index === modalCopiarDia.diaOrigem)?.label }}</strong>:
          </p>

          <div class="dias-destino-lista">
            <div
              v-for="dia in diasSemana"
              :key="dia.index"
              class="dia-destino-item"
              :class="{
                'origem': dia.index === modalCopiarDia.diaOrigem,
                'selecionado': modalCopiarDia.diasDestino.includes(dia.index)
              }"
            >
              <label class="dia-destino-label">
                <input
                  type="checkbox"
                  class="dia-destino-checkbox"
                  :checked="modalCopiarDia.diasDestino.includes(dia.index)"
                  :disabled="dia.index === modalCopiarDia.diaOrigem"
                  @change="toggleDiaDestino(dia.index)"
                />
                <span class="dia-destino-nome">{{ dia.label }}</span>
                <span v-if="dia.index === modalCopiarDia.diaOrigem" class="badge-origem">(Origem)</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-button modal-button-cancel" type="button" @click="fecharModalCopia">
            Cancelar
          </button>
          <button
            class="modal-button modal-button-confirm"
            type="button"
            :disabled="modalCopiarDia.diasDestino.length === 0"
            @click="confirmarCopia"
          >
            Copiar para {{ modalCopiarDia.diasDestino.length }} dia{{ modalCopiarDia.diasDestino.length !== 1 ? 's' : '' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

export default {
  name: 'DisponibilidadeSemanal',
  props: {
    content: {
      type: Object,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    }
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Detectar modo editor
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      return false;
    });

    // CSS Variables dinâmicas baseadas nas props do editor
    const cssVars = computed(() => ({
      '--header-bg-color': props.content?.headerBackgroundColor || '#1e3a5f',
      '--header-text-color': props.content?.headerTextColor || '#ffffff',
      '--checkbox-checked-color': props.content?.checkboxCheckedColor || '#4caf50',
      '--content-bg-color': props.content?.contentBackgroundColor || '#fafafa',
      '--border-color': props.content?.borderColor || '#e0e0e0',
      '--input-border-color': props.content?.inputBorderColor || '#ccc',
      '--input-focus-border-color': props.content?.inputFocusBorderColor || '#1e3a5f',
      '--day-gap': props.content?.dayGap || '8px',
      '--block-gap': props.content?.blockGap || '16px'
    }));

    // Definição dos dias da semana com labels customizáveis
    // index: posição nas variáveis diasSemanaEscolhidos e quantidadeBlocosPorDia (0=domingo, 1=segunda, ...)
    // A ordem visual na UI é diferente (segunda a domingo)
    const diasSemana = computed(() => [
      { index: 1, key: 'segunda', label: props.content?.labelSegunda || 'Segunda-feira' },
      { index: 2, key: 'terca', label: props.content?.labelTerca || 'Terça-feira' },
      { index: 3, key: 'quarta', label: props.content?.labelQuarta || 'Quarta-feira' },
      { index: 4, key: 'quinta', label: props.content?.labelQuinta || 'Quinta-feira' },
      { index: 5, key: 'sexta', label: props.content?.labelSexta || 'Sexta-feira' },
      { index: 6, key: 'sabado', label: props.content?.labelSabado || 'Sábado' },
      { index: 0, key: 'domingo', label: props.content?.labelDomingo || 'Domingo' }
    ]);

    // Inicializar estrutura de blocos vazia
    const inicializarBlocos = () => {
      const blocos = {};
      const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
      dias.forEach(dia => {
        blocos[dia] = {
          bloco_1_inicio: '',
          bloco_1_termino: '',
          bloco_2_inicio: '',
          bloco_2_termino: '',
          bloco_3_inicio: '',
          bloco_3_termino: '',
          bloco_4_inicio: '',
          bloco_4_termino: '',
          bloco_5_inicio: '',
          bloco_5_termino: '',
          bloco_6_inicio: '',
          bloco_6_termino: ''
        };
      });
      return blocos;
    };

    // Variáveis de componente expostas
    const { value: diasSemanaEscolhidos, setValue: setDiasSemanaEscolhidos } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'diasSemanaEscolhidos',
      type: 'array',
      defaultValue: [false, false, false, false, false, false, false]
    });

    const { value: quantidadeBlocosPorDia, setValue: setQuantidadeBlocosPorDia } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'quantidadeBlocosPorDia',
      type: 'array',
      defaultValue: [0, 0, 0, 0, 0, 0, 0]
    });

    const { value: blocos, setValue: setBlocos } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blocos',
      type: 'object',
      defaultValue: inicializarBlocos()
    });

    const { value: validacaoOk, setValue: setValidacaoOk } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'validacaoOk',
      type: 'boolean',
      defaultValue: true
    });

    const { value: mensagensErro, setValue: setMensagensErro } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'mensagensErro',
      type: 'array',
      defaultValue: []
    });

    // Variáveis expostas para mensagens de erro configuradas no editor
    const { value: msgErroBlocoIncompleto } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'msgErroBlocoIncompleto',
      type: 'string',
      defaultValue: computed(() => props.content?.msgErroBlocoIncompleto || 'Preencha tanto o horário de início quanto o de término')
    });

    const { value: msgErroTerminoMenorInicio } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'msgErroTerminoMenorInicio',
      type: 'string',
      defaultValue: computed(() => props.content?.msgErroTerminoMenorInicio || 'O horário de término deve ser maior que o de início')
    });

    const { value: msgErroSobreposicao } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'msgErroSobreposicao',
      type: 'string',
      defaultValue: computed(() => props.content?.msgErroSobreposicao || 'Sobreposição com o bloco')
    });

    // Flag para controlar se os dados iniciais já foram carregados
    const dadosIniciaisCarregados = ref(false);

    // Mapeamento de dia_semana (index) para key do objeto blocos
    const indexToDiaKey = {
      0: 'domingo',
      1: 'segunda',
      2: 'terca',
      3: 'quarta',
      4: 'quinta',
      5: 'sexta',
      6: 'sabado'
    };

    // Função para carregar dados iniciais das tabelas
    const carregarDadosIniciais = () => {
      const dadosConfig = props.content?.dadosConfig;
      const dadosDias = props.content?.dadosDias;
      const dadosDiasBlocos = props.content?.dadosDiasBlocos;

      // Verifica se temos os dados necessários (pelo menos dias)
      if (!dadosDias || !Array.isArray(dadosDias) || dadosDias.length === 0) {
        return;
      }

      // Marca que os dados foram carregados para não recarregar
      dadosIniciaisCarregados.value = true;

      // 1. Processar diasSemanaEscolhidos a partir de dadosDias
      const novosDiasSemana = [false, false, false, false, false, false, false];
      const mapaDiaIdParaIndex = {}; // Mapeia dia_id para dia_semana (index)

      dadosDias.forEach(dia => {
        const diaSemana = dia.dia_semana;
        const ativo = dia.Ativo === true || dia.ativo === true; // Suporta ambos os cases

        if (diaSemana >= 0 && diaSemana <= 6) {
          novosDiasSemana[diaSemana] = ativo;
          mapaDiaIdParaIndex[dia.id] = diaSemana;
        }
      });

      setDiasSemanaEscolhidos(novosDiasSemana);

      // 2. Processar blocos a partir de dadosDiasBlocos
      const novosBlocos = inicializarBlocos();
      const contagemBlocosPorDia = [0, 0, 0, 0, 0, 0, 0];

      if (dadosDiasBlocos && Array.isArray(dadosDiasBlocos)) {
        dadosDiasBlocos.forEach(bloco => {
          const diaIndex = mapaDiaIdParaIndex[bloco.dia_id];

          if (diaIndex === undefined || diaIndex < 0 || diaIndex > 6) {
            return; // dia_id não encontrado no mapeamento
          }

          const diaKey = indexToDiaKey[diaIndex];
          const numeroBloco = bloco.numero_bloco;

          if (!diaKey || numeroBloco < 1 || numeroBloco > 6) {
            return; // Dados inválidos
          }

          // Formatar horários (garantir formato HH:MM:SS)
          let horarioInicio = bloco.horario_inicio || '';
          let horarioFim = bloco.horario_fim || '';

          // Se o horário não tem segundos, adiciona :00
          if (horarioInicio && horarioInicio.split(':').length === 2) {
            horarioInicio = `${horarioInicio}:00`;
          }
          if (horarioFim && horarioFim.split(':').length === 2) {
            horarioFim = `${horarioFim}:00`;
          }

          novosBlocos[diaKey][`bloco_${numeroBloco}_inicio`] = horarioInicio;
          novosBlocos[diaKey][`bloco_${numeroBloco}_termino`] = horarioFim;

          // Atualiza contagem de blocos para o dia
          if (numeroBloco > contagemBlocosPorDia[diaIndex]) {
            contagemBlocosPorDia[diaIndex] = numeroBloco;
          }
        });
      }

      setBlocos(novosBlocos);
      setQuantidadeBlocosPorDia(contagemBlocosPorDia);

      // 3. Expandir automaticamente os dias selecionados
      nextTick(() => {
        novosDiasSemana.forEach((selecionado, index) => {
          if (selecionado) {
            expandedDays.value.add(index);
          }
        });

        // Validar após carregar
        validarTodosOsBlocos();
      });
    };

    // State interno para controle de expansão
    const expandedDays = ref(new Set());

    // State interno para erros por bloco
    const errosPorBloco = ref({});

    // Toggle seleção do dia
    const toggleDiaSelection = (diaIndex) => {
      if (isEditing.value) return;

      const newDiasSemana = [...diasSemanaEscolhidos.value];
      newDiasSemana[diaIndex] = !newDiasSemana[diaIndex];
      setDiasSemanaEscolhidos(newDiasSemana);

      // Se selecionou, expande automaticamente e define quantidade padrão
      if (newDiasSemana[diaIndex]) {
        expandedDays.value.add(diaIndex);

        // Define quantidade padrão de blocos se for 0 (sempre começa com 2 blocos)
        if (quantidadeBlocosPorDia.value[diaIndex] === 0) {
          const newQuantidades = [...quantidadeBlocosPorDia.value];
          newQuantidades[diaIndex] = 2;
          setQuantidadeBlocosPorDia(newQuantidades);

          // Pré-preenche os dois primeiros blocos com valores padrão
          const diaKey = diasSemana.value.find(d => d.index === diaIndex).key;
          const newBlocos = JSON.parse(JSON.stringify(blocos.value));

          const defaultBlock1Start = props.content?.defaultBlock1StartTime || '09:00';
          const defaultBlock1End = props.content?.defaultBlock1EndTime || '12:00';
          const defaultBlock2Start = props.content?.defaultBlock2StartTime || '14:00';
          const defaultBlock2End = props.content?.defaultBlock2EndTime || '18:00';

          newBlocos[diaKey].bloco_1_inicio = `${defaultBlock1Start}:00`;
          newBlocos[diaKey].bloco_1_termino = `${defaultBlock1End}:00`;
          newBlocos[diaKey].bloco_2_inicio = `${defaultBlock2Start}:00`;
          newBlocos[diaKey].bloco_2_termino = `${defaultBlock2End}:00`;

          setBlocos(newBlocos);
        }
      } else {
        // Se desmarcou, remove da expansão e zera blocos
        expandedDays.value.delete(diaIndex);

        const newQuantidades = [...quantidadeBlocosPorDia.value];
        newQuantidades[diaIndex] = 0;
        setQuantidadeBlocosPorDia(newQuantidades);

        // Limpa os horários do dia
        const diaKey = diasSemana.value.find(d => d.index === diaIndex).key;
        const newBlocos = { ...blocos.value };
        newBlocos[diaKey] = {
          bloco_1_inicio: '',
          bloco_1_termino: '',
          bloco_2_inicio: '',
          bloco_2_termino: '',
          bloco_3_inicio: '',
          bloco_3_termino: '',
          bloco_4_inicio: '',
          bloco_4_termino: '',
          bloco_5_inicio: '',
          bloco_5_termino: '',
          bloco_6_inicio: '',
          bloco_6_termino: ''
        };
        setBlocos(newBlocos);
      }

      // Emitir evento de mudança
      emit('trigger-event', {
        name: 'disponibilidadeChange',
        event: {
          diaIndex,
          diaKey: diasSemana.value.find(d => d.index === diaIndex).key,
          selecionado: newDiasSemana[diaIndex]
        }
      });
    };

    // Toggle expansão do dia
    const toggleDiaExpansion = (diaIndex) => {
      if (!diasSemanaEscolhidos.value[diaIndex]) return;

      if (expandedDays.value.has(diaIndex)) {
        expandedDays.value.delete(diaIndex);
      } else {
        expandedDays.value.add(diaIndex);
      }
    };

    // Adicionar um novo bloco
    const addBloco = (diaIndex) => {
      if (isEditing.value) return;

      const quantidadeAtual = quantidadeBlocosPorDia.value[diaIndex];

      // Verifica se já não atingiu o limite
      if (quantidadeAtual >= 6) return;

      const newQuantidades = [...quantidadeBlocosPorDia.value];
      newQuantidades[diaIndex] = quantidadeAtual + 1;
      setQuantidadeBlocosPorDia(newQuantidades);
    };

    // Remover um bloco
    const removeBloco = (diaIndex, blocoNum) => {
      if (isEditing.value) return;

      // Não permite remover o primeiro bloco
      if (blocoNum === 1) return;

      const quantidadeAtual = quantidadeBlocosPorDia.value[diaIndex];

      // Não permite deixar sem blocos se o dia está selecionado
      if (quantidadeAtual <= 1) return;

      const diaKey = diasSemana.value.find(d => d.index === diaIndex).key;
      const newBlocos = JSON.parse(JSON.stringify(blocos.value));

      // Move os blocos subsequentes para cima
      for (let i = blocoNum; i < quantidadeAtual; i++) {
        newBlocos[diaKey][`bloco_${i}_inicio`] = newBlocos[diaKey][`bloco_${i + 1}_inicio`] || '';
        newBlocos[diaKey][`bloco_${i}_termino`] = newBlocos[diaKey][`bloco_${i + 1}_termino`] || '';
      }

      // Limpa o último bloco
      newBlocos[diaKey][`bloco_${quantidadeAtual}_inicio`] = '';
      newBlocos[diaKey][`bloco_${quantidadeAtual}_termino`] = '';

      setBlocos(newBlocos);

      // Atualiza a quantidade
      const newQuantidades = [...quantidadeBlocosPorDia.value];
      newQuantidades[diaIndex] = quantidadeAtual - 1;
      setQuantidadeBlocosPorDia(newQuantidades);

      // Revalidar após remover
      setTimeout(() => validarTodosOsBlocos(), 100);
    };

    // Obter valor de início do bloco
    const getBlocoInicio = (diaKey, blocoNum) => {
      const valor = blocos.value[diaKey]?.[`bloco_${blocoNum}_inicio`] || '';
      // Converter "HH:MM:SS" para "HH:MM" para o input type="time"
      return valor ? valor.substring(0, 5) : '';
    };

    // Obter valor de término do bloco
    const getBlocoTermino = (diaKey, blocoNum) => {
      const valor = blocos.value[diaKey]?.[`bloco_${blocoNum}_termino`] || '';
      // Converter "HH:MM:SS" para "HH:MM" para o input type="time"
      return valor ? valor.substring(0, 5) : '';
    };

    // Atualizar horário de início
    const updateBlocoInicio = (diaKey, blocoNum, valor) => {
      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      if (!newBlocos[diaKey]) {
        newBlocos[diaKey] = inicializarBlocos()[diaKey];
      }
      // Armazena o valor
      newBlocos[diaKey][`bloco_${blocoNum}_inicio`] = valor;
      setBlocos(newBlocos);

      // Validar após atualizar (com delay para garantir reatividade)
      setTimeout(() => validarTodosOsBlocos(), 100);
    };

    // Atualizar horário de término
    const updateBlocoTermino = (diaKey, blocoNum, valor) => {
      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      if (!newBlocos[diaKey]) {
        newBlocos[diaKey] = inicializarBlocos()[diaKey];
      }
      // Armazena o valor
      newBlocos[diaKey][`bloco_${blocoNum}_termino`] = valor;
      setBlocos(newBlocos);

      // Validar após atualizar (com delay para garantir reatividade)
      setTimeout(() => validarTodosOsBlocos(), 100);
    };

    // Formatar input de tempo ao perder foco (adiciona :00 segundos)
    const formatTimeInput = (diaKey, blocoNum, tipo, valor) => {
      if (!valor) return;

      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      const campo = `bloco_${blocoNum}_${tipo}`;

      // Adiciona :00 se não tiver segundos
      newBlocos[diaKey][campo] = valor.includes(':') && valor.split(':').length === 2
        ? `${valor}:00`
        : valor;

      setBlocos(newBlocos);

      // Validar após atualizar
      setTimeout(() => validarTodosOsBlocos(), 100);
    };

    // Função de validação de blocos
    const validarBloco = (diaKey, blocoNum) => {
      const inicio = blocos.value[diaKey]?.[`bloco_${blocoNum}_inicio`];
      const termino = blocos.value[diaKey]?.[`bloco_${blocoNum}_termino`];

      // Se ambos estão vazios, não há erro
      if (!inicio && !termino) {
        return null;
      }

      // Se só um está preenchido
      if (!inicio || !termino) {
        return props.content?.msgErroBlocoIncompleto || 'Preencha tanto o horário de início quanto o de término';
      }

      // Validar se término > início
      if (termino <= inicio) {
        return props.content?.msgErroTerminoMenorInicio || 'O horário de término deve ser maior que o de início';
      }

      // Validar sobreposição com outros blocos do mesmo dia
      const dia = diasSemana.value.find(d => d.key === diaKey);
      const quantidade = quantidadeBlocosPorDia.value[dia.index];

      for (let i = 1; i <= quantidade; i++) {
        if (i === blocoNum) continue; // Pula o bloco atual

        const outroInicio = blocos.value[diaKey]?.[`bloco_${i}_inicio`];
        const outroTermino = blocos.value[diaKey]?.[`bloco_${i}_termino`];

        if (!outroInicio || !outroTermino) continue; // Pula blocos incompletos

        // Verifica sobreposição
        // Bloco atual começa durante outro bloco OU bloco atual termina durante outro bloco
        // OU bloco atual engloba outro bloco
        if (inicio < outroTermino && termino > outroInicio) {
          const msgBase = props.content?.msgErroSobreposicao || 'Sobreposição com o bloco';
          return `${msgBase} ${i}`;
        }
      }

      return null; // Sem erros
    };

    // Validar todos os blocos e atualizar variáveis expostas
    const validarTodosOsBlocos = () => {
      const novosErros = {};
      const mensagens = [];

      // Verificar se pelo menos um dia está selecionado
      const algumDiaSelecionado = diasSemanaEscolhidos.value.some(dia => dia === true);

      if (!algumDiaSelecionado) {
        errosPorBloco.value = novosErros;
        setMensagensErro(mensagens);
        setValidacaoOk(false);
        return;
      }

      diasSemana.value.forEach((dia) => {
        if (!diasSemanaEscolhidos.value[dia.index]) return;

        const quantidade = quantidadeBlocosPorDia.value[dia.index];

        for (let i = 1; i <= quantidade; i++) {
          const erro = validarBloco(dia.key, i);

          if (erro) {
            const chave = `${dia.key}_bloco_${i}`;
            novosErros[chave] = erro;
            mensagens.push(`${dia.label} - Bloco ${i}: ${erro}`);
          }
        }
      });

      errosPorBloco.value = novosErros;
      setMensagensErro(mensagens);
      setValidacaoOk(mensagens.length === 0);
    };

    // Obter erro de um bloco específico
    const getErroBloco = (diaKey, blocoNum) => {
      const chave = `${diaKey}_bloco_${blocoNum}`;
      return errosPorBloco.value[chave] || null;
    };

    // State para modal de cópia
    const modalCopiarDia = ref({
      visivel: false,
      diaOrigem: null,
      diasDestino: []
    });

    // Copiar configuração de um dia para outros dias
    const copiarDia = (diaIndex) => {
      if (isEditing.value) return;

      // Abre modal com o dia de origem
      modalCopiarDia.value = {
        visivel: true,
        diaOrigem: diaIndex,
        diasDestino: []
      };
    };

    // Fechar modal de cópia
    const fecharModalCopia = () => {
      modalCopiarDia.value = {
        visivel: false,
        diaOrigem: null,
        diasDestino: []
      };
    };

    // Toggle seleção de dia destino
    const toggleDiaDestino = (diaIndex) => {
      const index = modalCopiarDia.value.diasDestino.indexOf(diaIndex);
      if (index > -1) {
        modalCopiarDia.value.diasDestino.splice(index, 1);
      } else {
        modalCopiarDia.value.diasDestino.push(diaIndex);
      }
    };

    // Confirmar cópia para dias selecionados
    const confirmarCopia = () => {
      const diaOrigem = modalCopiarDia.value.diaOrigem;
      const diasDestino = modalCopiarDia.value.diasDestino;

      if (diasDestino.length === 0) {
        fecharModalCopia();
        return;
      }

      const diaKeyOrigem = diasSemana.value.find(d => d.index === diaOrigem).key;
      const quantidadeOrigem = quantidadeBlocosPorDia.value[diaOrigem];

      // Clona dados do dia de origem
      const newQuantidades = [...quantidadeBlocosPorDia.value];
      const newBlocos = JSON.parse(JSON.stringify(blocos.value));
      const newDiasSemana = [...diasSemanaEscolhidos.value];

      // Copia para cada dia destino
      diasDestino.forEach(diaDestino => {
        const diaKeyDestino = diasSemana.value.find(d => d.index === diaDestino).key;

        // Marca o dia como selecionado
        newDiasSemana[diaDestino] = true;

        // Expande automaticamente
        expandedDays.value.add(diaDestino);

        // Copia quantidade de blocos
        newQuantidades[diaDestino] = quantidadeOrigem;

        // Copia todos os horários
        for (let i = 1; i <= 6; i++) {
          newBlocos[diaKeyDestino][`bloco_${i}_inicio`] = newBlocos[diaKeyOrigem][`bloco_${i}_inicio`] || '';
          newBlocos[diaKeyDestino][`bloco_${i}_termino`] = newBlocos[diaKeyOrigem][`bloco_${i}_termino`] || '';
        }
      });

      // Atualiza variáveis
      setDiasSemanaEscolhidos(newDiasSemana);
      setQuantidadeBlocosPorDia(newQuantidades);
      setBlocos(newBlocos);

      // Valida após copiar
      setTimeout(() => validarTodosOsBlocos(), 100);

      // Fecha modal
      fecharModalCopia();
    };

    // Validação inicial e carregamento de dados quando componente carrega
    onMounted(() => {
      // Tenta carregar dados iniciais se disponíveis
      if (!dadosIniciaisCarregados.value) {
        carregarDadosIniciais();
      }
      validarTodosOsBlocos();
    });

    // Watch para carregar dados iniciais quando dadosDias mudar
    // Isso permite que os dados sejam carregados mesmo se chegarem após o mount
    watch(
      () => props.content?.dadosDias,
      (novosDadosDias) => {
        // Só carrega se ainda não foram carregados e se temos dados válidos
        if (!dadosIniciaisCarregados.value && novosDadosDias && Array.isArray(novosDadosDias) && novosDadosDias.length > 0) {
          carregarDadosIniciais();
        }
      },
      { deep: true, immediate: true }
    );

    // Watch para validar quando dias selecionados mudam
    watch(
      () => diasSemanaEscolhidos.value,
      () => {
        setTimeout(() => validarTodosOsBlocos(), 100);
      },
      { deep: true }
    );

    return {
      cssVars,
      diasSemana,
      diasSemanaEscolhidos,
      quantidadeBlocosPorDia,
      blocos,
      expandedDays,
      toggleDiaSelection,
      toggleDiaExpansion,
      addBloco,
      removeBloco,
      getBlocoInicio,
      getBlocoTermino,
      updateBlocoInicio,
      updateBlocoTermino,
      formatTimeInput,
      getErroBloco,
      copiarDia,
      modalCopiarDia,
      fecharModalCopia,
      toggleDiaDestino,
      confirmarCopia
    };
  }
};
</script>

<style scoped lang="scss">
.disponibilidade-semanal {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--day-gap, 8px);
}

.dia-container {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

.dia-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &.dia-selecionado {
    background-color: var(--header-bg-color, #1e3a5f);
    color: var(--header-text-color, #ffffff);

    &:hover {
      opacity: 0.95;
    }
  }
}

.dia-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &.checked {
    background-color: var(--checkbox-checked-color, #4caf50);
    border-color: var(--checkbox-checked-color, #4caf50);
  }

  .checkmark {
    width: 16px;
    height: 16px;
    color: #ffffff;
  }
}

.dia-label {
  font-size: 16px;
  font-weight: 500;
}

.disponivel-badge {
  font-size: 14px;
  opacity: 0.9;
}

.expand-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
}

.expand-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;

  &.rotated {
    transform: rotate(180deg);
  }
}

.dia-conteudo {
  padding: 24px 16px;
  background-color: var(--content-bg-color, #fafafa);
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.blocos-horarios {
  display: flex;
  flex-direction: column;
  gap: var(--block-gap, 16px);
}

.bloco-horario {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  position: relative;
}

.bloco-campos {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.horario-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.time-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.time-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid var(--input-border-color, #ccc);
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: var(--input-focus-border-color, #1e3a5f);
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 12px;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
}

.clock-icon {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  color: #666;
  pointer-events: none;
}

.bloco-horario-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bloco-erro {
  padding: 8px 12px;
  background-color: #fee;
  border-left: 3px solid #d32f2f;
  border-radius: 4px;
  font-size: 13px;
  color: #d32f2f;
  font-weight: 500;
}

.remove-block-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d32f2f;
  border-radius: 4px;
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-top: 20px;
  flex-shrink: 0;

  &:hover {
    background-color: #fee;
  }

  &:active {
    transform: scale(0.95);
  }

  .remove-icon {
    width: 20px;
    height: 20px;
  }
}

.remove-block-spacer {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-top: 20px;
}

.add-block-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--header-bg-color, #1e3a5f);
  color: var(--header-text-color, #ffffff);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  .add-icon {
    width: 18px;
    height: 18px;
  }
}

.acoes-dia {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.copiar-dia-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  color: var(--header-bg-color, #1e3a5f);
  border: 1px solid var(--header-bg-color, #1e3a5f);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--header-bg-color, #1e3a5f);
    color: var(--header-text-color, #ffffff);
  }

  &:active {
    transform: scale(0.98);
  }

  .copy-icon {
    width: 16px;
    height: 16px;
  }
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }

  .close-icon {
    width: 20px;
    height: 20px;
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;

  strong {
    color: var(--header-bg-color, #1e3a5f);
    font-weight: 600;
  }
}

.dias-destino-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dia-destino-item {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  transition: all 0.2s ease;

  &.origem {
    opacity: 0.5;
    background-color: #f5f5f5;
  }

  &.selecionado:not(.origem) {
    border-color: var(--header-bg-color, #1e3a5f);
    background-color: rgba(30, 58, 95, 0.05);
  }

  &:hover:not(.origem) {
    border-color: var(--header-bg-color, #1e3a5f);
  }
}

.dia-destino-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;

  .origem & {
    cursor: not-allowed;
  }
}

.dia-destino-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--header-bg-color, #1e3a5f);

  &:disabled {
    cursor: not-allowed;
  }
}

.dia-destino-nome {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.badge-origem {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.modal-button-cancel {
  background-color: transparent;
  color: #666;
  border: 1px solid var(--border-color, #e0e0e0);

  &:hover {
    background-color: #f5f5f5;
    border-color: #999;
  }
}

.modal-button-confirm {
  background-color: var(--header-bg-color, #1e3a5f);
  color: var(--header-text-color, #ffffff);

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
