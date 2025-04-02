// Define the class for the configuration editor element
class RangeSliderCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {}; // Initialize config object
  }

  // Called by Lovelace UI editor to set the current configuration
  setConfig(config) {
    this._config = config;
    this.render(); // Re-render the editor with the current config values
  }

  // Render the editor's HTML form
  connectedCallback() {
      this.render();
  }

  render() {
      if (!this.shadowRoot) return; // Exit if shadowRoot is not available yet

      // Define the HTML structure for the editor form
      this.shadowRoot.innerHTML = `
          <style>
              /* Basic styling for the editor form elements */
              .form-group {
                  margin-bottom: 12px;
                  display: flex;
                  flex-direction: column; /* Stack label and input vertically */
              }
              label {
                  font-weight: bold;
                  margin-bottom: 4px;
                  color: var(--primary-text-color);
              }
              input[type="text"],
              input[type="number"],
              select { /* Basic HA-like styling for inputs */
                  padding: 8px;
                  border-radius: var(--ha-card-border-radius, 4px);
                  border: 1px solid var(--divider-color);
                  background-color: var(--input-fill-color, var(--secondary-background-color));
                  color: var(--primary-text-color);
                  box-sizing: border-box; /* Include padding and border in element's total width/height */
                  width: 100%; /* Make inputs take full width */
              }
              input:focus {
                  outline: none;
                  border-color: var(--primary-color);
              }
              .grid-container { /* Use grid for side-by-side layout */
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Responsive grid */
                  gap: 12px; /* Space between grid items */
              }
          </style>
          <div class="form">
              <div class="form-group">
                  <label for="name">Name (Optional):</label>
                  <input type="text" id="name" .value="${this._config.name || ''}" @input="${this._valueChanged}">
              </div>

              <div class="grid-container">
                  <div class="form-group">
                      <label for="entity_min">Min Entity (Required):</label>
                      <input type="text" id="entity_min" .value="${this._config.entity_min || ''}" @input="${this._valueChanged}" required>
                  </div>
                  <div class="form-group">
                      <label for="entity_max">Max Entity (Required):</label>
                      <input type="text" id="entity_max" .value="${this._config.entity_max || ''}" @input="${this._valueChanged}" required>
                  </div>
              </div>

              <div class="grid-container">
                  <div class="form-group">
                      <label for="min">Slider Min (Optional):</label>
                      <input type="number" id="min" .value="${this._config.min === undefined ? '' : this._config.min}" @input="${this._valueChanged}" placeholder="0">
                  </div>
                  <div class="form-group">
                      <label for="max">Slider Max (Optional):</label>
                      <input type="number" id="max" .value="${this._config.max === undefined ? '' : this._config.max}" @input="${this._valueChanged}" placeholder="100">
                  </div>
                  <div class="form-group">
                      <label for="step">Step (Optional):</label>
                      <input type="number" id="step" .value="${this._config.step === undefined ? '' : this._config.step}" @input="${this._valueChanged}" placeholder="1">
                  </div>
                  <div class="form-group">
                      <label for="unit">Unit (Optional):</label>
                      <input type="text" id="unit" .value="${this._config.unit || ''}" @input="${this._valueChanged}">
                  </div>
              </div>
          </div>
      `;

      // Add event listeners after rendering (alternative to @input in template)
      // this.shadowRoot.querySelectorAll('input').forEach(input => {
      //    input.addEventListener('input', (ev) => this._valueChanged(ev));
      // });
  }

  // Called when any input value changes
  _valueChanged(ev) {
      if (!this._config) return; // Exit if config is not set

      const target = ev.target;
      const key = target.id;
      let value = target.value;

      // Handle type conversions or specific logic
      if (target.type === 'number') {
          value = value === '' ? undefined : Number(value); // Convert empty string to undefined for numbers
      }

      // Update the internal config object
      // Only update if the value actually changed
      if (this._config[key] !== value) {
          this._config = {
              ...this._config,
              [key]: value,
          };

          // Remove undefined values from config before firing event
          const updatedConfig = Object.fromEntries(
              Object.entries(this._config).filter(([_, v]) => v !== undefined)
          );


          // Fire an event to notify Lovelace UI that the configuration has changed
          const event = new CustomEvent("config-changed", {
              detail: { config: updatedConfig },
              bubbles: true, // Allow event to bubble up
              composed: true, // Allow event to cross Shadow DOM boundaries
          });
          this.dispatchEvent(event);
      }
  }
}
// Define the custom element for the editor
customElements.define('range-slider-card-editor', RangeSliderCardEditor);


// --- Main RangeSliderCard Class ---

// Define the class for the RangeSliderCard, inheriting from HTMLElement
class RangeSliderCard extends HTMLElement {

  constructor() {
    super(); // Call the parent class constructor (HTMLElement)
    this.attachShadow({ mode: 'open' }); // Create a Shadow DOM to encapsulate styles and structure
    this._updateTimeout = null; // Variable to hold the timeout ID for debouncing updates
    this.isUpdating = false; // Flag to indicate if the user is interacting with the slider (prevents unwanted updates)
  }

  // --- Lovelace Card Lifecycle Methods ---

  // Method called by Home Assistant to pass the card configuration (defined in Lovelace UI or YAML)
  setConfig(config) {
    // Essential validation: check if minimum and maximum entities are defined
    if (!config.entity_min || !config.entity_max) {
      throw new Error("You need to define 'entity_min' and 'entity_max' in the card configuration."); // Improved error message
    }
    // Add validation for min < max if both are provided
    if (config.min !== undefined && config.max !== undefined && config.min >= config.max) {
        console.warn("RangeSliderCard: 'min' value should be less than 'max' value in configuration.");
        // Optionally throw an error or just proceed
    }

    this.config = config; // Store the configuration

    // Re-render if the card is already connected to the DOM
    if (this.shadowRoot) {
        this.render();
    }
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    // Render only if config is set (setConfig is called before connectedCallback)
    if (this.config) {
        this.render();
    }
  }

  // Called when the element is removed from the DOM
  disconnectedCallback() {
    // Clear the update timeout if it exists
    if (this._updateTimeout) {
        clearTimeout(this._updateTimeout);
        this._updateTimeout = null;
    }
    // Destroy the slider instance if it exists to prevent memory leaks
    const sliderElement = this.shadowRoot && this.shadowRoot.getElementById('slider');
    if (sliderElement && sliderElement.noUiSlider) {
        try {
            sliderElement.noUiSlider.destroy();
        } catch (e) {
            console.warn("Error destroying slider:", e);
        }
    }
  }

  // Setter called by Home Assistant whenever the state changes
  set hass(hass) {
    const oldHass = this._hass; // Store the previous hass object for comparison
    this._hass = hass; // Store the hass object, containing all Home Assistant states and functions

    // Only re-render if necessary properties have changed or if it's the first time
    // and the card is actually rendered (has shadowRoot content)
    if (this.shadowRoot && this.shadowRoot.childElementCount > 0 && this.shouldUpdate(oldHass)) {
        // Implement debounce (delay) for rendering updates.
        clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => {
          // Only render if the shadowRoot exists and the user is not dragging the slider
          if (this.shadowRoot && !this.isUpdating) {
            this.render();
          }
        }, 150); // 150ms delay
    }
  }

  // Helper function to determine if a re-render is needed based on hass changes
  shouldUpdate(oldHass) {
    if (!this._hass || !this.config) return false; // Don't update if hass or config isn't set
    if (!oldHass) return true; // Always render if oldHass wasn't set (first time hass is set)

    const { entity_min, entity_max } = this.config;
    // Check if the relevant entity states have changed
    return (
        !oldHass.states[entity_min] || // Entity didn't exist before
        !oldHass.states[entity_max] || // Entity didn't exist before
        this._hass.states[entity_min]?.state !== oldHass.states[entity_min]?.state || // Min state changed
        this._hass.states[entity_max]?.state !== oldHass.states[entity_max]?.state   // Max state changed
    );
  }

  // --- Rendering Logic ---

  // Main method to render the card content
  async render() {
    // Exit if config or hass is not yet available
    if (!this.config || !this._hass) {
        return;
    }

    // Destructure the configuration to get options, with default values
    const { entity_min, entity_max, min = 0, max = 100, step = 1, name = 'Range Slider', unit = '' } = this.config;

    // Get the state objects for the minimum and maximum entities
    const stateMin = this._hass.states[entity_min];
    const stateMax = this._hass.states[entity_max];

    // Validation: Check if the entities exist in Home Assistant
    if (!stateMin || !stateMax) {
      this.shadowRoot.innerHTML = `<hui-warning>Entities not found: ${entity_min || '?'}, ${entity_max || '?'}</hui-warning>`; // Use HA's warning element
      return;
    }

    // Convert the states (which are strings) to numbers
    const valueMin = parseFloat(stateMin.state);
    const valueMax = parseFloat(stateMax.state);

    // Validation: Check if the states are valid numbers
    if (isNaN(valueMin) || isNaN(valueMax)) {
      this.shadowRoot.innerHTML = `<hui-warning>Invalid states for entities: ${entity_min} (${stateMin.state}), ${entity_max} (${stateMax.state})</hui-warning>`; // Use HA's warning element
      return;
    }

    // Define the card's HTML and CSS within the Shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        /* Import the base CSS for noUiSlider */
        @import "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.css";
        /* Card specific styles using HA variables */
        :host { display: block; }
        ha-card { /* Style the ha-card element directly */
            display: flex;
            flex-direction: column;
            padding: 16px;
            height: 100%; /* Make card fill its grid space */
            box-sizing: border-box; /* Include padding in height calculation */
            overflow: hidden; /* Prevent content overflow */
        }
        .slider-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            margin-top: 8px;
            flex-grow: 1; /* Allow slider container to grow */
            justify-content: center; /* Center slider vertically */
        }
        .slider {
            width: 100%;
            margin: 15px 0;
        }
        .values {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 0.9em;
            color: var(--secondary-text-color);
            padding: 0 5px;
            margin-top: 8px;
        }
        .title {
            font-size: 1.2em;
            font-weight: normal;
            color: var(--primary-text-color);
            margin: 0;
            padding-bottom: 8px;
            align-self: flex-start;
            white-space: nowrap; /* Prevent title wrapping */
            overflow: hidden;
            text-overflow: ellipsis; /* Add ellipsis if title is too long */
            max-width: 100%; /* Ensure title doesn't overflow card */
        }
        /* Styling noUiSlider elements to match HA theme */
        .noUi-target {
            background: var(--paper-slider-container-color, var(--disabled-text-color));
            border-radius: 4px; border: none; box-shadow: none; height: 4px;
        }
        .noUi-connect {
            background: var(--paper-slider-active-color, var(--primary-color));
            border-radius: 4px;
        }
        .noUi-handle {
            background: var(--paper-slider-knob-color, var(--primary-color));
            border: none; border-radius: 50%;
            box-shadow: var(--ha-elevation-1, 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12));
            height: 20px; width: 20px; top: -8px; right: -10px; cursor: pointer;
        }
        .noUi-handle:focus {
            outline: none;
            box-shadow: 0 0 0 3px var(--paper-slider-pin-color, var(--primary-color));
        }
        .noUi-handle.noUi-handle-lower { /* right: -10px; */ } /* Position adjusted by noUiSlider */
        .noUi-handle.noUi-handle-upper { /* right: -10px; */ }
        .noUi-tooltip { display: none; }
      </style>
      <ha-card>
        <div class="title" title="${name}">${name}</div>
        <div class="slider-container">
            <div class="slider" id="slider"></div>
            <div class="values">
              <span id="min-value">Min: ${valueMin.toFixed(1)}${unit}</span>
              <span id="max-value">Max: ${valueMax.toFixed(1)}${unit}</span>
            </div>
        </div>
      </ha-card>
    `;

    // Get the element where the slider will be created
    const sliderElement = this.shadowRoot.getElementById('slider');

    // Load the noUiSlider library (if not already loaded)
    const noUiSlider = await this.loadNoUiSlider();
    if (!noUiSlider) {
        console.error("Failed to load noUiSlider library.");
        this.shadowRoot.innerHTML = `<hui-warning>Error loading slider library.</hui-warning>`;
        return; // Stop rendering if library failed
    }

    // Check if the slider instance already exists before creating/updating
    if (sliderElement.noUiSlider) {
        // If it exists, update the values and range if they differ
        const currentOptions = sliderElement.noUiSlider.options;
        const needsUpdate = currentOptions.start[0] !== valueMin ||
                            currentOptions.start[1] !== valueMax ||
                            currentOptions.range.min !== min ||
                            currentOptions.range.max !== max;

        if (needsUpdate) {
            try {
                sliderElement.noUiSlider.updateOptions({
                    start: [valueMin, valueMax],
                    range: { min: min, max: max }
                }, false); // 'false' prevents firing update events immediately
            } catch (e) {
                console.error("Error updating slider options:", e);
                // Destroy and recreate if update fails
                sliderElement.noUiSlider.destroy();
                this.createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit);
            }
        } else {
             // Even if options don't need update, ensure handles are at correct positions
             // This handles cases where HA state updates but slider missed it (e.g., during drag)
             sliderElement.noUiSlider.set([valueMin, valueMax], false); // false = don't fire events
        }
    } else {
        // If it doesn't exist, create the slider
        this.createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit);
    }
  }

  // Helper function to create the slider and attach events
  createSlider(sliderElement, noUiSlider, valueMin, valueMax, min, max, step, unit) {
      try {
          // Ensure min is less than max before creating
          const sliderMin = Math.min(min, max - step); // Ensure min is at least one step below max
          const sliderMax = Math.max(max, min + step); // Ensure max is at least one step above min

          noUiSlider.create(sliderElement, {
            start: [valueMin, valueMax],
            connect: true,
            range: { min: sliderMin, max: sliderMax },
            step: step,
            behaviour: 'tap-drag',
            format: { to: v => v, from: v => Number(v) }
          });

          // Attach event listeners with namespace for easy removal
          sliderElement.noUiSlider.on('start.RangeSliderCard', () => { this.isUpdating = true; });

          sliderElement.noUiSlider.on('update.RangeSliderCard', (values) => {
            const minValText = `Min: ${parseFloat(values[0]).toFixed(1)}${unit}`;
            const maxValText = `Max: ${parseFloat(values[1]).toFixed(1)}${unit}`;
            const minSpan = this.shadowRoot.getElementById('min-value');
            const maxSpan = this.shadowRoot.getElementById('max-value');
            if (minSpan) minSpan.textContent = minValText;
            if (maxSpan) maxSpan.textContent = maxValText;
          });

          sliderElement.noUiSlider.on('change.RangeSliderCard', (values) => {
            const currentMinState = this._hass.states[this.config.entity_min]?.state;
            const currentMaxState = this._hass.states[this.config.entity_max]?.state;
            const newMinValue = parseFloat(values[0]);
            const newMaxValue = parseFloat(values[1]);

            // Check threshold before calling service
            if (Math.abs(newMinValue - parseFloat(currentMinState)) >= (step / 2)) {
                this._hass.callService('input_number', 'set_value', { entity_id: this.config.entity_min, value: newMinValue });
            }
            if (Math.abs(newMaxValue - parseFloat(currentMaxState)) >= (step / 2)) {
                this._hass.callService('input_number', 'set_value', { entity_id: this.config.entity_max, value: newMaxValue });
            }
            // Note: isUpdating is reset in 'end' event
          });

          sliderElement.noUiSlider.on('end.RangeSliderCard', () => { this.isUpdating = false; });

      } catch (e) {
          console.error("Error creating slider:", e);
          // Display error within the card's shadow DOM if possible
          if (this.shadowRoot) {
             this.shadowRoot.innerHTML = `<hui-warning>Error creating slider element: ${e.message}</hui-warning>`;
          }
      }
  }

  // --- Library Loading ---

  // Method to dynamically load the noUiSlider library
  async loadNoUiSlider() {
    if (window.noUiSlider) return window.noUiSlider; // Already loaded

    // Check if script tag is already present (might be loading)
    const existingScript = document.querySelector('script[src*="nouislider.min.js"]');
    if (existingScript && !window.noUiSlider) {
        // Wait for the existing script to load
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject("Timeout loading noUiSlider"), 5000);
            const checkInterval = setInterval(() => {
                if (window.noUiSlider) {
                    clearInterval(checkInterval);
                    clearTimeout(timeout);
                    resolve(window.noUiSlider);
                }
            }, 100);
        });
    } else if (!existingScript) {
        // Load the script
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.js";
            script.async = true;
            script.onload = () => resolve(window.noUiSlider);
            script.onerror = () => reject("Failed to load noUiSlider.");
            document.head.appendChild(script);
        });
    }
    // Should not happen, but return null if something went wrong
    return null;
  }

  // --- Lovelace UI Configuration Methods ---

  // Static method called by Lovelace UI to get the configuration editor element
  static getConfigElement() {
    // Return an instance of the editor element we defined earlier
    return document.createElement('range-slider-card-editor');
  }

  // Static method called by Lovelace UI to get a default configuration stub
  static getStubConfig() {
    // Provide a basic structure when adding the card via UI
    return {
      entity_min: 'input_number.min_value', // Placeholder entity
      entity_max: 'input_number.max_value', // Placeholder entity
      name: 'My Range Slider'
      // min, max, step, unit will use defaults defined in render() if not specified
    };
  }

  // Optional method that tells Lovelace the card's height (in grid units)
  getCardSize() {
    // Returns 2, which seems reasonable for this type of card.
    return 2;
  }
}

// Define the custom element for the main card
customElements.define('range-slider-card', RangeSliderCard);

// Optional: Add the card to the Lovelace card picker (requires more setup usually)
// window.customCards = window.customCards || [];
// window.customCards.push({
//   type: "range-slider-card",
//   name: "Range Slider Card",
//   description: "A custom card with a range slider linked to two input_number entities.",
//   preview: true, // Optional: Show a preview in the picker
// });
