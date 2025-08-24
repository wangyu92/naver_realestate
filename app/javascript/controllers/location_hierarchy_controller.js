import { Controller } from "@hotwired/stimulus"

// Korean location hierarchy controller for province → city → district → dong selection
export default class extends Controller {
  static targets = [
    "searchInput", "list", "selectedList", "selectedCount", "selectedTags", 
    "clearButton", "expandButton", "districtsList", "dongsList"
  ]
  static values = { multiple: Boolean }

  connect() {
    this.selectedLocations = new Set()
    this.originalList = this.listTarget.innerHTML
    this.updateSelectedDisplay()
  }

  // Search functionality
  search(event) {
    const query = event.target.value.toLowerCase().trim()
    
    if (!query) {
      this.showAllLocations()
      return
    }
    
    this.filterLocationsByQuery(query)
  }

  handleKeydown(event) {
    // Handle Enter key in search
    if (event.key === 'Enter') {
      event.preventDefault()
      this.selectFirstVisibleLocation()
    }
  }

  filterLocationsByQuery(query) {
    const regionItems = this.listTarget.querySelectorAll('.region-item')
    
    regionItems.forEach(regionItem => {
      let regionMatches = false
      const regionName = regionItem.dataset.region.toLowerCase()
      
      // Check if region name matches
      if (regionName.includes(query)) {
        regionMatches = true
      }
      
      // Check districts and dongs
      const districtItems = regionItem.querySelectorAll('.district-item')
      let hasVisibleDistricts = false
      
      districtItems.forEach(districtItem => {
        let districtMatches = false
        const districtName = districtItem.querySelector('input[data-district-name]')
                                       ?.dataset.districtName.toLowerCase() || ''
        
        if (districtName.includes(query)) {
          districtMatches = true
        }
        
        // Check dongs
        const dongLabels = districtItem.querySelectorAll('.dongs-list label')
        let hasVisibleDongs = false
        
        dongLabels.forEach(dongLabel => {
          const dongName = dongLabel.querySelector('input[data-dong-name]')
                                   ?.dataset.dongName.toLowerCase() || ''
          
          if (dongName.includes(query) || districtMatches || regionMatches) {
            dongLabel.style.display = 'flex'
            hasVisibleDongs = true
          } else {
            dongLabel.style.display = 'none'
          }
        })
        
        // Show/hide district based on matches
        if (districtMatches || regionMatches || hasVisibleDongs) {
          districtItem.style.display = 'block'
          hasVisibleDistricts = true
          
          // Auto-expand if there are matches
          if (hasVisibleDongs && !districtMatches && !regionMatches) {
            this.expandDistrict(districtItem)
          }
        } else {
          districtItem.style.display = 'none'
        }
      })
      
      // Show/hide region based on matches
      if (regionMatches || hasVisibleDistricts) {
        regionItem.style.display = 'block'
        
        // Auto-expand region if there are district/dong matches
        if (hasVisibleDistricts) {
          this.expandRegion(regionItem)
        }
      } else {
        regionItem.style.display = 'none'
      }
    })
  }

  showAllLocations() {
    // Reset all visibility
    const allItems = this.listTarget.querySelectorAll('.region-item, .district-item, .dongs-list label')
    allItems.forEach(item => {
      item.style.display = item.classList.contains('region-item') ? 'block' : 
                          item.classList.contains('district-item') ? 'block' : 'flex'
    })
    
    // Collapse all expanded items
    this.collapseAll()
  }

  selectFirstVisibleLocation() {
    const firstVisibleInput = this.listTarget.querySelector('.dongs-list label:not([style*="none"]) input')
    if (firstVisibleInput) {
      firstVisibleInput.checked = true
      this.selectLocation({ target: firstVisibleInput })
    }
  }

  // Region toggle
  toggleRegion(event) {
    const checkbox = event.target
    const regionItem = checkbox.closest('.region-item')
    const regionName = checkbox.dataset.regionName
    
    if (checkbox.checked) {
      // Select all districts and dongs in this region
      this.selectAllInRegion(regionItem, regionName)
    } else {
      // Deselect all in this region
      this.deselectAllInRegion(regionItem, regionName)
    }
    
    this.updateSelectedDisplay()
    this.dispatchLocationChange()
  }

  // District toggle
  toggleDistrict(event) {
    const checkbox = event.target
    const districtItem = checkbox.closest('.district-item')
    const regionName = checkbox.dataset.regionName
    const districtName = checkbox.dataset.districtName
    
    if (checkbox.checked) {
      // Select all dongs in this district
      this.selectAllInDistrict(districtItem, regionName, districtName)
    } else {
      // Deselect all dongs in this district
      this.deselectAllInDistrict(districtItem, regionName, districtName)
    }
    
    this.updateSelectedDisplay()
    this.dispatchLocationChange()
  }

  // Individual location selection
  selectLocation(event) {
    const input = event.target
    const locationValue = input.value
    
    if (!this.multipleValue && input.type === 'radio') {
      // For radio buttons, clear all others first
      this.selectedLocations.clear()
      const otherRadios = this.listTarget.querySelectorAll('input[type="radio"]')
      otherRadios.forEach(radio => {
        if (radio !== input) {
          radio.checked = false
        }
      })
    }
    
    if (input.checked) {
      this.selectedLocations.add(locationValue)
    } else {
      this.selectedLocations.delete(locationValue)
    }
    
    this.updateSelectedDisplay()
    this.updateParentCheckboxes(input)
    this.dispatchLocationChange()
  }

  // Expansion controls
  toggleExpand(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const button = event.currentTarget
    const regionItem = button.closest('.region-item')
    
    this.toggleRegionExpansion(regionItem, button)
  }

  toggleDistrictExpand(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const button = event.currentTarget
    const districtItem = button.closest('.district-item')
    
    this.toggleDistrictExpansion(districtItem, button)
  }

  toggleRegionExpansion(regionItem, button) {
    const districtsList = regionItem.querySelector('.districts-list')
    const icon = button.querySelector('svg')
    const isExpanded = !districtsList.classList.contains('hidden')
    
    if (isExpanded) {
      districtsList.classList.add('hidden')
      icon.style.transform = 'rotate(0deg)'
      icon.dataset.expanded = 'false'
    } else {
      districtsList.classList.remove('hidden')
      icon.style.transform = 'rotate(90deg)'
      icon.dataset.expanded = 'true'
    }
  }

  toggleDistrictExpansion(districtItem, button) {
    const dongsList = districtItem.querySelector('.dongs-list')
    const icon = button.querySelector('svg')
    const isExpanded = !dongsList.classList.contains('hidden')
    
    if (isExpanded) {
      dongsList.classList.add('hidden')
      icon.style.transform = 'rotate(0deg)'
      icon.dataset.expanded = 'false'
    } else {
      dongsList.classList.remove('hidden')
      icon.style.transform = 'rotate(90deg)'
      icon.dataset.expanded = 'true'
    }
  }

  expandRegion(regionItem) {
    const districtsList = regionItem.querySelector('.districts-list')
    const button = regionItem.querySelector('.expand-toggle')
    const icon = button?.querySelector('svg')
    
    if (districtsList && districtsList.classList.contains('hidden')) {
      districtsList.classList.remove('hidden')
      if (icon) {
        icon.style.transform = 'rotate(90deg)'
        icon.dataset.expanded = 'true'
      }
    }
  }

  expandDistrict(districtItem) {
    const dongsList = districtItem.querySelector('.dongs-list')
    const button = districtItem.querySelector('.expand-toggle')
    const icon = button?.querySelector('svg')
    
    if (dongsList && dongsList.classList.contains('hidden')) {
      dongsList.classList.remove('hidden')
      if (icon) {
        icon.style.transform = 'rotate(90deg)'
        icon.dataset.expanded = 'true'
      }
    }
  }

  collapseAll() {
    // Collapse all districts
    const allDistrictsList = this.listTarget.querySelectorAll('.districts-list')
    allDistrictsList.forEach(list => list.classList.add('hidden'))
    
    // Collapse all dongs
    const allDongsList = this.listTarget.querySelectorAll('.dongs-list')
    allDongsList.forEach(list => list.classList.add('hidden'))
    
    // Reset all expand icons
    const allIcons = this.listTarget.querySelectorAll('.expand-toggle svg')
    allIcons.forEach(icon => {
      icon.style.transform = 'rotate(0deg)'
      icon.dataset.expanded = 'false'
    })
  }

  // Selection helpers
  selectAllInRegion(regionItem, regionName) {
    const dongInputs = regionItem.querySelectorAll('.dongs-list input')
    dongInputs.forEach(input => {
      input.checked = true
      this.selectedLocations.add(input.value)
    })
  }

  deselectAllInRegion(regionItem, regionName) {
    const dongInputs = regionItem.querySelectorAll('.dongs-list input')
    dongInputs.forEach(input => {
      input.checked = false
      this.selectedLocations.delete(input.value)
    })
  }

  selectAllInDistrict(districtItem, regionName, districtName) {
    const dongInputs = districtItem.querySelectorAll('.dongs-list input')
    dongInputs.forEach(input => {
      input.checked = true
      this.selectedLocations.add(input.value)
    })
  }

  deselectAllInDistrict(districtItem, regionName, districtName) {
    const dongInputs = districtItem.querySelectorAll('.dongs-list input')
    dongInputs.forEach(input => {
      input.checked = false
      this.selectedLocations.delete(input.value)
    })
  }

  updateParentCheckboxes(dongInput) {
    const districtItem = dongInput.closest('.district-item')
    const regionItem = dongInput.closest('.region-item')
    
    // Update district checkbox
    const districtCheckbox = districtItem?.querySelector('input[data-district-name]')
    if (districtCheckbox) {
      const districtDongInputs = districtItem.querySelectorAll('.dongs-list input')
      const checkedDongInputs = Array.from(districtDongInputs).filter(input => input.checked)
      
      if (checkedDongInputs.length === 0) {
        districtCheckbox.checked = false
        districtCheckbox.indeterminate = false
      } else if (checkedDongInputs.length === districtDongInputs.length) {
        districtCheckbox.checked = true
        districtCheckbox.indeterminate = false
      } else {
        districtCheckbox.checked = false
        districtCheckbox.indeterminate = true
      }
    }
    
    // Update region checkbox
    const regionCheckbox = regionItem?.querySelector('input[data-region-name]')
    if (regionCheckbox) {
      const regionDongInputs = regionItem.querySelectorAll('.dongs-list input')
      const checkedRegionDongInputs = Array.from(regionDongInputs).filter(input => input.checked)
      
      if (checkedRegionDongInputs.length === 0) {
        regionCheckbox.checked = false
        regionCheckbox.indeterminate = false
      } else if (checkedRegionDongInputs.length === regionDongInputs.length) {
        regionCheckbox.checked = true
        regionCheckbox.indeterminate = false
      } else {
        regionCheckbox.checked = false
        regionCheckbox.indeterminate = true
      }
    }
  }

  // Display updates
  updateSelectedDisplay() {
    if (this.hasSelectedCountTarget) {
      this.selectedCountTarget.textContent = this.selectedLocations.size
    }
    
    if (this.hasSelectedTagsTarget) {
      this.renderSelectedTags()
    }
  }

  renderSelectedTags() {
    const tagsHTML = Array.from(this.selectedLocations).map(location => {
      const parts = location.split(' ')
      const dong = parts[parts.length - 1]
      const district = parts[parts.length - 2]
      
      return `
        <div class="location-tag">
          <span>${district} ${dong}</span>
          <button type="button" 
                  class="remove-btn" 
                  data-action="click->location-hierarchy#removeLocation"
                  data-location="${location}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      `
    }).join('')
    
    this.selectedTagsTarget.innerHTML = tagsHTML
  }

  removeLocation(event) {
    const location = event.currentTarget.dataset.location
    this.selectedLocations.delete(location)
    
    // Uncheck the corresponding input
    const input = this.listTarget.querySelector(`input[value="${location}"]`)
    if (input) {
      input.checked = false
      this.updateParentCheckboxes(input)
    }
    
    this.updateSelectedDisplay()
    this.dispatchLocationChange()
  }

  clearAll() {
    this.selectedLocations.clear()
    
    // Uncheck all inputs
    const allInputs = this.listTarget.querySelectorAll('input[type="checkbox"], input[type="radio"]')
    allInputs.forEach(input => {
      input.checked = false
      input.indeterminate = false
    })
    
    this.updateSelectedDisplay()
    this.dispatchLocationChange()
  }

  // Modal actions
  confirm() {
    this.dispatch("locationsConfirmed", {
      detail: {
        selected: Array.from(this.selectedLocations),
        count: this.selectedLocations.size
      }
    })
  }

  cancel() {
    this.dispatch("locationsCancelled", {
      detail: {
        selected: Array.from(this.selectedLocations),
        count: this.selectedLocations.size
      }
    })
  }

  dispatchLocationChange() {
    this.dispatch("locationsChanged", {
      detail: {
        selected: Array.from(this.selectedLocations),
        count: this.selectedLocations.size,
        multiple: this.multipleValue
      }
    })
  }

  // Public API methods
  getSelectedLocations() {
    return Array.from(this.selectedLocations)
  }

  setSelectedLocations(locations) {
    this.selectedLocations = new Set(locations)
    
    // Update UI
    const allInputs = this.listTarget.querySelectorAll('input')
    allInputs.forEach(input => {
      input.checked = this.selectedLocations.has(input.value)
      if (input.checked) {
        this.updateParentCheckboxes(input)
      }
    })
    
    this.updateSelectedDisplay()
  }
}