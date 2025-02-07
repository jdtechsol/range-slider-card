class RangeSliderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._updateTimeout = null; // Timer per ritardare l'aggiornamento
    this.isUpdating = false; // Flag per evitare aggiornamenti mentre l'utente interagisce
  }

  setConfig(config) {
    if (!config.entity_min || !config.entity_max) {
      throw new Error("You need to define 'entity_min' and 'entity_max'");
    }
    this.config = config;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    clearTimeout(this._updateTimeout);
  }

  set hass(hass) {
    this._hass = hass;
    
    clearTimeout(this._updateTimeout);
    this._updateTimeout = setTimeout(() => {
      if (this.shadowRoot && !this.isUpdating) {
        this.render();
      }
    }, 500);
  }

  async render() {
    const { entity_min, entity_max, min = 0, max = 100, step = 1, name = 'Range Slider', unit = '' } = this.config;
    const stateMin = this._hass.states[entity_min];
    const stateMax = this._hass.states[entity_max];

    if (!stateMin || !stateMax) {
      this.shadowRoot.innerHTML = `<p>Entities not found</p>`;
      return;
    }

    const valueMin = parseFloat(stateMin.state);
    const valueMax = parseFloat(stateMax.state);

    if (isNaN(valueMin) || isNaN(valueMax)) {
      this.shadowRoot.innerHTML = `<p>Invalid entity state</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.css";
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
        }
        .slider {
          width: 90%;
          margin: 8px 0;
        }
        .values {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.9rem;
        }
        .title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 8px;
        }
      </style>
      <div class="container">
        <div class="title">${name}</div>
        <div class="slider" id="slider"></div>
        <div class="values">
          <span id="min-value">Min: ${Math.round(valueMin)}${unit}</span>
          <span id="max-value">Max: ${Math.round(valueMax)}${unit}</span>
        </div>
      </div>
    `;

    const slider = this.shadowRoot.getElementById('slider');
    const noUiSlider = await this.loadNoUiSlider();

    noUiSlider.create(slider, {
      start: [valueMin, valueMax],
      connect: true,
      range: {
        min: min,
        max: max,
      },
      step: step,
    });

    slider.noUiSlider.on('start', () => {
      this.isUpdating = true;
    });

    slider.noUiSlider.on('update', (values) => {
      this.shadowRoot.getElementById('min-value').textContent = `Min: ${Math.round(values[0])}${unit}`;
      this.shadowRoot.getElementById('max-value').textContent = `Max: ${Math.round(values[1])}${unit}`;
    });

    slider.noUiSlider.on('change', (values) => {
      this.isUpdating = false;
      
      this._hass.callService('input_number', 'set_value', {
        entity_id: entity_min,
        value: parseFloat(values[0]),
      });

      this._hass.callService('input_number', 'set_value', {
        entity_id: entity_max,
        value: parseFloat(values[1]),
      });
    });

    slider.noUiSlider.on('end', () => {
      this.isUpdating = false;
    });
  }

  async loadNoUiSlider() {
    if (!window.noUiSlider) {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.js";
        script.onload = () => resolve(window.noUiSlider);
        document.head.appendChild(script);
      });
    }
    return window.noUiSlider;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define('range-slider-card', RangeSliderCard);