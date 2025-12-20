export default {
  editor: {
    label: {
      pt: 'Disponibilidade Semanal'
    },
    icon: 'calendar'
  },

  triggerEvents: [
    {
      name: 'disponibilidadeChange',
      label: {
        pt: 'Ao mudar disponibilidade'
      },
      event: {
        diaIndex: 0,
        diaKey: 'segunda',
        selecionado: true
      }
    }
  ],

  properties: {
    // Cores e Estilos
    headerBackgroundColor: {
      label: {
        pt: 'Cor de Fundo do Cabeçalho Selecionado'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#1e3a5f',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for selected day headers'
      },
      propertyHelp: {
        tooltip: 'Background color when a day is selected'
      }
      /* wwEditor:end */
    },

    headerTextColor: {
      label: {
        pt: 'Cor do Texto do Cabeçalho Selecionado'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ffffff',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color for selected day headers'
      },
      propertyHelp: {
        tooltip: 'Text color when a day is selected'
      }
      /* wwEditor:end */
    },

    checkboxCheckedColor: {
      label: {
        pt: 'Cor do Checkbox Marcado'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#4caf50',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color of the checkbox when checked'
      },
      propertyHelp: {
        tooltip: 'Background color of checked checkboxes'
      }
      /* wwEditor:end */
    },

    contentBackgroundColor: {
      label: {
        pt: 'Cor de Fundo do Conteúdo'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#fafafa',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for expanded day content'
      },
      propertyHelp: {
        tooltip: 'Background color of the time blocks section'
      }
      /* wwEditor:end */
    },

    borderColor: {
      label: {
        pt: 'Cor da Borda'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#e0e0e0',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color for day containers'
      },
      propertyHelp: {
        tooltip: 'Color of borders around day containers'
      }
      /* wwEditor:end */
    },

    inputBorderColor: {
      label: {
        pt: 'Cor da Borda dos Inputs'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ccc',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color for time inputs'
      },
      propertyHelp: {
        tooltip: 'Color of borders for time input fields'
      }
      /* wwEditor:end */
    },

    inputFocusBorderColor: {
      label: {
        pt: 'Cor da Borda dos Inputs em Foco'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#1e3a5f',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color for focused time inputs'
      },
      propertyHelp: {
        tooltip: 'Border color when time input is focused'
      }
      /* wwEditor:end */
    },

    // Espaçamentos
    dayGap: {
      label: {
        pt: 'Espaçamento Entre Dias'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '8px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 50 }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Gap between day containers (e.g., "8px")'
      },
      propertyHelp: {
        tooltip: 'Spacing between each day container'
      }
      /* wwEditor:end */
    },

    blockGap: {
      label: {
        pt: 'Espaçamento Entre Blocos de Horário'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '16px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 50 }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Gap between time blocks (e.g., "16px")'
      },
      propertyHelp: {
        tooltip: 'Spacing between time block rows'
      }
      /* wwEditor:end */
    },

    // Labels Customizáveis
    labelDomingo: {
      label: {
        pt: 'Label Domingo'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Domingo',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Sunday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Sunday'
      }
      /* wwEditor:end */
    },

    labelSegunda: {
      label: {
        pt: 'Label Segunda-feira'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Segunda-feira',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Monday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Monday'
      }
      /* wwEditor:end */
    },

    labelTerca: {
      label: {
        pt: 'Label Terça-feira'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Terça-feira',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Tuesday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Tuesday'
      }
      /* wwEditor:end */
    },

    labelQuarta: {
      label: {
        pt: 'Label Quarta-feira'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Quarta-feira',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Wednesday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Wednesday'
      }
      /* wwEditor:end */
    },

    labelQuinta: {
      label: {
        pt: 'Label Quinta-feira'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Quinta-feira',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Thursday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Thursday'
      }
      /* wwEditor:end */
    },

    labelSexta: {
      label: {
        pt: 'Label Sexta-feira'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Sexta-feira',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Friday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Friday'
      }
      /* wwEditor:end */
    },

    labelSabado: {
      label: {
        pt: 'Label Sábado'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Sábado',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom label for Saturday'
      },
      propertyHelp: {
        tooltip: 'Label displayed for Saturday'
      }
      /* wwEditor:end */
    },

    labelDisponivelBadge: {
      label: {
        pt: 'Label Badge Disponível'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: '(Disponível)',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Badge text shown when day is selected'
      },
      propertyHelp: {
        tooltip: 'Text shown next to selected day name'
      }
      /* wwEditor:end */
    },

    labelHorarioInicio: {
      label: {
        pt: 'Label Horário de Início'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Horário de início',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Label for start time input'
      },
      propertyHelp: {
        tooltip: 'Label displayed above start time inputs'
      }
      /* wwEditor:end */
    },

    labelHorarioTermino: {
      label: {
        pt: 'Label Horário de Término'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Horário de Término',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Label for end time input'
      },
      propertyHelp: {
        tooltip: 'Label displayed above end time inputs'
      }
      /* wwEditor:end */
    },

    // Horários Padrão
    defaultBlock1StartTime: {
      label: {
        pt: 'Horário Padrão Início Bloco 1'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '09:00',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Default start time for first block (format: HH:MM)'
      },
      propertyHelp: {
        tooltip: 'Pre-fill first block start time (e.g., "09:00")'
      }
      /* wwEditor:end */
    },

    defaultBlock1EndTime: {
      label: {
        pt: 'Horário Padrão Término Bloco 1'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '12:00',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Default end time for first block (format: HH:MM)'
      },
      propertyHelp: {
        tooltip: 'Pre-fill first block end time (e.g., "12:00")'
      }
      /* wwEditor:end */
    },

    defaultBlock2StartTime: {
      label: {
        pt: 'Horário Padrão Início Bloco 2'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '14:00',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Default start time for second block (format: HH:MM)'
      },
      propertyHelp: {
        tooltip: 'Pre-fill second block start time (e.g., "14:00")'
      }
      /* wwEditor:end */
    },

    defaultBlock2EndTime: {
      label: {
        pt: 'Horário Padrão Término Bloco 2'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '18:00',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Default end time for second block (format: HH:MM)'
      },
      propertyHelp: {
        tooltip: 'Pre-fill second block end time (e.g., "18:00")'
      }
      /* wwEditor:end */
    },

    autoExpand: {
      label: {
        pt: 'Expandir Automaticamente Dias Selecionados'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Automatically expand day when selected'
      },
      propertyHelp: {
        tooltip: 'When enabled, days are automatically expanded when selected'
      }
      /* wwEditor:end */
    },

    // Mensagens de Validação
    msgErroBlocoIncompleto: {
      label: {
        pt: 'Mensagem Erro Bloco Incompleto'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Preencha tanto o horário de início quanto o de término',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Error message when block has only start or end time'
      },
      propertyHelp: {
        tooltip: 'Displayed when user fills only one time field'
      }
      /* wwEditor:end */
    },

    msgErroTerminoMenorInicio: {
      label: {
        pt: 'Mensagem Erro Término Antes de Início'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'O horário de término deve ser maior que o de início',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Error message when end time is before or equal to start time'
      },
      propertyHelp: {
        tooltip: 'Displayed when end time is not greater than start time'
      }
      /* wwEditor:end */
    },

    msgErroSobreposicao: {
      label: {
        pt: 'Mensagem Erro Sobreposição'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Sobreposição com o bloco',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Error message when blocks overlap (block number will be appended)'
      },
      propertyHelp: {
        tooltip: 'Displayed when time blocks overlap. Block number is automatically added.'
      }
      /* wwEditor:end */
    }
  }
};
