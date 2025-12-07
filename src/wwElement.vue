<template>
  <div class="disponibilidade-semanal">
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
          <span v-if="diasSemanaEscolhidos[dia.index]" class="disponivel-badge">(Disponível)</span>
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
        <!-- Seletor de Quantidade de Blocos -->
        <div class="blocos-selector">
          <label class="selector-label">
            Em quantos blocos você quer dividir a disponibilidade de {{ dia.label.toLowerCase() }}?
          </label>
          <select
            v-model.number="quantidadeBlocosPorDia[dia.index]"
            class="blocos-select"
            @change="updateQuantidadeBlocos(dia.index, $event.target.value)"
          >
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="5">5</option>
            <option :value="6">6</option>
          </select>
        </div>

        <!-- Blocos de Horário -->
        <div class="blocos-horarios">
          <div
            v-for="blocoNum in quantidadeBlocosPorDia[dia.index]"
            :key="blocoNum"
            class="bloco-horario"
          >
            <div class="horario-field">
              <label class="field-label">Horário de início</label>
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
              <label class="field-label">Horário de Término</label>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

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

    // Definição dos dias da semana
    const diasSemana = [
      { index: 0, key: 'domingo', label: 'Domingo' },
      { index: 1, key: 'segunda', label: 'Segunda-feira' },
      { index: 2, key: 'terca', label: 'Terça-feira' },
      { index: 3, key: 'quarta', label: 'Quarta-feira' },
      { index: 4, key: 'quinta', label: 'Quinta-feira' },
      { index: 5, key: 'sexta', label: 'Sexta-feira' },
      { index: 6, key: 'sabado', label: 'Sábado' }
    ];

    // Inicializar estrutura de blocos vazia
    const inicializarBlocos = () => {
      const blocos = {};
      diasSemana.forEach(dia => {
        blocos[dia.key] = {
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

    // State interno para controle de expansão
    const expandedDays = ref(new Set());

    // Toggle seleção do dia
    const toggleDiaSelection = (diaIndex) => {
      if (isEditing.value) return;

      const newDiasSemana = [...diasSemanaEscolhidos.value];
      newDiasSemana[diaIndex] = !newDiasSemana[diaIndex];
      setDiasSemanaEscolhidos(newDiasSemana);

      // Se selecionou, expande automaticamente e define quantidade padrão
      if (newDiasSemana[diaIndex]) {
        expandedDays.value.add(diaIndex);

        // Define quantidade padrão de blocos se for 0
        if (quantidadeBlocosPorDia.value[diaIndex] === 0) {
          const newQuantidades = [...quantidadeBlocosPorDia.value];
          newQuantidades[diaIndex] = 2;
          setQuantidadeBlocosPorDia(newQuantidades);
        }
      } else {
        // Se desmarcou, remove da expansão e zera blocos
        expandedDays.value.delete(diaIndex);

        const newQuantidades = [...quantidadeBlocosPorDia.value];
        newQuantidades[diaIndex] = 0;
        setQuantidadeBlocosPorDia(newQuantidades);

        // Limpa os horários do dia
        const diaKey = diasSemana[diaIndex].key;
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
          diaKey: diasSemana[diaIndex].key,
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

    // Atualizar quantidade de blocos
    const updateQuantidadeBlocos = (diaIndex, quantidade) => {
      if (isEditing.value) return;

      const newQuantidades = [...quantidadeBlocosPorDia.value];
      newQuantidades[diaIndex] = parseInt(quantidade);
      setQuantidadeBlocosPorDia(newQuantidades);

      // Limpar blocos que não são mais usados
      const diaKey = diasSemana[diaIndex].key;
      const newBlocos = { ...blocos.value };
      for (let i = parseInt(quantidade) + 1; i <= 6; i++) {
        newBlocos[diaKey][`bloco_${i}_inicio`] = '';
        newBlocos[diaKey][`bloco_${i}_termino`] = '';
      }
      setBlocos(newBlocos);
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
      console.log('updateBlocoInicio', { diaKey, blocoNum, valor });
      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      if (!newBlocos[diaKey]) {
        newBlocos[diaKey] = inicializarBlocos()[diaKey];
      }
      // Armazena o valor
      newBlocos[diaKey][`bloco_${blocoNum}_inicio`] = valor;
      console.log('Novo blocos:', newBlocos);
      setBlocos(newBlocos);
    };

    // Atualizar horário de término
    const updateBlocoTermino = (diaKey, blocoNum, valor) => {
      console.log('updateBlocoTermino', { diaKey, blocoNum, valor });
      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      if (!newBlocos[diaKey]) {
        newBlocos[diaKey] = inicializarBlocos()[diaKey];
      }
      // Armazena o valor
      newBlocos[diaKey][`bloco_${blocoNum}_termino`] = valor;
      console.log('Novo blocos:', newBlocos);
      setBlocos(newBlocos);
    };

    // Formatar input de tempo ao perder foco (adiciona :00 segundos)
    const formatTimeInput = (diaKey, blocoNum, tipo, valor) => {
      if (!valor) return;

      console.log('formatTimeInput', { diaKey, blocoNum, tipo, valor });
      const newBlocos = JSON.parse(JSON.stringify(blocos.value)); // Deep clone
      const campo = `bloco_${blocoNum}_${tipo}`;

      // Adiciona :00 se não tiver segundos
      newBlocos[diaKey][campo] = valor.includes(':') && valor.split(':').length === 2
        ? `${valor}:00`
        : valor;

      console.log('Após format:', newBlocos[diaKey][campo]);
      setBlocos(newBlocos);
    };

    return {
      diasSemana,
      diasSemanaEscolhidos,
      quantidadeBlocosPorDia,
      blocos,
      expandedDays,
      toggleDiaSelection,
      toggleDiaExpansion,
      updateQuantidadeBlocos,
      getBlocoInicio,
      getBlocoTermino,
      updateBlocoInicio,
      updateBlocoTermino,
      formatTimeInput
    };
  }
};
</script>

<style scoped lang="scss">
.disponibilidade-semanal {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dia-container {
  border: 1px solid #e0e0e0;
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
    background-color: #1e3a5f;
    color: #ffffff;

    &:hover {
      background-color: #2a4a75;
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
    background-color: #4caf50;
    border-color: #4caf50;
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
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.blocos-selector {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-label {
  font-size: 14px;
  color: #333;
}

.blocos-select {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1e3a5f;
  }
}

.blocos-horarios {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bloco-horario {
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
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #1e3a5f;
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
</style>
