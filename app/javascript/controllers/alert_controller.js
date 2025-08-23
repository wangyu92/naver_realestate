import { Controller } from "@hotwired/stimulus"

// Alert and notification controller
export default class extends Controller {
  static targets = ["close"]
  static values = {
    dismissible: { type: Boolean, default: true },
    autoHide: { type: Boolean, default: false },
    delay: { type: Number, default: 5000 },
    animation: { type: String, default: "fade" }
  }

  connect() {
    this.setupCloseHandlers()
    this.setupAutoHide()
  }

  disconnect() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout)
    }
  }

  // Setup close button handlers
  setupCloseHandlers() {
    this.closeTargets.forEach(closeBtn => {
      closeBtn.addEventListener("click", this.close.bind(this))
    })
  }

  // Setup auto-hide functionality
  setupAutoHide() {
    if (this.autoHideValue) {
      this.autoHideTimeout = setTimeout(() => {
        this.close()
      }, this.delayValue)
    }
  }

  // Close alert
  close(event) {
    if (event) {
      event.preventDefault()
    }
    
    if (!this.dismissibleValue) {
      return
    }
    
    // Dispatch close event
    const closeEvent = this.dispatch("close", { cancelable: true })
    if (closeEvent.defaultPrevented) {
      return
    }
    
    this.animateClose()
  }

  // Animate alert closure
  animateClose() {
    const animation = this.animationValue
    
    switch (animation) {
      case "slide":
        this.slideOut()
        break
      case "scale":
        this.scaleOut()
        break
      case "fade":
      default:
        this.fadeOut()
        break
    }
  }

  // Fade out animation
  fadeOut() {
    this.element.style.transition = "opacity 0.3s ease, transform 0.3s ease"
    this.element.style.opacity = "0"
    this.element.style.transform = "translateY(-10px)"
    
    setTimeout(() => {
      this.remove()
    }, 300)
  }

  // Slide out animation
  slideOut() {
    const height = this.element.offsetHeight
    
    this.element.style.transition = "all 0.3s ease"
    this.element.style.height = height + "px"
    this.element.style.overflow = "hidden"
    
    requestAnimationFrame(() => {
      this.element.style.height = "0"
      this.element.style.paddingTop = "0"
      this.element.style.paddingBottom = "0"
      this.element.style.marginTop = "0"
      this.element.style.marginBottom = "0"
      this.element.style.opacity = "0"
    })
    
    setTimeout(() => {
      this.remove()
    }, 300)
  }

  // Scale out animation
  scaleOut() {
    this.element.style.transition = "all 0.3s ease"
    this.element.style.transform = "scale(0.8)"
    this.element.style.opacity = "0"
    
    setTimeout(() => {
      this.remove()
    }, 300)
  }

  // Remove element from DOM
  remove() {
    // Dispatch closed event
    this.dispatch("closed")
    
    // Remove element
    this.element.remove()
  }

  // Reset auto-hide timer
  resetAutoHide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout)
    }
    
    if (this.autoHideValue) {
      this.autoHideTimeout = setTimeout(() => {
        this.close()
      }, this.delayValue)
    }
  }

  // Pause auto-hide (on hover)
  pauseAutoHide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout)
    }
  }

  // Resume auto-hide
  resumeAutoHide() {
    if (this.autoHideValue) {
      this.autoHideTimeout = setTimeout(() => {
        this.close()
      }, this.delayValue)
    }
  }

  // Static methods for creating alerts programmatically
  static show(message, type = "info", options = {}) {
    const alertElement = this.createElement(message, type, options)
    const container = this.getContainer(options.container)
    
    container.appendChild(alertElement)
    
    // Animate in
    requestAnimationFrame(() => {
      alertElement.style.opacity = "1"
      alertElement.style.transform = "translateY(0)"
    })
    
    return alertElement
  }

  static createElement(message, type, options) {
    const alert = document.createElement("div")
    alert.className = `alert alert-${type} ${options.dismissible !== false ? "alert-dismissible" : ""}`
    alert.setAttribute("data-controller", "alert")
    alert.setAttribute("data-alert-dismissible-value", options.dismissible !== false)
    alert.setAttribute("data-alert-auto-hide-value", options.autoHide || false)
    alert.setAttribute("data-alert-delay-value", options.delay || 5000)
    
    // Initial animation state
    alert.style.opacity = "0"
    alert.style.transform = "translateY(-10px)"
    alert.style.transition = "all 0.3s ease"
    
    let content = ""
    
    if (options.icon) {
      content += `<div class="alert-with-icon">
        <div class="alert-icon">${options.icon}</div>
        <div>`
    }
    
    if (options.title) {
      content += `<div class="alert-heading">${options.title}</div>`
    }
    
    content += message
    
    if (options.icon) {
      content += `</div></div>`
    }
    
    if (options.dismissible !== false) {
      content += `<button type="button" class="alert-close" data-alert-target="close" aria-label="Close">×</button>`
    }
    
    alert.innerHTML = content
    
    return alert
  }

  static getContainer(selector) {
    if (selector) {
      return document.querySelector(selector)
    }
    
    // Create default container if it doesn't exist
    let container = document.querySelector(".alert-container")
    if (!container) {
      container = document.createElement("div")
      container.className = "alert-container"
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        z-index: 1070;
        pointer-events: none;
      `
      container.style.pointerEvents = "none"
      document.body.appendChild(container)
    }
    
    return container
  }

  // Convenience methods for different alert types
  static success(message, options = {}) {
    return this.show(message, "success", {
      icon: "✅",
      ...options
    })
  }

  static warning(message, options = {}) {
    return this.show(message, "warning", {
      icon: "⚠️",
      ...options
    })
  }

  static danger(message, options = {}) {
    return this.show(message, "danger", {
      icon: "❌",
      ...options
    })
  }

  static info(message, options = {}) {
    return this.show(message, "info", {
      icon: "ℹ️",
      ...options
    })
  }
}

// Toast notification controller
window.AlertController = AlertController

// Global toast methods
window.showToast = function(message, type = "info", options = {}) {
  return AlertController.show(message, type, {
    autoHide: true,
    delay: 3000,
    container: ".toast-container",
    ...options
  })
}

window.showSuccess = function(message, options = {}) {
  return showToast(message, "success", options)
}

window.showWarning = function(message, options = {}) {
  return showToast(message, "warning", options)
}

window.showError = function(message, options = {}) {
  return showToast(message, "danger", options)
}

window.showInfo = function(message, options = {}) {
  return showToast(message, "info", options)
}