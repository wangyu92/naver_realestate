import { Controller } from "@hotwired/stimulus"

// Sort handler controller for maintaining filters when sorting changes
export default class extends Controller {

  handleSortChange(event) {
    const selectedSort = event.target.value
    const url = new URL(window.location)
    
    // Update sort parameter
    url.searchParams.set('sort', selectedSort)
    
    // Navigate to updated URL (this maintains all existing filter parameters)
    window.location.href = url.toString()
  }
}