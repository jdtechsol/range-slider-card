var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { handleAction,
// computeStateDisplay // Not used in this card
 } from 'custom-card-helpers';
// --- Constantes ---
const MIN_STEP_SEPARATION_FACTOR = 1;
/* // Development version logging
console.info(
  `%c RANGE-SLIDER-CARD %c DEVELOPMENT `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);
*/
let RangeSliderCard = class RangeSliderCard extends LitElement {
    // --- Métodos do Ciclo de Vida ---
    constructor() {
        super();
        this._minValue = 0;
        this._maxValue = 100;
        this._currentValue = null;
        this._isDraggingMin = false;
        this._isDraggingMax = false;
        this._tooltipValueMin = null;
        this._tooltipValueMax = null;
        this._activeHandle = null;
        this._handleMove = this._handleMove.bind(this);
        this._handleUp = this._handleUp.bind(this);
    }
    setConfig(config) {
        if (!config.entity_min || !config.entity_max) {
            throw new Error("Configuration Error: You need to define 'entity_min' and 'entity_max'");
        }
        if (config.entity_min.split('.')[0] !== 'input_number' || config.entity_max.split('.')[0] !== 'input_number') {
            console.warn(`Range Slider Card (${config.entity_min}/${config.entity_max}): 'entity_min' and 'entity_max' should ideally be 'input_number' entities for service calls.`);
        }
        if (config.show_inputs && config.read_only) {
            console.warn(`Range Slider Card (${config.entity_min}/${config.entity_max}): 'show_inputs' is true but 'read_only' is also true. Inputs will not be editable.`);
        }
        this._config = {
            name: 'Range Slider',
            min: 0,
            max: 100,
            step: 1,
            unit: '',
            orientation: 'horizontal',
            read_only: false,
            show_range: false,
            show_inputs: false,
            show_tooltips: false,
            show_value_marker: false,
            read_only_min: config.read_only ?? false, // Default to global read_only
            read_only_max: config.read_only ?? false, // Default to global read_only
            read_only_value: config.read_only ?? false, // Default to global read_only
            tap_action: { action: 'more-info' },
            hold_action: undefined,
            double_tap_action: undefined,
            entity_value: undefined,
            min_entity: undefined,
            max_entity: undefined,
            step_entity: undefined,
            ...config,
        };
        this._error = undefined;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('hass') && this.hass) {
            const oldHass = changedProperties.get('hass');
            this._updateStates(oldHass);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.hass && !this._error && this._config) {
            this._updateStates();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeGlobalListeners();
    }
    render() {
        if (!this._config || !this.hass)
            return html ``;
        if (this._error)
            return this._renderError(this._error);
        const min = this._getEffectiveMin();
        const max = this._getEffectiveMax();
        const step = this._getEffectiveStep();
        if (min === undefined || max === undefined || step === undefined || min >= max || step <= 0) {
            console.error('Range Slider Card: Invalid effective limits or step detected in render.', { min, max, step });
            this._validateAndPrepare(true);
            if (this._error)
                return this._renderError(this._error);
            if (min === undefined || max === undefined || step === undefined || min >= max || step <= 0) {
                return this._renderError('Internal Error: Invalid slider limits or step after validation.');
            }
        }
        const range = max - min;
        const minPos = range === 0 ? 0 : Math.max(0, Math.min(100, ((this._minValue - min) / range) * 100));
        const maxPos = range === 0 ? 100 : Math.max(0, Math.min(100, ((this._maxValue - min) / range) * 100));
        const valuePos = this._currentValue !== null && range !== 0
            ? Math.max(0, Math.min(100, ((this._currentValue - min) / range) * 100))
            : null;
        const showMarker = this._config.show_value_marker &&
            this._config.entity_value &&
            this._entityValueState &&
            valuePos !== null &&
            this._currentValue !== null &&
            this._currentValue >= this._minValue &&
            this._currentValue <= this._maxValue;
        const displayMinVal = this._isDraggingMin && this._tooltipValueMin !== null ? this._tooltipValueMin : this._minValue;
        const displayMaxVal = this._isDraggingMax && this._tooltipValueMax !== null ? this._tooltipValueMax : this._maxValue;
        const minText = this._formatValueText(this._minValue);
        const maxText = this._formatValueText(this._maxValue);
        return html `
      <ha-card
        .header=${this._config.name}
        @action=${this._handleCardAction}
        .actionHandler=${{
            hasDoubleClick: !!this._config.double_tap_action,
            hasHold: !!this._config.hold_action,
            repeat: this._config.hold_action?.repeat,
        }}
        tabindex="-1"
        aria-label=${`Range Slider: ${this._config.name ?? 'Unnamed'}`}
        class="${this._config.orientation === 'vertical' ? 'vertical' : 'horizontal'} ${this._config.read_only
            ? 'read-only'
            : ''}"
      >
        <div class="card-content">
          <div class="slider-container">
            <div class="slider-track" @click=${this._handleTrackClick}>
              <div class="slider-bar" style="${this._getBarStyle(minPos, maxPos)}"></div>

              ${showMarker ? html ` <div class="value-marker" style="${this._getMarkerStyle(valuePos)}"></div> ` : ''}

              <div
                class="slider-handle min-handle ${this._activeHandle === 'min' ? 'active' : ''}"
                style="${this._getHandleStyle(minPos)}"
                @mousedown=${this._handleMinDown}
                @touchstart=${this._handleMinDown}
                @keydown=${this._handleKeyDown}
                @focus=${() => this._handleFocus('min')}
                @blur=${this._handleBlur}
                tabindex=${this._config.read_only || this._config.read_only_min ? '-1' : '0'}
                role="slider"
                aria-valuemin=${min}
                aria-valuemax=${this._maxValue}
                aria-valuenow=${this._minValue}
                aria-valuetext=${minText}
                aria-label="Minimum value"
                aria-disabled=${this._config.read_only || this._config.read_only_min}
                aria-orientation=${this._config.orientation}
              >
                ${this._config.show_tooltips && (this._isDraggingMin || this._activeHandle === 'min')
            ? html ` <span class="tooltip">${this._formatValue(displayMinVal)}</span> `
            : ''}
              </div>

              <div
                class="slider-handle max-handle ${this._activeHandle === 'max' ? 'active' : ''}"
                style="${this._getHandleStyle(maxPos)}"
                @mousedown=${this._handleMaxDown}
                @touchstart=${this._handleMaxDown}
                @keydown=${this._handleKeyDown}
                @focus=${() => this._handleFocus('max')}
                @blur=${this._handleBlur}
                tabindex=${this._config.read_only || this._config.read_only_max ? '-1' : '0'}
                role="slider"
                aria-valuemin=${this._minValue}
                aria-valuemax=${max}
                aria-valuenow=${this._maxValue}
                aria-valuetext=${maxText}
                aria-label="Maximum value"
                aria-disabled=${this._config.read_only || this._config.read_only_max}
                aria-orientation=${this._config.orientation}
              >
                ${this._config.show_tooltips && (this._isDraggingMax || this._activeHandle === 'max')
            ? html ` <span class="tooltip">${this._formatValue(displayMaxVal)}</span> `
            : ''}
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="value-label min-label">
              <span class="label">Min:</span>
              ${this._config.show_inputs
            ? html `
                    <input
                      type="number"
                      .value=${this._formatValue(displayMinVal)}
                      @change=${(e) => this._handleInputChange(e, 'min')}
                      @input=${(e) => this._handleInputChange(e, 'min')}
                      .step=${step}
                      .min=${min}
                      .max=${this._maxValue - step * MIN_STEP_SEPARATION_FACTOR}
                      aria-label="Minimum value input"
                      class="value-input"
                      ?disabled=${this._config.read_only || this._config.read_only_min}
                    />
                  `
            : html ` <span class="value">${this._formatValue(this._minValue)}${this._config.unit ?? ''}</span> `}
            </div>

            ${this._config.show_range
            ? html `
                  <div class="value-label range-label">
                    <span class="label">Range:</span>
                    <span class="value"
                      >${this._formatValue(this._maxValue - this._minValue)}${this._config.unit ?? ''}</span
                    >
                  </div>
                `
            : ''}

            <div class="value-label max-label">
              <span class="label">Max:</span>
              ${this._config.show_inputs
            ? html `
                    <input
                      type="number"
                      .value=${this._formatValue(displayMaxVal)}
                      @change=${(e) => this._handleInputChange(e, 'max')}
                      @input=${(e) => this._handleInputChange(e, 'max')}
                      .step=${step}
                      .min=${this._minValue + step * MIN_STEP_SEPARATION_FACTOR}
                      .max=${max}
                      aria-label="Maximum value input"
                      class="value-input"
                      ?disabled=${this._config.read_only || this._config.read_only_max}
                    />
                  `
            : html ` <span class="value">${this._formatValue(this._maxValue)}${this._config.unit ?? ''}</span> `}
            </div>
          </div>
        </div>
      </ha-card>
    `;
    }
    getCardSize() {
        if (!this._config)
            return 1;
        let size = this._config.orientation === 'vertical' ? 4 : 2;
        if (this._config.name)
            size += 0.5;
        if (this._config.show_inputs)
            size += 0.5;
        return Math.max(1, Math.round(size));
    }
    // --- Métodos Auxiliares Privados ---
    _updateStates(oldHass) {
        if (!this.hass || !this._config)
            return;
        let statesChanged = false;
        const updateIfNeeded = (entityId, stateProp) => {
            if (!entityId) {
                if (this[stateProp] !== undefined) {
                    this[stateProp] = undefined;
                    statesChanged = true;
                }
                return;
            }
            const newState = this.hass.states[entityId];
            const oldState = oldHass?.states[entityId];
            if (newState !== this[stateProp] || newState?.state !== oldState?.state) {
                this[stateProp] = newState;
                statesChanged = true;
            }
        };
        // CORREÇÃO: Adicionar 'as keyof RangeSliderCard' às strings literais
        updateIfNeeded(this._config.entity_min, '_entityMinState');
        updateIfNeeded(this._config.entity_max, '_entityMaxState');
        updateIfNeeded(this._config.entity_value, '_entityValueState');
        updateIfNeeded(this._config.min_entity, '_minLimitState');
        updateIfNeeded(this._config.max_entity, '_maxLimitState');
        updateIfNeeded(this._config.step_entity, '_stepState');
        if (statesChanged || this._minValue === undefined || this._maxValue === undefined) {
            this.requestUpdate();
            this._validateAndPrepare(true);
        }
    }
    _validateAndPrepare(ignoreDragging = false) {
        if (!this.hass || !this._config) {
            this._error = 'Card not fully configured yet.';
            this.requestUpdate();
            return;
        }
        this._error = undefined;
        const entityMinState = this.hass.states[this._config.entity_min];
        const entityMaxState = this.hass.states[this._config.entity_max];
        const entityValueState = this._config.entity_value ? this.hass.states[this._config.entity_value] : undefined;
        const minLimitState = this._config.min_entity ? this.hass.states[this._config.min_entity] : undefined;
        const maxLimitState = this._config.max_entity ? this.hass.states[this._config.max_entity] : undefined;
        const stepState = this._config.step_entity ? this.hass.states[this._config.step_entity] : undefined;
        if (!entityMinState) {
            this._error = `Entity not found: ${this._config.entity_min}`;
            this.requestUpdate();
            return;
        }
        if (!entityMaxState) {
            this._error = `Entity not found: ${this._config.entity_max}`;
            this.requestUpdate();
            return;
        }
        if (this._config.entity_value && !entityValueState)
            console.warn(`Range Slider Card: Optional entity ${this._config.entity_value} not found.`);
        if (this._config.min_entity && !minLimitState)
            console.warn(`Range Slider Card: Optional entity ${this._config.min_entity} not found.`);
        if (this._config.max_entity && !maxLimitState)
            console.warn(`Range Slider Card: Optional entity ${this._config.max_entity} not found.`);
        if (this._config.step_entity && !stepState)
            console.warn(`Range Slider Card: Optional entity ${this._config.step_entity} not found.`);
        const getNumericState = (stateObj, entityKey, allowZero = true, mustBePositive = false) => {
            if (!stateObj || !entityKey)
                return null; // Return null for missing optional entities
            const state = stateObj.state;
            if (state === 'unavailable' || state === 'unknown') {
                const errorMsg = `Invalid state for ${entityKey}: ${state}`;
                // Only treat required entities or limits/step as errors if unavailable
                if (entityKey === this._config.entity_min ||
                    entityKey === this._config.entity_max ||
                    entityKey === this._config.min_entity ||
                    entityKey === this._config.max_entity ||
                    entityKey === this._config.step_entity) {
                    this._error = errorMsg;
                    return undefined; // Indicate error for required/limit/step entities
                }
                else {
                    // For optional entity_value, just warn and return null
                    console.warn(`Range Slider Card: ${errorMsg}. Ignoring value.`);
                    return null;
                }
            }
            const value = parseFloat(state);
            if (isNaN(value)) {
                // Only treat required entities or limits/step as errors if NaN
                if (entityKey === this._config.entity_min ||
                    entityKey === this._config.entity_max ||
                    entityKey === this._config.min_entity ||
                    entityKey === this._config.max_entity ||
                    entityKey === this._config.step_entity) {
                    this._error = `Invalid numeric state for ${entityKey}: ${state}`;
                    return undefined; // Indicate error
                }
                else {
                    console.warn(`Range Slider Card: Invalid numeric state for ${entityKey}: ${state}. Ignoring value.`);
                    return null; // Return null for optional entity_value if NaN
                }
            }
            if (!allowZero && value === 0) {
                this._error = `Invalid state for ${entityKey}: must not be zero`;
                return undefined;
            }
            if (mustBePositive && value <= 0) {
                this._error = `Invalid state for ${entityKey}: must be positive (${value})`;
                return undefined;
            }
            return value;
        };
        const minLimit = getNumericState(minLimitState, this._config.min_entity) ?? this._config.min ?? 0;
        const maxLimit = getNumericState(maxLimitState, this._config.max_entity) ?? this._config.max ?? 100;
        let step = getNumericState(stepState, this._config.step_entity, false, true) ?? this._config.step ?? 1;
        step = step > 0 ? step : 1;
        if (this._error) {
            this.requestUpdate();
            return;
        }
        if (minLimit >= maxLimit) {
            this._error = `Min limit (${minLimit}) must be less than Max limit (${maxLimit})`;
            this.requestUpdate();
            return;
        }
        const minValState = getNumericState(entityMinState, this._config.entity_min);
        const maxValState = getNumericState(entityMaxState, this._config.entity_max);
        const currentValState = getNumericState(entityValueState, this._config.entity_value);
        if (minValState === undefined || maxValState === undefined) {
            this.requestUpdate();
            return;
        }
        let newMinValue = this._clampAndStep(minValState, minLimit, maxLimit, step);
        let newMaxValue = this._clampAndStep(maxValState, minLimit, maxLimit, step);
        let newCurrentValue = currentValState !== null ? this._clampAndStep(currentValState, minLimit, maxLimit, step) : null;
        if (newMinValue > newMaxValue) {
            console.warn(`Range Slider Card: Corrected invalid state where min (${newMinValue}) > max (${newMaxValue}). Adjusting max.`);
            newMaxValue = this._clampAndStep(newMinValue + step * MIN_STEP_SEPARATION_FACTOR, newMinValue + step * MIN_STEP_SEPARATION_FACTOR, maxLimit, step);
            if (newMinValue > newMaxValue) {
                newMinValue = this._clampAndStep(newMaxValue - step * MIN_STEP_SEPARATION_FACTOR, minLimit, newMaxValue - step * MIN_STEP_SEPARATION_FACTOR, step);
            }
            if (newMinValue > newMaxValue) {
                this._error = `Internal Error: Cannot resolve min (${newMinValue}) > max (${newMaxValue}). Check limits and step configuration.`;
                this.requestUpdate();
                return;
            }
        }
        let needsUpdate = this._error !== undefined;
        this._error = undefined;
        if ((!this._isDraggingMin || ignoreDragging) && this._minValue !== newMinValue) {
            this._minValue = newMinValue;
            needsUpdate = true;
        }
        if ((!this._isDraggingMax || ignoreDragging) && this._maxValue !== newMaxValue) {
            this._maxValue = newMaxValue;
            needsUpdate = true;
        }
        if (this._currentValue !== newCurrentValue) {
            this._currentValue = newCurrentValue;
            needsUpdate = true;
        }
        if (this._minValue > this._maxValue) {
            this._error = `Internal Error: Final check failed - Min value (${this._minValue}) > Max value (${this._maxValue})`;
            needsUpdate = true;
        }
        if (needsUpdate) {
            this.requestUpdate();
        }
    }
    _renderError(error) {
        return html `
      <ha-card class="error-card">
        <hui-warning>${error}</hui-warning>
      </ha-card>
    `;
    }
    _getEffectiveMin() {
        const state = this._config?.min_entity ? this.hass?.states[this._config.min_entity] : undefined;
        if (state && state.state !== 'unavailable' && state.state !== 'unknown') {
            const val = parseFloat(state.state);
            if (!isNaN(val))
                return val;
        }
        return this._config?.min ?? 0;
    }
    _getEffectiveMax() {
        const state = this._config?.max_entity ? this.hass?.states[this._config.max_entity] : undefined;
        if (state && state.state !== 'unavailable' && state.state !== 'unknown') {
            const val = parseFloat(state.state);
            if (!isNaN(val))
                return val;
        }
        return this._config?.max ?? 100;
    }
    _getEffectiveStep() {
        let step = this._config?.step ?? 1;
        const state = this._config?.step_entity ? this.hass?.states[this._config.step_entity] : undefined;
        if (state && state.state !== 'unavailable' && state.state !== 'unknown') {
            const val = parseFloat(state.state);
            if (!isNaN(val) && val > 0)
                step = val;
        }
        return step > 0 ? step : 1;
    }
    _clampAndStep(value, min, max, step) {
        if (value === null || value === undefined || isNaN(value) || isNaN(min) || isNaN(max) || isNaN(step) || step <= 0) {
            return min;
        }
        const clamped = Math.max(min, Math.min(value, max));
        const steps = Math.round((clamped - min) / step);
        const precision = this._getPrecision(step);
        const steppedValue = parseFloat((min + steps * step).toFixed(precision));
        return Math.max(min, Math.min(steppedValue, max));
    }
    _getPrecision(step) {
        if (step === null || step === undefined || isNaN(step))
            return 0;
        const stepString = String(step);
        if (stepString.includes('.')) {
            if (stepString.toLowerCase().includes('e')) {
                try {
                    return parseInt(stepString.split('-')[1], 10) || 0;
                }
                catch {
                    return 0;
                }
            }
            return stepString.split('.')[1]?.length || 0;
        }
        return 0;
    }
    _formatValue(value) {
        if (value === null || value === undefined || isNaN(value))
            return '';
        const step = this._getEffectiveStep();
        return value.toFixed(this._getPrecision(step));
    }
    _formatValueText(value) {
        if (value === null || value === undefined || isNaN(value))
            return '';
        const unit = this._config?.unit ?? '';
        return `${this._formatValue(value)}${unit ? ` ${unit}` : ''}`;
    }
    _calculateValueFromPosition(position, trackRect) {
        const min = this._getEffectiveMin();
        const max = this._getEffectiveMax();
        const step = this._getEffectiveStep();
        let percentage;
        if (this._config.orientation === 'vertical') {
            const trackHeight = trackRect.height;
            const clampedPos = Math.max(trackRect.top, Math.min(position, trackRect.bottom));
            percentage = trackHeight === 0 ? 0 : Math.max(0, Math.min(1, (trackRect.bottom - clampedPos) / trackHeight));
        }
        else {
            const trackWidth = trackRect.width;
            const clampedPos = Math.max(trackRect.left, Math.min(position, trackRect.right));
            percentage = trackWidth === 0 ? 0 : Math.max(0, Math.min(1, (clampedPos - trackRect.left) / trackWidth));
        }
        const rawValue = min + percentage * (max - min);
        return this._clampAndStep(rawValue, min, max, step);
    }
    _setEntityValue(entityId, value) {
        if (!this.hass ||
            !this._config ||
            !entityId ||
            value === null ||
            value === undefined ||
            isNaN(value)) {
            return;
        }
        // Check individual read-only flags
        if (this._config.read_only)
            return; // Global override
        if (entityId === this._config.entity_min && this._config.read_only_min)
            return;
        if (entityId === this._config.entity_max && this._config.read_only_max)
            return;
        // Add check for read_only_value if entity_value setting becomes possible
        // if (entityId === this._config.entity_value && this._config.read_only_value) return;
        const currentEntityState = this.hass.states[entityId];
        const currentValue = currentEntityState ? parseFloat(currentEntityState.state) : NaN;
        const step = this._getEffectiveStep();
        const precision = this._getPrecision(step);
        const formattedNewValue = parseFloat(value.toFixed(precision));
        if (isNaN(formattedNewValue)) {
            console.error(`Range Slider Card: Attempted to set invalid value (${value}) for ${entityId}`);
            return;
        }
        if (isNaN(currentValue) || currentValue.toFixed(precision) !== formattedNewValue.toFixed(precision)) {
            console.debug(`Range Slider Card: Calling input_number.set_value for ${entityId} with value ${formattedNewValue}`);
            this.hass.callService('input_number', 'set_value', {
                entity_id: entityId,
                value: formattedNewValue,
            });
        }
        else {
            console.debug(`Range Slider Card: Value for ${entityId} unchanged (${formattedNewValue}), skipping service call.`);
        }
    }
    _addGlobalListeners() {
        window.addEventListener('mousemove', this._handleMove, { passive: false });
        window.addEventListener('mouseup', this._handleUp, { passive: false });
        window.addEventListener('touchmove', this._handleMove, { passive: false });
        window.addEventListener('touchend', this._handleUp, { passive: false });
        window.addEventListener('touchcancel', this._handleUp, { passive: false });
    }
    _removeGlobalListeners() {
        window.removeEventListener('mousemove', this._handleMove);
        window.removeEventListener('mouseup', this._handleUp);
        window.removeEventListener('touchmove', this._handleMove);
        window.removeEventListener('touchend', this._handleUp);
        window.removeEventListener('touchcancel', this._handleUp);
    }
    // --- Handlers de Eventos ---
    _handleFocus(handleType) {
        if (this._config?.read_only)
            return;
        this._activeHandle = handleType;
    }
    _handleBlur() {
        setTimeout(() => {
            if (this.shadowRoot && !this.shadowRoot.activeElement?.classList.contains('slider-handle')) {
                this._activeHandle = null;
            }
        }, 100);
    }
    _handleMinDown(e) {
        if (this._config?.read_only || this._config?.read_only_min || this._isDraggingMax || (e instanceof MouseEvent && e.button !== 0))
            return;
        e.stopPropagation();
        this._isDraggingMin = true;
        this._tooltipValueMin = this._minValue;
        this._addGlobalListeners();
        this.shadowRoot?.querySelector('.min-handle')?.focus();
        this._activeHandle = 'min';
    }
    _handleMaxDown(e) {
        if (this._config?.read_only || this._config?.read_only_max || this._isDraggingMin || (e instanceof MouseEvent && e.button !== 0))
            return;
        e.stopPropagation();
        this._isDraggingMax = true;
        this._tooltipValueMax = this._maxValue;
        this._addGlobalListeners();
        this.shadowRoot?.querySelector('.max-handle')?.focus();
        this._activeHandle = 'max';
    }
    _handleMove(e) {
        if ((!this._isDraggingMin && !this._isDraggingMax) || !this._config)
            return;
        // Prevent default scrolling behavior only when dragging vertically on touch devices
        if (e instanceof TouchEvent && this._config.orientation === 'vertical') {
            e.preventDefault();
        }
        // Removed redundant e.preventDefault() here
        const track = this.shadowRoot?.querySelector('.slider-track');
        if (!track)
            return;
        const trackRect = track.getBoundingClientRect();
        const position = this._config.orientation === 'vertical'
            ? e.touches
                ? e.touches[0].clientY
                : e.clientY
            : e.touches
                ? e.touches[0].clientX
                : e.clientX;
        const newValue = this._calculateValueFromPosition(position, trackRect);
        const step = this._getEffectiveStep();
        const minSeparation = step * MIN_STEP_SEPARATION_FACTOR;
        const currentMinValue = this._minValue;
        const currentMaxValue = this._maxValue;
        if (this._isDraggingMin) {
            const effectiveMax = currentMaxValue - minSeparation;
            const clampedNewValue = this._clampAndStep(newValue, this._getEffectiveMin(), effectiveMax, step);
            if (typeof clampedNewValue === 'number') {
                this._tooltipValueMin = clampedNewValue;
            }
        }
        else if (this._isDraggingMax) {
            const effectiveMin = currentMinValue + minSeparation;
            const clampedNewValue = this._clampAndStep(newValue, effectiveMin, this._getEffectiveMax(), step);
            if (typeof clampedNewValue === 'number') {
                this._tooltipValueMax = clampedNewValue;
            }
        }
    }
    _handleUp(e) {
        if ((!this._isDraggingMin && !this._isDraggingMax) || !this._config)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (this._isDraggingMin && this._tooltipValueMin !== null) {
            if (this._tooltipValueMin !== this._minValue) {
                this._minValue = this._tooltipValueMin;
                this._setEntityValue(this._config.entity_min, this._minValue);
            }
        }
        else if (this._isDraggingMax && this._tooltipValueMax !== null) {
            if (this._tooltipValueMax !== this._maxValue) {
                this._maxValue = this._tooltipValueMax;
                this._setEntityValue(this._config.entity_max, this._maxValue);
            }
        }
        this._isDraggingMin = false;
        this._isDraggingMax = false;
        this._tooltipValueMin = null;
        this._tooltipValueMax = null;
        this._removeGlobalListeners();
        this.requestUpdate();
    }
    _handleKeyDown(e) {
        if (!this._config || this._config.read_only || !this._activeHandle)
            return;
        const handleType = this._activeHandle;
        // Check individual read-only for the active handle
        if (handleType === 'min' && this._config.read_only_min)
            return;
        if (handleType === 'max' && this._config.read_only_max)
            return;
        const step = this._getEffectiveStep();
        const minLimit = this._getEffectiveMin();
        const maxLimit = this._getEffectiveMax();
        const minSeparation = step * MIN_STEP_SEPARATION_FACTOR;
        const currentMinValue = this._minValue;
        const currentMaxValue = this._maxValue;
        let newValue = handleType === 'min' ? currentMinValue : currentMaxValue;
        let valueChanged = false;
        let increment = 0;
        switch (e.key) {
            case 'ArrowLeft':
                increment = this._config.orientation === 'horizontal' ? -step : 0;
                break;
            case 'ArrowRight':
                increment = this._config.orientation === 'horizontal' ? step : 0;
                break;
            case 'ArrowDown':
                increment = this._config.orientation === 'vertical' ? -step : 0;
                break;
            case 'ArrowUp':
                increment = this._config.orientation === 'vertical' ? step : 0;
                break;
            case 'Home':
                newValue = handleType === 'min' ? minLimit : currentMinValue + minSeparation;
                valueChanged = true;
                break;
            case 'End':
                newValue = handleType === 'max' ? maxLimit : currentMaxValue - minSeparation;
                valueChanged = true;
                break;
            default:
                return;
        }
        if (increment === 0 && !valueChanged)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (increment !== 0) {
            newValue += increment;
            valueChanged = true;
        }
        if (valueChanged) {
            let finalValue;
            if (handleType === 'min') {
                const effectiveMax = currentMaxValue - minSeparation;
                finalValue = this._clampAndStep(newValue, minLimit, effectiveMax, step);
                if (finalValue !== this._minValue) {
                    this._minValue = finalValue;
                    this._setEntityValue(this._config.entity_min, finalValue);
                }
            }
            else {
                const effectiveMin = currentMinValue + minSeparation;
                finalValue = this._clampAndStep(newValue, effectiveMin, maxLimit, step);
                if (finalValue !== this._maxValue) {
                    this._maxValue = finalValue;
                    this._setEntityValue(this._config.entity_max, finalValue);
                }
            }
        }
    }
    _handleTrackClick(e) {
        if (!this._config || this._config.read_only || this._isDraggingMin || this._isDraggingMax)
            return;
        if (e.target?.classList.contains('slider-handle'))
            return;
        e.stopPropagation();
        const track = this.shadowRoot?.querySelector('.slider-track');
        if (!track)
            return;
        const trackRect = track.getBoundingClientRect();
        const position = this._config.orientation === 'vertical' ? e.clientY : e.clientX;
        const clickedValue = this._calculateValueFromPosition(position, trackRect);
        const currentMinValue = this._minValue;
        const currentMaxValue = this._maxValue;
        const minDiff = Math.abs(clickedValue - currentMinValue);
        const maxDiff = Math.abs(clickedValue - currentMaxValue);
        const step = this._getEffectiveStep();
        const minSeparation = step * MIN_STEP_SEPARATION_FACTOR;
        const minLimit = this._getEffectiveMin();
        const maxLimit = this._getEffectiveMax();
        // Check individual read-only before setting value
        if (minDiff <= maxDiff || clickedValue < currentMinValue) {
            if (this._config.read_only_min)
                return; // Don't modify if min is read-only
            const effectiveMax = currentMaxValue - minSeparation;
            const finalValue = this._clampAndStep(clickedValue, minLimit, effectiveMax, step);
            if (finalValue !== this._minValue) {
                this._minValue = finalValue;
                this._setEntityValue(this._config.entity_min, finalValue);
                this.shadowRoot?.querySelector('.min-handle')?.focus();
            }
        }
        else {
            if (this._config.read_only_max)
                return; // Don't modify if max is read-only
            const effectiveMin = currentMinValue + minSeparation;
            const finalValue = this._clampAndStep(clickedValue, effectiveMin, maxLimit, step);
            if (finalValue !== this._maxValue) {
                this._maxValue = finalValue;
                this._setEntityValue(this._config.entity_max, finalValue);
                this.shadowRoot?.querySelector('.max-handle')?.focus();
            }
        }
    }
    _handleInputChange(e, type) {
        if (!this._config || this._config.read_only)
            return;
        // Check individual read-only for the specific input
        if (type === 'min' && this._config.read_only_min)
            return;
        if (type === 'max' && this._config.read_only_max)
            return;
        const input = e.target;
        const value = parseFloat(input.value);
        const minLimit = this._getEffectiveMin();
        const maxLimit = this._getEffectiveMax();
        const step = this._getEffectiveStep();
        const minSeparation = step * MIN_STEP_SEPARATION_FACTOR;
        const currentMinValue = this._minValue;
        const currentMaxValue = this._maxValue;
        let finalValue;
        if (isNaN(value)) {
            input.value = this._formatValue(type === 'min' ? currentMinValue : currentMaxValue);
            return;
        }
        if (type === 'min') {
            const effectiveMax = currentMaxValue - minSeparation;
            finalValue = this._clampAndStep(value, minLimit, effectiveMax, step);
            if (finalValue !== this._minValue) {
                this._minValue = finalValue;
                this._setEntityValue(this._config.entity_min, finalValue);
            }
        }
        else {
            const effectiveMin = currentMinValue + minSeparation;
            finalValue = this._clampAndStep(value, effectiveMin, maxLimit, step);
            if (finalValue !== this._maxValue) {
                this._maxValue = finalValue;
                this._setEntityValue(this._config.entity_max, finalValue);
            }
        }
        input.value = this._formatValue(finalValue);
    }
    _handleCardAction(ev) {
        const path = ev.composedPath();
        const isInteractiveElement = path.some((el) => el instanceof HTMLElement &&
            (el.classList?.contains('slider-handle') || el.classList?.contains('slider-track') || el.tagName === 'INPUT'));
        if (!isInteractiveElement && this.hass && this._config && ev.detail.action) {
            ev.stopPropagation();
            handleAction(this, this.hass, this._config, ev.detail.action);
        }
    }
    // --- Métodos Auxiliares de Estilo ---
    _getBarStyle(minPos, maxPos) {
        const safeMinPos = Math.max(0, Math.min(100, minPos));
        const safeMaxPos = Math.max(0, Math.min(100, maxPos));
        const length = Math.max(0, safeMaxPos - safeMinPos);
        if (this._config?.orientation === 'vertical') {
            const bottom = `${safeMinPos}%`;
            const height = `${length}%`;
            return `bottom: ${bottom}; height: ${height}; left: 0; right: 0;`;
        }
        else {
            const left = `${safeMinPos}%`;
            const width = `${length}%`;
            return `left: ${left}; width: ${width}; top: 0; bottom: 0;`;
        }
    }
    _getHandleStyle(pos) {
        const safePos = Math.max(0, Math.min(100, pos));
        if (this._config?.orientation === 'vertical') {
            return `bottom: ${safePos}%;`;
        }
        else {
            return `left: ${safePos}%;`;
        }
    }
    _getMarkerStyle(pos) {
        if (pos === null)
            return 'display: none;';
        const safePos = Math.max(0, Math.min(100, pos));
        if (this._config?.orientation === 'vertical') {
            return `bottom: ${safePos}%;`;
        }
        else {
            return `left: ${safePos}%;`;
        }
    }
    // --- Métodos Estáticos ---
    static async getConfigElement() {
        await import('./range-slider-card-editor');
        return document.createElement('range-slider-card-editor');
    }
    static getStubConfig(hass, entities) {
        let entityMin = 'input_number.min_example';
        let entityMax = 'input_number.max_example';
        if (hass && entities) {
            const inputNumbers = entities.filter((eid) => eid.startsWith('input_number.'));
            if (inputNumbers.length > 0)
                entityMin = inputNumbers[0];
            if (inputNumbers.length > 1)
                entityMax = inputNumbers[1];
        }
        return {
            type: 'custom:range-slider-card',
            entity_min: entityMin,
            entity_max: entityMax,
            name: 'Range Slider',
        };
    }
    // --- Estilos CSS ---
    static get styles() {
        return css `
      :host {
        display: block;
        --range-slider-bar-color: var(--paper-slider-active-color, var(--primary-color));
        --range-slider-track-color: var(--paper-slider-secondary-color, var(--secondary-background-color));
        --range-slider-handle-color: var(--paper-slider-knob-color, var(--primary-color));
        --range-slider-handle-focus-color: var(--paper-slider-knob-color, var(--primary-color));
        --range-slider-handle-active-color: var(--paper-slider-pin-color, var(--primary-color));
        --range-slider-handle-size: 20px;
        --range-slider-track-height: 4px;
        --range-slider-value-marker-color: var(--state-icon-active-color, var(--primary-color));
        --range-slider-value-marker-size: 8px;
        --range-slider-tooltip-background-color: var(--primary-text-color);
        --range-slider-tooltip-text-color: var(--primary-background-color);
        --range-slider-input-border-color: var(--divider-color);
        --range-slider-input-background-color: var(--ha-card-background, var(--card-background-color, white));
        --range-slider-input-text-color: var(--primary-text-color);
        --range-slider-handle-transition: left 0.15s ease-out, bottom 0.15s ease-out;
        /* Title styling */
        --ha-card-header-font-size: 1em; /* Smaller font size */
        --ha-card-header-padding: 8px 16px; /* Reduced padding */
        --ha-card-content-padding: 12px; /* Slightly reduced content padding */
      }
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }
      .card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-grow: 1;
        box-sizing: border-box;
        padding: var(--ha-card-content-padding, 16px); /* Use variable */
      }
      :host(.vertical) .card-content {
        flex-direction: row;
        align-items: center;
      }
      .slider-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Reduced padding slightly */
        padding: calc(var(--range-slider-handle-size) / 2 + 1px) 0;
        min-height: var(--range-slider-handle-size);
        cursor: pointer;
        margin-bottom: 8px; /* Add some space below slider */
      }
      :host(.read-only) .slider-container {
        cursor: default;
      }
      :host(.vertical) .slider-container {
        padding: 0 calc(var(--range-slider-handle-size) / 2 + 2px);
        min-width: var(--range-slider-handle-size);
        height: 150px;
        align-self: stretch;
      }
      .slider-track {
        position: relative;
        background-color: var(--range-slider-track-color);
        border-radius: calc(var(--range-slider-track-height) / 2);
        width: 100%;
        height: var(--range-slider-track-height);
      }
      :host(.vertical) .slider-track {
        width: var(--range-slider-track-height);
        height: 100%;
      }
      .slider-bar {
        position: absolute;
        background-color: var(--range-slider-bar-color);
        border-radius: calc(var(--range-slider-track-height) / 2);
        pointer-events: none;
      }
      .slider-handle {
        position: absolute;
        width: var(--range-slider-handle-size);
        height: var(--range-slider-handle-size);
        background-color: var(--range-slider-handle-color);
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        cursor: grab;
        transform: translate(-50%, -50%);
        top: 50%;
        outline: none;
        transition: var(--range-slider-handle-transition);
        z-index: 2;
      }
      :host(.read-only) .slider-handle {
        cursor: default;
        pointer-events: none;
        background-color: var(--disabled-text-color);
      }
      .slider-handle:focus-visible {
        box-shadow: 0 0 0 3px var(--range-slider-handle-focus-color);
      }
      .slider-handle.active {
        background-color: var(--range-slider-handle-active-color);
        box-shadow: 0 0 0 3px var(--range-slider-handle-focus-color);
      }
      .slider-handle:active {
        cursor: grabbing;
        background-color: var(--range-slider-handle-active-color);
      }
      :host(.vertical) .slider-handle {
        left: 50%;
        transform: translate(-50%, 50%);
        top: auto;
      }
      .value-marker {
        position: absolute;
        width: var(--range-slider-value-marker-size);
        height: var(--range-slider-value-marker-size);
        background-color: var(--range-slider-value-marker-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        pointer-events: none;
        z-index: 1;
        transition: var(--range-slider-handle-transition);
      }
      :host(.vertical) .value-marker {
        left: 50%;
        transform: translate(-50%, 50%);
        top: auto;
      }
      .tooltip {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--range-slider-tooltip-background-color);
        color: var(--range-slider-tooltip-text-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
      }
      :host(.vertical) .tooltip {
        bottom: auto;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px; /* Reduced top margin */
        gap: 8px; /* Reduced gap */
      }
      :host(.vertical) .info-row {
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        margin-top: 0;
        margin-left: 16px;
        gap: 8px;
        width: 100px;
      }
      .value-label {
        text-align: center;
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 45px; /* Slightly reduce min-width */
      }
      :host(.vertical) .value-label {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        min-width: 0;
      }
      .value-label .label {
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 1px; /* Reduced margin */
        white-space: nowrap;
        font-size: 0.9em; /* Smaller label font */
        font-weight: 400; /* Lighter weight */
      }
      :host(.vertical) .value-label .label {
        margin-bottom: 0;
        margin-right: 4px;
      }
      .value-label .value {
        font-weight: bold;
        color: var(--primary-text-color);
      }
      .value-input {
        width: 65px;
        padding: 4px;
        border: 1px solid var(--range-slider-input-border-color);
        border-radius: 4px;
        text-align: center;
        font-size: 0.9em;
        background-color: var(--range-slider-input-background-color);
        color: var(--range-slider-input-text-color);
        box-shadow: none;
        box-sizing: border-box;
        -moz-appearance: textfield;
      }
      .value-input:disabled {
        background-color: var(--disabled-text-color);
        cursor: not-allowed;
      }
      .value-input::-webkit-outer-spin-button,
      .value-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      :host(.vertical) .value-input {
        width: 55px;
      }
      .error-card {
        background-color: var(--error-color);
        color: var(--text-primary-color);
      }
      hui-warning {
        padding: 16px;
        display: block;
        color: inherit;
        text-align: center;
      }
    `;
    }
};
__decorate([
    property({ attribute: false })
], RangeSliderCard.prototype, "hass", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_config", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_entityMinState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_entityMaxState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_entityValueState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_minLimitState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_maxLimitState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_stepState", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_minValue", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_maxValue", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_currentValue", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_error", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_isDraggingMin", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_isDraggingMax", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_tooltipValueMin", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_tooltipValueMax", void 0);
__decorate([
    state()
], RangeSliderCard.prototype, "_activeHandle", void 0);
RangeSliderCard = __decorate([
    customElement('range-slider-card')
], RangeSliderCard);
export { RangeSliderCard };
// Adiciona metadados para o picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'range-slider-card',
    name: 'Range Slider Card',
    description: 'An interactive range slider linked to two input_number entities.',
    preview: true,
    documentationURL: 'https://github.com/dbarciela/range-slider-card/',
});
