import { LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import type { RangeSliderCardConfig } from './range-slider-card';
export declare class RangeSliderCardEditor extends LitElement implements LovelaceCardEditor {
    hass?: HomeAssistant;
    private _config?;
    /**
     * Chamado pelo Lovelace para fornecer a configuração atual do cartão.
     * @param config A configuração a ser editada.
     */
    setConfig(config: RangeSliderCardConfig): void;
    /**
     * Renderiza a interface do editor.
     * @returns O template HTML para o editor.
     */
    protected render(): TemplateResult | void;
    /** Handler específico para o evento 'selected' do ha-select */
    private _handleSelectChanged;
    /**
     * Chamado quando o valor de um campo do editor é alterado.
     * Atualiza a configuração interna e dispara o evento 'config-changed'.
     * @param ev O evento de alteração (e.g., input, change, value-changed).
     */
    private _valueChanged;
    /**
     * Atualiza a configuração interna e dispara o evento 'config-changed'.
     * @param configValue A chave da configuração a atualizar.
     * @param newValue O novo valor para a chave.
     */
    private _updateConfig;
    /**
     * Retorna o valor padrão para uma chave de configuração específica.
     * @param key A chave de configuração.
     * @returns O valor padrão.
     */
    private _getDefaultValue;
    /** Função auxiliar para capitalizar a primeira letra */
    private _capitalize;
    static get styles(): CSSResultGroup;
}
