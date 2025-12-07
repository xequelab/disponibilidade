# Exemplos de Uso - Componente Disponibilidade Semanal

## Exemplo 1: Salvar Disponibilidade no Backend

### Cenário
Usuário preenche sua disponibilidade e clica em "Salvar".

### Workflow
1. Adicione o componente à página (anote o UID)
2. Adicione um botão "Salvar Disponibilidade"
3. No workflow do botão, adicione ação "Execute HTTP Request"

### Dados a Enviar

```js
{
  "professional_id": variables['currentUser'].id,
  "availability": {
    "dias": variables['COMPONENT_UID-diasSemanaEscolhidos'],
    "blocos_quantidade": variables['COMPONENT_UID-quantidadeBlocosPorDia'],
    "horarios": variables['COMPONENT_UID-blocos']
  }
}
```

### Exemplo de Payload Completo

```json
{
  "professional_id": 123,
  "availability": {
    "dias": [false, true, true, true, true, true, false],
    "blocos_quantidade": [0, 2, 2, 2, 2, 1, 0],
    "horarios": {
      "domingo": {
        "bloco_1_inicio": "",
        "bloco_1_termino": "",
        "bloco_2_inicio": "",
        "bloco_2_termino": "",
        "bloco_3_inicio": "",
        "bloco_3_termino": "",
        "bloco_4_inicio": "",
        "bloco_4_termino": "",
        "bloco_5_inicio": "",
        "bloco_5_termino": "",
        "bloco_6_inicio": "",
        "bloco_6_termino": ""
      },
      "segunda": {
        "bloco_1_inicio": "09:00:00",
        "bloco_1_termino": "12:00:00",
        "bloco_2_inicio": "14:00:00",
        "bloco_2_termino": "18:00:00",
        "bloco_3_inicio": "",
        "bloco_3_termino": "",
        "bloco_4_inicio": "",
        "bloco_4_termino": "",
        "bloco_5_inicio": "",
        "bloco_5_termino": "",
        "bloco_6_inicio": "",
        "bloco_6_termino": ""
      }
      // ... demais dias
    }
  }
}
```

---

## Exemplo 2: Validação Antes de Salvar

### Cenário
Garantir que pelo menos um dia foi selecionado antes de salvar.

### Workflow
1. No botão "Salvar", adicione uma condição

### Condição

```js
variables['COMPONENT_UID-diasSemanaEscolhidos'].some(dia => dia === true)
```

### If True
→ Executar HTTP Request para salvar

### If False
→ Mostrar notificação de erro: "Selecione pelo menos um dia disponível"

---

## Exemplo 3: Calcular Total de Horas Semanais

### Cenário
Exibir ao usuário quantas horas totais ele estará disponível.

### Fórmula (JavaScript)

```js
function calcularHorasSemanais() {
  const blocos = variables['COMPONENT_UID-blocos'];
  const diasSelecionados = variables['COMPONENT_UID-diasSemanaEscolhidos'];
  const diasKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  let totalMinutos = 0;

  diasKeys.forEach((diaKey, index) => {
    if (!diasSelecionados[index]) return;

    const blocosDia = blocos[diaKey];

    for (let i = 1; i <= 6; i++) {
      const inicio = blocosDia[`bloco_${i}_inicio`];
      const termino = blocosDia[`bloco_${i}_termino`];

      if (inicio && termino) {
        const [hInicio, mInicio] = inicio.split(':').map(Number);
        const [hTermino, mTermino] = termino.split(':').map(Number);

        const minutosInicio = hInicio * 60 + mInicio;
        const minutosTermino = hTermino * 60 + mTermino;

        totalMinutos += (minutosTermino - minutosInicio);
      }
    }
  });

  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${horas}h ${minutos}min`;
}
```

### Binding em Texto
```
Disponibilidade semanal total: {{ calcularHorasSemanais() }}
```

---

## Exemplo 4: Pré-preencher Disponibilidade do Backend

### Cenário
Carregar disponibilidade já salva quando usuário editar.

### Workflow (On Page Load)
1. Execute HTTP Request GET `/api/availability/{userId}`
2. Se dados existirem, execute ações para atualizar variáveis do componente

### Actions
```js
// Não é possível atualizar variáveis de componente diretamente
// Alternativa: Use bindable properties no ww-config.js

// OU armazene em variáveis globais e use binding:
variables['loadedDias'] = response.data.dias;
variables['loadedBlocos'] = response.data.blocos_quantidade;
variables['loadedHorarios'] = response.data.horarios;
```

### Nota
WeWeb não permite atualizar variáveis de componente via workflow. Para pré-preencher, você precisaria criar propriedades bindable no `ww-config.js` e fazer o componente inicializar com esses valores.

---

## Exemplo 5: Mostrar Resumo da Disponibilidade

### Cenário
Exibir lista dos dias selecionados com seus horários.

### Collection (Computed)

```js
const diasSelecionados = variables['COMPONENT_UID-diasSemanaEscolhidos'];
const blocos = variables['COMPONENT_UID-blocos'];
const quantidades = variables['COMPONENT_UID-quantidadeBlocosPorDia'];
const diasKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
const diasLabels = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

return diasKeys
  .map((key, index) => ({
    dia: diasLabels[index],
    selecionado: diasSelecionados[index],
    quantidade: quantidades[index],
    horarios: blocos[key]
  }))
  .filter(item => item.selecionado);
```

### List Component
```html
<div v-for="item in resumoDisponibilidade" :key="item.dia">
  <h3>{{ item.dia }}</h3>
  <p>{{ item.quantidade }} bloco(s) de horário</p>

  <div v-for="i in item.quantidade">
    <span>{{ item.horarios[`bloco_${i}_inicio`] }} - {{ item.horarios[`bloco_${i}_termino`] }}</span>
  </div>
</div>
```

---

## Exemplo 6: Validar Horários Consistentes

### Cenário
Garantir que horário de término seja maior que início.

### Function

```js
function validarHorarios() {
  const blocos = variables['COMPONENT_UID-blocos'];
  const diasSelecionados = variables['COMPONENT_UID-diasSemanaEscolhidos'];
  const quantidades = variables['COMPONENT_UID-quantidadeBlocosPorDia'];
  const diasKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  const erros = [];

  diasKeys.forEach((diaKey, index) => {
    if (!diasSelecionados[index]) return;

    const blocosDia = blocos[diaKey];
    const qtd = quantidades[index];

    for (let i = 1; i <= qtd; i++) {
      const inicio = blocosDia[`bloco_${i}_inicio`];
      const termino = blocosDia[`bloco_${i}_termino`];

      if (!inicio || !termino) {
        erros.push(`Bloco ${i} de ${diasLabels[index]} está incompleto`);
        continue;
      }

      if (inicio >= termino) {
        erros.push(`Bloco ${i} de ${diasLabels[index]}: término deve ser depois do início`);
      }
    }
  });

  return erros;
}
```

### Uso no Workflow
```js
const erros = validarHorarios();

if (erros.length > 0) {
  // Mostrar erros
  alert(erros.join('\n'));
  return; // Não salvar
}

// Prosseguir com salvamento
```

---

## Exemplo 7: Copiar Disponibilidade Para Todos os Dias

### Cenário
Botão "Aplicar para todos os dias" que copia o primeiro dia configurado para os demais.

### Function

```js
function copiarPrimeiroDiaParaTodos() {
  const blocos = variables['COMPONENT_UID-blocos'];
  const diasSelecionados = variables['COMPONENT_UID-diasSemanaEscolhidos'];
  const diasKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  // Encontrar primeiro dia selecionado
  const primeiroDiaIndex = diasSelecionados.findIndex(d => d === true);
  if (primeiroDiaIndex === -1) return;

  const primeiroDiaKey = diasKeys[primeiroDiaIndex];
  const horariosPrimeiroDia = blocos[primeiroDiaKey];

  // Copiar para todos os dias selecionados
  const novosBlocos = { ...blocos };

  diasKeys.forEach((diaKey, index) => {
    if (diasSelecionados[index] && index !== primeiroDiaIndex) {
      novosBlocos[diaKey] = { ...horariosPrimeiroDia };
    }
  });

  // Atualizar variável
  // NOTA: WeWeb não permite atualizar variáveis de componente via workflow
  // Esta função seria implementada internamente no componente como uma Action

  return novosBlocos;
}
```

---

## Exemplo 8: Exportar para JSON

### Cenário
Permitir que usuário baixe sua disponibilidade como arquivo JSON.

### Function

```js
function exportarDisponibilidade() {
  const dados = {
    diasSemanaEscolhidos: variables['COMPONENT_UID-diasSemanaEscolhidos'],
    quantidadeBlocosPorDia: variables['COMPONENT_UID-quantidadeBlocosPorDia'],
    blocos: variables['COMPONENT_UID-blocos'],
    exportadoEm: new Date().toISOString()
  };

  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `disponibilidade-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
}
```

---

## Exemplo 9: Dashboard com Estatísticas

### Cenário
Painel mostrando estatísticas da disponibilidade configurada.

### Computed Variables

```js
// Total de dias disponíveis
const totalDiasDisponiveis = variables['COMPONENT_UID-diasSemanaEscolhidos']
  .filter(d => d === true)
  .length;

// Total de blocos configurados
const totalBlocos = variables['COMPONENT_UID-quantidadeBlocosPorDia']
  .reduce((sum, qty) => sum + qty, 0);

// Dia com mais blocos
const diasKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
const diasLabels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const quantidades = variables['COMPONENT_UID-quantidadeBlocosPorDia'];
const maxBlocos = Math.max(...quantidades);
const diaComMaisBlocos = diasLabels[quantidades.indexOf(maxBlocos)];

// Horário de início mais cedo
function horarioMaisCedo() {
  const blocos = variables['COMPONENT_UID-blocos'];
  let maisCedo = "23:59:59";

  Object.values(blocos).forEach(blocosDia => {
    for (let i = 1; i <= 6; i++) {
      const inicio = blocosDia[`bloco_${i}_inicio`];
      if (inicio && inicio < maisCedo) {
        maisCedo = inicio;
      }
    }
  });

  return maisCedo;
}

// Horário de término mais tarde
function horarioMaisTarde() {
  const blocos = variables['COMPONENT_UID-blocos'];
  let maisTarde = "00:00:00";

  Object.values(blocos).forEach(blocosDia => {
    for (let i = 1; i <= 6; i++) {
      const termino = blocosDia[`bloco_${i}_termino`];
      if (termino && termino > maisTarde) {
        maisTarde = termino;
      }
    }
  });

  return maisTarde;
}
```

### UI

```html
<div class="stats-dashboard">
  <div class="stat-card">
    <h3>{{ totalDiasDisponiveis }}</h3>
    <p>Dias disponíveis</p>
  </div>

  <div class="stat-card">
    <h3>{{ totalBlocos }}</h3>
    <p>Blocos de horário</p>
  </div>

  <div class="stat-card">
    <h3>{{ diaComMaisBlocos }}</h3>
    <p>Dia com mais horários</p>
  </div>

  <div class="stat-card">
    <h3>{{ horarioMaisCedo() }}</h3>
    <p>Horário mais cedo</p>
  </div>

  <div class="stat-card">
    <h3>{{ horarioMaisTarde() }}</h3>
    <p>Horário mais tarde</p>
  </div>
</div>
```

---

## Dicas Gerais

### Acessando Variáveis do Componente

Sempre use o formato:
```js
variables['SEU_COMPONENT_UID-nomeVariavel']
```

### Descobrindo o UID do Componente

1. Selecione o componente no editor
2. Veja o UID no painel de propriedades
3. Ou inspecione o elemento e procure `data-component-uid`

### Debugging

No console do navegador (modo preview):
```js
// Ver todas as variáveis
console.log(window.wwLib.getFrontVariables());

// Ver variável específica
console.log(window.wwLib.getFrontVariable('componentUid-diasSemanaEscolhidos'));
```

### Performance

- As variáveis são reativas: atualizações são automáticas
- Evite loops pesados sobre os blocos em computed properties
- Use memoização quando possível
