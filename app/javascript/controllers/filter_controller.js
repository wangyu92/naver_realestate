import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="filter"
export default class extends Controller {
  static targets = ["form"]

  apply(event) {
    event.preventDefault()
    
    const formData = new FormData(this.formTarget)
    const filters = {}
    
    // Collect all form data
    for (let [key, value] of formData.entries()) {
      if (filters[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(filters[key])) {
          filters[key].push(value)
        } else {
          filters[key] = [filters[key], value]
        }
      } else {
        filters[key] = value
      }
    }
    
    // Dispatch custom event with filter data
    this.dispatch("applied", { detail: { filters } })
    
    // You can add your filter logic here
    console.log("Filters applied:", filters)
  }

  reset() {
    this.formTarget.reset()
    
    // Reset custom styled elements (like room selection buttons)
    this.resetRoomSelection()
    
    // Dispatch reset event
    this.dispatch("reset")
    
    console.log("Filters reset")
  }

  resetRoomSelection() {
    const roomLabels = this.element.querySelectorAll('input[name="rooms[]"]').forEach(input => {
      input.checked = false
      const label = input.closest('label')
      if (label) {
        label.classList.remove('bg-blue-50', 'border-blue-500', 'text-blue-700')
        label.classList.add('border-gray-300', 'text-gray-700')
      }
    })
  }

  toggleRoomSelection(event) {
    const input = event.target
    const label = input.closest('label')
    
    if (input.checked) {
      label.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-700')
      label.classList.remove('border-gray-300', 'text-gray-700')
    } else {
      label.classList.remove('bg-blue-50', 'border-blue-500', 'text-blue-700')
      label.classList.add('border-gray-300', 'text-gray-700')
    }
  }
}