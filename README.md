
# 📊 Home Assistant Range Slider Card  

A **custom card** for Home Assistant that allows adjusting **two** `input_number` values with a **single slider**, enabling the selection of a custom value range.  

## 🚀 Features  
✅ **Dual Value Control** – Adjust two `input_number` values with a single slider.  
✅ **Custom Ranges** – Define your own minimum and maximum value limits.  
✅ **User-Friendly UI** – Smooth and intuitive interaction.  
✅ **Fully Configurable** – Easy to customize and integrate into your Lovelace dashboard.  

## 📌 Installation  

### 1️⃣ Manual Installation  
- Download `range-slider-card.js`  
- Place it in your `www` folder in Home Assistant  
- Add the resource to `configuration.yaml` or via the UI  

```yaml
resources:
  - url: /local/range-slider-card.js
    type: module
```



## ⚙️ Configuration  

Example configuration for **Lovelace UI**:  

```yaml
type: custom:range-slider-card
entity_min: input_number.min_value
entity_max: input_number.max_value
min: 0
max: 100
step: 1
unit: "%"
```

### 🔧 Options  

| Option       | Type   | Description |
|-------------|--------|-------------|
| `entity_min` | string | The `input_number` entity for the minimum value |
| `entity_max` | string | The `input_number` entity for the maximum value |
| `min`       | number | The minimum selectable value |
| `max`       | number | The maximum selectable value |
| `step`      | number | Increment step for the slider |
#| `unit`      | string | Display unit (e.g., `%`, `°C`, etc.) |

## 📷 Preview  
*(Add a screenshot or GIF here to showcase the card in action!)*  

## 🛠️ Contributing  
Feel free to submit issues or pull requests to improve this component!  

⭐ **If you find this useful, don't forget to star this repository!**  
