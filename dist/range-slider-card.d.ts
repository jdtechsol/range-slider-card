import { LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { HomeAssistant, LovelaceCardEditor, LovelaceCardConfig, ActionConfig } from 'custom-card-helpers';
export interface RangeSliderCardConfig extends LovelaceCardConfig {
    entity_min: string;
    entity_max: string;
    entity_value?: string;
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    orientation?: 'horizontal' | 'vertical';
    read_only?: boolean;
    show_range?: boolean;
    show_inputs?: boolean;
    show_tooltips?: boolean;
    show_value_marker?: boolean;
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
    min_entity?: string;
    max_entity?: string;
    step_entity?: string;
}
export declare class RangeSliderCard extends LitElement {
    hass: HomeAssistant;
    private _config;
    private _entityMinState?;
    private _entityMaxState?;
    private _entityValueState?;
    private _minLimitState?;
    private _maxLimitState?;
    private _stepState?;
    private _minValue;
    private _maxValue;
    private _currentValue;
    private _error?;
    private _isDraggingMin;
    private _isDraggingMax;
    private _tooltipValueMin;
    private _tooltipValueMax;
    private _activeHandle;
    constructor();
    setConfig(config: RangeSliderCardConfig): void;
    protected updated(changedProperties: Map<string | number | symbol, unknown>): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult | void;
    getCardSize(): number;
    private _updateStates;
    private _validateAndPrepare;
    private _renderError;
    private _getEffectiveMin;
    private _getEffectiveMax;
    private _getEffectiveStep;
    private _clampAndStep;
    private _getPrecision;
    private _formatValue;
    private _formatValueText;
    private _calculateValueFromPosition;
    private _setEntityValue;
    private _addGlobalListeners;
    private _removeGlobalListeners;
    private _handleFocus;
    private _handleBlur;
    private _handleMinDown;
    private _handleMaxDown;
    private _handleMove;
    private _handleUp;
    private _handleKeyDown;
    private _handleTrackClick;
    private _handleInputChange;
    private _handleCardAction;
    private _getBarStyle;
    private _getHandleStyle;
    private _getMarkerStyle;
    static getConfigElement(): Promise<LovelaceCardEditor>;
    static getStubConfig(hass?: HomeAssistant, entities?: string[]): RangeSliderCardConfig;
    static get styles(): CSSResultGroup;
}
declare global {
    interface Window {
        customCards?: Array<unknown>;
    }
}
