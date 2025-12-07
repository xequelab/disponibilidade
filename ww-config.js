export default {
  editor: {
    label: {
      en: 'Weekly Availability',
      pt: 'Disponibilidade Semanal'
    },
    icon: 'calendar'
  },

  triggerEvents: [
    {
      name: 'disponibilidadeChange',
      label: {
        en: 'On availability change',
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
        en: 'Selected Day Header Background',
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
        en: 'Selected Day Header Text Color',
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
        en: 'Checkbox Checked Color',
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
        en: 'Content Background Color',
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
        en: 'Border Color',
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
        en: 'Input Border Color',
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
        en: 'Input Focus Border Color',
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
        en: 'Gap Between Days',
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
        en: 'Gap Between Time Blocks',
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
        en: 'Sunday Label',
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
        en: 'Monday Label',
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
        en: 'Tuesday Label',
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
        en: 'Wednesday Label',
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
        en: 'Thursday Label',
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
        en: 'Friday Label',
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
        en: 'Saturday Label',
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
        en: 'Available Badge Label',
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

    labelBlocosSelector: {
      label: {
        en: 'Blocks Selector Label',
        pt: 'Label Seletor de Blocos'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      multiLang: true,
      defaultValue: 'Em quantos blocos você quer dividir a disponibilidade de',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Label for blocks quantity selector'
      },
      propertyHelp: {
        tooltip: 'Text asking how many blocks to divide availability into'
      }
      /* wwEditor:end */
    },

    labelHorarioInicio: {
      label: {
        en: 'Start Time Label',
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
        en: 'End Time Label',
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

    // Comportamento
    defaultBlocksQuantity: {
      label: {
        en: 'Default Blocks Quantity',
        pt: 'Quantidade Padrão de Blocos'
      },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: 2,
      options: {
        min: 1,
        max: 6
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Default number of time blocks when selecting a day (1-6)'
      },
      propertyHelp: {
        tooltip: 'How many blocks are selected by default when enabling a day'
      }
      /* wwEditor:end */
    },

    autoExpand: {
      label: {
        en: 'Auto Expand Selected Days',
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
    }
  }
};
