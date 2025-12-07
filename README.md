# Componente WeWeb: Disponibilidade Semanal

Componente para coleta de disponibilidade semanal de profissionais, permitindo seleção de dias e definição de até 6 blocos de horário por dia.

## Funcionalidades

- ✅ Seleção dos 7 dias da semana
- ✅ Até 6 blocos de horário por dia
- ✅ Interface expansível/colapsável
- ✅ Inputs de horário (início e término)
- ✅ Variáveis expostas para uso em workflows
- ✅ Totalmente customizável via editor WeWeb
- ✅ Suporte a multi-idioma

## Estrutura de Dados Gerada

O componente expõe 3 variáveis que podem ser acessadas via `variables['uid-nomeVariavel']`:

### 1. diasSemanaEscolhidos

Array de 7 booleanos indicando quais dias foram selecionados:

```js
[false, true, true, true, true, false, false]
```

**Índices:**
- 0 = Domingo
- 1 = Segunda-feira
- 2 = Terça-feira
- 3 = Quarta-feira
- 4 = Quinta-feira
- 5 = Sexta-feira
- 6 = Sábado

### 2. quantidadeBlocosPorDia

Array de 7 números indicando quantos blocos cada dia possui (0-6):

```js
[0, 2, 2, 2, 2, 0, 0]
```

### 3. blocos

Objeto contendo os horários de todos os dias e blocos:

```js
{
  domingo: {
    bloco_1_inicio: "",
    bloco_1_termino: "",
    bloco_2_inicio: "",
    bloco_2_termino: "",
    bloco_3_inicio: "",
    bloco_3_termino: "",
    bloco_4_inicio: "",
    bloco_4_termino: "",
    bloco_5_inicio: "",
    bloco_5_termino: "",
    bloco_6_inicio: "",
    bloco_6_termino: ""
  },
  segunda: {
    bloco_1_inicio: "09:00:00",
    bloco_1_termino: "12:00:00",
    bloco_2_inicio: "13:00:00",
    bloco_2_termino: "18:00:00",
    bloco_3_inicio: "",
    bloco_3_termino: "",
    bloco_4_inicio: "",
    bloco_5_inicio: "",
    bloco_6_inicio: "",
    bloco_4_termino: "",
    bloco_5_termino: "",
    bloco_6_termino: ""
  },
  terca: { /* ... */ },
  quarta: { /* ... */ },
  quinta: { /* ... */ },
  sexta: { /* ... */ },
  sabado: { /* ... */ }
}
```

**Formato dos horários:** `"HH:MM:SS"` (ex: `"09:00:00"`, `"18:30:00"`)

## Acessando as Variáveis

No editor WeWeb, acesse as variáveis através de bindings:

```js
// Verificar se segunda-feira foi selecionada
variables['componentUid-diasSemanaEscolhidos'][1]

// Obter quantidade de blocos de quarta-feira
variables['componentUid-quantidadeBlocosPorDia'][3]

// Obter horário de início do primeiro bloco de sexta
variables['componentUid-blocos'].sexta.bloco_1_inicio

// Obter horário de término do segundo bloco de terça
variables['componentUid-blocos'].terca.bloco_2_termino
```

## Propriedades Customizáveis

### Cores (Style)

- **Selected Day Header Background** - Cor de fundo do cabeçalho quando dia selecionado
- **Selected Day Header Text Color** - Cor do texto do cabeçalho selecionado
- **Checkbox Checked Color** - Cor do checkbox quando marcado
- **Content Background Color** - Cor de fundo da área de blocos
- **Border Color** - Cor das bordas dos containers
- **Input Border Color** - Cor da borda dos inputs
- **Input Focus Border Color** - Cor da borda dos inputs em foco

### Espaçamentos (Style)

- **Gap Between Days** - Espaçamento entre containers de dias
- **Gap Between Time Blocks** - Espaçamento entre blocos de horário

### Labels (Settings)

Todos os labels são customizáveis e suportam multi-idioma:

- Labels dos dias da semana (Domingo, Segunda-feira, etc.)
- Label do badge "Disponível"
- Label do seletor de blocos
- Label dos campos de horário (início e término)

### Comportamento (Settings)

- **Default Blocks Quantity** - Quantidade padrão de blocos ao selecionar um dia (1-6)
- **Auto Expand Selected Days** - Expandir automaticamente ao selecionar dia

## Eventos

### disponibilidadeChange

Disparado quando usuário seleciona ou desmarca um dia.

**Payload:**
```js
{
  diaIndex: 1,           // Índice do dia (0-6)
  diaKey: 'segunda',     // Chave do dia
  selecionado: true      // Se foi selecionado ou desmarcado
}
```

## Exemplo de Uso em Workflow

### Salvar disponibilidade no backend

1. Adicione o componente à página
2. Crie um botão "Salvar Disponibilidade"
3. No workflow do botão, adicione uma action "Execute HTTP Request":

```js
{
  "diasSelecionados": variables['componentUid-diasSemanaEscolhidos'],
  "quantidadeBlocos": variables['componentUid-quantidadeBlocosPorDia'],
  "horarios": variables['componentUid-blocos']
}
```

### Validar se pelo menos um dia foi selecionado

```js
variables['componentUid-diasSemanaEscolhidos'].some(dia => dia === true)
```

### Calcular total de blocos configurados

```js
variables['componentUid-quantidadeBlocosPorDia'].reduce((sum, qty) => sum + qty, 0)
```

## Desenvolvimento

### Servir em modo desenvolvimento

```bash
npm run serve
```

### Build para produção

```bash
npm run build
```

## Estrutura de Arquivos

```
ww-disponibilidade/
├── src/
│   └── wwElement.vue       # Componente Vue principal
├── ww-config.js            # Configuração do componente
├── package.json            # Dependências e scripts
└── README.md               # Esta documentação
```

## Tecnologias

- Vue 3 (Composition API)
- WeWeb Custom Component SDK
- SCSS (scoped styles)

## Versão

1.0.0 - Primeira versão funcional

## Melhorias Futuras

- [ ] Validação de horários (término depois do início)
- [ ] Validação de sobreposição de blocos
- [ ] Copiar disponibilidade de um dia para outro
- [ ] Templates de disponibilidade pré-configurados
- [ ] Visualização em modo calendário

## Licença

MIT
