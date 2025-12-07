# Documentação Técnica - Componente Disponibilidade Semanal

## Visão Geral Técnica

Este documento descreve a implementação técnica do componente WeWeb de disponibilidade semanal.

## Arquitetura

### Componente Principal (wwElement.vue)

O componente utiliza Vue 3 Composition API para gerenciar estado e lógica.

#### Props

```js
{
  content: Object,      // Propriedades editáveis do ww-config.js
  uid: String,          // ID único do componente
  wwEditorState: Object // Estado do editor (somente em modo editor)
}
```

#### Variáveis de Componente Expostas

Utilizamos `wwLib.wwVariable.useComponentVariable` para criar variáveis acessíveis externamente:

```js
// 1. diasSemanaEscolhidos
{
  uid: props.uid,
  name: 'diasSemanaEscolhidos',
  type: 'array',
  defaultValue: [false, false, false, false, false, false, false]
}

// 2. quantidadeBlocosPorDia
{
  uid: props.uid,
  name: 'quantidadeBlocosPorDia',
  type: 'array',
  defaultValue: [0, 0, 0, 0, 0, 0, 0]
}

// 3. blocos
{
  uid: props.uid,
  name: 'blocos',
  type: 'object',
  defaultValue: {
    domingo: { bloco_1_inicio: '', ... },
    segunda: { bloco_1_inicio: '', ... },
    // ... todos os dias
  }
}
```

#### State Interno

```js
const expandedDays = ref(new Set())
```

Utiliza `Set` para gerenciar eficientemente quais dias estão expandidos na UI.

## Fluxo de Dados

### 1. Seleção de Dia

```
Usuário clica no checkbox
  ↓
toggleDiaSelection(diaIndex)
  ↓
Atualiza diasSemanaEscolhidos[index]
  ↓
Se selecionado:
  - Adiciona dia ao expandedDays
  - Define quantidade padrão de blocos (2)
  ↓
Se desmarcado:
  - Remove dia do expandedDays
  - Zera quantidade de blocos
  - Limpa todos os horários do dia
  ↓
Emite evento 'disponibilidadeChange'
```

### 2. Mudança de Quantidade de Blocos

```
Usuário seleciona quantidade no dropdown
  ↓
updateQuantidadeBlocos(diaIndex, quantidade)
  ↓
Atualiza quantidadeBlocosPorDia[index]
  ↓
Limpa horários de blocos não utilizados
  ↓
Mantém horários dos blocos em uso
```

### 3. Atualização de Horários

```
Usuário digita horário no input
  ↓
@input → updateBlocoInicio/Termino()
  ↓
Atualiza blocos[diaKey][bloco_N_inicio/termino]
  ↓
Formato temporário: "HH:MM"
  ↓
@blur → formatTimeInput()
  ↓
Formato final: "HH:MM:00"
```

## Estrutura de Dados Detalhada

### diasSemanaEscolhidos

```ts
type DiasSemanaEscolhidos = [
  boolean, // 0: domingo
  boolean, // 1: segunda
  boolean, // 2: terça
  boolean, // 3: quarta
  boolean, // 4: quinta
  boolean, // 5: sexta
  boolean  // 6: sábado
]
```

### quantidadeBlocosPorDia

```ts
type QuantidadeBlocosPorDia = [
  number, // 0: domingo (0-6)
  number, // 1: segunda (0-6)
  number, // 2: terça (0-6)
  number, // 3: quarta (0-6)
  number, // 4: quinta (0-6)
  number, // 5: sexta (0-6)
  number  // 6: sábado (0-6)
]
```

### blocos

```ts
type Blocos = {
  domingo: BlocoDia
  segunda: BlocoDia
  terca: BlocoDia
  quarta: BlocoDia
  quinta: BlocoDia
  sexta: BlocoDia
  sabado: BlocoDia
}

type BlocoDia = {
  bloco_1_inicio: string   // "HH:MM:SS" ou ""
  bloco_1_termino: string  // "HH:MM:SS" ou ""
  bloco_2_inicio: string
  bloco_2_termino: string
  bloco_3_inicio: string
  bloco_3_termino: string
  bloco_4_inicio: string
  bloco_4_termino: string
  bloco_5_inicio: string
  bloco_5_termino: string
  bloco_6_inicio: string
  bloco_6_termino: string
}
```

## Funções Principais

### toggleDiaSelection(diaIndex)

Alterna seleção de um dia.

**Parâmetros:**
- `diaIndex` (number): Índice do dia (0-6)

**Lógica:**
1. Inverte valor de `diasSemanaEscolhidos[diaIndex]`
2. Se selecionado:
   - Expande dia automaticamente
   - Define quantidade padrão de blocos (se for 0)
3. Se desmarcado:
   - Remove da lista de expandidos
   - Zera quantidade de blocos
   - Limpa todos os horários do dia
4. Emite evento `disponibilidadeChange`

### toggleDiaExpansion(diaIndex)

Alterna expansão/colapso de um dia.

**Parâmetros:**
- `diaIndex` (number): Índice do dia (0-6)

**Lógica:**
1. Verifica se dia está selecionado
2. Adiciona ou remove do Set `expandedDays`

### updateQuantidadeBlocos(diaIndex, quantidade)

Atualiza quantidade de blocos de um dia.

**Parâmetros:**
- `diaIndex` (number): Índice do dia (0-6)
- `quantidade` (number): Nova quantidade (1-6)

**Lógica:**
1. Atualiza `quantidadeBlocosPorDia[diaIndex]`
2. Limpa horários de blocos acima da nova quantidade
3. Mantém horários de blocos em uso

### getBlocoInicio/Termino(diaKey, blocoNum)

Obtém valor de horário formatado para input type="time".

**Parâmetros:**
- `diaKey` (string): Chave do dia ('domingo', 'segunda', etc.)
- `blocoNum` (number): Número do bloco (1-6)

**Retorno:**
- String no formato "HH:MM" (sem segundos)

**Lógica:**
1. Busca valor em `blocos[diaKey][bloco_N_inicio/termino]`
2. Se valor existe, remove segundos (substring 0-5)
3. Se não existe, retorna string vazia

### updateBlocoInicio/Termino(diaKey, blocoNum, valor)

Atualiza horário de início/término de um bloco.

**Parâmetros:**
- `diaKey` (string): Chave do dia
- `blocoNum` (number): Número do bloco
- `valor` (string): Novo horário ("HH:MM")

**Lógica:**
1. Cria cópia do objeto blocos
2. Atualiza campo específico
3. Chama setBlocos() para atualizar variável

### formatTimeInput(diaKey, blocoNum, tipo, valor)

Formata horário para incluir segundos ao perder foco.

**Parâmetros:**
- `diaKey` (string): Chave do dia
- `blocoNum` (number): Número do bloco
- `tipo` (string): 'inicio' ou 'termino'
- `valor` (string): Valor atual ("HH:MM")

**Lógica:**
1. Verifica se valor existe
2. Se tiver formato "HH:MM", adiciona ":00"
3. Atualiza variável blocos

## Estilos CSS

### Classes Principais

```scss
.disponibilidade-semanal     // Container principal
.dia-container                // Container de cada dia
.dia-header                   // Cabeçalho do dia
  .dia-selecionado           // Modificador quando dia selecionado
  .dia-expandido             // Modificador quando dia expandido
.dia-header-left             // Lado esquerdo do header
.checkbox-wrapper            // Wrapper do checkbox
.checkbox                    // Checkbox visual
  .checked                   // Modificador quando checked
.dia-label                   // Label do dia da semana
.disponivel-badge            // Badge "Disponível"
.expand-button               // Botão de expandir/colapsar
.expand-icon                 // Ícone do botão
  .rotated                   // Modificador quando expandido
.dia-conteudo                // Área de conteúdo (blocos)
.blocos-selector             // Seletor de quantidade
.blocos-select               // Dropdown de quantidade
.blocos-horarios             // Container dos blocos
.bloco-horario               // Grid de um bloco
.horario-field               // Campo de horário
.field-label                 // Label do campo
.time-input-wrapper          // Wrapper do input de tempo
.time-input                  // Input type="time"
.clock-icon                  // Ícone de relógio
```

### Layout Responsivo

```scss
.bloco-horario {
  display: grid;
  grid-template-columns: 1fr 1fr; // 2 colunas em desktop
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;   // 1 coluna em mobile
  }
}
```

## Comportamento no Editor vs Preview

```js
const isEditing = computed(() => {
  /* wwEditor:start */
  return props.wwEditorState.isEditing;
  /* wwEditor:end */
  return false;
});
```

Todas as funções de atualização verificam `isEditing.value` e retornam early se estiver em modo editor, prevenindo mudanças acidentais durante edição.

## Eventos Emitidos

### disponibilidadeChange

```js
emit('trigger-event', {
  name: 'disponibilidadeChange',
  event: {
    diaIndex: number,      // 0-6
    diaKey: string,        // 'domingo', 'segunda', etc.
    selecionado: boolean   // true/false
  }
});
```

## Customização via ww-config.js

### Cores Customizáveis

Todas as cores são bindable e podem usar variáveis CSS:

```js
const headerStyle = computed(() => ({
  backgroundColor: props.content.headerBackgroundColor || '#1e3a5f',
  color: props.content.headerTextColor || '#ffffff'
}));
```

### Labels Customizáveis

Todos os labels suportam multi-idioma via `wwLib.wwLang.getText()`:

```html
<span>{{ wwLib.wwLang.getText(content.labelSegunda) }}</span>
```

## Performance

### Otimizações Implementadas

1. **Set para expandedDays**: Operações O(1) para add/delete/has
2. **v-if para conteúdo**: Só renderiza blocos de dias selecionados
3. **Computed properties**: Caching automático pelo Vue
4. **Spread operator**: Imutabilidade sem deep clone pesado

### Possíveis Melhorias

1. Debounce em inputs de horário
2. Virtual scrolling se muitos dias
3. Memoização de funções getter

## Testes

### Cenários de Teste Recomendados

1. **Seleção de dias**
   - Selecionar/desmarcar cada dia
   - Verificar atualização de diasSemanaEscolhidos

2. **Quantidade de blocos**
   - Mudar quantidade de 1-6
   - Verificar limpeza de blocos não utilizados

3. **Horários**
   - Preencher horários diversos
   - Verificar formato "HH:MM:SS"
   - Testar valores vazios

4. **Expansão/Colapso**
   - Expandir/colapsar dias
   - Verificar estado visual

5. **Customização**
   - Modificar cores via props
   - Modificar labels
   - Testar responsividade

## Debugging

### Acessar variáveis no console (modo preview)

```js
// No console do navegador
const component = wwLib.getFrontDocument().querySelector('[data-component-uid="SEU_UID"]').__vueParentComponent.ctx

console.log('Dias selecionados:', component.diasSemanaEscolhidos)
console.log('Quantidade blocos:', component.quantidadeBlocosPorDia)
console.log('Blocos:', component.blocos)
```

### Logs de Desenvolvimento

Adicionar logs temporários para debugging:

```js
watch(() => blocos.value, (newVal) => {
  console.log('Blocos atualizados:', newVal);
}, { deep: true });
```

## Limitações Conhecidas

1. **Sem validação de horários**: Não valida se término > início
2. **Sem validação de sobreposição**: Blocos podem se sobrepor
3. **Sem persistência local**: Dados perdidos ao recarregar
4. **Input type="time"**: Limitado ao suporte do navegador

## Roadmap

### Versão 1.1
- [ ] Validação de horários
- [ ] Mensagens de erro customizáveis
- [ ] Ação para resetar disponibilidade

### Versão 1.2
- [ ] Copiar disponibilidade entre dias
- [ ] Templates pré-configurados
- [ ] Exportar/importar JSON

### Versão 2.0
- [ ] Modo visualização calendário
- [ ] Drag & drop para reordenar blocos
- [ ] Suporte a fusos horários
