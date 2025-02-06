
# 📊 Home Assistant Range Slider Card  (beta)

A **custom card** for Home Assistant that allows adjusting **two** `input_number` values with a **single slider**, enabling the selection of a custom value range.  

## 📷 Preview  
![all](https://github.com/Gasp96/range-slider-card/blob/main/assets/Screen_Recording_20250206_183226_Home%20Assistant_1.gif) 

## 🚀 Features  
✅ **Dual Value Control** – Adjust two `input_number` values with a single slider.  
✅ **Custom Ranges** – Define your own minimum and maximum value limits.  


## 📌 Installation  

### 1️⃣ Manual Installation  
- Download `range-slider-card.js`  
- Place it in your `www` folder in Home Assistant  
- Installation instructions: go to Settings > Dashboards > (top right, the three dots) > Resources > Add resource > paste the following URL: /local/range-slider-card.js


## ⚙️ Configuration  

Example configuration for **Lovelace UI**:  

```yaml
type: custom:range-slider-card
entity_min: input_number.min_value
entity_max: input_number.max_value
min: 0
max: 100
step: 1

```

### 🔧 Options  

| Option       | Type   | Description |
|-------------|--------|-------------|
| `entity_min` | string | The `input_number` entity for the minimum value |
| `entity_max` | string | The `input_number` entity for the maximum value |
| `min`       | number | The minimum selectable value |
| `max`       | number | The maximum selectable value |
| `step`      | number | Increment step for the slider |


 

## 🛠️ Contributing  
Feel free to submit issues or pull requests to improve this component!  

⭐ **If you find this useful, don't forget to star this repository!**  
