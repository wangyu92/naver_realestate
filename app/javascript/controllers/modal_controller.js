import { Controller } from "@hotwired/stimulus"

// Modal controller for enhanced modal interactions
export default class extends Controller {
  static targets = ["backdrop", "content", "close"]
  static values = {
    keyboard: { type: Boolean, default: true },
    backdrop: { type: String, default: "true" }, // "true", "false", "static"
    focus: { type: Boolean, default: true },
    show: { type: Boolean, default: false }
  }
  static classes = ["show"]

  connect() {
    this.setupKeyboardHandling()
    this.setupFocusManagement()
    
    if (this.showValue) {
      this.show()
    }
    
    // Handle close buttons
    this.closeTargets.forEach(closeBtn => {
      closeBtn.addEventListener("click", this.hide.bind(this))
    })
    
    // Handle backdrop clicks
    if (this.hasBackdropTarget) {
      this.backdropTarget.addEventListener("click", this.handleBackdropClick.bind(this))
    }
  }

  disconnect() {
    this.hide()
    document.removeEventListener("keydown", this.handleKeydown)
  }

  // Show modal
  show() {
    if (this.element.classList.contains(this.showClass || "show")) {
      return
    }
    
    // Dispatch show event
    const showEvent = this.dispatch("show", { cancelable: true })
    if (showEvent.defaultPrevented) {
      return
    }
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = this.getScrollbarWidth() + "px"
    
    // Show modal
    this.element.classList.add(this.showClass || "show")
    this.element.style.display = "flex"
    
    // Focus management
    if (this.focusValue) {
      this.setInitialFocus()
    }
    
    // Setup focus trap
    this.setupFocusTrap()
    
    // Dispatch shown event
    setTimeout(() => {
      this.dispatch("shown")
    }, 300) // Wait for CSS transition
  }

  // Hide modal
  hide() {
    if (!this.element.classList.contains(this.showClass || "show")) {
      return
    }
    
    // Dispatch hide event
    const hideEvent = this.dispatch("hide", { cancelable: true })
    if (hideEvent.defaultPrevented) {
      return
    }
    
    // Hide modal
    this.element.classList.remove(this.showClass || "show")
    
    // Restore body scroll after animation
    setTimeout(() => {
      this.element.style.display = "none"
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
      
      // Restore focus
      if (this.previousActiveElement) {
        this.previousActiveElement.focus()
        this.previousActiveElement = null
      }
      
      // Dispatch hidden event
      this.dispatch("hidden")
    }, 300) // Wait for CSS transition
    
    // Remove focus trap
    this.removeFocusTrap()
  }

  // Toggle modal
  toggle() {
    if (this.element.classList.contains(this.showClass || "show")) {
      this.hide()
    } else {
      this.show()
    }
  }

  // Handle backdrop clicks
  handleBackdropClick(event) {
    if (event.target === this.backdropTarget) {
      if (this.backdropValue === "true") {
        this.hide()
      } else if (this.backdropValue === "static") {
        // Add shake animation for static backdrop
        this.contentTarget.style.animation = "modalShake 0.3s ease-in-out"
        setTimeout(() => {
          this.contentTarget.style.animation = ""
        }, 300)
      }
    }
  }

  // Setup keyboard handling
  setupKeyboardHandling() {
    this.handleKeydown = this.handleKeydown.bind(this)
    document.addEventListener("keydown", this.handleKeydown)
  }

  // Handle keyboard events
  handleKeydown(event) {
    if (!this.element.classList.contains(this.showClass || "show")) {
      return
    }
    
    switch (event.key) {
      case "Escape":
        if (this.keyboardValue) {
          event.preventDefault()
          this.hide()
        }
        break
        
      case "Tab":
        this.handleTabKey(event)
        break
    }
  }

  // Setup focus management
  setupFocusManagement() {
    // Store the element that had focus before modal opened
    this.previousActiveElement = document.activeElement
  }

  // Set initial focus
  setInitialFocus() {
    // Try to focus on first input, then first focusable element, then close button
    const focusableElements = this.getFocusableElements()
    const firstInput = this.element.querySelector("input, textarea, select")
    
    if (firstInput && !firstInput.disabled) {
      firstInput.focus()
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  // Get focusable elements
  getFocusableElements() {
    return this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  }

  // Setup focus trap
  setupFocusTrap() {
    const focusableElements = this.getFocusableElements()
    this.firstFocusableElement = focusableElements[0]
    this.lastFocusableElement = focusableElements[focusableElements.length - 1]
  }

  // Remove focus trap
  removeFocusTrap() {
    this.firstFocusableElement = null
    this.lastFocusableElement = null
  }

  // Handle tab key for focus trapping
  handleTabKey(event) {
    if (!this.firstFocusableElement || !this.lastFocusableElement) {
      return
    }
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault()
        this.lastFocusableElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault()
        this.firstFocusableElement.focus()
      }
    }
  }

  // Get scrollbar width
  getScrollbarWidth() {
    const scrollDiv = document.createElement("div")
    scrollDiv.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;"
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  // Resize modal content
  resize() {
    if (this.hasContentTarget) {
      const maxHeight = window.innerHeight * 0.9
      this.contentTarget.style.maxHeight = maxHeight + "px"
    }
  }

  // Auto-resize on window resize
  handleResize() {
    if (this.element.classList.contains(this.showClass || "show")) {
      this.resize()
    }
  }
}