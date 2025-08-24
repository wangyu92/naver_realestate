import { Controller } from "@hotwired/stimulus"

// Property filters controller for managing search filters and UI interactions
export default class extends Controller {
  static targets = ["form"]

  connect() {
    this.setupConditionalFields()
    this.setupFilterInteractions()
    this.restoreFiltersFromUrl()
    this.setupAutoUrlUpdate()
  }

  // Handle form submission
  submit(event) {
    // Let the form submit naturally, but could add loading states here
    const submitButton = event.target.querySelector('input[type="submit"]')
    if (submitButton) {
      submitButton.disabled = true
      submitButton.value = '검색 중...'
      
      // Re-enable after a short delay in case the form doesn't redirect
      setTimeout(() => {
        submitButton.disabled = false
        submitButton.value = '조건으로 검색'
      }, 3000)
    }
  }

  // Setup conditional field visibility based on transaction type
  setupConditionalFields() {
    const transactionSelect = document.querySelector('select[name="transaction_type"]')
    if (!transactionSelect) return

    const updateFieldVisibility = () => {
      const selectedValue = transactionSelect.value
      
      // Show/hide price fields based on transaction type
      this.toggleFieldVisibility('[data-show-if="transaction_type"]', selectedValue)
    }

    // Initial setup
    updateFieldVisibility()
    
    // Listen for changes
    transactionSelect.addEventListener('change', updateFieldVisibility)
  }

  toggleFieldVisibility(selector, currentValue) {
    const conditionalFields = document.querySelectorAll(selector)
    
    conditionalFields.forEach(field => {
      const showValues = field.dataset.showValues.split(',')
      const shouldShow = showValues.includes(currentValue) || showValues.includes('')
      
      if (shouldShow) {
        field.style.display = 'block'
        field.classList.remove('hidden')
      } else {
        field.style.display = 'none'
        field.classList.add('hidden')
      }
    })
  }

  // Setup filter interactions and event listeners
  setupFilterInteractions() {
    this.setupRangeSliderInteractions()
    this.setupCheckboxInteractions()
    this.setupLocationInteractions()
  }

  setupRangeSliderInteractions() {
    // Listen for range slider changes to update other related filters
    document.addEventListener('rangeChanged', (event) => {
      const { detail } = event
      
      // Update URL parameters if needed
      this.updateUrlParams(detail.name, {
        min: detail.min,
        max: detail.max
      })
    })
  }

  setupCheckboxInteractions() {
    // Listen for multi-checkbox changes
    document.addEventListener('selectionChanged', (event) => {
      const { detail } = event
      
      // Update counter displays or other UI elements
      this.updateSelectionCounters(detail.name, detail.count)
    })
  }

  setupLocationInteractions() {
    // Listen for location hierarchy changes
    document.addEventListener('locationsChanged', (event) => {
      const { detail } = event
      
      // Update location summary or other UI elements
      this.updateLocationSummary(detail.selected, detail.count)
    })
  }

  updateUrlParams(filterName, value) {
    // Update URL parameters without page reload (for better UX)
    const url = new URL(window.location)
    
    if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
      url.searchParams.set(`${filterName}[min]`, value.min)
      url.searchParams.set(`${filterName}[max]`, value.max)
    } else if (Array.isArray(value)) {
      // Remove existing parameters
      url.searchParams.delete(filterName)
      // Add new ones
      value.forEach(v => url.searchParams.append(`${filterName}[]`, v))
    } else {
      url.searchParams.set(filterName, value)
    }
    
    // Update URL without reloading page
    window.history.replaceState({}, '', url)
  }

  updateSelectionCounters(filterName, count) {
    const counter = document.querySelector(`[data-selection-counter="${filterName}"]`)
    if (counter) {
      counter.textContent = count
      counter.style.display = count > 0 ? 'inline' : 'none'
    }
  }

  updateLocationSummary(locations, count) {
    const summary = document.querySelector('[data-location-summary]')
    if (summary) {
      if (count > 0) {
        const shortLocations = locations.slice(0, 2).map(location => {
          const parts = location.split(' ')
          return parts.slice(-2).join(' ') // Show district + dong
        })
        
        const text = count > 2 
          ? `${shortLocations.join(', ')} 외 ${count - 2}곳`
          : shortLocations.join(', ')
        
        summary.textContent = text
        summary.style.display = 'block'
      } else {
        summary.style.display = 'none'
      }
    }
  }

  // Public methods for external interaction
  clearAllFilters() {
    // Clear form inputs
    const form = this.hasFormTarget ? this.formTarget : document.querySelector('form')
    if (form) {
      // Reset all form inputs
      const inputs = form.querySelectorAll('input, select')
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false
        } else {
          input.value = ''
        }
      })
      
      // Trigger change events to update UI
      inputs.forEach(input => {
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
      
      // Clear URL parameters
      const url = new URL(window.location)
      const keysToRemove = []
      for (const [key] of url.searchParams.entries()) {
        keysToRemove.push(key)
      }
      keysToRemove.forEach(key => url.searchParams.delete(key))
      
      window.history.replaceState({}, '', url)
    }
  }

  resetFilter(filterName) {
    // Reset specific filter
    const inputs = document.querySelectorAll(`[name="${filterName}"], [name="${filterName}[]"]`)
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false
      } else {
        input.value = ''
      }
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
    
    // Remove from URL
    const url = new URL(window.location)
    url.searchParams.delete(filterName)
    window.history.replaceState({}, '', url)
  }

  // Auto-submit functionality (optional)
  enableAutoSubmit() {
    const form = this.hasFormTarget ? this.formTarget : document.querySelector('form')
    if (!form) return

    let submitTimeout
    
    const autoSubmit = () => {
      clearTimeout(submitTimeout)
      submitTimeout = setTimeout(() => {
        form.dispatchEvent(new Event('submit', { bubbles: true }))
      }, 1000) // Submit after 1 second of inactivity
    }
    
    // Listen for filter changes
    form.addEventListener('change', autoSubmit)
    form.addEventListener('input', autoSubmit)
  }

  // Restore filter values from URL parameters
  restoreFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const form = this.hasFormTarget ? this.formTarget : document.querySelector('form')
    if (!form) return

    // Restore single value fields
    const singleValueFields = ['transaction_type', 'sort', 'area_unit', 'has_elevator', 'has_photos']
    singleValueFields.forEach(fieldName => {
      if (urlParams.has(fieldName)) {
        const element = form.querySelector(`[name="${fieldName}"]`)
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = true
          } else {
            element.value = urlParams.get(fieldName)
          }
          element.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
    })

    // Restore array fields (checkboxes, multi-select)
    const arrayFields = ['property_types', 'locations', 'direction']
    arrayFields.forEach(fieldName => {
      const values = urlParams.getAll(`${fieldName}[]`)
      if (values.length > 0) {
        const checkboxes = form.querySelectorAll(`input[name="${fieldName}[]"]`)
        checkboxes.forEach(checkbox => {
          if (values.includes(checkbox.value)) {
            checkbox.checked = true
            checkbox.dispatchEvent(new Event('change', { bubbles: true }))
          }
        })
      }
    })

    // Restore range fields (sliders)
    const rangeFields = [
      'sale_price', 'jeonse_deposit', 'monthly_rent', 'maintenance_fee',
      'exclusive_area', 'supply_area', 'room_count', 'bathroom_count',
      'built_year', 'parking_ratio', 'floor', 'household_count'
    ]
    rangeFields.forEach(fieldName => {
      const minValue = urlParams.get(`${fieldName}[min]`)
      const maxValue = urlParams.get(`${fieldName}[max]`)
      
      if (minValue !== null || maxValue !== null) {
        const minInput = form.querySelector(`input[name="${fieldName}[min]"]`)
        const maxInput = form.querySelector(`input[name="${fieldName}[max]"]`)
        
        if (minInput && minValue !== null) {
          minInput.value = minValue
          minInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
        
        if (maxInput && maxValue !== null) {
          maxInput.value = maxValue
          maxInput.dispatchEvent(new Event('input', { bubbles: true }))
        }

        // Trigger range slider update if it exists
        const rangeSlider = form.querySelector(`[data-controller*="range-slider"][data-name="${fieldName}"]`)
        if (rangeSlider) {
          const controller = this.application.getControllerForElementAndIdentifier(rangeSlider, 'range-slider')
          if (controller && controller.updateFromInputs) {
            controller.updateFromInputs()
          }
        }
      }
    })

    // Trigger conditional field visibility update
    this.setupConditionalFields()
  }

  // Setup automatic URL parameter updates
  setupAutoUrlUpdate() {
    const form = this.hasFormTarget ? this.formTarget : document.querySelector('form')
    if (!form) return

    // Listen for all form changes and update URL
    const updateUrl = (event) => {
      // Skip if it's a submit button
      if (event.target.type === 'submit') return
      
      setTimeout(() => {
        this.updateUrlFromForm()
      }, 100) // Small delay to ensure all values are updated
    }

    form.addEventListener('change', updateUrl)
    form.addEventListener('input', updateUrl)
  }

  // Update URL parameters based on current form state
  updateUrlFromForm() {
    const form = this.hasFormTarget ? this.formTarget : document.querySelector('form')
    if (!form) return

    const url = new URL(window.location)
    const formData = new FormData(form)

    // Clear existing filter parameters (but keep sort)
    const keysToRemove = []
    for (const [key] of url.searchParams.entries()) {
      if (key !== 'sort') { // Keep sort parameter
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))

    // Add current form values
    for (const [key, value] of formData.entries()) {
      if (value && value.trim() !== '') {
        // Handle range fields specially
        if (key.includes('[') && key.includes(']')) {
          url.searchParams.set(key, value)
        } else if (form.querySelector(`input[name="${key}[]"]`)) {
          // Handle array fields - collect all checked values
          const checkedValues = Array.from(form.querySelectorAll(`input[name="${key}[]"]:checked`))
                                     .map(input => input.value)
          
          // Remove existing entries for this field
          url.searchParams.delete(key)
          for (const [existingKey] of url.searchParams.entries()) {
            if (existingKey.startsWith(`${key}[`)) {
              url.searchParams.delete(existingKey)
            }
          }
          
          // Add new values
          checkedValues.forEach(val => url.searchParams.append(`${key}[]`, val))
        } else {
          url.searchParams.set(key, value)
        }
      }
    }

    // Remove empty parameters
    const paramsToRemove = []
    for (const [key, value] of url.searchParams.entries()) {
      if (!value || value.trim() === '') {
        paramsToRemove.push(key)
      }
    }
    paramsToRemove.forEach(key => url.searchParams.delete(key))

    // Update URL without reloading page
    if (url.toString() !== window.location.toString()) {
      window.history.replaceState({}, '', url)
    }
  }
}