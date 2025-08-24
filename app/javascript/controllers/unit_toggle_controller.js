import { Controller } from "@hotwired/stimulus"

// Unit toggle controller for switching between 평 (pyeong) and ㎡ (square meters)
export default class extends Controller {
  static targets = ["pyeongButton", "sqmButton", "hiddenInput"]
  static values = { current: String }

  connect() {
    this.updateButtonStyles()
  }

  selectPyeong() {
    this.currentValue = "pyeong"
    this.hiddenInputTarget.value = "pyeong"
    this.updateButtonStyles()
    this.dispatchUnitChange()
  }

  selectSqm() {
    this.currentValue = "sqm"
    this.hiddenInputTarget.value = "sqm"
    this.updateButtonStyles()
    this.dispatchUnitChange()
  }

  updateButtonStyles() {
    const activeClasses = "bg-white text-gray-900 shadow-sm"
    const inactiveClasses = "text-gray-600 hover:text-gray-900"
    
    // Reset all buttons
    this.pyeongButtonTarget.className = this.pyeongButtonTarget.className
      .replace(activeClasses, "")
      .replace(inactiveClasses, "")
    this.sqmButtonTarget.className = this.sqmButtonTarget.className
      .replace(activeClasses, "")
      .replace(inactiveClasses, "")
    
    // Add base classes back
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    
    if (this.currentValue === "pyeong") {
      this.pyeongButtonTarget.className = `${baseClasses} ${activeClasses}`
      this.sqmButtonTarget.className = `${baseClasses} ${inactiveClasses}`
    } else {
      this.pyeongButtonTarget.className = `${baseClasses} ${inactiveClasses}`
      this.sqmButtonTarget.className = `${baseClasses} ${activeClasses}`
    }
  }

  dispatchUnitChange() {
    this.dispatch("unitChanged", {
      detail: {
        unit: this.currentValue,
        conversionFactor: this.getConversionFactor()
      }
    })
  }

  getConversionFactor() {
    // 1평 = 3.3058㎡
    return this.currentValue === "pyeong" ? 3.3058 : (1 / 3.3058)
  }

  // Helper method to convert values
  static convertValue(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value
    
    if (fromUnit === "pyeong" && toUnit === "sqm") {
      return Math.round(value * 3.3058 * 100) / 100 // 평 -> ㎡
    } else if (fromUnit === "sqm" && toUnit === "pyeong") {
      return Math.round(value / 3.3058 * 100) / 100 // ㎡ -> 평
    }
    
    return value
  }
}