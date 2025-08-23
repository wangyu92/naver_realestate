import { Controller } from "@hotwired/stimulus"

// Enhanced form controller for real estate app
export default class extends Controller {
  static targets = ["input", "error", "submit", "fileInput", "filePreview", "priceInput"]
  static values = {
    autoSave: Boolean,
    validateOnChange: Boolean,
    priceFormat: String
  }

  connect() {
    this.setupValidation()
    this.setupFileHandling()
    this.setupPriceFormatting()
    this.setupAutoSave()
  }

  // Form validation setup
  setupValidation() {
    if (this.validateOnChangeValue) {
      this.inputTargets.forEach(input => {
        input.addEventListener("input", this.validateField.bind(this))
        input.addEventListener("blur", this.validateField.bind(this))
      })
    }
  }

  // Validate individual field
  validateField(event) {
    const field = event.target
    const fieldGroup = field.closest(".form-group")
    const errorElement = fieldGroup?.querySelector(".form-error")
    
    // Clear previous validation state
    field.classList.remove("is-valid", "is-invalid")
    if (errorElement) {
      errorElement.textContent = ""
    }
    
    let isValid = true
    let errorMessage = ""
    
    // Required field validation
    if (field.hasAttribute("required") && !field.value.trim()) {
      isValid = false
      errorMessage = `${this.getFieldLabel(field)} is required`
    }
    
    // Email validation
    if (field.type === "email" && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(field.value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }
    
    // Phone validation
    if (field.name === "phone" && field.value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ""))) {
        isValid = false
        errorMessage = "Please enter a valid phone number"
      }
    }
    
    // Price validation (positive numbers only)
    if (field.classList.contains("price-input") && field.value) {
      const price = parseFloat(field.value.replace(/[^0-9.]/g, ""))
      if (isNaN(price) || price < 0) {
        isValid = false
        errorMessage = "Please enter a valid price"
      }
    }
    
    // Custom validation
    const customValidation = field.dataset.validation
    if (customValidation && field.value) {
      try {
        const validationFn = new Function("value", customValidation)
        const result = validationFn(field.value)
        if (result !== true) {
          isValid = false
          errorMessage = typeof result === "string" ? result : "Invalid input"
        }
      } catch (e) {
        console.warn("Invalid validation function:", e)
      }
    }
    
    // Apply validation result
    if (isValid) {
      field.classList.add("is-valid")
    } else {
      field.classList.add("is-invalid")
      if (errorElement) {
        errorElement.textContent = errorMessage
      }
    }
    
    this.updateSubmitButton()
    return isValid
  }

  // Validate entire form
  validateForm() {
    let isValid = true
    
    this.inputTargets.forEach(input => {
      const fieldValid = this.validateField({ target: input })
      if (!fieldValid) {
        isValid = false
      }
    })
    
    return isValid
  }

  // Get field label for error messages
  getFieldLabel(field) {
    const label = this.element.querySelector(`label[for="${field.id}"]`)
    if (label) {
      return label.textContent.replace("*", "").trim()
    }
    
    return field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/_/g, " ")
  }

  // Update submit button state
  updateSubmitButton() {
    if (this.hasSubmitTarget) {
      const hasErrors = this.element.querySelectorAll(".is-invalid").length > 0
      const isEmpty = this.inputTargets.some(input => 
        input.hasAttribute("required") && !input.value.trim()
      )
      
      this.submitTarget.disabled = hasErrors || isEmpty
    }
  }

  // Handle form submission
  submit(event) {
    if (!this.validateForm()) {
      event.preventDefault()
      event.stopPropagation()
      
      // Focus on first invalid field
      const firstInvalid = this.element.querySelector(".is-invalid")
      if (firstInvalid) {
        firstInvalid.focus()
      }
      
      return false
    }
    
    // Show loading state on submit button
    if (this.hasSubmitTarget) {
      this.submitTarget.classList.add("btn-loading")
      this.submitTarget.disabled = true
    }
  }

  // File handling setup
  setupFileHandling() {
    this.fileInputTargets.forEach(input => {
      input.addEventListener("change", this.handleFileChange.bind(this))
      
      // Setup drag and drop if container has drop class
      const container = input.closest(".form-file-drop")
      if (container) {
        this.setupDragDrop(container, input)
      }
    })
  }

  // Handle file selection
  handleFileChange(event) {
    const input = event.target
    const files = Array.from(input.files)
    const previewContainer = this.element.querySelector(`[data-preview-for="${input.id}"]`)
    
    if (previewContainer) {
      this.displayFilePreview(files, previewContainer)
    }
    
    // Validate file size and type
    files.forEach(file => {
      this.validateFile(file, input)
    })
  }

  // Setup drag and drop functionality
  setupDragDrop(container, input) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      container.addEventListener(eventName, this.preventDefaults, false)
    })
    
    ;["dragenter", "dragover"].forEach(eventName => {
      container.addEventListener(eventName, () => container.classList.add("dragover"), false)
    })
    
    ;["dragleave", "drop"].forEach(eventName => {
      container.addEventListener(eventName, () => container.classList.remove("dragover"), false)
    })
    
    container.addEventListener("drop", (event) => {
      const files = event.dataTransfer.files
      input.files = files
      this.handleFileChange({ target: input })
    }, false)
  }

  preventDefaults(event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // Display file preview
  displayFilePreview(files, container) {
    container.innerHTML = ""
    
    files.forEach(file => {
      const preview = document.createElement("div")
      preview.className = "file-preview-item"
      
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img")
        img.src = URL.createObjectURL(file)
        img.onload = () => URL.revokeObjectURL(img.src)
        img.style.cssText = "max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 4px;"
        preview.appendChild(img)
      } else {
        preview.textContent = file.name
      }
      
      const size = document.createElement("small")
      size.textContent = ` (${this.formatFileSize(file.size)})`
      size.style.color = "var(--color-gray-500)"
      preview.appendChild(size)
      
      container.appendChild(preview)
    })
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Validate file
  validateFile(file, input) {
    const maxSize = input.dataset.maxSize ? parseInt(input.dataset.maxSize) : 5 * 1024 * 1024 // 5MB default
    const allowedTypes = input.dataset.allowedTypes ? input.dataset.allowedTypes.split(",") : []
    
    let isValid = true
    let errorMessage = ""
    
    if (file.size > maxSize) {
      isValid = false
      errorMessage = `File size must be less than ${this.formatFileSize(maxSize)}`
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
      isValid = false
      errorMessage = `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    }
    
    if (!isValid) {
      const fieldGroup = input.closest(".form-group")
      const errorElement = fieldGroup?.querySelector(".form-error")
      if (errorElement) {
        errorElement.textContent = errorMessage
      }
      input.classList.add("is-invalid")
    }
  }

  // Price formatting setup
  setupPriceFormatting() {
    this.priceInputTargets.forEach(input => {
      input.addEventListener("input", this.formatPrice.bind(this))
      input.addEventListener("blur", this.formatPrice.bind(this))
    })
  }

  // Format price input
  formatPrice(event) {
    const input = event.target
    let value = input.value.replace(/[^0-9.]/g, "")
    
    if (value) {
      const number = parseFloat(value)
      if (!isNaN(number)) {
        if (event.type === "blur") {
          input.value = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: this.priceFormatValue || "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(number)
        } else {
          // During typing, just add commas
          input.value = number.toLocaleString("en-US")
        }
      }
    }
  }

  // Auto-save setup
  setupAutoSave() {
    if (this.autoSaveValue) {
      this.autoSaveTimeout = null
      this.inputTargets.forEach(input => {
        input.addEventListener("input", this.scheduleAutoSave.bind(this))
      })
    }
  }

  // Schedule auto-save
  scheduleAutoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      this.autoSave()
    }, 2000) // Auto-save after 2 seconds of inactivity
  }

  // Perform auto-save
  autoSave() {
    const formData = new FormData(this.element)
    
    // Add auto-save indicator
    const indicator = document.createElement("div")
    indicator.textContent = "Saving..."
    indicator.className = "auto-save-indicator"
    indicator.style.cssText = "position: fixed; top: 20px; right: 20px; background: var(--color-primary); color: white; padding: 8px 16px; border-radius: 4px; z-index: 1000; font-size: 14px;"
    document.body.appendChild(indicator)
    
    fetch(this.element.action || window.location.pathname, {
      method: "PATCH",
      body: formData,
      headers: {
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        "X-Auto-Save": "true"
      }
    })
    .then(response => {
      if (response.ok) {
        indicator.textContent = "Saved"
        indicator.style.backgroundColor = "var(--color-success)"
      } else {
        throw new Error("Auto-save failed")
      }
    })
    .catch(() => {
      indicator.textContent = "Save failed"
      indicator.style.backgroundColor = "var(--color-danger)"
    })
    .finally(() => {
      setTimeout(() => {
        indicator.remove()
      }, 2000)
    })
  }

  // Property search specific methods
  updatePriceRange(event) {
    const slider = event.target
    const output = this.element.querySelector(`[data-output-for="${slider.id}"]`)
    if (output) {
      const value = parseInt(slider.value)
      output.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }
  }

  // Reset form with animations
  reset() {
    this.element.reset()
    
    // Clear validation states
    this.element.querySelectorAll(".is-valid, .is-invalid").forEach(field => {
      field.classList.remove("is-valid", "is-invalid")
    })
    
    // Clear error messages
    this.element.querySelectorAll(".form-error").forEach(error => {
      error.textContent = ""
    })
    
    // Clear file previews
    this.element.querySelectorAll("[data-preview-for]").forEach(preview => {
      preview.innerHTML = ""
    })
    
    this.updateSubmitButton()
    
    // Animate reset
    this.element.style.opacity = "0.5"
    setTimeout(() => {
      this.element.style.opacity = "1"
    }, 200)
  }

  // Cleanup
  disconnect() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }
  }
}