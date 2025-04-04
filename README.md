# Range Slider Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

A Lovelace card for Home Assistant that provides an interactive range slider, allowing you to control two `input_number` entities simultaneously for minimum and maximum values.

![Example Screenshot (to be added)](placeholder.png) <!-- Add a screenshot later -->

## Features

*   Control two `input_number` entities (min and max) with one slider.
*   Supports horizontal and vertical orientations.
*   Optional display of current range (max - min).
*   Optional numeric inputs for min/max values.
*   Optional tooltips on handles.
*   Optional marker to show a third entity's value within the range.
*   Supports dynamic min/max/step values from other entities.
*   Read-only mode.
*   Customizable tap, hold, and double-tap actions.
*   Visual editor integration.

## Installation

### HACS (Recommended)

1.  Ensure you have [HACS (Home Assistant Community Store)](https://hacs.xyz/) installed.
2.  Go to HACS -> Frontend -> Explore & Add Repositories.
3.  Search for "Range Slider Card".
4.  Click "Install".
5.  Restart Home Assistant (if prompted).

### Manual Installation

1.  Download the `range-slider-card.js` file from the [latest release](https://github.com/dbarciela/range-slider-card/releases/latest).
2.  Place the file in your `config/www/` directory.
3.  Add the resource reference to your Lovelace configuration:
    *   Go to Configuration -> Lovelace Dashboards -> Resources.
    *   Click "Add Resource".
    *   Set URL to `/local/range-slider-card.js`.
    *   Set Resource Type to "JavaScript Module".
    *   Click "Create".

## Configuration

Use the visual editor or YAML to configure the card.

| Name                | Type      | Required | Default       | Description                                                                 |
| ------------------- | --------- | -------- | ------------- | --------------------------------------------------------------------------- |
| `type`              | `string`  | Yes      |               | `custom:range-slider-card`                                                  |
| `entity_min`        | `string`  | Yes      |               | `input_number` entity ID for the minimum value.                             |
| `entity_max`        | `string`  | Yes      |               | `input_number` entity ID for the maximum value.                             |
| `name`              | `string`  | No       | `Range Slider`| Card title.                                                                 |
| `entity_value`      | `string`  | No       |               | Optional entity ID (`sensor` or `input_number`) for the value marker.       |
| `min`               | `number`  | No       | `0`           | Absolute minimum scale value (overridden by `min_entity`).                  |
| `max`               | `number`  | No       | `100`         | Absolute maximum scale value (overridden by `max_entity`).                  |
| `step`              | `number`  | No       | `1`           | Slider step increment (overridden by `step_entity`).                        |
| `unit`              | `string`  | No       | `""`          | Unit to display next to values.                                             |
| `orientation`       | `string`  | No       | `horizontal`  | `horizontal` or `vertical`.                                                 |
| `read_only`         | `boolean` | No       | `false`       | Disable interaction.                                                        |
| `show_range`        | `boolean` | No       | `false`       | Display the difference between max and min values.                          |
| `show_inputs`       | `boolean` | No       | `false`       | Show numeric input fields for min/max (disabled if `read_only`).            |
| `show_tooltips`     | `boolean` | No       | `false`       | Show value tooltips when dragging handles.                                  |
| `show_value_marker` | `boolean` | No       | `false`       | Show a marker for `entity_value` (requires `entity_value` to be set).       |
| `min_entity`        | `string`  | No       |               | Optional entity ID (`sensor` or `input_number`) to dynamically set the min limit. |
| `max_entity`        | `string`  | No       |               | Optional entity ID (`sensor` or `input_number`) to dynamically set the max limit. |
| `step_entity`       | `string`  | No       |               | Optional entity ID (`sensor` or `input_number`) to dynamically set the step.    |
| `tap_action`        | `object`  | No       | `more-info`   | Action for tapping the card background.                                     |
| `hold_action`       | `object`  | No       | `none`        | Action for holding the card background.                                     |
| `double_tap_action` | `object`  | No       | `none`        | Action for double-tapping the card background.                              |

### Example YAML

```yaml
type: custom:range-slider-card
entity_min: input_number.thermostat_min_temp
entity_max: input_number.thermostat_max_temp
name: Thermostat Range
unit: °C
min: 15
max: 25
step: 0.5
show_inputs: true
show_tooltips: true
entity_value: sensor.current_room_temperature # Optional marker
show_value_marker: true
```

## Contributing

Contributions are welcome! Please see the [GitHub repository](https://github.com/dbarciela/range-slider-card/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
