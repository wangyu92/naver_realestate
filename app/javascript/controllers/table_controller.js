import { Controller } from "@hotwired/stimulus"

// Table controller for sorting, filtering, and enhanced interactions
export default class extends Controller {
  static targets = ["sortable", "row", "searchInput", "filterSelect", "tbody", "loadingOverlay"]
  static values = {
    sortColumn: String,
    sortDirection: { type: String, default: "asc" },
    searchColumns: Array,
    filterColumn: String
  }
  static classes = ["loading", "sortAsc", "sortDesc"]

  connect() {
    this.setupSorting()
    this.setupSearch()
    this.setupFiltering()
    this.setupRowSelection()
    this.originalRows = Array.from(this.rowTargets)
  }

  // Setup column sorting
  setupSorting() {
    this.sortableTargets.forEach(header => {
      header.addEventListener("click", this.handleSort.bind(this))
      header.setAttribute("role", "button")
      header.setAttribute("tabindex", "0")
      header.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          this.handleSort(event)
        }
      })
    })
  }

  // Handle column sorting
  handleSort(event) {
    const header = event.currentTarget
    const column = header.dataset.column
    
    // Remove sort classes from all headers
    this.sortableTargets.forEach(h => {
      h.classList.remove(this.sortAscClass || "sort-asc", this.sortDescClass || "sort-desc")
    })
    
    // Determine sort direction
    let direction = "asc"
    if (this.sortColumnValue === column && this.sortDirectionValue === "asc") {
      direction = "desc"
    }
    
    // Update values
    this.sortColumnValue = column
    this.sortDirectionValue = direction
    
    // Add appropriate class to header
    header.classList.add(direction === "asc" ? (this.sortAscClass || "sort-asc") : (this.sortDescClass || "sort-desc"))
    
    // Sort the rows
    this.sortRows(column, direction)
    
    // Dispatch event
    this.dispatch("sorted", {
      detail: { column, direction }
    })
  }

  // Sort table rows
  sortRows(column, direction) {
    const columnIndex = this.getColumnIndex(column)
    if (columnIndex === -1) return
    
    const rows = Array.from(this.rowTargets)
    
    rows.sort((a, b) => {
      const aValue = this.getCellValue(a, columnIndex)
      const bValue = this.getCellValue(b, columnIndex)
      
      // Handle different data types
      const aNum = parseFloat(aValue)
      const bNum = parseFloat(bValue)
      
      let comparison = 0
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        // Numeric comparison
        comparison = aNum - bNum
      } else if (this.isDate(aValue) && this.isDate(bValue)) {
        // Date comparison
        comparison = new Date(aValue) - new Date(bValue)
      } else {
        // String comparison
        comparison = aValue.localeCompare(bValue, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        })
      }
      
      return direction === "asc" ? comparison : -comparison
    })
    
    // Re-append sorted rows
    const tbody = this.tbodyTarget
    rows.forEach(row => tbody.appendChild(row))
  }

  // Get column index by column name
  getColumnIndex(column) {
    return this.sortableTargets.findIndex(header => header.dataset.column === column)
  }

  // Get cell value for sorting
  getCellValue(row, columnIndex) {
    const cell = row.cells[columnIndex]
    if (!cell) return ""
    
    // Check for data-sort-value attribute first
    if (cell.dataset.sortValue) {
      return cell.dataset.sortValue
    }
    
    // Otherwise use text content
    return cell.textContent.trim()
  }

  // Check if string is a date
  isDate(str) {
    return !isNaN(Date.parse(str))
  }

  // Setup search functionality
  setupSearch() {
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.addEventListener("input", this.debounce(this.handleSearch.bind(this), 300))
    }
  }

  // Handle search input
  handleSearch(event) {
    const query = event.target.value.toLowerCase()
    const searchColumns = this.searchColumnsValue || []
    
    this.rowTargets.forEach(row => {
      let shouldShow = false
      
      if (query === "") {
        shouldShow = true
      } else {
        // Search in specified columns or all columns if none specified
        const cellsToSearch = searchColumns.length > 0 
          ? searchColumns.map(col => this.getColumnIndex(col)).filter(idx => idx !== -1)
          : Array.from(row.cells).map((_, idx) => idx)
        
        shouldShow = cellsToSearch.some(colIndex => {
          const cellValue = this.getCellValue(row, colIndex).toLowerCase()
          return cellValue.includes(query)
        })
      }
      
      row.style.display = shouldShow ? "" : "none"
    })
    
    this.updateRowCount()
    
    // Dispatch event
    this.dispatch("searched", {
      detail: { query, visibleRows: this.getVisibleRows().length }
    })
  }

  // Setup filtering
  setupFiltering() {
    if (this.hasFilterSelectTarget) {
      this.filterSelectTarget.addEventListener("change", this.handleFilter.bind(this))
    }
  }

  // Handle filter selection
  handleFilter(event) {
    const filterValue = event.target.value
    const filterColumn = this.filterColumnValue
    
    if (!filterColumn) return
    
    const columnIndex = this.getColumnIndex(filterColumn)
    if (columnIndex === -1) return
    
    this.rowTargets.forEach(row => {
      let shouldShow = true
      
      if (filterValue && filterValue !== "") {
        const cellValue = this.getCellValue(row, columnIndex)
        shouldShow = cellValue === filterValue
      }
      
      row.style.display = shouldShow ? "" : "none"
    })
    
    this.updateRowCount()
    
    // Dispatch event
    this.dispatch("filtered", {
      detail: { filterValue, column: filterColumn, visibleRows: this.getVisibleRows().length }
    })
  }

  // Setup row selection
  setupRowSelection() {
    // Add click handlers to rows with selectable class
    this.rowTargets.forEach(row => {
      if (row.classList.contains("selectable")) {
        row.addEventListener("click", this.handleRowSelect.bind(this))
        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            this.handleRowSelect(event)
          }
        })
        row.setAttribute("tabindex", "0")
        row.setAttribute("role", "button")
      }
    })
  }

  // Handle row selection
  handleRowSelect(event) {
    const row = event.currentTarget
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      row.classList.toggle("selected")
    } else {
      // Single select
      this.rowTargets.forEach(r => r.classList.remove("selected"))
      row.classList.add("selected")
    }
    
    const selectedRows = this.getSelectedRows()
    
    // Dispatch event
    this.dispatch("selection-changed", {
      detail: { 
        selectedRows: selectedRows.length,
        selectedData: selectedRows.map(row => this.getRowData(row))
      }
    })
  }

  // Get selected rows
  getSelectedRows() {
    return this.rowTargets.filter(row => row.classList.contains("selected"))
  }

  // Get visible rows
  getVisibleRows() {
    return this.rowTargets.filter(row => row.style.display !== "none")
  }

  // Get row data
  getRowData(row) {
    const data = {}
    Array.from(row.cells).forEach((cell, index) => {
      const header = this.sortableTargets[index]
      const column = header?.dataset.column || `col_${index}`
      data[column] = this.getCellValue(row, index)
    })
    return data
  }

  // Update row count display
  updateRowCount() {
    const visibleRows = this.getVisibleRows().length
    const totalRows = this.rowTargets.length
    
    const countElement = this.element.querySelector(".table-row-count")
    if (countElement) {
      if (visibleRows === totalRows) {
        countElement.textContent = `Showing ${totalRows} ${totalRows === 1 ? "row" : "rows"}`
      } else {
        countElement.textContent = `Showing ${visibleRows} of ${totalRows} ${totalRows === 1 ? "row" : "rows"}`
      }
    }
  }

  // Show loading state
  showLoading() {
    if (this.hasLoadingOverlayTarget) {
      this.loadingOverlayTarget.style.display = "flex"
    } else {
      // Create loading overlay
      const overlay = document.createElement("div")
      overlay.className = "loading-overlay"
      overlay.innerHTML = '<div class="spinner"></div>'
      this.element.style.position = "relative"
      this.element.appendChild(overlay)
    }
    
    this.element.classList.add(this.loadingClass || "table-loading")
  }

  // Hide loading state
  hideLoading() {
    if (this.hasLoadingOverlayTarget) {
      this.loadingOverlayTarget.style.display = "none"
    } else {
      const overlay = this.element.querySelector(".loading-overlay")
      if (overlay) {
        overlay.remove()
      }
    }
    
    this.element.classList.remove(this.loadingClass || "table-loading")
  }

  // Clear all filters and search
  clearFilters() {
    // Clear search
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.value = ""
    }
    
    // Clear filter
    if (this.hasFilterSelectTarget) {
      this.filterSelectTarget.value = ""
    }
    
    // Show all rows
    this.rowTargets.forEach(row => {
      row.style.display = ""
    })
    
    this.updateRowCount()
    
    // Dispatch event
    this.dispatch("filters-cleared")
  }

  // Select all rows
  selectAll() {
    this.getVisibleRows().forEach(row => {
      if (row.classList.contains("selectable")) {
        row.classList.add("selected")
      }
    })
    
    this.dispatch("selection-changed", {
      detail: { 
        selectedRows: this.getSelectedRows().length,
        selectedData: this.getSelectedRows().map(row => this.getRowData(row))
      }
    })
  }

  // Deselect all rows
  deselectAll() {
    this.rowTargets.forEach(row => {
      row.classList.remove("selected")
    })
    
    this.dispatch("selection-changed", {
      detail: { selectedRows: 0, selectedData: [] }
    })
  }

  // Export visible data as CSV
  exportCSV() {
    const headers = this.sortableTargets.map(header => 
      header.textContent.trim().replace(/[",]/g, "")
    )
    
    const rows = this.getVisibleRows().map(row =>
      Array.from(row.cells).map(cell => 
        `"${this.getCellValue(row, Array.from(row.cells).indexOf(cell)).replace(/"/g, '""')}"`
      )
    )
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "table-export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    this.dispatch("exported", { detail: { format: "csv", rows: rows.length + 1 } })
  }

  // Refresh table data
  async refreshData(url) {
    if (!url) return
    
    this.showLoading()
    
    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "text/html",
          "X-Requested-With": "XMLHttpRequest"
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const newTbody = doc.querySelector("tbody")
        
        if (newTbody && this.hasTbodyTarget) {
          this.tbodyTarget.innerHTML = newTbody.innerHTML
          this.originalRows = Array.from(this.rowTargets)
          this.setupRowSelection()
          this.updateRowCount()
          
          this.dispatch("refreshed", { detail: { rows: this.rowTargets.length } })
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to refresh table data:", error)
      this.dispatch("refresh-error", { detail: { error: error.message } })
    } finally {
      this.hideLoading()
    }
  }

  // Utility: Debounce function
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Handle keyboard navigation
  handleKeyNavigation(event) {
    const focusedRow = document.activeElement
    if (!focusedRow.classList.contains("selectable")) return
    
    const rows = this.getVisibleRows()
    const currentIndex = rows.indexOf(focusedRow)
    
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (currentIndex < rows.length - 1) {
          rows[currentIndex + 1].focus()
        }
        break
        
      case "ArrowUp":
        event.preventDefault()
        if (currentIndex > 0) {
          rows[currentIndex - 1].focus()
        }
        break
        
      case "Home":
        event.preventDefault()
        if (rows.length > 0) {
          rows[0].focus()
        }
        break
        
      case "End":
        event.preventDefault()
        if (rows.length > 0) {
          rows[rows.length - 1].focus()
        }
        break
    }
  }
}