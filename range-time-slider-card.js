class RangeTimeSliderCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._updateTimeout = null;
    this.isUpdating = false;
  }

  setConfig(config) {
    if (!config.entity_time_min || !config.entity_time_max) {
      throw new Error("You need to define 'entity_time_min' and 'entity_time_max'");
    }
    this.config = config;
  }

  connectedCallback() {
    this.render();
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
    const { entity_time_min, entity_time_max, name = 'Time Range Slider' } = this.config;
    const stateTimeMin = this._hass.states[entity_time_min];
    const stateTimeMax = this._hass.states[entity_time_max];

    if (!stateTimeMin || !stateTimeMax) {
      this.shadowRoot.innerHTML = `<p>Entities not found</p>`;
      return;
    }

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
      const mins = (minutes % 60).toString().padStart(2, '0');
      return `${hours}:${mins}`;
    };
    
    const minMinutes = timeToMinutes(stateTimeMin.state);
    const maxMinutes = timeToMinutes(stateTimeMax.state);

    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.css";
        
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px;
          max-width: 400px;
          margin: auto;
        }
        .slider {
          width: 100%;
          margin: 4px 0;
          height: 50%;
        }
        .values {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.85rem;
          font-family: Arial, sans-serif;
        }
        .title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 8px;
          font-family: Arial, sans-serif;
        }
        .noUi-base {
          height: 4px !important;
          background: #ddd;
          border-radius: 4px;
        }
        .noUi-connect {
          height: 4px !important;
        }
        .noUi-handle {
          width: 14px !important;
          height: 14px !important;
          top: -5px !important;
          right: -5px !important;
          background: #fff;
          border: 2px solid #007bff;
          border-radius: 50%;
        }
        .noUi-handle::before, .noUi-handle::after {
          display: none !important;
        }
      </style>
      <div class="container">
        <div class="title">${name}</div>
        <div class="slider" id="slider"></div>
        <div class="values">
          <span id="min-value">${stateTimeMin.state}</span>
          <span id="max-value">${stateTimeMax.state}</span>
        </div>
      </div>
    `;

    const slider = this.shadowRoot.getElementById('slider');
    const noUiSlider = await this.loadNoUiSlider();

    noUiSlider.create(slider, {
      start: [minMinutes, maxMinutes],
      connect: true,
      range: { min: 0, max: 1440 }, // 24 ore in minuti
      step: 1,
    });

    slider.noUiSlider.on('start', () => {
      this.isUpdating = true;
    });

    slider.noUiSlider.on('update', (values) => {
      this.shadowRoot.getElementById('min-value').textContent = minutesToTime(Math.round(values[0]));
      this.shadowRoot.getElementById('max-value').textContent = minutesToTime(Math.round(values[1]));
    });

    slider.noUiSlider.on('change', (values) => {
      this.isUpdating = false;
      this._hass.callService('input_datetime', 'set_datetime', {
        entity_id: entity_time_min,
        time: minutesToTime(Math.round(values[0])),
      });
      this._hass.callService('input_datetime', 'set_datetime', {
        entity_id: entity_time_max,
        time: minutesToTime(Math.round(values[1])),
      });
    });
  }

  async loadNoUiSlider() {
    if (!window.noUiSlider) {
      await import("https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.0/nouislider.min.js");
    }
    return window.noUiSlider;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('range-time-slider-card', RangeTimeSliderCard);
