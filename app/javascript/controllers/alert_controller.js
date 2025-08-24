import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="alert"
export default class extends Controller {
  dismiss() {
    // Fade out animation
    this.element.style.transition = "opacity 0.3s ease-out"
    this.element.style.opacity = "0"
    
    // Remove element after animation
    setTimeout(() => {
      this.element.remove()
    }, 300)
  }

  // Auto-dismiss after specified time (in milliseconds)
  autoDismiss(event) {
    const delay = event.params?.delay || 5000
    setTimeout(() => {
      if (this.element.isConnected) {
        this.dismiss()
      }
    }, delay)
  }
}