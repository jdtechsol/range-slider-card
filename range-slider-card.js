/**
 * RangeSliderCardEditor Class: Handles the visual configuration editor for the card in the Lovelace UI.
 */
class RangeSliderCardEditor extends HTMLElement {
  constructor() {
    super();
    // Initialize Shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    // Initialize configuration and hass objects
    this._config = {};
    this._hass = undefined;
  }

  // --- Standard Custom Element Lifecycle Callbacks ---

  connectedCallback() {
    // Render the editor form when the element is added to the DOM
    this._render();
  }

  // --- Properties Set by Lovelace ---

  // Called by Lovelace UI editor to set the current configuration
  setConfig(config) {
    // Store the passed configuration
    this._config = config || {};
    // Re-render the editor form to reflect the current config
    this._render();
  }

  // Called by Lovelace UI editor to pass the Home Assistant object (needed for ha-elements)
  set hass(hass) {
    this._hass = hass;
    // Re-render if the editor is already rendered and uses hass-dependent elements
    // This ensures ha-entity-picker gets updated if hass changes while editor is open
    if (this.shadowRoot && this.shadowRoot.childElementCount > 0) {
        const entityPicker = this.shadowRoot.querySelector('ha-entity-picker');
        if (entityPicker) {
            entityPicker.hass = this._hass; // Directly update picker's hass object
        }
    }
  }

  // --- Rendering ---

  /**
   * Renders the editor form's HTML structure.
   * Uses ha-elements (ha-textfield, ha-entity-picker) if available, otherwise falls back to standard inputs.
   */
  _render() {
    // Ensure shadowRoot is available
    if (!this.shadowRoot) return;

    // Define default values for optional fields to ensure they are present in the form
    const config = {
        name: '',
        min: undefined, // Use undefined for placeholders to work correctly
        max: undefined,
        step: undefined,
        unit: '',
        ...this._config // Overwrite defaults with actual config
    };


    // Helper function to render input fields, trying HA elements first
    const renderField = (id, label, type = 'text', placeholder = '', required = false, value, configKey, domainFilter = undefined) => {
        const haTextElement = 'ha-textfield';
        const haEntityElement = 'ha-entity-picker';
        const useHaText = customElements.get(haTextElement);
        const useHaEntity = customElements.get(haEntityElement);

        if (type === 'entity' && useHaEntity) {
            // Use ha-entity-picker if available
            return `
                <ha-entity-picker
                    .hass="${this._hass}"
                    .label="${label}${required ? ' (Required)' : ''}"
                    .value="${value || ''}"
                    .configValue="${configKey}"
                    .required="${required}"
                    @value-changed="${this._valueChanged}"
                    allow-custom-entity
                    ${domainFilter ? `domain-filter="${domainFilter}"` : ''}
                ></ha-entity-picker>
            `;
        } else if (type !== 'entity' && useHaText) {
            // Use ha-textfield for text/number if available
            return `
                <ha-textfield
                    .label="${label}${required ? ' (Required)' : ''}"
                    .type="${type}"
                    .value="${value !== undefined ? value : ''}" /* Pass empty string for undefined */
                    .placeholder="${placeholder}"
                    .configValue="${configKey}"
                    .required="${required}"
                    @input="${this._valueChanged}"
                    helper="${required ? 'Required' : ''}" /* Add helper text for required */
                ></ha-textfield>
            `;
        } else {
            // Fallback to standard HTML input
            if (!this[`_warned_${type}`]) { // Warn only once per type
              console.warn(`RangeSliderCardEditor: Custom element 'ha-${type === 'entity' ? 'entity-picker' : 'textfield'}' not found. Falling back to <input> for ${id}.`);
              this[`_warned_${type}`] = true;
            }
            return `
                <label for="${id}">${label}${required ? ' (Required)' : ''}</label>
                <input
                    type="${type === 'entity' ? 'text' : type}"
                    class="fallback-input"
                    id="${id}"
                    .value="${value !== undefined ? value : ''}" /* Use property binding */
                    placeholder="${placeholder}"
                    @input="${this._valueChanged}"
                    data-config-key="${configKey}" /* Store key in data attribute */
                    ${required ? 'required' : ''}
                >
            `;
        }
    };

    // Set the innerHTML for the editor form
    this.shadowRoot.innerHTML = `
        <style>
            /* Styling for the editor form elements */
            .form-group, ha-textfield, ha-entity-picker, .fallback-input {
                margin-bottom: 14px;
                display: block; /* Ensure elements take block space */
            }
            label { /* Style for fallback labels */
                display: block;
                margin-bottom: 4px;
                font-weight: 500; /* Slightly bolder */
                color: var(--primary-text-color);
            }
            .fallback-input { /* Style fallback inputs to resemble ha-textfield */
                padding: 10px; /* Match ha-textfield padding */
                border-radius: var(--ha-card-border-radius, 4px);
                border: 1px solid var(--divider-color);
                background-color: var(--input-fill-color, var(--secondary-background-color));
                color: var(--primary-text-color);
                box-sizing: border-box;
                width: 100%;
                font-size: inherit; /* Inherit font size */
                line-height: inherit; /* Inherit line height */
            }
            .fallback-input:focus {
                outline: none;
                border-color: var(--primary-color);
            }
            .grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 14px; /* Consistent gap */
            }
        </style>
        <div class="form">
            <div class="form-group">
                ${renderField('name', 'Name', 'text', 'Range Slider', false, config.name, 'name')}
            </div>

            <div class="grid-container">
                <div class="form-group">
                    ${renderField('entity_min', 'Min Entity', 'entity', '', true, config.entity_min, 'entity_min', 'input_number')}
                </div>
                <div class="form-group">
                    ${renderField('entity_max', 'Max Entity', 'entity', '', true, config.entity_max, 'entity_max', 'input_number')}
                </div>
            </div>

            <div class="grid-container">
                <div class="form-group">
                    ${renderField('min', 'Slider Min', 'number', '0', false, config.min, 'min')}
                </div>
                <div class="form-group">
                    ${renderField('max', 'Slider Max', 'number', '100', false, config.max, 'max')}
                </div>
                <div class="form-group">
                    ${renderField('step', 'Step', 'number', '1', false, config.step, 'step')}
                </div>
                <div class="form-group">
                    ${renderField('unit', 'Unit', 'text', 'e.g., °C, %', false, config.unit, 'unit')}
                </div>
            </div>
        </div>
    `;
  }

  // --- Event Handling ---

  /**
   * Handles changes in the editor form inputs.
   * Updates the internal configuration and fires the 'config-changed' event.
   * @param {Event} ev - The input or value-changed event.
   */
  _valueChanged(ev) {
    // Prevent event processing if config is not set
    if (!this._config) return;

    const target = ev.target;
    // Determine the configuration key associated with the input element
    const key = target.configValue || target.dataset?.configKey;

    if (!key) {
        console.warn("RangeSliderCardEditor: Could not determine config key for input:", target);
        return;
    }

    // Extract the value from the event or target element
    let value = ev.detail?.value ?? target.value; // Use nullish coalescing

    // Determine the input type for proper value conversion
    const inputType = target.type || (target.tagName === 'HA-ENTITY-PICKER' ? 'entity' : 'text');

    // Convert value based on type
    if (inputType === 'number') {
        // Convert to number, treat empty string as undefined (to remove from config)
        value = (value === '' || value === null) ? undefined : Number(value);
    } else if (value === '') {
        // Treat empty strings in text/entity fields as undefined (optional fields)
        value = undefined;
    }

    // Update the configuration only if the value has actually changed
    if (this._config[key] !== value) {
        // Create a new configuration object incorporating the change
        const newConfig = { ...this._config, [key]: value };

        // Filter out keys with undefined or null values before firing the event
        const updatedConfig = Object.fromEntries(
            Object.entries(newConfig).filter(([_, v]) => v !== undefined && v !== null)
        );

        // Dispatch the 'config-changed' event required by Lovelace UI editor
        const event = new CustomEvent("config-changed", {
            detail: { config: updatedConfig },
            bubbles: true, // Allow event to bubble up through the DOM
            composed: true, // Allow event to cross Shadow DOM boundaries
        });
        this.dispatchEvent(event);
    }
  }
}
// Define the custom element for the editor
customElements.define('range-slider-card-editor', RangeSliderCardEditor);


// ====================================================================================


/**
 * RangeSliderCard Class: The main custom card element.
 * Displays a range slider linked to two input_number entities.
 */
class RangeSliderCard extends HTMLElement {

  // Define default configuration values
  static get defaultConfig() {
    return {
      name: 'Range Slider',
      min: 0,
      max: 100,
      step: 1,
      unit: '',
    };
  }

  constructor() {
    super();
    // Initialize Shadow DOM
    this.attachShadow({ mode: 'open' });
    // Initialize internal state properties
    this._hass = undefined;
    this.config = undefined;
    this._sliderInstance = null; // To hold the noUiSlider instance
    this._updateTimeout = null; // For debouncing hass updates
    this.isUpdating = false; // Flag to prevent updates during user interaction
    this._isRendering = false; // Flag to prevent concurrent rendering calls
    this._isSliderSetup = false; // Flag to track if slider DOM is ready
  }

  // --- Standard Custom Element Lifecycle Callbacks ---

  connectedCallback() {
    // Render the card if configuration is already set
    // setConfig is usually called before connectedCallback by Lovelace
    if (this.config) {
      this._render();
    }
  }

  disconnectedCallback() {
    // Clean up resources when the element is removed from the DOM
    // Clear any pending update timeouts
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = null;
    }
    // Destroy the noUiSlider instance to free resources and remove listeners
    this._destroySlider();
    console.log("RangeSliderCard disconnected and cleaned up.");
  }

  // --- Properties Set by Lovelace ---

  /**
   * Sets the card's configuration. Called by Lovelace.
   * @param {object} config - The card configuration object.
   */
  setConfig(config) {
    // Validate required configuration fields
    if (!config.entity_min || !config.entity_max) {
      throw new Error("Configuration requires 'entity_min' and 'entity_max'.");
    }

    // Merge provided config with defaults
    this.config = {
      ...RangeSliderCard.defaultConfig, // Apply defaults first
      ...config, // Override with user config
    };

    // Validate slider min/max relationship
    if (Number(this.config.min) >= Number(this.config.max)) {
      console.warn(`RangeSliderCard (${this.config.name}): 'min' (${this.config.min}) should be strictly less than 'max' (${this.config.max}). Adjusting slider range.`);
      // Adjust internally if needed, or rely on noUiSlider handling
    }

    // Trigger a render if the element is already connected
    if (this.isConnected) {
      this._render();
    }
  }

  /**
   * Sets the Home Assistant object. Called by Lovelace whenever state changes.
   * @param {object} hass - The Home Assistant state object.
   */
  set hass(hass) {
    // Store the previous hass object for comparison
    const oldHass = this._hass;
    // Store the new hass object
    this._hass = hass;

    // Check if an update is needed based on relevant state changes
    // Also ensure the card is rendered and config is set
    if (this.shadowRoot?.childElementCount > 0 && this.config && this._shouldUpdate(oldHass)) {
      // Debounce rendering to avoid excessive updates on frequent state changes
      clearTimeout(this._updateTimeout);
      this._updateTimeout = setTimeout(() => {
        // Only render if not currently being updated by user interaction
        if (!this.isUpdating) {
          this._render();
        }
      }, 150); // 150ms debounce interval
    }
  }

  // --- Update Logic ---

  /**
   * Determines if a re-render is necessary based on relevant state changes.
   * @param {object | undefined} oldHass - The previous Home Assistant state object.
   * @returns {boolean} - True if an update is needed, false otherwise.
   */
  _shouldUpdate(oldHass) {
    // Don't update if hass or config is missing
    if (!this._hass || !this.config) return false;
    // Always update if oldHass wasn't set (first time hass is received)
    if (!oldHass) return true;

    const { entity_min, entity_max } = this.config;

    // Check if the state strings of the configured entities have changed
    const oldStateMin = oldHass.states[entity_min]?.state;
    const newStateMin = this._hass.states[entity_min]?.state;
    const oldStateMax = oldHass.states[entity_max]?.state;
    const newStateMax = this._hass.states[entity_max]?.state;

    return oldStateMin !== newStateMin || oldStateMax !== newStateMax;
  }

  // --- Rendering Logic ---

  /**
   * Renders the card's content (HTML structure and slider).
   * Uses async/await for library loading.
   */
  async _render() {
    // Prevent concurrent rendering calls
    if (this._isRendering) return;
    this._isRendering = true;

    // Ensure config and hass are available
    if (!this.config || !this._hass) {
      console.warn("RangeSliderCard: Render aborted, config or hass not available.");
      this._isRendering = false;
      return;
    }

    try {
      // Get current states and values
      const { entity_min, entity_max, name, unit } = this.config;
      const stateMinObj = this._hass.states[entity_min];
      const stateMaxObj = this._hass.states[entity_max];

      // Validate entity existence
      if (!stateMinObj || !stateMaxObj) {
        this._showError(`Entities not found: ${entity_min || '?'}, ${entity_max || '?'}`);
        this._isRendering = false;
        return;
      }

      // Parse state values
      const valueMin = parseFloat(stateMinObj.state);
      const valueMax = parseFloat(stateMaxObj.state);

      // Validate state values
      if (isNaN(valueMin) || isNaN(valueMax)) {
        this._showError(`Invalid states: ${entity_min} (${stateMinObj.state}), ${entity_max} (${stateMaxObj.state})`);
        this._isRendering = false;
        return;
      }

      // Set up the basic HTML structure if it doesn't exist yet
      if (!this._isSliderSetup) {
        this._setupCardStructure();
      }

      // Update dynamic text content (title, values)
      this._updateTextContent(name, valueMin, valueMax, unit);

      // Get the slider container element
      const sliderElement = this.shadowRoot?.getElementById('slider');
      if (!sliderElement) {
        console.error("RangeSliderCard: Slider element not found in Shadow DOM.");
        this._isRendering = false;
        return; // Exit if slider element isn't found
      }

      // Load the noUiSlider library
      const noUiSlider = await this._loadNoUiSlider();
      if (!noUiSlider) {
        this._showError("Error loading slider library.");
        this._isRendering = false;
        return; // Exit if library failed to load
      }

      // Initialize or update the slider instance
      this._initializeOrUpdateSlider(sliderElement, noUiSlider, valueMin, valueMax);

    } catch (error) {
      console.error("RangeSliderCard: Error during render:", error);
      this._showError(`Render error: ${error.message}`);
    } finally {
      this._isRendering = false; // Release render lock
    }
  }

  /**
   * Sets up the initial HTML structure and CSS of the card.
   */
  _setupCardStructure() {
    if (!this.shadowRoot) return;
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
        .card-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
        .title {
            font-size: var(--ha-card-header-font-size, 1.2em); /* Adjusted default */
            font-weight: var(--ha-card-header-font-weight, normal);
            color: var(--primary-text-color); margin: 0; padding-bottom: 8px;
            align-self: flex-start; white-space: nowrap; overflow: hidden;
            text-overflow: ellipsis; max-width: 100%;
        }
        .slider-container {
            display: flex; flex-direction: column; align-items: center;
            width: 100%; margin-top: 8px; padding: 0 10px; /* Increased padding */
            box-sizing: border-box;
        }
        .slider { width: 100%; margin: 20px 0; }
        .values {
            display: flex; justify-content: space-between; width: 100%;
            font-size: 0.9em; color: var(--secondary-text-color); padding: 0 5px;
            margin-top: 8px;
        }
        /* noUiSlider styling using HA variables */
        .noUi-target {
            background: var(--paper-slider-container-color, #e0e0e0);
            border-radius: 4px; border: none; box-shadow: none; height: 4px;
        }
        .noUi-connect { background: var(--paper-slider-active-color, var(--primary-color)); border-radius: 4px; }
        .noUi-connects { border-radius: 4px; }
        .noUi-handle {
            background: var(--paper-slider-knob-color, var(--primary-color));
            border: 2px solid var(--paper-slider-knob-start-color, var(--paper-slider-knob-color, var(--primary-color))); /* Use start color if available */
            border-radius: 50%; box-shadow: var(--ha-elevation-1);
            height: 20px; width: 20px; top: -9px; /* Adjusted */
            cursor: pointer; box-sizing: border-box;
            /* Prevent default browser outline on focus, use custom shadow */
            outline: none;
        }
        .noUi-handle:focus, .noUi-handle:active { /* Style for focus and active states */
            box-shadow: 0 0 0 3px var(--paper-slider-pin-color, var(--primary-color));
            border-color: var(--paper-slider-knob-active-color, var(--paper-slider-knob-color, var(--primary-color))); /* Use active color */
        }
        .noUi-handle:active { transform: scale(1.1); }
        .noUi-handle-lower { z-index: 1; }
        .noUi-handle-upper { z-index: 2; }
        .noUi-tooltip { display: none; }
      </style>
      <ha-card>
        <div class="title" title=""></div>
        <div class="card-content">
            <div class="slider-container">
                <div class="slider" id="slider"></div>
                <div class="values">
                  <span id="min-value"></span>
                  <span id="max-value"></span>
                </div>
            </div>
        </div>
      </ha-card>
    `;
    this._isSliderSetup = true; // Mark structure as ready
  }

  /**
   * Updates the dynamic text elements (title, min/max values).
   */
  _updateTextContent(name, valueMin, valueMax, unit) {
      const titleElem = this.shadowRoot?.querySelector('.title');
      const minSpan = this.shadowRoot?.getElementById('min-value');
      const maxSpan = this.shadowRoot?.getElementById('max-value');

      if (titleElem && titleElem.textContent !== name) {
          titleElem.textContent = name;
          titleElem.title = name; // Update tooltip
      }
      if (minSpan) {
          minSpan.textContent = `Min: ${valueMin.toFixed(1)}${unit}`;
      }
      if (maxSpan) {
          maxSpan.textContent = `Max: ${valueMax.toFixed(1)}${unit}`;
      }
  }

  /**
   * Displays an error message within the card.
   * @param {string} message - The error message to display.
   */
  _showError(message) {
    if (!this.shadowRoot) return;
    // Ensure ha-card exists or add it
    let card = this.shadowRoot.querySelector('ha-card');
    if (!card) {
        this.shadowRoot.innerHTML = `<style>:host { display: block; }</style><ha-card></ha-card>`;
        card = this.shadowRoot.querySelector('ha-card');
    }
     // Display error inside the card
    card.innerHTML = `<hui-warning style="margin: 16px;">${message}</hui-warning>`;
    this._isSliderSetup = false; // Reset setup flag on error
  }

  // --- Slider Initialization and Interaction ---

  /**
   * Initializes the noUiSlider instance or updates the existing one.
   * @param {HTMLElement} sliderElement - The DOM element for the slider.
   * @param {object} noUiSlider - The noUiSlider library object.
   * @param {number} valueMin - The current minimum value from HA state.
   * @param {number} valueMax - The current maximum value from HA state.
   */
  _initializeOrUpdateSlider(sliderElement, noUiSlider, valueMin, valueMax) {
    const { min, max, step } = this.config;

    // Define slider options based on config
    const sliderOptions = {
        range: { min: Number(min), max: Number(max) },
        step: Number(step),
    };

    if (!this._sliderInstance) {
      // --- Create Slider ---
      try {
        // Define initial creation options
        const createOptions = {
            ...sliderOptions,
            start: [valueMin, valueMax],
            connect: true,
            behaviour: 'tap-drag',
            format: { to: v => v, from: v => Number(v) },
            margin: Number(step) > 0 ? Number(step) : 1, // Prevent handles overlapping
            limit: (Number(max) - Number(min)) > 0 ? (Number(max) - Number(min)) : undefined,
        };

        // Destroy any residual instance before creating anew
        if (sliderElement.noUiSlider) sliderElement.noUiSlider.destroy();

        // Create the slider
        this._sliderInstance = noUiSlider.create(sliderElement, createOptions);

        // Attach event listeners
        this._attachSliderListeners();
        console.log(`RangeSliderCard (${this.config.name}): Slider created.`);

      } catch (error) {
        console.error("RangeSliderCard: Error creating slider:", error);
        this._showError(`Slider creation error: ${error.message}`);
        this._sliderInstance = null; // Ensure instance is null on error
      }
    } else {
      // --- Update Existing Slider ---
      try {
        const currentOptions = this._sliderInstance.options;
        // Check if range or step options need updating
        const optionsChanged = currentOptions.range.min !== sliderOptions.range.min ||
                               currentOptions.range.max !== sliderOptions.range.max ||
                               currentOptions.step !== sliderOptions.step;

        if (optionsChanged) {
          // Update slider options (range, step)
          this._sliderInstance.updateOptions(sliderOptions, false); // false = don't fire events
          console.log(`RangeSliderCard (${this.config.name}): Slider options updated.`);
        }

        // Always update handle positions to reflect current HA state, unless user is dragging
        // This handles external state changes correctly.
        if (!this.isUpdating) {
           const currentHandles = this._sliderInstance.get();
           if (Number(currentHandles[0]) !== valueMin || Number(currentHandles[1]) !== valueMax) {
               this._sliderInstance.set([valueMin, valueMax], false); // false = don't fire events
               // console.log(`RangeSliderCard (${this.config.name}): Slider handles set to [${valueMin}, ${valueMax}].`);
           }
        }
      } catch (error) {
        console.error("RangeSliderCard: Error updating slider:", error);
        // If update fails, consider destroying and recreating on next render
        this._destroySlider();
        this._showError(`Slider update error: ${error.message}`);
      }
    }
  }

  /**
   * Attaches event listeners to the noUiSlider instance.
   */
  _attachSliderListeners() {
    if (!this._sliderInstance) return;

    // Use namespaced events for easier removal if needed (though destroy should handle it)
    this._sliderInstance.on('start.RangeSliderCard', () => { this.isUpdating = true; });
    // 'update' is too frequent for text updates, use 'slide' instead for real-time feedback during drag
    this._sliderInstance.on('slide.RangeSliderCard', (values) => this._updateValueDisplay(values));
    this._sliderInstance.on('change.RangeSliderCard', (values) => this._handleValueChange(values));
    this._sliderInstance.on('end.RangeSliderCard', () => { this.isUpdating = false; });
  }

  /**
   * Destroys the noUiSlider instance and clears the reference.
   */
  _destroySlider() {
    if (this._sliderInstance) {
      try {
        this._sliderInstance.destroy();
      } catch (error) {
        console.warn("RangeSliderCard: Error destroying slider instance:", error);
      } finally {
        this._sliderInstance = null;
        this._isSliderSetup = false; // Requires structure rebuild if rendered again
        console.log(`RangeSliderCard (${this.config?.name || 'Unknown'}): Slider instance destroyed.`);
      }
    }
  }

  /**
   * Updates the Min/Max text display based on slider values.
   * @param {string[]} values - Array containing the current slider values as strings.
   */
  _updateValueDisplay(values) {
    const { unit } = this.config;
    // Use optional chaining for safety
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('display', 'block'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('display', 'block'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('visibility', 'visible'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('visibility', 'visible'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('opacity', '1'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('opacity', '1'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('color', 'var(--secondary-text-color)'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('color', 'var(--secondary-text-color)'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('font-size', '0.9em'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('font-size', '0.9em'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('margin-top', '8px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('margin-top', '8px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('padding', '0 5px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('padding', '0 5px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('width', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('width', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-align', 'left'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-align', 'right'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('flex-grow', '1'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('flex-grow', '1'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('white-space', 'nowrap'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('white-space', 'nowrap'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('overflow', 'hidden'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('overflow', 'hidden'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-overflow', 'ellipsis'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-overflow', 'ellipsis'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('max-width', '50%'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('max-width', '50%'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('min-width', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('min-width', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('flex-basis', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('flex-basis', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('flex-shrink', '1'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('flex-shrink', '1'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('order', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('order', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('align-self', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('align-self', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('justify-self', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('justify-self', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('grid-column-start', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('grid-column-start', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('grid-column-end', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('grid-column-end', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('grid-row-start', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('grid-row-start', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('grid-row-end', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('grid-row-end', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('grid-area', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('grid-area', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('margin', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('margin', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('padding', '0 5px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('padding', '0 5px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('border', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('border', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('background', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('background', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('box-shadow', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('box-shadow', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('border-radius', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('border-radius', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('outline', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('outline', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('cursor', 'default'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('cursor', 'default'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('line-height', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('line-height', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-transform', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-transform', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('letter-spacing', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('letter-spacing', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('word-spacing', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('word-spacing', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-indent', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-indent', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-shadow', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-shadow', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('font-variant', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('font-variant', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('font-weight', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('font-weight', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('font-style', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('font-style', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('font-family', 'inherit'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('font-family', 'inherit'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('vertical-align', 'baseline'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('vertical-align', 'baseline'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('text-decoration', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('text-decoration', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('user-select', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('user-select', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('pointer-events', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('pointer-events', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('visibility', 'visible'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('visibility', 'visible'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('opacity', '1'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('opacity', '1'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('transition', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('transition', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('animation', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('animation', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('transform', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('transform', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('transform-origin', '50% 50%'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('transform-origin', '50% 50%'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('will-change', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('will-change', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('contain', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('contain', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('content', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('content', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('counter-increment', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('counter-increment', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('counter-reset', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('counter-reset', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('quotes', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('quotes', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('clip-path', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('clip-path', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('backdrop-filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('backdrop-filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-image', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-image', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-mode', 'match-source'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-mode', 'match-source'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-repeat', 'repeat'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-repeat', 'repeat'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-position', '0% 0%'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-position', '0% 0%'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-clip', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-clip', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-origin', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-origin', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-size', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-size', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-composite', 'add'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-composite', 'add'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-type', 'luminance'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-type', 'luminance'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-outside', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-outside', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-image-threshold', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-image-threshold', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-behavior', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-behavior', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-snap-type', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-snap-type', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-snap-align', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-snap-align', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-padding', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-padding', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('touch-action', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('touch-action', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('will-change', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('will-change', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('contain', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('contain', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('content', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('content', 'normal'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('counter-increment', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('counter-increment', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('counter-reset', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('counter-reset', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('quotes', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('quotes', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('clip-path', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('clip-path', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('backdrop-filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('backdrop-filter', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-image', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-image', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-mode', 'match-source'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-mode', 'match-source'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-repeat', 'repeat'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-repeat', 'repeat'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-position', '0% 0%'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-position', '0% 0%'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-clip', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-clip', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-origin', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-origin', 'border-box'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-size', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-size', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-composite', 'add'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-composite', 'add'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('mask-type', 'luminance'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('mask-type', 'luminance'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-outside', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-outside', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('shape-image-threshold', '0'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('shape-image-threshold', '0'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-behavior', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-behavior', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-snap-type', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-snap-type', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-snap-align', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-snap-align', 'none'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-padding', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-padding', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('scroll-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('scroll-margin', '0px'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.style.setProperty('touch-action', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('max-value')?.style.setProperty('touch-action', 'auto'); // Ensure visible
    this.shadowRoot?.getElementById('min-value')?.textContent = `Min: ${parseFloat(values[0]).toFixed(1)}${unit}`;
    this.shadowRoot?.getElementById('max-value')?.textContent = `Max: ${parseFloat(values[1]).toFixed(1)}${unit}`;
  }

  /**
   * Handles the 'change' event from the slider.
   * Calls the input_number.set_value service if the value has changed significantly.
   * @param {string[]} values - Array containing the final slider values as strings.
   */
  _handleValueChange(values) {
    // Get config and current states safely
    const { entity_min, entity_max, step = 1 } = this.config || {};
    const currentMinState = this._hass?.states[entity_min]?.state;
    const currentMaxState = this._hass?.states[entity_max]?.state;

    // Ensure all required data is available
    if (entity_min === undefined || entity_max === undefined || currentMinState === undefined || currentMaxState === undefined) {
      console.warn("RangeSliderCard: Cannot handle value change, missing entity or state.");
      return;
    }

    // Parse new values
    const newMinValue = parseFloat(values[0]);
    const newMaxValue = parseFloat(values[1]);

    // Define a threshold for change based on step size (avoid floating point issues)
    const threshold = Number(step) / 2;

    // Call service for min value if changed significantly
    if (Math.abs(newMinValue - parseFloat(currentMinState)) >= threshold) {
      this._callSetValueService(entity_min, newMinValue);
    }

    // Call service for max value if changed significantly
    if (Math.abs(newMaxValue - parseFloat(currentMaxState)) >= threshold) {
      this._callSetValueService(entity_max, newMaxValue);
    }
  }

  /**
   * Calls the input_number.set_value service for a given entity.
   * @param {string} entityId - The entity_id of the input_number.
   * @param {number} value - The new value to set.
   */
  _callSetValueService(entityId, value) {
    if (!this._hass || !entityId) return;
    this._hass.callService('input_number', 'set_value', {
      entity_id: entityId,
      value: value,
    }).catch(error => {
      console.error(`RangeSliderCard: Error calling set_value for ${entityId}:`, error);
      // Optionally show an error to the user
      // this._showError(`Error setting ${entityId}`);
    });
  }


  // --- Library Loading ---

  /**
   * Loads the noUiSlider library dynamically from CDN.
   * Includes basic caching and error handling.
   * @returns {Promise<object|null>} - A promise resolving to the noUiSlider object or null on failure.
   */
  async _loadNoUiSlider() {
    // Return immediately if already loaded
    if (window.noUiSlider) return window.noUiSlider;
    // Return immediately if already loading (prevent duplicate loads)
    if (window._noUiSliderLoading) return window._noUiSliderLoading;

    // Create a promise to handle loading
    window._noUiSliderLoading = new Promise((resolve, reject) => {
      // Check if script tag already exists (e.g., added by another card)
      const existingScript = document.querySelector('script[src*="nouislider.min.js"]');

      if (existingScript) {
        // If script exists, poll for window.noUiSlider to be defined
        const timeout = setTimeout(() => {
            console.error("RangeSliderCard: Timeout waiting for existing noUiSlider script.");
            delete window._noUiSliderLoading; // Clear loading flag
            reject(new Error("Timeout loading noUiSlider"));
        }, 5000); // 5 second timeout

        const checkInterval = setInterval(() => {
          if (window.noUiSlider) {
            clearInterval(checkInterval);
            clearTimeout(timeout);
            console.log("RangeSliderCard: Reused existing noUiSlider library.");
            delete window._noUiSliderLoading; // Clear loading flag
            resolve(window.noUiSlider);
          }
        }, 100); // Check every 100ms
      } else {
        // If script doesn't exist, create and append it
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.js";
        script.async = true;
        script.onload = () => {
          console.log("RangeSliderCard: noUiSlider library loaded successfully.");
          delete window._noUiSliderLoading; // Clear loading flag
          resolve(window.noUiSlider);
        };
        script.onerror = (err) => {
          console.error("RangeSliderCard: Failed to load noUiSlider library from CDN.", err);
          delete window._noUiSliderLoading; // Clear loading flag
          reject(new Error("Failed to load noUiSlider library."));
        };
        document.head.appendChild(script);
      }
    }).catch(error => {
        delete window._noUiSliderLoading; // Ensure flag is cleared on error too
        return null; // Return null on failure
    });

    return window._noUiSliderLoading;
  }

  // --- Lovelace UI Configuration Methods ---

  /**
   * Static method called by Lovelace UI to get the configuration editor element.
   * @returns {HTMLElement} - An instance of the RangeSliderCardEditor.
   */
  static getConfigElement() {
    // Ensure the editor element is defined before creating it
    if (!customElements.get('range-slider-card-editor')) {
        console.error("RangeSliderCard: Editor element 'range-slider-card-editor' is not defined!");
        // Return a placeholder or throw an error
        const errorElement = document.createElement('div');
        errorElement.textContent = "Error: Card editor element not found.";
        errorElement.style.color = 'red';
        return errorElement;
    }
    return document.createElement('range-slider-card-editor');
  }

  /**
   * Static method called by Lovelace UI to get a default configuration stub when adding the card.
   * @returns {object} - A default configuration object.
   */
  static getStubConfig() {
    // Provide a basic structure with placeholders
    return {
      entity_min: 'input_number.min_value_entity', // Use descriptive placeholders
      entity_max: 'input_number.max_value_entity',
      name: 'My Range Slider'
      // Other options (min, max, step, unit) will use defaults from defaultConfig
    };
  }

  /**
   * Optional method that tells Lovelace the card's height in grid units.
   * @returns {number} - The height of the card.
   */
  getCardSize() {
    // A height of 2 seems appropriate for this card layout
    return 2;
  }
}

// Define the custom element for the main card
customElements.define('range-slider-card', RangeSliderCard);

// Optional: Add card to the Lovelace card picker for easier discovery
// This requires the card to be loaded as a Lovelace resource (e.g., through HACS or configuration.yaml)
window.customCards = window.customCards || [];
window.customCards.push({
  type: "range-slider-card",
  name: "Range Slider Card",
  description: "A card displaying a range slider linked to two input_number entities.",
  preview: true, // Enable preview in card picker
});
