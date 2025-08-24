import { Controller } from "@hotwired/stimulus"

// Toggle controller for boolean filters (elevator, photos, etc.)
export default class extends Controller {
  static targets = ["checkbox", "switch", "handle"]

  connect() {
    this.updateAppearance()
  }

  toggle() {
    this.checkboxTarget.checked = !this.checkboxTarget.checked
    this.updateAppearance()
    this.dispatchToggleChange()
  }

  updateAppearance() {
    const isChecked = this.checkboxTarget.checked
    
    // Update switch background
    if (isChecked) {
      this.switchTarget.classList.remove('bg-gray-200')
      // Find the color class (default to blue if none found)
      const colorClasses = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500']
      const currentColorClass = colorClasses.find(cls => this.switchTarget.classList.contains(cls))
      if (!currentColorClass) {
        this.switchTarget.classList.add('bg-blue-500')
      }
    } else {
      // Remove all color classes and add gray
      this.switchTarget.classList.remove('bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500')
      this.switchTarget.classList.add('bg-gray-200')
    }
    
    // Update handle position
    const handleElement = this.handleTarget
    const switchElement = this.switchTarget
    
    // Determine size and calculate translation
    let translateClass = ''
    if (switchElement.classList.contains('w-8')) { // sm
      translateClass = isChecked ? 'translate-x-3' : 'translate-x-0'
    } else if (switchElement.classList.contains('w-12')) { // lg  
      translateClass = isChecked ? 'translate-x-5' : 'translate-x-0'
    } else { // base
      translateClass = isChecked ? 'translate-x-4' : 'translate-x-0'
    }
    
    // Remove existing translate classes and add the correct one
    handleElement.classList.remove('translate-x-0', 'translate-x-3', 'translate-x-4', 'translate-x-5')
    handleElement.classList.add(translateClass)
  }

  dispatchToggleChange() {
    const isChecked = this.checkboxTarget.checked
    const name = this.checkboxTarget.name
    
    this.dispatch("toggleChanged", {
      detail: {
        name: name,
        checked: isChecked,
        value: isChecked ? this.checkboxTarget.value : null
      }
    })
  }

  // Public method to set toggle state
  setChecked(checked) {
    this.checkboxTarget.checked = checked
    this.updateAppearance()
  }

  // Public method to get toggle state
  isChecked() {
    return this.checkboxTarget.checked
  }
}