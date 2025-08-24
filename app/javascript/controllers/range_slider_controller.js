import { Controller } from "@hotwired/stimulus"

// Range slider controller for dual-range inputs (price, area, year filters)
export default class extends Controller {
  static targets = ["minSlider", "maxSlider", "minInput", "maxInput", "minLabel", "maxLabel", "track", "activeRange"]
  static values = { 
    min: Number, 
    max: Number, 
    step: Number,
    format: String
  }

  connect() {
    this.currentAreaUnit = 'sqm' // Default to square meters
    this.updateDisplay()
    this.updateActiveRange()
    
    // Listen for unit changes if this is an area slider
    if (this.formatValue === 'area') {
      document.addEventListener('unitChanged', this.handleUnitChange.bind(this))
    }
  }

  // Update values when slider is moved
  updateValues() {
    const minVal = parseInt(this.minSliderTarget.value)
    const maxVal = parseInt(this.maxSliderTarget.value)
    
    // Prevent sliders from crossing over
    if (minVal > maxVal - this.stepValue) {
      if (event.target === this.minSliderTarget) {
        this.minSliderTarget.value = maxVal - this.stepValue
      } else {
        this.maxSliderTarget.value = minVal + this.stepValue
      }
    }
    
    this.updateDisplay()
    this.updateActiveRange()
    this.dispatchChangeEvent()
  }

  // Update slider values from text input
  updateFromInput(event) {
    const input = event.target
    const value = this.parseInputValue(input.value)
    
    if (input === this.minInputTarget) {
      const clampedValue = Math.max(this.minValue, Math.min(value, this.maxValue - this.stepValue))
      this.minSliderTarget.value = clampedValue
    } else if (input === this.maxInputTarget) {
      const clampedValue = Math.min(this.maxValue, Math.max(value, this.minValue + this.stepValue))
      this.maxSliderTarget.value = clampedValue
    }
    
    this.updateDisplay()
    this.updateActiveRange()
    this.dispatchChangeEvent()
  }

  // Parse input value based on format
  parseInputValue(value) {
    const cleanValue = value.replace(/[^0-9.]/g, '')
    const numValue = parseFloat(cleanValue)
    
    // Handle different formats
    switch (this.formatValue) {
      case "currency":
        return Math.round(numValue) // Already in 만원 units
      case "area":
        return Math.round(numValue * 3.3058) // 평 -> ㎡ conversion if needed
      case "ratio":
        return Math.round(numValue * 10) / 10 // Keep one decimal place
      default:
        return Math.round(numValue)
    }
  }

  // Update display values in inputs/labels
  updateDisplay() {
    const minVal = parseInt(this.minSliderTarget.value)
    const maxVal = parseInt(this.maxSliderTarget.value)
    
    if (this.hasMinInputTarget) {
      this.minInputTarget.value = this.formatValue(minVal)
    }
    
    if (this.hasMaxInputTarget) {
      this.maxInputTarget.value = this.formatValue(maxVal)
    }
    
    if (this.hasMinLabelTarget) {
      this.minLabelTarget.textContent = this.formatDisplayValue(minVal)
    }
    
    if (this.hasMaxLabelTarget) {
      this.maxLabelTarget.textContent = this.formatDisplayValue(maxVal)
    }
  }

  // Update the active range visual indicator
  updateActiveRange() {
    const minVal = parseInt(this.minSliderTarget.value)
    const maxVal = parseInt(this.maxSliderTarget.value)
    
    const minPercent = ((minVal - this.minValue) / (this.maxValue - this.minValue)) * 100
    const maxPercent = ((maxVal - this.minValue) / (this.maxValue - this.minValue)) * 100
    
    if (this.hasActiveRangeTarget) {
      this.activeRangeTarget.style.left = `${minPercent}%`
      this.activeRangeTarget.style.width = `${maxPercent - minPercent}%`
    }
  }

  // Format value based on type
  formatDisplayValue(value) {
    switch (this.formatValue) {
      case "currency":
        return this.formatCurrency(value)
      case "area":
        return this.formatArea(value)
      case "year":
        return `${value}년`
      case "ratio":
        return this.formatRatio(value)
      default:
        return value.toLocaleString()
    }
  }

  // Format input value (simplified for user input)
  formatValue(value) {
    switch (this.formatValue) {
      case "currency":
        return value.toLocaleString() // Already in 만원 units
      case "area":
        return Math.round(value / 3.3058 * 10) / 10 // ㎡ -> 평
      case "ratio":
        return parseFloat(value).toFixed(1)
      default:
        return value.toString()
    }
  }

  // Currency formatting (values are in 만원 units)
  formatCurrency(value) {
    if (value >= 10000) { // 1억 이상 (10000만원)
      const eok = Math.floor(value / 10000)
      const man = value % 10000
      return man > 0 ? `${eok}억 ${man}만원` : `${eok}억원`
    } else if (value >= 1) { // 1만 이상
      return `${value}만원`
    } else {
      return `${Math.round(value * 10000).toLocaleString()}원`
    }
  }

  // Area formatting
  formatArea(value) {
    if (this.currentAreaUnit === 'pyeong') {
      const pyeong = Math.round(value / 3.3058 * 10) / 10
      return `${pyeong}평`
    } else {
      return `${value}㎡`
    }
  }
  
  // Ratio formatting
  formatRatio(value) {
    const ratio = parseFloat(value)
    if (ratio === 0) {
      return "주차불가"
    } else if (ratio >= 1) {
      return `${ratio.toFixed(1)}대/세대`
    } else {
      const households = Math.round(1 / ratio)
      return `${households}세대당 1대`
    }
  }
  
  // Handle unit change from toggle
  handleUnitChange(event) {
    const { unit, oldUnit } = event.detail
    const oldAreaUnit = this.currentAreaUnit
    this.currentAreaUnit = unit === 'pyeong' ? 'pyeong' : 'sqm'
    
    // Convert current slider values if needed
    if (oldAreaUnit !== this.currentAreaUnit) {
      this.convertSliderValues(oldAreaUnit, this.currentAreaUnit)
    }
    
    this.updateDisplay()
  }
  
  convertSliderValues(fromUnit, toUnit) {
    const currentMin = parseInt(this.minSliderTarget.value)
    const currentMax = parseInt(this.maxSliderTarget.value)
    
    let newMin, newMax
    
    if (fromUnit === 'sqm' && toUnit === 'pyeong') {
      // Convert ㎡ to 평
      newMin = Math.round(currentMin / 3.3058)
      newMax = Math.round(currentMax / 3.3058)
      
      // Update slider ranges
      this.minValue = Math.round(this.minValue / 3.3058)
      this.maxValue = Math.round(this.maxValue / 3.3058)
      this.stepValue = Math.max(1, Math.round(this.stepValue / 3.3058))
      
    } else if (fromUnit === 'pyeong' && toUnit === 'sqm') {
      // Convert 평 to ㎡
      newMin = Math.round(currentMin * 3.3058)
      newMax = Math.round(currentMax * 3.3058)
      
      // Update slider ranges
      this.minValue = Math.round(this.minValue * 3.3058)
      this.maxValue = Math.round(this.maxValue * 3.3058)
      this.stepValue = Math.max(1, Math.round(this.stepValue * 3.3058))
    } else {
      return // No conversion needed
    }
    
    // Update slider attributes
    this.minSliderTarget.min = this.minValue
    this.minSliderTarget.max = this.maxValue  
    this.minSliderTarget.step = this.stepValue
    this.maxSliderTarget.min = this.minValue
    this.maxSliderTarget.max = this.maxValue
    this.maxSliderTarget.step = this.stepValue
    
    // Update slider values
    this.minSliderTarget.value = Math.max(this.minValue, Math.min(newMin, this.maxValue))
    this.maxSliderTarget.value = Math.max(this.minValue, Math.min(newMax, this.maxValue))
    
    this.updateActiveRange()
  }
  
  // Method to be called externally for unit updates
  updateAreaUnit(unit) {
    const oldUnit = this.currentAreaUnit
    this.currentAreaUnit = unit === 'pyeong' ? 'pyeong' : 'sqm'
    
    if (oldUnit !== this.currentAreaUnit) {
      this.convertSliderValues(oldUnit, this.currentAreaUnit)
      this.updateDisplay()
    }
  }

  // Dispatch change event for parent components
  dispatchChangeEvent() {
    const minVal = parseInt(this.minSliderTarget.value)
    const maxVal = parseInt(this.maxSliderTarget.value)
    
    this.dispatch("rangeChanged", {
      detail: {
        min: minVal,
        max: maxVal,
        name: this.element.querySelector('input[type="range"]').name
      }
    })
  }
}