import { Controller } from "@hotwired/stimulus"

// Button controller for enhanced interactions
export default class extends Controller {
  static classes = ["loading"]
  static values = { 
    confirmMessage: String,
    loadingText: String,
    originalText: String
  }

  connect() {
    this.originalTextValue = this.element.textContent.trim()
  }

  // Handle click with optional confirmation
  click(event) {
    if (this.hasConfirmMessageValue && this.confirmMessageValue) {
      if (!confirm(this.confirmMessageValue)) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }
    
    // Show loading state if configured
    if (this.hasLoadingTextValue) {
      this.showLoading()
    }
  }

  // Show loading state
  showLoading() {
    if (this.hasLoadingClass) {
      this.element.classList.add(this.loadingClass)
    } else {
      this.element.classList.add("btn-loading")
    }
    
    this.element.disabled = true
    
    if (this.hasLoadingTextValue) {
      this.element.textContent = this.loadingTextValue
    }
    
    // Auto-hide loading after 5 seconds (safety measure)
    this.loadingTimeout = setTimeout(() => {
      this.hideLoading()
    }, 5000)
  }

  // Hide loading state
  hideLoading() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout)
      this.loadingTimeout = null
    }
    
    if (this.hasLoadingClass) {
      this.element.classList.remove(this.loadingClass)
    } else {
      this.element.classList.remove("btn-loading")
    }
    
    this.element.disabled = false
    this.element.textContent = this.originalTextValue
  }

  // Handle form submission completion
  turbo:submit-end() {
    this.hideLoading()
  }

  // Handle navigation away from page
  turbo:before-visit() {
    this.hideLoading()
  }

  // Cleanup on disconnect
  disconnect() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout)
    }
  }

  // Ripple effect for material-style interactions
  ripple(event) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const ripple = document.createElement("span")
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 600ms linear;
      background-color: rgba(255, 255, 255, 0.3);
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `
    
    // Add ripple styles if not already present
    if (!button.style.position || button.style.position === 'static') {
      button.style.position = 'relative'
    }
    if (button.style.overflow !== 'hidden') {
      button.style.overflow = 'hidden'
    }
    
    button.appendChild(ripple)
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Toggle button state (for toggle buttons)
  toggle() {
    this.element.classList.toggle("active")
    const pressed = this.element.classList.contains("active")
    this.element.setAttribute("aria-pressed", pressed)
    
    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent("button:toggle", {
      detail: { pressed },
      bubbles: true
    }))
  }

  // Focus management for accessibility
  focusNext() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const currentIndex = Array.from(focusableElements).indexOf(this.element)
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
    }
  }

  focusPrevious() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const currentIndex = Array.from(focusableElements).indexOf(this.element)
    const previousElement = focusableElements[currentIndex - 1]
    if (previousElement) {
      previousElement.focus()
    }
  }
}