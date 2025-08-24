import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="gallery"
export default class extends Controller {
  static targets = ["mainImage", "thumbnail", "counter", "prevButton", "nextButton"]
  static values = { currentIndex: Number }

  connect() {
    this.currentIndexValue = 0
    this.updateThumbnailStates()
  }

  selectImage(event) {
    const index = parseInt(event.currentTarget.dataset.galleryIndex)
    this.currentIndexValue = index
    this.updateMainImage()
    this.updateThumbnailStates()
    this.updateCounter()
  }

  next() {
    if (this.currentIndexValue < this.thumbnailTargets.length - 1) {
      this.currentIndexValue++
      this.updateMainImage()
      this.updateThumbnailStates()
      this.updateCounter()
    }
  }

  previous() {
    if (this.currentIndexValue > 0) {
      this.currentIndexValue--
      this.updateMainImage()
      this.updateThumbnailStates()
      this.updateCounter()
    }
  }

  openFullscreen() {
    if (this.mainImageTarget.requestFullscreen) {
      this.mainImageTarget.requestFullscreen()
    } else if (this.mainImageTarget.webkitRequestFullscreen) {
      this.mainImageTarget.webkitRequestFullscreen()
    } else if (this.mainImageTarget.msRequestFullscreen) {
      this.mainImageTarget.msRequestFullscreen()
    }
  }

  updateMainImage() {
    const currentThumbnail = this.thumbnailTargets[this.currentIndexValue]
    const newSrc = currentThumbnail.src
    const newAlt = currentThumbnail.alt

    this.mainImageTarget.src = newSrc
    this.mainImageTarget.alt = newAlt
  }

  updateThumbnailStates() {
    this.thumbnailTargets.forEach((thumbnail, index) => {
      if (index === this.currentIndexValue) {
        thumbnail.classList.add("ring-2", "ring-blue-500")
      } else {
        thumbnail.classList.remove("ring-2", "ring-blue-500")
      }
    })
  }

  updateCounter() {
    if (this.hasCounterTarget) {
      this.counterTarget.textContent = this.currentIndexValue + 1
    }
  }

  // Handle keyboard navigation
  keydown(event) {
    switch(event.key) {
      case "ArrowLeft":
        event.preventDefault()
        this.previous()
        break
      case "ArrowRight":
        event.preventDefault()
        this.next()
        break
      case "Escape":
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
        break
    }
  }
}