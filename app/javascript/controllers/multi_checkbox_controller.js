import { Controller } from "@hotwired/stimulus"

// Multi-checkbox controller for property type selection
export default class extends Controller {
  static targets = ["checkbox", "selectAllButton", "selectedCount", "countText"]
  static values = { name: String }

  connect() {
    this.updateSelectedCount()
    this.updateSelectAllButton()
  }

  updateSelection() {
    this.updateSelectedCount()
    this.updateSelectAllButton()
    this.dispatchSelectionChange()
  }

  toggleAll() {
    const checkedCount = this.getSelectedCheckboxes().length
    const totalCount = this.checkboxTargets.length
    const shouldSelectAll = checkedCount < totalCount

    this.checkboxTargets.forEach(checkbox => {
      checkbox.checked = shouldSelectAll
      this.updateCheckboxStyle(checkbox)
    })

    this.updateSelectedCount()
    this.updateSelectAllButton()
    this.dispatchSelectionChange()
  }

  updateSelectedCount() {
    const selectedCount = this.getSelectedCheckboxes().length
    
    if (this.hasCountTextTarget) {
      this.countTextTarget.textContent = selectedCount
    }
  }

  updateSelectAllButton() {
    if (!this.hasSelectAllButtonTarget) return

    const checkedCount = this.getSelectedCheckboxes().length
    const totalCount = this.checkboxTargets.length

    if (checkedCount === 0) {
      this.selectAllButtonTarget.textContent = "전체 선택"
      this.selectAllButtonTarget.classList.remove("text-red-600", "hover:text-red-800")
      this.selectAllButtonTarget.classList.add("text-blue-600", "hover:text-blue-800")
    } else if (checkedCount === totalCount) {
      this.selectAllButtonTarget.textContent = "전체 해제"
      this.selectAllButtonTarget.classList.remove("text-blue-600", "hover:text-blue-800")
      this.selectAllButtonTarget.classList.add("text-red-600", "hover:text-red-800")
    } else {
      this.selectAllButtonTarget.textContent = "전체 선택"
      this.selectAllButtonTarget.classList.remove("text-red-600", "hover:text-red-800")
      this.selectAllButtonTarget.classList.add("text-blue-600", "hover:text-blue-800")
    }
  }

  updateCheckboxStyle(checkbox) {
    const label = checkbox.closest('label')
    const indicator = label.querySelector('div')
    const svg = indicator.querySelector('svg')

    if (checkbox.checked) {
      // Selected state
      label.classList.remove('border-gray-200')
      label.classList.add('border-blue-500', 'bg-blue-50')
      indicator.classList.remove('border-gray-300')
      indicator.classList.add('bg-blue-500', 'border-blue-500')
      if (svg) svg.style.display = 'block'
    } else {
      // Unselected state
      label.classList.remove('border-blue-500', 'bg-blue-50')
      label.classList.add('border-gray-200')
      indicator.classList.remove('bg-blue-500', 'border-blue-500')
      indicator.classList.add('border-gray-300')
      if (svg) svg.style.display = 'none'
    }
  }

  getSelectedCheckboxes() {
    return this.checkboxTargets.filter(checkbox => checkbox.checked)
  }

  getSelectedValues() {
    return this.getSelectedCheckboxes().map(checkbox => checkbox.value)
  }

  setSelectedValues(values) {
    this.checkboxTargets.forEach(checkbox => {
      checkbox.checked = values.includes(checkbox.value)
      this.updateCheckboxStyle(checkbox)
    })
    
    this.updateSelectedCount()
    this.updateSelectAllButton()
  }

  dispatchSelectionChange() {
    const selectedValues = this.getSelectedValues()
    
    this.dispatch("selectionChanged", {
      detail: {
        name: this.nameValue,
        selected: selectedValues,
        count: selectedValues.length
      }
    })
  }

  // Auto-update checkbox styles when they change
  checkboxTargetConnected(element) {
    this.updateCheckboxStyle(element)
  }
}