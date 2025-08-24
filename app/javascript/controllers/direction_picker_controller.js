import { Controller } from "@hotwired/stimulus"

// Direction picker controller for property orientation selection
export default class extends Controller {
  static targets = ["input", "selectedDisplay"]
  static values = { multiple: Boolean }

  static directions = {
    north: { label: '북', short: 'N' },
    northeast: { label: '북동', short: 'NE' },
    east: { label: '동', short: 'E' },
    southeast: { label: '남동', short: 'SE' },
    south: { label: '남', short: 'S' },
    southwest: { label: '남서', short: 'SW' },
    west: { label: '서', short: 'W' },
    northwest: { label: '북서', short: 'NW' }
  }

  connect() {
    this.updateSelectedDisplay()
  }

  updateSelection(event) {
    const input = event.target
    
    if (!this.multipleValue && input.type === 'radio') {
      // For radio buttons, uncheck all others
      this.inputTargets.forEach(otherInput => {
        if (otherInput !== input) {
          otherInput.checked = false
          this.updateInputStyle(otherInput)
        }
      })
    }
    
    this.updateInputStyle(input)
    this.updateSelectedDisplay()
    this.dispatchDirectionChange()
  }

  updateInputStyle(input) {
    const label = input.closest('label')
    const indicator = label.querySelector('div')
    const icon = indicator.querySelector('svg, div:last-child')

    if (input.checked) {
      // Selected state
      label.classList.remove('border-gray-200', 'text-gray-600')
      label.classList.add('border-blue-500', 'bg-blue-50', 'text-white')
      
      if (label.classList.contains('rounded-full')) {
        // Compass style
        label.classList.add('bg-blue-500', 'border-blue-500', 'text-white', 'shadow-lg')
        label.classList.remove('bg-white', 'border-gray-300', 'text-gray-600')
      }
      
      if (indicator) {
        indicator.classList.remove('border-gray-300')
        indicator.classList.add('bg-blue-500', 'border-blue-500')
        if (icon) icon.style.display = 'block'
      }
    } else {
      // Unselected state  
      label.classList.remove('border-blue-500', 'bg-blue-50', 'text-white')
      label.classList.add('border-gray-200')
      
      if (label.classList.contains('rounded-full')) {
        // Compass style
        label.classList.remove('bg-blue-500', 'border-blue-500', 'text-white', 'shadow-lg')
        label.classList.add('bg-white', 'border-gray-300', 'text-gray-600')
      }
      
      if (indicator) {
        indicator.classList.remove('bg-blue-500', 'border-blue-500')
        indicator.classList.add('border-gray-300')
        if (icon) icon.style.display = 'none'
      }
    }
  }

  updateSelectedDisplay() {
    if (!this.hasSelectedDisplayTarget) return

    const selectedInputs = this.getSelectedInputs()
    
    if (selectedInputs.length > 0) {
      const selectedLabels = selectedInputs.map(input => 
        this.constructor.directions[input.value]?.label || input.value
      )
      
      this.selectedDisplayTarget.innerHTML = `
        <span class="font-medium">선택됨:</span> ${selectedLabels.join(', ')}
      `
    } else {
      this.selectedDisplayTarget.innerHTML = `
        <span class="text-gray-400">선택된 방향이 없습니다</span>
      `
    }
  }

  getSelectedInputs() {
    return this.inputTargets.filter(input => input.checked)
  }

  getSelectedValues() {
    return this.getSelectedInputs().map(input => input.value)
  }

  setSelectedValues(values) {
    this.inputTargets.forEach(input => {
      input.checked = values.includes(input.value)
      this.updateInputStyle(input)
    })
    
    this.updateSelectedDisplay()
  }

  dispatchDirectionChange() {
    const selectedValues = this.getSelectedValues()
    const selectedLabels = selectedValues.map(value => 
      this.constructor.directions[value]?.label || value
    )
    
    this.dispatch("directionChanged", {
      detail: {
        selected: selectedValues,
        labels: selectedLabels,
        multiple: this.multipleValue
      }
    })
  }

  // Auto-update input styles when they connect
  inputTargetConnected(element) {
    this.updateInputStyle(element)
  }
}