import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  LovelaceCardEditor,
  ActionConfig,
  fireEvent, // Helper para disparar eventos
} from 'custom-card-helpers';

// Importa a interface de configuração definida no ficheiro principal do cartão
// Garanta que o caminho relativo está correto
import type { RangeSliderCardConfig } from './range-slider-card';

// REMOVIDAS as importações de tipos específicos para @ha/components/*
// que estavam a causar erros TS2307

const ORIENTATIONS = ['horizontal', 'vertical'];

@customElement('range-slider-card-editor') // Define o custom element para o editor
export class RangeSliderCardEditor extends LitElement implements LovelaceCardEditor {
  // Propriedades recebidas do Lovelace
  @property({ attribute: false }) hass?: HomeAssistant;

  // Estado interno para guardar a configuração atual
  @state() private _config?: RangeSliderCardConfig;

  /**
   * Chamado pelo Lovelace para fornecer a configuração atual do cartão.
   * @param config A configuração a ser editada.
   */
  public setConfig(config: RangeSliderCardConfig): void {
    this._config = config;
  }

  /**
   * Renderiza a interface do editor.
   * @returns O template HTML para o editor.
   */
  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) {
      return html``; // Não renderiza nada se não tiver dados
    }

    // Função auxiliar para obter valores da config com segurança
    const getValue = <T extends keyof RangeSliderCardConfig>(
      key: T,
      defaultValue: RangeSliderCardConfig[T] | undefined = undefined
    ): RangeSliderCardConfig[T] | undefined => {
      // Usa ! com cuidado, assumindo que _config existe após a guarda inicial
      return this._config![key] ?? defaultValue;
    };

    return html`
      <div class="card-config">
        <ha-alert alert-type="info" title="Range Slider Card Config">Configure as opções do seu cartão.</ha-alert>

        <section>
          <h3>Entidades Principais</h3>
          <ha-entity-picker
            .hass=${this.hass}
            .label="Entidade Mínima (Obrigatório)"
                  .value=${getValue('entity_min')}
                  .configValue=${'entity_min'}
                  .includeDomains=${['input_number']}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
                  required
                ></ha-entity-picker>
                <ha-entity-picker
                  .hass=${this.hass}
                  .label="Entidade Máxima (Obrigatório)"
                  .value=${getValue('entity_max')}
                  .configValue=${'entity_max'}
                  .includeDomains=${['input_number']}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
                  required
                ></ha-entity-picker>
                <ha-entity-picker
                  .hass=${this.hass}
                  .label="Entidade de Valor (Opcional, para marcador)"
                  .value=${getValue('entity_value')}
                  .configValue=${'entity_value'}
                  .includeDomains=${['sensor', 'input_number']}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
          ></ha-entity-picker>
        </section>

        <section>
          <!-- Removed H3 Title: Título e Unidade -->
          <ha-textfield
            .label="Nome do Cartão (Opcional)"
            .value=${getValue('name', 'Range Slider')}
            .configValue=${'name'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            .label="Unidade (Opcional, ex: °C, %)"
            .value=${getValue('unit', '')}
            .configValue=${'unit'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </section>

        <section>
          <!-- Removed H3 Title: Limites e Passo da Escala -->
          <div class="side-by-side">
            <ha-textfield
              .label="Mínimo Absoluto"
              type="number"
              .value=${String(getValue('min', 0))}
              .configValue=${'min'}
              @input=${this._valueChanged}
              .disabled=${!!this._config.min_entity}
              title=${this._config.min_entity
                ? "Desativado porque 'Entidade Mín.' está definida"
                : 'Valor mínimo da escala'}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Mín. (Substitui Mín. Absoluto)"
              .value=${getValue('min_entity')}
              .configValue=${'min_entity'}
              .includeDomains=${['sensor', 'input_number']}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
          <div class="side-by-side">
            <ha-textfield
              .label="Máximo Absoluto"
              type="number"
              .value=${String(getValue('max', 100))}
              .configValue=${'max'}
              @input=${this._valueChanged}
              .disabled=${!!this._config.max_entity}
              title=${this._config.max_entity
                ? "Desativado porque 'Entidade Máx.' está definida"
                : 'Valor máximo da escala'}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Máx. (Substitui Máx. Absoluto)"
              .value=${getValue('max_entity')}
              .configValue=${'max_entity'}
              .includeDomains=${['sensor', 'input_number']}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
          <div class="side-by-side">
            <ha-textfield
              .label="Passo (Step)"
              type="number"
              .value=${String(getValue('step', 1))}
              .configValue=${'step'}
              step="any"
              min="0.000001"
              @input=${this._valueChanged}
              .disabled=${!!this._config.step_entity}
              title=${this._config.step_entity
                ? "Desativado porque 'Entidade Passo' está definida"
                : 'Incremento do slider'}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Passo (Substitui Passo)"
              .value=${getValue('step_entity')}
              .configValue=${'step_entity'}
              .includeDomains=${['sensor', 'input_number']}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
        </section>

        <section>
          <h3>Aparência e Funcionalidade</h3>
          <ha-select
            .label="Orientação"
            .value=${getValue('orientation', 'horizontal')}
            .configValue=${'orientation'}
            @selected=${this._handleSelectChanged}
            @closed=${(ev: Event) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${ORIENTATIONS.map((val) => html`<mwc-list-item .value=${val}>${this._capitalize(val)}</mwc-list-item>`)}
          </ha-select>

          <ha-formfield .label=${'Modo Apenas Leitura'}>
            <ha-switch
              .checked=${Boolean(getValue('read_only', false))}
              .configValue=${'read_only'}
              @change=${this._valueChanged}
              title=${"Define se todo o slider é apenas leitura"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${'Apenas Leitura (Mínimo)'}>
            <ha-switch
              .checked=${Boolean(getValue('read_only_min', getValue('read_only', false)))}
              .configValue=${'read_only_min'}
              @change=${this._valueChanged}
              .disabled=${Boolean(getValue('read_only', false))}
              title=${"Define se o puxador mínimo é apenas leitura (ignorado se 'Modo Apenas Leitura' global estiver ativo)"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${'Apenas Leitura (Máximo)'}>
            <ha-switch
              .checked=${Boolean(getValue('read_only_max', getValue('read_only', false)))}
              .configValue=${'read_only_max'}
              @change=${this._valueChanged}
              .disabled=${Boolean(getValue('read_only', false))}
              title=${"Define se o puxador máximo é apenas leitura (ignorado se 'Modo Apenas Leitura' global estiver ativo)"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${'Mostrar Intervalo (Max - Min)'}>
            <ha-switch
              .checked=${Boolean(getValue('show_range', false))}
              .configValue=${'show_range'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${'Mostrar Inputs Numéricos (Min/Max)'}>
            <ha-switch
              .checked=${Boolean(getValue('show_inputs', false))}
              .configValue=${'show_inputs'}
              @change=${this._valueChanged}
              .disabled=${getValue('read_only', false)}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${'Mostrar Tooltips nos Puxadores'}>
            <ha-switch
              .checked=${Boolean(getValue('show_tooltips', false))}
              .configValue=${'show_tooltips'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Mostrar Marcador de Valor (Requer 'Entidade de Valor' selecionada)"}>
            <ha-switch
              .checked=${Boolean(getValue('show_value_marker', false))}
              .configValue=${'show_value_marker'}
              @change=${this._valueChanged}
              .disabled=${!this._config.entity_value}
            ></ha-switch>
          </ha-formfield>
        </section>

        <section>
          <h3>Interações (Ações)</h3>
          <ha-form-action
            .label=${'Ação ao Tocar (Tap Action)'}
            .hass=${this.hass}
            .config=${getValue('tap_action', { action: 'more-info' })}
            .configValue=${'tap_action'}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
          <ha-form-action
            .label=${'Ação ao Manter Premido (Hold Action)'}
            .hass=${this.hass}
            .config=${getValue('hold_action')}
            .configValue=${'hold_action'}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
          <ha-form-action
            .label=${'Ação ao Tocar Duas Vezes (Double Tap Action)'}
            .hass=${this.hass}
            .config=${getValue('double_tap_action')}
            .configValue=${'double_tap_action'}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
        </section>
      </div>
    `;
  }

  /** Handler específico para o evento 'selected' do ha-select */
  private _handleSelectChanged(ev: CustomEvent): void {
    if (!this._config) return;
    const selectElement = ev.currentTarget as HTMLSelectElement;
    // CORREÇÃO: Usar 'as any' para aceder à propriedade dinâmica
    const configValue = (selectElement as any).configValue as keyof RangeSliderCardConfig | undefined;
    if (configValue && selectElement.value) {
      const newValue = selectElement.value;
      this._updateConfig(configValue, newValue);
    }
  }

  /**
   * Chamado quando o valor de um campo do editor é alterado.
   * Atualiza a configuração interna e dispara o evento 'config-changed'.
   * @param ev O evento de alteração (e.g., input, change, value-changed).
   */
  private _valueChanged(ev: Event | CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as HTMLElement & {
      configValue?: keyof RangeSliderCardConfig;
      value?: string | number | boolean | ActionConfig;
      checked?: boolean;
      type?: string;
      tagName?: string;
    };

    const configValue = target?.configValue;
    if (!configValue) return; // Ignora se não tiver configValue

    let newValue: string | number | boolean | ActionConfig | undefined | null;

    if (target.tagName === 'HA-SWITCH') {
      newValue = (target as HTMLInputElement).checked; // ha-switch comporta-se como input checkbox
    } else if (target.tagName === 'HA-FORM-ACTION') {
      // Para ações, o valor está no detail do evento value-changed
      newValue = (ev as CustomEvent<{ value: ActionConfig }>)?.detail?.value;
    } else if (target.type === 'number') {
      const numVal = (target as HTMLInputElement).value;
      // Trata string vazia como 'undefined' para remover a chave da config
      newValue = numVal === '' || numVal === undefined || numVal === null ? undefined : parseFloat(String(numVal));
      if (isNaN(newValue as number)) {
        newValue = undefined; // Se não for número válido, trata como indefinido
      }
    } else {
      // Para textfield, entity-picker, etc.
      newValue = (target as HTMLInputElement | HTMLSelectElement).value;
    }

    this._updateConfig(configValue, newValue);
  }

  /**
   * Atualiza a configuração interna e dispara o evento 'config-changed'.
   * @param configValue A chave da configuração a atualizar.
   * @param newValue O novo valor para a chave.
   */
  private _updateConfig(configValue: keyof RangeSliderCardConfig, newValue: any): void {
    if (!this._config) return;

    const defaultValue = this._getDefaultValue(configValue);
    const newConfig = { ...this._config };

    // Lógica para remover/adicionar a chave baseada no valor vs default
    const shouldRemove =
      (newValue === '' || newValue === undefined || newValue === null || newValue === defaultValue) &&
      configValue !== 'entity_min' && // Nunca remover chaves obrigatórias
      configValue !== 'entity_max' &&
      !(newValue === false && typeof defaultValue === 'boolean'); // Não remover booleano 'false' se for default

    if (shouldRemove) {
      delete newConfig[configValue];
    } else {
      (newConfig as any)[configValue] = newValue;
    }

    // Atualiza o estado e dispara o evento
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  /**
   * Retorna o valor padrão para uma chave de configuração específica.
   * @param key A chave de configuração.
   * @returns O valor padrão.
   */
  private _getDefaultValue(key: keyof RangeSliderCardConfig): any {
    // Esta função deve corresponder aos defaults definidos no setConfig do cartão principal
    switch (key) {
      case 'name':
        return 'Range Slider';
      case 'min':
        return 0;
      case 'max':
        return 100;
      case 'step':
        return 1;
      case 'unit':
        return '';
      case 'orientation':
        return 'horizontal';
      case 'read_only':
      case 'read_only_min': // Inherits global read_only default
      case 'read_only_max': // Inherits global read_only default
      case 'read_only_value': // Inherits global read_only default
        return false;
      case 'show_range':
        return false;
      case 'show_inputs':
        return false;
      case 'show_tooltips':
        return false;
      case 'show_value_marker':
        return false;
      case 'tap_action':
        return { action: 'more-info' };
      default:
        return undefined;
    }
  }

  /** Função auxiliar para capitalizar a primeira letra */
  private _capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Estilos CSS para o editor
  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        padding: 0 16px 16px 16px;
      }
      section {
        margin-top: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }
      section:last-of-type {
        border-bottom: none;
      }
      h3 {
        margin-top: 0;
        margin-bottom: 8px;
        color: var(--primary-text-color);
        font-weight: 500;
        font-size: 1.1em; /* Ligeiramente maior */
      }
      ha-alert {
        display: block;
        margin-bottom: 16px;
        border-radius: var(--ha-card-border-radius, 4px);
      }
      ha-entity-picker,
      ha-textfield,
      ha-select,
      ha-form-action {
        display: block;
        margin-bottom: 12px;
      }
      ha-formfield {
        display: block;
        margin-bottom: 8px;
        padding-left: 8px;
      }
      .side-by-side {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
      }
      .side-by-side > * {
        margin-bottom: 0;
      }
      ha-textfield[disabled] {
        opacity: 0.7;
      }
      ha-select {
        width: 100%;
      }
      /* Adiciona algum espaçamento antes das secções */
      section + section {
        margin-top: 24px;
      }
    `;
  }
}

// Regista o elemento personalizado (necessário para document.createElement no cartão principal)
if (!customElements.get('range-slider-card-editor')) {
  customElements.define('range-slider-card-editor', RangeSliderCardEditor);
}
