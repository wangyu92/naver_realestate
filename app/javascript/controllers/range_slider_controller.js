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
    this.updateDisplay()
    this.updateActiveRange()
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
        return Math.round(numValue * 10000) // 만원 단위 -> 원
      case "area":
        return Math.round(numValue * 3.3058) // 평 -> ㎡ conversion if needed
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
      default:
        return value.toLocaleString()
    }
  }

  // Format input value (simplified for user input)
  formatValue(value) {
    switch (this.formatValue) {
      case "currency":
        return Math.round(value / 10000).toLocaleString() // 만원 단위
      case "area":
        return Math.round(value / 3.3058 * 10) / 10 // ㎡ -> 평
      default:
        return value.toString()
    }
  }

  // Currency formatting
  formatCurrency(value) {
    if (value >= 100000000) { // 1억 이상
      const eok = Math.floor(value / 100000000)
      const man = Math.round((value % 100000000) / 10000)
      return man > 0 ? `${eok}억 ${man}만원` : `${eok}억원`
    } else if (value >= 10000) { // 1만 이상
      const man = Math.round(value / 10000)
      return `${man}만원`
    } else {
      return `${value.toLocaleString()}원`
    }
  }

  // Area formatting
  formatArea(value) {
    const pyeong = Math.round(value / 3.3058 * 10) / 10
    return `${pyeong}평 (${value}㎡)`
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