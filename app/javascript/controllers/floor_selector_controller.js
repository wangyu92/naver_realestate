import { Controller } from "@hotwired/stimulus"

// Floor selector controller for current/total floor input parsing
export default class extends Controller {
  static targets = ["input", "validation", "helpText", "helpButton", "result"]

  connect() {
    this.parseInput()
  }

  validateInput() {
    const value = this.inputTarget.value.trim()
    this.showValidation(this.validateFloorFormat(value))
  }

  parseInput() {
    const value = this.inputTarget.value.trim()
    if (!value) {
      this.clearResults()
      return
    }

    const validation = this.validateFloorFormat(value)
    this.showValidation(validation)

    if (validation.isValid) {
      const parsed = this.parseFloorString(value)
      this.showResult(parsed)
      this.dispatchFloorChange(parsed)
    } else {
      this.clearResults()
    }
  }

  selectQuickOption(event) {
    const button = event.currentTarget
    const current = button.dataset.current
    const total = button.dataset.total
    
    let floorString = ""
    if (current.includes('-')) {
      // Range format
      if (total && total !== "null") {
        floorString = `${current}/${total}`
      } else {
        floorString = current
      }
    } else if (current === "8" && !total) {
      // Special case for "8층 이상"
      floorString = "8+"
    } else {
      // Single floor
      if (total && total !== "null") {
        floorString = `${current}/${total}`
      } else {
        floorString = current
      }
    }
    
    this.inputTarget.value = floorString
    this.parseInput()
  }

  toggleHelp() {
    this.helpTextTarget.classList.toggle('hidden')
  }

  validateFloorFormat(value) {
    if (!value) {
      return { isValid: true, message: "" }
    }

    // Patterns to match:
    // 5/15, 10-12/20, 1, 8+, 1-3
    const patterns = [
      /^\d+\/\d+$/, // 5/15
      /^\d+-\d+\/\d+$/, // 10-12/20  
      /^\d+$/, // 1
      /^\d+\+$/, // 8+
      /^\d+-\d+$/ // 1-3
    ]

    const isValid = patterns.some(pattern => pattern.test(value))
    
    if (!isValid) {
      return {
        isValid: false,
        message: "올바른 형식이 아닙니다. 예: 5/15, 10-12/20, 1, 8+, 1-3"
      }
    }

    // Additional validation for ranges
    const rangeMatch = value.match(/^(\d+)-(\d+)/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1])
      const end = parseInt(rangeMatch[2])
      if (start >= end) {
        return {
          isValid: false,
          message: "시작 층수는 끝 층수보다 작아야 합니다"
        }
      }
    }

    // Validation for current/total format
    const currentTotalMatch = value.match(/^(\d+(?:-\d+)?)\/(\d+)$/)
    if (currentTotalMatch) {
      const totalFloors = parseInt(currentTotalMatch[2])
      const currentPart = currentTotalMatch[1]
      
      if (currentPart.includes('-')) {
        const [start, end] = currentPart.split('-').map(Number)
        if (end > totalFloors) {
          return {
            isValid: false,
            message: "현재 층수는 총 층수를 초과할 수 없습니다"
          }
        }
      } else {
        const currentFloor = parseInt(currentPart)
        if (currentFloor > totalFloors) {
          return {
            isValid: false,
            message: "현재 층수는 총 층수를 초과할 수 없습니다"
          }
        }
      }
    }

    return { isValid: true, message: "올바른 형식입니다" }
  }

  parseFloorString(value) {
    const result = {
      input: value,
      type: 'single',
      current: { min: null, max: null },
      total: null,
      description: ''
    }

    // Pattern: 5/15 (current/total)
    let match = value.match(/^(\d+)\/(\d+)$/)
    if (match) {
      result.current.min = result.current.max = parseInt(match[1])
      result.total = parseInt(match[2])
      result.description = `${match[1]}층 (총 ${match[2]}층)`
      return result
    }

    // Pattern: 10-12/20 (range/total)
    match = value.match(/^(\d+)-(\d+)\/(\d+)$/)
    if (match) {
      result.type = 'range'
      result.current.min = parseInt(match[1])
      result.current.max = parseInt(match[2])
      result.total = parseInt(match[3])
      result.description = `${match[1]}~${match[2]}층 (총 ${match[3]}층)`
      return result
    }

    // Pattern: 8+ (8층 이상)
    match = value.match(/^(\d+)\+$/)
    if (match) {
      result.type = 'min'
      result.current.min = parseInt(match[1])
      result.current.max = 999
      result.description = `${match[1]}층 이상`
      return result
    }

    // Pattern: 1-3 (range)
    match = value.match(/^(\d+)-(\d+)$/)
    if (match) {
      result.type = 'range'
      result.current.min = parseInt(match[1])
      result.current.max = parseInt(match[2])
      result.description = `${match[1]}~${match[2]}층`
      return result
    }

    // Pattern: 1 (single floor)
    match = value.match(/^(\d+)$/)
    if (match) {
      result.current.min = result.current.max = parseInt(match[1])
      result.description = `${match[1]}층`
      return result
    }

    return result
  }

  showValidation(validation) {
    if (!this.hasValidationTarget) return

    if (validation.isValid) {
      this.validationTarget.innerHTML = `
        <span class="text-green-600">✓ ${validation.message}</span>
      `
    } else {
      this.validationTarget.innerHTML = `
        <span class="text-red-600">✗ ${validation.message}</span>
      `
    }
  }

  showResult(parsed) {
    if (!this.hasResultTarget) return

    this.resultTarget.innerHTML = `
      <div class="text-sm">
        <span class="font-medium text-gray-700">해석:</span>
        <span class="text-blue-600">${parsed.description}</span>
      </div>
    `
  }

  clearResults() {
    if (this.hasValidationTarget) {
      this.validationTarget.innerHTML = ""
    }
    if (this.hasResultTarget) {
      this.resultTarget.innerHTML = ""
    }
  }

  dispatchFloorChange(parsed) {
    this.dispatch("floorChanged", {
      detail: {
        input: parsed.input,
        type: parsed.type,
        current: parsed.current,
        total: parsed.total,
        description: parsed.description
      }
    })
  }
}