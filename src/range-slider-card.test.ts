import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RangeSliderCard } from './range-slider-card';
import { HomeAssistant } from 'custom-card-helpers';

// Mock the customElements.define call
if (!customElements.get('range-slider-card')) {
  customElements.define('range-slider-card', RangeSliderCard);
}

describe('RangeSliderCard', () => {
  let element: RangeSliderCard;
  let hass: HomeAssistant;

  beforeEach(() => {
    // Reset the element and mock hass object before each test
    element = document.createElement('range-slider-card') as RangeSliderCard;
    hass = {
      states: {
        'input_number.min_temp': { entity_id: 'input_number.min_temp', state: '18', attributes: { min: 10, max: 30, step: 1 } },
        'input_number.max_temp': { entity_id: 'input_number.max_temp', state: '22', attributes: { min: 10, max: 30, step: 1 } },
      },
      callService: vi.fn(),
      localize: vi.fn((key) => key), // Simple localize mock
      connection: {} as any, // Mock connection object
      themes: {} as any, // Mock themes object
      selectedTheme: null,
      user: {} as any, // Mock user object
      panelUrl: '',
      language: 'en',
      resources: {} as any,
      translationMetadata: {} as any,
      suspendWhenHidden: false,
      setSuspended: vi.fn(),
      areas: {},
      devices: {},
      entities: {},
      services: {},
      formatEntityState: vi.fn((stateObj) => stateObj.state),
      formatEntityAttributeValue: vi.fn((stateObj, attribute) => stateObj.attributes[attribute]),
      formatEntityAttributeName: vi.fn((stateObj, attribute) => attribute),
    } as unknown as HomeAssistant; // Use unknown first for type safety

    document.body.appendChild(element);
  });

  it('should create the element', () => {
    expect(element).toBeInstanceOf(RangeSliderCard);
  });

  it('should render the card structure when config and hass are set', async () => {
    element.setConfig({
      type: 'custom:range-slider-card',
      entity_min: 'input_number.min_temp',
      entity_max: 'input_number.max_temp',
    });
    element.hass = hass;
    await element.updateComplete; // Wait for lit element to render

    const card = element.shadowRoot?.querySelector('ha-card');
    // Select the slider handles instead of input[type="range"]
    const minHandle = element.shadowRoot?.querySelector('.slider-handle.min-handle');
    const maxHandle = element.shadowRoot?.querySelector('.slider-handle.max-handle');
    const allHandles = element.shadowRoot?.querySelectorAll('.slider-handle');

    expect(card).not.toBeNull();
    expect(minHandle).not.toBeNull(); // Check if min handle exists
    expect(maxHandle).not.toBeNull(); // Check if max handle exists
    // Check if exactly two handles are rendered
    expect(allHandles?.length).toBe(2);
  });

  // Add more tests here:
  // - Test default configuration values
  // - Test different configuration options (title, step, etc.)
  // - Test event handling (slider changes)
  // - Test service calls
  // - Test error handling (missing entities, invalid config)
});
