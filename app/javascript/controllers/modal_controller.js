import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["backdrop", "content"]

  connect() {
    // Hide modal by default
    this.element.classList.add("hidden")
  }

  open() {
    this.element.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
    
    // Focus management
    this.previousActiveElement = document.activeElement
    this.contentTarget.focus()
  }

  close() {
    this.element.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
    
    // Restore focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus()
    }
  }

  closeOnBackdrop(event) {
    if (event.target === this.backdropTarget) {
      this.close()
    }
  }

  closeOnEscape(event) {
    if (event.key === "Escape" && !this.element.classList.contains("hidden")) {
      this.close()
    }
  }

  disconnect() {
    document.body.classList.remove("overflow-hidden")
  }
}