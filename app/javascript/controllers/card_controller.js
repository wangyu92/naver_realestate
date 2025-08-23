import { Controller } from "@hotwired/stimulus"

// Card controller for interactive cards
export default class extends Controller {
  static targets = ["favorite", "share", "image", "details"]
  static values = { 
    propertyId: String,
    favorited: Boolean,
    shareUrl: String
  }
  static classes = ["favorited", "expanded"]

  connect() {
    if (this.favoritedValue) {
      this.favoriteTarget?.classList.add("active")
    }
    
    // Setup image lazy loading
    this.setupLazyLoading()
    
    // Setup touch gestures for mobile
    this.setupTouchGestures()
  }

  // Toggle favorite status
  favorite(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const isFavorited = this.favoriteTarget.classList.contains("active")
    
    if (isFavorited) {
      this.removeFavorite()
    } else {
      this.addFavorite()
    }
  }

  // Add to favorites
  async addFavorite() {
    try {
      const response = await fetch("/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify({
          property_id: this.propertyIdValue
        })
      })
      
      if (response.ok) {
        this.favoriteTarget.classList.add("active")
        this.favoritedValue = true
        
        // Add heart animation
        this.animateHeart()
        
        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent("property:favorited", {
          detail: { propertyId: this.propertyIdValue },
          bubbles: true
        }))
      }
    } catch (error) {
      console.error("Failed to add favorite:", error)
      this.showToast("Failed to add to favorites", "error")
    }
  }

  // Remove from favorites
  async removeFavorite() {
    try {
      const response = await fetch(`/favorites/${this.propertyIdValue}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        }
      })
      
      if (response.ok) {
        this.favoriteTarget.classList.remove("active")
        this.favoritedValue = false
        
        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent("property:unfavorited", {
          detail: { propertyId: this.propertyIdValue },
          bubbles: true
        }))
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      this.showToast("Failed to remove from favorites", "error")
    }
  }

  // Animate heart icon
  animateHeart() {
    const heart = this.favoriteTarget
    
    // Create floating hearts animation
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const floatingHeart = document.createElement("span")
        floatingHeart.textContent = "❤️"
        floatingHeart.style.cssText = `
          position: absolute;
          pointer-events: none;
          font-size: 1.5rem;
          z-index: 1000;
          animation: float-heart 2s ease-out forwards;
        `
        
        const rect = heart.getBoundingClientRect()
        floatingHeart.style.left = `${rect.left + Math.random() * 20}px`
        floatingHeart.style.top = `${rect.top}px`
        
        document.body.appendChild(floatingHeart)
        
        setTimeout(() => {
          floatingHeart.remove()
        }, 2000)
      }, i * 100)
    }
    
    // Pulse animation for the button
    heart.style.animation = "heart-pulse 0.6s ease-out"
    setTimeout(() => {
      heart.style.animation = ""
    }, 600)
  }

  // Share property
  async share(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const shareUrl = this.shareUrlValue || window.location.href
    const shareData = {
      title: this.element.querySelector(".property-card-title, .card-title")?.textContent || "Check out this property",
      text: "Found this amazing property you might be interested in!",
      url: shareUrl
    }
    
    // Use native share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        this.showToast("Shared successfully!", "success")
      } catch (error) {
        if (error.name !== "AbortError") {
          this.fallbackShare(shareUrl)
        }
      }
    } else {
      this.fallbackShare(shareUrl)
    }
  }

  // Fallback share options
  fallbackShare(url) {
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      this.showToast("Link copied to clipboard!", "success")
    }).catch(() => {
      // Show share modal with social options
      this.showShareModal(url)
    })
  }

  // Show share modal
  showShareModal(url) {
    const modal = document.createElement("div")
    modal.className = "share-modal"
    modal.innerHTML = `
      <div class="share-modal-overlay"></div>
      <div class="share-modal-content">
        <h3>Share this property</h3>
        <div class="share-options">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-option facebook">
            📘 Facebook
          </a>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}" target="_blank" class="share-option twitter">
            🐦 Twitter
          </a>
          <a href="mailto:?subject=Check out this property&body=${encodeURIComponent(url)}" class="share-option email">
            📧 Email
          </a>
          <button class="share-option copy-link" data-url="${url}">
            📋 Copy Link
          </button>
        </div>
        <button class="share-modal-close">×</button>
      </div>
    `
    
    // Add styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `
    
    document.body.appendChild(modal)
    
    // Event listeners
    modal.querySelector(".share-modal-overlay").addEventListener("click", () => {
      modal.remove()
    })
    
    modal.querySelector(".share-modal-close").addEventListener("click", () => {
      modal.remove()
    })
    
    modal.querySelector(".copy-link").addEventListener("click", (e) => {
      navigator.clipboard.writeText(e.target.dataset.url)
      this.showToast("Link copied!", "success")
      modal.remove()
    })
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove()
      }
    }, 10000)
  }

  // Handle card click for navigation
  navigate(event) {
    // Don't navigate if clicking on interactive elements
    if (event.target.closest("button, a, .property-card-favorite, .property-card-share")) {
      return
    }
    
    const propertyUrl = this.element.dataset.propertyUrl || `/properties/${this.propertyIdValue}`
    
    if (event.metaKey || event.ctrlKey) {
      // Open in new tab
      window.open(propertyUrl, "_blank")
    } else {
      // Normal navigation
      window.location.href = propertyUrl
    }
  }

  // Setup image lazy loading
  setupLazyLoading() {
    const images = this.element.querySelectorAll("img[data-src]")
    
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove("lazy")
            observer.unobserve(img)
          }
        })
      })
      
      images.forEach(img => {
        imageObserver.observe(img)
      })
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src
      })
    }
  }

  // Setup touch gestures for mobile
  setupTouchGestures() {
    let startY = 0
    let startX = 0
    
    this.element.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
    }, { passive: true })
    
    this.element.addEventListener("touchend", (event) => {
      const endX = event.changedTouches[0].clientX
      const endY = event.changedTouches[0].clientY
      const deltaX = endX - startX
      const deltaY = endY - startY
      
      // Detect swipe gestures
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
        if (deltaX > 0) {
          // Swipe right - add to favorites
          this.addFavorite()
        } else {
          // Swipe left - share
          this.share(event)
        }
      }
    }, { passive: true })
  }

  // Expand/collapse card details
  toggleDetails(event) {
    event.preventDefault()
    event.stopPropagation()
    
    if (this.hasDetailsTarget) {
      const isExpanded = this.detailsTarget.classList.contains("expanded")
      
      if (isExpanded) {
        this.collapseDetails()
      } else {
        this.expandDetails()
      }
    }
  }

  // Expand card details
  expandDetails() {
    this.detailsTarget.classList.add("expanded")
    this.element.classList.add(this.expandedClass || "card-expanded")
    
    // Animate height
    const height = this.detailsTarget.scrollHeight
    this.detailsTarget.style.height = `${height}px`
    
    // Dispatch event
    this.element.dispatchEvent(new CustomEvent("card:expanded", {
      detail: { propertyId: this.propertyIdValue },
      bubbles: true
    }))
  }

  // Collapse card details
  collapseDetails() {
    this.detailsTarget.style.height = "0"
    
    setTimeout(() => {
      this.detailsTarget.classList.remove("expanded")
      this.element.classList.remove(this.expandedClass || "card-expanded")
      this.detailsTarget.style.height = ""
    }, 300)
    
    // Dispatch event
    this.element.dispatchEvent(new CustomEvent("card:collapsed", {
      detail: { propertyId: this.propertyIdValue },
      bubbles: true
    }))
  }

  // Show toast notification
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: var(--color-${type === "error" ? "danger" : type});
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2.7s;
      box-shadow: var(--shadow-lg);
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  // Handle image load error
  imageError(event) {
    const img = event.target
    img.src = "/assets/placeholder-property.jpg" // Add a placeholder image
    img.alt = "Property image unavailable"
  }

  // Image gallery navigation
  nextImage() {
    const images = this.element.querySelectorAll(".property-images img")
    const currentIndex = Array.from(images).findIndex(img => img.classList.contains("active"))
    const nextIndex = (currentIndex + 1) % images.length
    
    images[currentIndex].classList.remove("active")
    images[nextIndex].classList.add("active")
  }

  previousImage() {
    const images = this.element.querySelectorAll(".property-images img")
    const currentIndex = Array.from(images).findIndex(img => img.classList.contains("active"))
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    
    images[currentIndex].classList.remove("active")
    images[prevIndex].classList.add("active")
  }

  // Price change animation
  animatePriceChange() {
    const priceElement = this.element.querySelector(".property-card-price")
    if (priceElement) {
      priceElement.style.animation = "price-update 0.6s ease-out"
      setTimeout(() => {
        priceElement.style.animation = ""
      }, 600)
    }
  }

  // Update property status
  updateStatus(newStatus) {
    const badge = this.element.querySelector(".property-card-badge")
    if (badge) {
      badge.className = `property-card-badge ${newStatus}`
      badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
    }
  }

  // Cleanup
  disconnect() {
    // Clean up any running animations or timers
    const modal = document.querySelector(".share-modal")
    if (modal) {
      modal.remove()
    }
  }
}