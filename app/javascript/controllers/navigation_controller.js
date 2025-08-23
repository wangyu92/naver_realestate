import { Controller } from "@hotwired/stimulus"

// Navigation controller for enhanced navigation interactions
export default class extends Controller {
  static targets = ["menu", "toggle", "dropdown", "tab", "step"]
  static values = { 
    activeTab: String,
    mobileBreakpoint: { type: Number, default: 768 },
    autoClose: { type: Boolean, default: true }
  }
  static classes = ["open", "active"]

  connect() {
    this.setupMobileNavigation()
    this.setupDropdowns()
    this.setupTabs()
    this.setupKeyboardNavigation()
    this.handleResize()
    
    // Listen for resize events
    window.addEventListener("resize", this.handleResize.bind(this))
    
    // Close mobile nav on route change
    document.addEventListener("turbo:visit", this.closeMobileNav.bind(this))
  }

  disconnect() {
    window.removeEventListener("resize", this.handleResize.bind(this))
    document.removeEventListener("turbo:visit", this.closeMobileNav.bind(this))
  }

  // Mobile navigation toggle
  toggleMobileNav() {
    if (this.hasMenuTarget && this.hasToggleTarget) {
      const isOpen = this.element.classList.contains(this.openClass || "open")
      
      if (isOpen) {
        this.closeMobileNav()
      } else {
        this.openMobileNav()
      }
    }
  }

  // Open mobile navigation
  openMobileNav() {
    this.element.classList.add(this.openClass || "open")
    this.toggleTarget.classList.add("active")
    this.toggleTarget.setAttribute("aria-expanded", "true")
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"
    
    // Focus trap
    this.setupFocusTrap()
    
    // Animate menu items
    this.animateMenuItems(true)
    
    // Dispatch event
    this.dispatch("opened")
  }

  // Close mobile navigation
  closeMobileNav() {
    this.element.classList.remove(this.openClass || "open")
    this.toggleTarget?.classList.remove("active")
    this.toggleTarget?.setAttribute("aria-expanded", "false")
    
    // Restore body scroll
    document.body.style.overflow = ""
    
    // Remove focus trap
    this.removeFocusTrap()
    
    // Animate menu items
    this.animateMenuItems(false)
    
    // Dispatch event
    this.dispatch("closed")
  }

  // Setup mobile navigation
  setupMobileNavigation() {
    if (this.hasToggleTarget) {
      this.toggleTarget.setAttribute("aria-expanded", "false")
      this.toggleTarget.setAttribute("aria-controls", this.menuTarget?.id || "navbar-menu")
    }
  }

  // Handle window resize
  handleResize() {
    const isMobile = window.innerWidth < this.mobileBreakpointValue
    
    if (!isMobile) {
      this.closeMobileNav()
      document.body.style.overflow = ""
    }
  }

  // Animate menu items in/out
  animateMenuItems(isOpening) {
    const menuItems = this.element.querySelectorAll(".nav-link")
    
    menuItems.forEach((item, index) => {
      if (isOpening) {
        item.style.animation = `slideInLeft 0.3s ease ${index * 0.05}s both`
      } else {
        item.style.animation = `slideOutLeft 0.3s ease ${index * 0.02}s both`
      }
    })
    
    // Clear animations after completion
    setTimeout(() => {
      menuItems.forEach(item => {
        item.style.animation = ""
      })
    }, isOpening ? 500 : 300)
  }

  // Setup dropdown functionality
  setupDropdowns() {
    this.dropdownTargets.forEach(dropdown => {
      const trigger = dropdown.querySelector(".dropdown-toggle")
      const menu = dropdown.querySelector(".dropdown-menu")
      
      if (trigger && menu) {
        trigger.addEventListener("click", this.toggleDropdown.bind(this))
        trigger.setAttribute("aria-haspopup", "true")
        trigger.setAttribute("aria-expanded", "false")
        
        // Close dropdown when clicking outside
        if (this.autoCloseValue) {
          document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
              this.closeDropdown(dropdown)
            }
          })
        }
      }
    })
  }

  // Toggle dropdown
  toggleDropdown(event) {
    event.preventDefault()
    const dropdown = event.target.closest(".dropdown")
    const isOpen = dropdown.classList.contains("open")
    
    // Close all other dropdowns first
    this.closeAllDropdowns()
    
    if (!isOpen) {
      this.openDropdown(dropdown)
    }
  }

  // Open dropdown
  openDropdown(dropdown) {
    const trigger = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")
    
    dropdown.classList.add("open")
    trigger.setAttribute("aria-expanded", "true")
    
    // Position dropdown if needed
    this.positionDropdown(dropdown, menu)
    
    // Focus first item
    const firstItem = menu.querySelector(".dropdown-item")
    if (firstItem) {
      setTimeout(() => firstItem.focus(), 100)
    }
    
    this.dispatch("dropdown:opened", { target: dropdown })
  }

  // Close dropdown
  closeDropdown(dropdown) {
    const trigger = dropdown.querySelector(".dropdown-toggle")
    
    dropdown.classList.remove("open")
    trigger.setAttribute("aria-expanded", "false")
    
    this.dispatch("dropdown:closed", { target: dropdown })
  }

  // Close all dropdowns
  closeAllDropdowns() {
    this.dropdownTargets.forEach(dropdown => {
      this.closeDropdown(dropdown)
    })
  }

  // Position dropdown to stay in viewport
  positionDropdown(dropdown, menu) {
    const rect = dropdown.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    
    // Reset positioning
    menu.style.left = ""
    menu.style.right = ""
    menu.style.top = ""
    menu.style.bottom = ""
    
    // Check if dropdown goes outside viewport
    if (rect.left + menuRect.width > viewport.width) {
      menu.style.left = "auto"
      menu.style.right = "0"
    }
    
    if (rect.bottom + menuRect.height > viewport.height) {
      menu.style.top = "auto"
      menu.style.bottom = "100%"
    }
  }

  // Setup tab navigation
  setupTabs() {
    if (this.activeTabValue) {
      this.activateTab(this.activeTabValue)
    }
    
    this.tabTargets.forEach(tab => {
      tab.addEventListener("click", this.switchTab.bind(this))
    })
  }

  // Switch tab
  switchTab(event) {
    event.preventDefault()
    const tab = event.target.closest("[data-navigation-target='tab']")
    const tabId = tab.dataset.tabId || tab.getAttribute("href").substring(1)
    
    this.activateTab(tabId)
  }

  // Activate specific tab
  activateTab(tabId) {
    // Deactivate all tabs
    this.tabTargets.forEach(tab => {
      tab.classList.remove(this.activeClass || "active")
      tab.setAttribute("aria-selected", "false")
    })
    
    // Hide all tab panels
    const tabPanels = document.querySelectorAll(".tab-pane")
    tabPanels.forEach(panel => {
      panel.classList.remove("active", "show")
    })
    
    // Activate selected tab
    const activeTab = this.tabTargets.find(tab => 
      tab.dataset.tabId === tabId || tab.getAttribute("href") === `#${tabId}`
    )
    
    if (activeTab) {
      activeTab.classList.add(this.activeClass || "active")
      activeTab.setAttribute("aria-selected", "true")
      
      // Show associated panel
      const panel = document.getElementById(tabId)
      if (panel) {
        panel.classList.add("active", "show")
      }
      
      this.activeTabValue = tabId
      this.dispatch("tab:changed", { detail: { tabId } })
    }
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    this.element.addEventListener("keydown", this.handleKeydown.bind(this))
  }

  // Handle keyboard navigation
  handleKeydown(event) {
    switch (event.key) {
      case "Escape":
        this.closeMobileNav()
        this.closeAllDropdowns()
        break
        
      case "Tab":
        // Handle focus management in mobile nav
        if (this.element.classList.contains("open")) {
          this.handleTabKey(event)
        }
        break
        
      case "ArrowDown":
        if (event.target.classList.contains("dropdown-toggle")) {
          event.preventDefault()
          this.focusNextDropdownItem(event.target)
        }
        break
        
      case "ArrowUp":
        if (event.target.classList.contains("dropdown-item")) {
          event.preventDefault()
          this.focusPreviousDropdownItem(event.target)
        }
        break
        
      case "ArrowRight":
        if (event.target.classList.contains("nav-link")) {
          event.preventDefault()
          this.focusNextNavItem(event.target)
        }
        break
        
      case "ArrowLeft":
        if (event.target.classList.contains("nav-link")) {
          event.preventDefault()
          this.focusPreviousNavItem(event.target)
        }
        break
    }
  }

  // Focus trap for mobile navigation
  setupFocusTrap() {
    const focusableElements = this.menuTarget.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    
    this.firstFocusableElement = focusableElements[0]
    this.lastFocusableElement = focusableElements[focusableElements.length - 1]
    
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus()
    }
  }

  // Remove focus trap
  removeFocusTrap() {
    this.firstFocusableElement = null
    this.lastFocusableElement = null
  }

  // Handle Tab key in focus trap
  handleTabKey(event) {
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

  // Focus navigation helpers
  focusNextNavItem(currentItem) {
    const navItems = Array.from(this.element.querySelectorAll(".nav-link"))
    const currentIndex = navItems.indexOf(currentItem)
    const nextIndex = (currentIndex + 1) % navItems.length
    navItems[nextIndex].focus()
  }

  focusPreviousNavItem(currentItem) {
    const navItems = Array.from(this.element.querySelectorAll(".nav-link"))
    const currentIndex = navItems.indexOf(currentItem)
    const prevIndex = currentIndex === 0 ? navItems.length - 1 : currentIndex - 1
    navItems[prevIndex].focus()
  }

  focusNextDropdownItem(trigger) {
    const dropdown = trigger.closest(".dropdown")
    const items = dropdown.querySelectorAll(".dropdown-item")
    if (items.length > 0) {
      items[0].focus()
    }
  }

  focusPreviousDropdownItem(currentItem) {
    const dropdown = currentItem.closest(".dropdown")
    const items = Array.from(dropdown.querySelectorAll(".dropdown-item"))
    const currentIndex = items.indexOf(currentItem)
    
    if (currentIndex === 0) {
      const trigger = dropdown.querySelector(".dropdown-toggle")
      trigger.focus()
    } else {
      items[currentIndex - 1].focus()
    }
  }

  // Step navigation
  goToStep(stepNumber) {
    this.stepTargets.forEach((step, index) => {
      const stepNum = index + 1
      
      step.classList.remove("active", "completed")
      
      if (stepNum < stepNumber) {
        step.classList.add("completed")
      } else if (stepNum === stepNumber) {
        step.classList.add("active")
      }
    })
    
    this.dispatch("step:changed", { detail: { step: stepNumber } })
  }

  // Navigation state management
  setActiveNavItem(href) {
    // Remove active class from all nav items
    this.element.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove(this.activeClass || "active")
    })
    
    // Add active class to matching nav item
    const activeLink = this.element.querySelector(`[href="${href}"]`)
    if (activeLink) {
      activeLink.classList.add(this.activeClass || "active")
    }
  }

  // Update breadcrumb
  updateBreadcrumb(items) {
    const breadcrumb = document.querySelector(".breadcrumb")
    if (breadcrumb) {
      breadcrumb.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1
        const itemClass = isLast ? "breadcrumb-item active" : "breadcrumb-item"
        
        if (isLast || !item.href) {
          return `<li class="${itemClass}">${item.text}</li>`
        } else {
          return `<li class="${itemClass}"><a href="${item.href}">${item.text}</a></li>`
        }
      }).join("")
    }
  }

  // Smooth scroll to section
  scrollToSection(event) {
    event.preventDefault()
    const target = event.target.getAttribute("href")
    const section = document.querySelector(target)
    
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
      
      // Update URL without triggering navigation
      history.pushState(null, null, target)
    }
  }

  // Auto-highlight active section on scroll
  highlightActiveSection() {
    const sections = document.querySelectorAll("[id]")
    const navLinks = this.element.querySelectorAll(".nav-link[href^='#']")
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute("id")
        const navLink = this.element.querySelector(`[href="#${id}"]`)
        
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove("active"))
          navLink?.classList.add("active")
        }
      })
    }, {
      rootMargin: "-50px 0px -50px 0px"
    })
    
    sections.forEach(section => observer.observe(section))
  }
}