import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="dropdown"
export default class extends Controller {
  static targets = ["menu"]
  static classes = ["open"]

  toggle() {
    if (this.menuTarget.classList.contains("hidden")) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    this.menuTarget.classList.remove("hidden")
    this.element.classList.add(...this.openClasses)
    
    // Close dropdown when clicking outside
    document.addEventListener("click", this.closeOnClickOutside.bind(this))
  }

  close() {
    this.menuTarget.classList.add("hidden")
    this.element.classList.remove(...this.openClasses)
    
    // Remove event listener
    document.removeEventListener("click", this.closeOnClickOutside.bind(this))
  }

  closeOnClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  disconnect() {
    document.removeEventListener("click", this.closeOnClickOutside.bind(this))
  }
}