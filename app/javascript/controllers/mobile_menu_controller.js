import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="mobile-menu"
export default class extends Controller {
  static targets = ["menu", "overlay", "hamburger"]

  toggle() {
    if (this.menuTarget.classList.contains("hidden")) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    this.menuTarget.classList.remove("hidden")
    if (this.hasOverlayTarget) {
      this.overlayTarget.classList.remove("hidden")
    }
    
    // Prevent body scroll
    document.body.classList.add("overflow-hidden")
    
    // Update hamburger icon
    this.updateHamburgerIcon(true)
    
    // Close menu when clicking outside
    document.addEventListener("click", this.closeOnClickOutside.bind(this))
  }

  close() {
    this.menuTarget.classList.add("hidden")
    if (this.hasOverlayTarget) {
      this.overlayTarget.classList.add("hidden")
    }
    
    // Restore body scroll
    document.body.classList.remove("overflow-hidden")
    
    // Update hamburger icon
    this.updateHamburgerIcon(false)
    
    // Remove event listener
    document.removeEventListener("click", this.closeOnClickOutside.bind(this))
  }

  closeOnClickOutside(event) {
    if (this.hasOverlayTarget && event.target === this.overlayTarget) {
      this.close()
    }
  }

  updateHamburgerIcon(isOpen) {
    if (this.hasHamburgerTarget) {
      const lines = this.hamburgerTarget.querySelectorAll('span')
      if (isOpen) {
        // Transform to X
        lines[0]?.classList.add('rotate-45', 'translate-y-1.5')
        lines[1]?.classList.add('opacity-0')
        lines[2]?.classList.add('-rotate-45', '-translate-y-1.5')
      } else {
        // Back to hamburger
        lines[0]?.classList.remove('rotate-45', 'translate-y-1.5')
        lines[1]?.classList.remove('opacity-0')
        lines[2]?.classList.remove('-rotate-45', '-translate-y-1.5')
      }
    }
  }

  disconnect() {
    document.body.classList.remove("overflow-hidden")
    document.removeEventListener("click", this.closeOnClickOutside.bind(this))
  }
}