// Define the class for the configuration editor element
class RangeSliderCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = undefined; // Store hass object for ha-entity-picker
  }

  // Called by Lovelace UI editor to set the current configuration and hass object
  setConfig(config) {
    this._config = config;
    // Render the editor with the current config values
    this.render();
  }

  // Lovelace UI editor also passes the hass object
  set hass(hass) {
    this._hass = hass;
    // Re-render if hass changes and elements depend on it (like ha-entity-picker)
    // This check might be too simple, depending on how often hass updates in editor
    if (this.shadowRoot && this.shadowRoot.querySelector('ha-entity-picker')) {
       this.render();
    }
  }

  // Render the editor's HTML form
  connectedCallback() {
      this.render(); // Initial render
  }

  render() {
      if (!this.shadowRoot) return; // Exit if shadowRoot is not available yet

      // Helper function to render input fields, trying HA elements first
      const renderField = (id, label, type = 'text', placeholder = '', required = false, value, configKey) => {
          const haElement = type === 'entity' ? 'ha-entity-picker' : 'ha-textfield';
          const useHaElement = customElements.get(haElement); // Check if element is defined

          if (useHaElement && type === 'entity') {
              // Use ha-entity-picker if available
              return `
                  <ha-entity-picker
                      .hass="${this._hass}"
                      .label="${label}"
                      .value="${value || ''}"
                      .configValue="${configKey}"
                      .required="${required}"
                      @value-changed="${this._valueChanged}"
                      allow-custom-entity
                      domain-filter="input_number" /* Filter for input_number */
                  ></ha-entity-picker>
              `;
          } else if (useHaElement && type !== 'entity') {
              // Use ha-textfield for text/number if available
              return `
                  <ha-textfield
                      .label="${label}"
                      .type="${type}"
                      .value="${value || ''}"
                      .placeholder="${placeholder}"
                      .configValue="${configKey}"
                      .required="${required}"
                      @input="${this._valueChanged}"
                  ></ha-textfield>
              `;
          } else {
              // Fallback to standard HTML input
              console.warn(`Custom element '${haElement}' not found. Falling back to <input> for ${id}.`);
              return `
                  <label for="${id}">${label}${required ? ' (Required)' : ''}</label>
                  <input
                      type="${type === 'entity' ? 'text' : type}"
                      id="${id}"
                      .value="${value || ''}"
                      placeholder="${placeholder}"
                      @input="${this._valueChanged}"
                      data-config-key="${configKey}" /* Store key in data attribute */
                      ${required ? 'required' : ''}
                  >
              `;
          }
      };


      // Define the HTML structure for the editor form
      this.shadowRoot.innerHTML = `
          <style>
              /* Styling for the editor form elements */
              .form-group, ha-textfield, ha-entity-picker {
                  margin-bottom: 12px;
                  display: block; /* Ensure HA elements take block space */
              }
              /* Style standard inputs if HA elements are not available */
              label {
                  font-weight: bold;
                  margin-bottom: 4px;
                  color: var(--primary-text-color);
                  display: block; /* Make label block for spacing */
              }
              input[type="text"],
              input[type="number"] {
                  padding: 8px;
                  border-radius: var(--ha-card-border-radius, 4px);
                  border: 1px solid var(--divider-color);
                  background-color: var(--input-fill-color, var(--secondary-background-color));
                  color: var(--primary-text-color);
                  box-sizing: border-box;
                  width: 100%;
              }
              input:focus {
                  outline: none;
                  border-color: var(--primary-color);
              }
              .grid-container {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Adjusted minmax */
                  gap: 12px;
              }
          </style>
          <div class="form">
              <div class="form-group">
                  ${renderField('name', 'Name (Optional)', 'text', '', false, this._config.name, 'name')}
              </div>

              <div class="grid-container">
                  <div class="form-group">
                      ${renderField('entity_min', 'Min Entity', 'entity', '', true, this._config.entity_min, 'entity_min')}
                  </div>
                  <div class="form-group">
                      ${renderField('entity_max', 'Max Entity', 'entity', '', true, this._config.entity_max, 'entity_max')}
                  </div>
              </div>

              <div class="grid-container">
                  <div class="form-group">
                      ${renderField('min', 'Slider Min (Optional)', 'number', '0', false, this._config.min, 'min')}
                  </div>
                  <div class="form-group">
                      ${renderField('max', 'Slider Max (Optional)', 'number', '100', false, this._config.max, 'max')}
                  </div>
                  <div class="form-group">
                      ${renderField('step', 'Step (Optional)', 'number', '1', false, this._config.step, 'step')}
                  </div>
                  <div class="form-group">
                      ${renderField('unit', 'Unit (Optional)', 'text', '', false, this._config.unit, 'unit')}
                  </div>
              </div>
          </div>
      `;
  }

  // Called when any input value changes
  _valueChanged(ev) {
      if (!this._config || !ev.target) return; // Exit if config or target is not set

      const target = ev.target;
      // Determine the config key: from 'configValue' property or data attribute
      const key = target.configValue || target.dataset?.configKey;
      if (!key) {
          console.warn("Could not determine config key for input:", target);
          return;
      }

      let value;
      // Get value based on element type
      if (target.tagName === 'HA-ENTITY-PICKER' || target.tagName === 'HA-TEXTFIELD') {
          value = ev.detail?.value !== undefined ? ev.detail.value : target.value; // HA elements use detail.value or .value
      } else {
          // Standard input
           value = target.value;
      }


      // Handle type conversions or specific logic
      const inputType = target.type || (target.tagName === 'HA-ENTITY-PICKER' ? 'entity' : 'text'); // Infer type
      if (inputType === 'number') {
          value = value === '' || value === null ? undefined : Number(value); // Convert empty/null to undefined for numbers
      } else if (inputType === 'text' || inputType === 'entity') {
          value = value === '' ? undefined : value; // Convert empty string to undefined for optional text fields
      }

      // Update the internal config object only if the value actually changed
      if (this._config[key] !== value) {
          // Create a new config object with the updated value
          const newConfig = { ...this._config, [key]: value };

          // Remove undefined or null values from config before firing event
          const updatedConfig = Object.fromEntries(
              Object.entries(newConfig).filter(([_, v]) => v !== undefined && v !== null)
          );

          // Fire the event to notify Lovelace UI
          const event = new CustomEvent("config-changed", {
              detail: { config: updatedConfig },
              bubbles: true,
              composed: true,
          });
          this.dispatchEvent(event);
      }
  }
}
// Define the custom element for the editor
customElements.define('range-slider-card-editor', RangeSliderCardEditor);


// --- Main RangeSliderCard Class ---

class RangeSliderCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._updateTimeout = null;
    this.isUpdating = false;
    this._sliderInstance = null; // Store slider instance
  }

  // --- Lovelace Card Lifecycle Methods ---
  setConfig(config) {
    if (!config.entity_min || !config.entity_max) {
      throw new Error("You need to define 'entity_min' and 'entity_max'.");
    }
    if (config.min !== undefined && config.max !== undefined && Number(config.min) >= Number(config.max)) {
        console.warn("RangeSliderCard: 'min' value should be less than 'max' value.");
    }
    this.config = config;
    if (this.shadowRoot) {
        this.render();
    }
  }

  connectedCallback() {
    if (this.config) {
        this.render();
    }
  }

  disconnectedCallback() {
    if (this._updateTimeout) {
        clearTimeout(this._updateTimeout);
        this._updateTimeout = null;
    }
    // Destroy the slider instance cleanly
    if (this._sliderInstance) {
        try {
            this._sliderInstance.destroy();
            this._sliderInstance = null; // Clear reference
        } catch (e) {
            console.warn("Error destroying slider:", e);
        }
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (this.shadowRoot && this.shadowRoot.childElementCount > 0 && this.shouldUpdate(oldHass)) {
        clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => {
          if (this.shadowRoot && !this.isUpdating) {
            this.render();
          }
        }, 150);
    }
  }

  shouldUpdate(oldHass) {
    if (!this._hass || !this.config) return false;
    if (!oldHass) return true;
    const { entity_min, entity_max } = this.config;
    return (
        !oldHass.states[entity_min] ||
        !oldHass.states[entity_max] ||
        this._hass.states[entity_min]?.state !== oldHass.states[entity_min]?.state ||
        this._hass.states[entity_max]?.state !== oldHass.states[entity_max]?.state
    );
  }

  // --- Rendering Logic ---
  async render() {
    if (!this.config || !this._hass) return;

    const { entity_min, entity_max, min = 0, max = 100, step = 1, name = 'Range Slider', unit = '' } = this.config;
    const stateMin = this._hass.states[entity_min];
    const stateMax = this._hass.states[entity_max];

    if (!stateMin || !stateMax) {
      this.shadowRoot.innerHTML = `<ha-card><hui-warning>Entities not found: ${entity_min || '?'}, ${entity_max || '?'}</hui-warning></ha-card>`;
      return;
    }

    const valueMin = parseFloat(stateMin.state);
    const valueMax = parseFloat(stateMax.state);

    if (isNaN(valueMin) || isNaN(valueMax)) {
      this.shadowRoot.innerHTML = `<ha-card><hui-warning>Invalid states: ${entity_min} (${stateMin.state}), ${entity_max} (${stateMax.state})</hui-warning></ha-card>`;
      return;
    }

    // Only set innerHTML if it's not already populated or needs full refresh
    if (!this.shadowRoot.getElementById('slider')) {
        this.shadowRoot.innerHTML = `
          <style>
            /* Import noUiSlider CSS */
            @import "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.css";
            /* Card styles */
            :host { display: block; }
            ha-card {
                display: flex; flex-direction: column; padding: 16px; height: 100%;
                box-sizing: border-box; overflow: hidden;
            }
            .card-content { /* Added container for content */
                flex-grow: 1; display: flex; flex-direction: column; justify-content: center;
            }
            .title {
                font-size: var(--ha-card-header-font-size, 1.5em); /* Use HA header font size */
                font-weight: var(--ha-card-header-font-weight, normal);
                color: var(--primary-text-color); margin: 0; padding-bottom: 8px;
                align-self: flex-start; white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; max-width: 100%;
            }
            .slider-container {
                display: flex; flex-direction: column; align-items: center;
                width: 100%; margin-top: 8px; padding: 0 8px; /* Add padding to prevent handles touching edge */
                box-sizing: border-box;
            }
            .slider { width: 100%; margin: 20px 0; } /* Increased margin for handles */
            .values {
                display: flex; justify-content: space-between; width: 100%;
                font-size: 0.9em; color: var(--secondary-text-color); padding: 0 5px;
                margin-top: 8px;
            }
            /* More specific noUiSlider styling using HA variables */
            .noUi-target {
                background: var(--paper-slider-container-color, #e0e0e0); /* Use HA var or fallback */
                border-radius: 4px; border: none; box-shadow: none; height: 4px;
            }
            .noUi-connect {
                background: var(--paper-slider-active-color, var(--primary-color));
                border-radius: 4px;
            }
            .noUi-connects { /* Ensure the track container is rounded */
                 border-radius: 4px;
            }
            .noUi-handle {
                background: var(--paper-slider-knob-color, var(--primary-color));
                border: 2px solid var(--paper-slider-knob-color, var(--primary-color)); /* Ensure border matches */
                border-radius: 50%;
                box-shadow: var(--ha-elevation-1); /* Use HA shadow */
                height: 20px; width: 20px; top: -9px; /* Adjusted top */
                right: -10px; /* Let noUiSlider handle position, but keep base */
                cursor: pointer;
                box-sizing: border-box;
            }
            .noUi-handle:focus {
                outline: none;
                box-shadow: 0 0 0 3px var(--paper-slider-pin-color, var(--primary-color));
            }
            .noUi-handle:active {
                 transform: scale(1.1); /* Slightly enlarge handle on drag */
            }
            /* Ensure handles don't overlap visually */
            .noUi-handle-lower { z-index: 1; }
            .noUi-handle-upper { z-index: 2; }

            .noUi-tooltip { display: none; }
          </style>
          <ha-card>
            <div class="title" title="${name}">${name}</div>
            <div class="card-content">
                <div class="slider-container">
                    <div class="slider" id="slider"></div>
                    <div class="values">
                      <span id="min-value">Min: ${valueMin.toFixed(1)}${unit}</span>
                      <span id="max-value">Max: ${valueMax.toFixed(1)}${unit}</span>
                    </div>
                </div>
            </div>
          </ha-card>
        `;
    } else {
        // Only update values if slider exists
        const minSpan = this.shadowRoot.getElementById('min-value');
        const maxSpan = this.shadowRoot.getElementById('max-value');
        if (minSpan) minSpan.textContent = `Min: ${valueMin.toFixed(1)}${unit}`;
        if (maxSpan) maxSpan.textContent = `Max: ${valueMax.toFixed(1)}${unit}`;
        // Update title if it changed
        const titleElem = this.shadowRoot.querySelector('.title');
        if (titleElem && titleElem.textContent !== name) {
            titleElem.textContent = name;
            titleElem.title = name;
        }
    }


    const sliderElement = this.shadowRoot.getElementById('slider');
    if (!sliderElement) return; // Should not happen if innerHTML was set

    const noUiSlider = await this.loadNoUiSlider();
    if (!noUiSlider) {
        console.error("Failed to load noUiSlider library.");
        sliderElement.innerHTML = `<hui-warning>Error loading slider library.</hui-warning>`;
        return;
    }

    // --- Slider Creation / Update ---
    if (!this._sliderInstance) {
        // Create slider if it doesn't exist
        this.createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit);
    } else {
        // Update existing slider if necessary
        const currentOptions = this._sliderInstance.options;
        const needsUpdate = currentOptions.start[0] !== valueMin ||
                            currentOptions.start[1] !== valueMax ||
                            currentOptions.range.min !== min ||
                            currentOptions.range.max !== max ||
                            currentOptions.step !== step;

        if (needsUpdate) {
            try {
                // Only update options that can be updated
                this._sliderInstance.updateOptions({
                    range: { min: min, max: max },
                    step: step
                }, false); // Don't fire events yet
                // Set handles separately as start option cannot be updated directly
                this._sliderInstance.set([valueMin, valueMax], false);
            } catch (e) {
                console.error("Error updating slider options:", e);
                // Fallback: Destroy and recreate
                this._sliderInstance.destroy();
                this._sliderInstance = null;
                this.createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit);
            }
        } else {
             // If options are the same, still ensure handles are at the correct state values
             // Prevents slider from being stuck if state changed externally during drag
             this._sliderInstance.set([valueMin, valueMax], false);
        }
    }
  }

  // Helper function to create the slider and attach events
  createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit) {
      try {
          const sliderMin = Math.min(min, max - step);
          const sliderMax = Math.max(max, min + step);

          // Destroy existing instance if somehow it exists but wasn't cleared
          if (sliderElement.noUiSlider) sliderElement.noUiSlider.destroy();

          this._sliderInstance = noUiSlider.create(sliderElement, {
            start: [valueMin, valueMax], connect: true,
            range: { min: sliderMin, max: sliderMax }, step: step,
            behaviour: 'tap-drag', format: { to: v => v, from: v => Number(v) },
            // Add margin to prevent handles overlapping too much at extremes
            margin: step > 0 ? step : 1, // Minimum margin is the step size
            limit: (max - min) > 0 ? (max - min) : undefined, // Limit total range if needed
          });

          // Attach event listeners
          this._sliderInstance.on('start.RangeSliderCard', () => { this.isUpdating = true; });
          this._sliderInstance.on('update.RangeSliderCard', (values) => this.updateValueDisplay(values, unit));
          this._sliderInstance.on('change.RangeSliderCard', (values) => this.handleValueChange(values, step));
          this._sliderInstance.on('end.RangeSliderCard', () => { this.isUpdating = false; });

      } catch (e) {
          console.error("Error creating slider:", e);
          if (this.shadowRoot) {
             this.shadowRoot.innerHTML = `<ha-card><hui-warning>Error creating slider: ${e.message}</hui-warning></ha-card>`;
          }
          this._sliderInstance = null; // Ensure instance is null on error
      }
  }

  // Helper to update the Min/Max text display
  updateValueDisplay(values, unit) {
      const minSpan = this.shadowRoot?.getElementById('min-value');
      const maxSpan = this.shadowRoot?.getElementById('max-value');
      if (minSpan) minSpan.textContent = `Min: ${parseFloat(values[0]).toFixed(1)}${unit}`;
      if (maxSpan) maxSpan.textContent = `Max: ${parseFloat(values[1]).toFixed(1)}${unit}`;
  }

  // Helper to handle calling HA service on value change
  handleValueChange(values, step) {
      const currentMinState = this._hass.states[this.config.entity_min]?.state;
      const currentMaxState = this._hass.states[this.config.entity_max]?.state;
      const newMinValue = parseFloat(values[0]);
      const newMaxValue = parseFloat(values[1]);
      const threshold = (step || 1) / 2; // Use step for threshold, default 1

      if (Math.abs(newMinValue - parseFloat(currentMinState)) >= threshold) {
          this._hass.callService('input_number', 'set_value', { entity_id: this.config.entity_min, value: newMinValue });
      }
      if (Math.abs(newMaxValue - parseFloat(currentMaxState)) >= threshold) {
          this._hass.callService('input_number', 'set_value', { entity_id: this.config.entity_max, value: newMaxValue });
      }
  }


  // --- Library Loading ---
  async loadNoUiSlider() {
    // Simplified loader - assumes it works or fails quickly
    if (window.noUiSlider) return window.noUiSlider;
    try {
        await new Promise((resolve, reject) => {
            if (document.querySelector('script[src*="nouislider.min.js"]')) {
                 // If script tag exists, assume it will load or has loaded
                 const check = () => window.noUiSlider ? resolve() : setTimeout(check, 50);
                 check();
            } else {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.js";
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            }
            // Add a timeout
            setTimeout(() => reject("Timeout loading noUiSlider"), 5000);
        });
        return window.noUiSlider;
    } catch (error) {
        console.error("Error loading noUiSlider:", error);
        return null;
    }
  }

  // --- Lovelace UI Configuration Methods ---
  static getConfigElement() {
    return document.createElement('range-slider-card-editor');
  }
  static getStubConfig() {
    return {
      entity_min: 'input_number.min_value',
      entity_max: 'input_number.max_value',
      name: 'My Range Slider'
    };
  }
  getCardSize() { return 2; }
}

// Define the custom element for the main card
customElements.define('range-slider-card', RangeSliderCard);
