// Main JavaScript functionality for File Access System

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme(this.currentTheme)
    this.bindEvents()
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    this.currentTheme = theme
    localStorage.setItem("theme", theme)
    this.updateThemeIcon()
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme(newTheme)
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector(".theme-toggle i")
    if (themeIcon) {
      themeIcon.className = this.currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  }

  bindEvents() {
    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.preventDefault()
        this.toggleTheme()
      })
    }
  }
}

// Loading Manager
class LoadingManager {
  constructor() {
    this.loadingElement = null
    this.createLoadingElement()
  }

  createLoadingElement() {
    this.loadingElement = document.createElement("div")
    this.loadingElement.className = "loading-spinner"
    this.loadingElement.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `
    document.body.appendChild(this.loadingElement)
  }

  show() {
    if (this.loadingElement) {
      this.loadingElement.style.display = "block"
    }
  }

  hide() {
    if (this.loadingElement) {
      this.loadingElement.style.display = "none"
    }
  }
}

// Toast Notification System
class ToastManager {
  constructor() {
    this.container = this.createContainer()
  }

  createContainer() {
    let container = document.getElementById("toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "toast-container"
      container.className = "toast-container position-fixed top-0 end-0 p-3"
      container.style.zIndex = "9999"
      document.body.appendChild(container)
    }
    return container
  }

  show(message, type = "info", autoHide = true, duration = 3000) {
    const toastId = "toast-" + Date.now()
    const iconMap = {
      success: "check-circle",
      error: "exclamation-triangle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }

    const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${iconMap[type] || "info-circle"} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `

    this.container.insertAdjacentHTML("beforeend", toastHtml)
    const toastElement = document.getElementById(toastId)

    if (window.bootstrap && window.bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastElement, {
        autohide: autoHide,
        delay: duration,
      })
      toast.show()

      // Remove element after it's hidden
      toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove()
      })

      return toast
    }
  }
}

// File Operations Manager
class FileManager {
  constructor() {
    this.toastManager = new ToastManager()
    this.loadingManager = new LoadingManager()
    this.bindEvents()
  }

  bindEvents() {
    // File upload progress
    const fileInputs = document.querySelectorAll('input[type="file"]')
    fileInputs.forEach((input) => {
      input.addEventListener("change", (e) => this.handleFileSelect(e))
    })

    // Form submissions
    const forms = document.querySelectorAll("form")
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e))
    })

    // Download buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="download"]')) {
        this.handleDownload(e)
      }
    })

    // Delete buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="delete"]')) {
        this.handleDelete(e)
      }
    })
  }

  handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2)
      const maxSize = 16 // 16MB limit

      if (fileSize > maxSize) {
        this.toastManager.show(`File size (${fileSize}MB) exceeds the maximum limit of ${maxSize}MB`, "error")
        event.target.value = ""
        return
      }

      this.toastManager.show(`Selected: ${file.name} (${fileSize}MB)`, "info")
    }
  }

  handleFormSubmit(event) {
    const form = event.target
    const submitBtn = form.querySelector('button[type="submit"]')

    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
    }

    this.loadingManager.show()

    // Re-enable button after 5 seconds as fallback
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = submitBtn.getAttribute("data-original-text") || "Submit"
      }
      this.loadingManager.hide()
    }, 5000)
  }

  handleDownload(event) {
    event.preventDefault()
    const button = event.target.closest('[data-action="download"]')
    const fileId = button.getAttribute("data-file-id")
    const fileName = button.getAttribute("data-file-name")

    this.toastManager.show("Preparing download...", "info")

    // Create hidden link and trigger download
    const link = document.createElement("a")
    link.href = `/files/download/${fileId}`
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      this.toastManager.show(`Download started: ${fileName}`, "success")
    }, 1000)
  }

  handleDelete(event) {
    event.preventDefault()
    const button = event.target.closest('[data-action="delete"]')
    const fileId = button.getAttribute("data-file-id")
    const fileName = button.getAttribute("data-file-name")

    if (confirm(`Are you sure you want to delete "${fileName}"?\n\nThis action cannot be undone.`)) {
      this.toastManager.show("Deleting file...", "info")
      window.location.href = `/files/delete/${fileId}`
    }
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.addRippleEffect()
    this.addScrollAnimations()
    this.addHoverEffects()
  }

  addRippleEffect() {
    document.addEventListener("click", (e) => {
      const button = e.target.closest(".btn")
      if (button) {
        this.createRipple(e, button)
      }
    })
  }

  createRipple(event, element) {
    const ripple = document.createElement("span")
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  addScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")
        }
      })
    }, observerOptions)

    // Observe cards and other elements
    const elementsToAnimate = document.querySelectorAll(".card, .stats-card, .table")
    elementsToAnimate.forEach((el) => observer.observe(el))
  }

  addHoverEffects() {
    // Add hover effects to file cards
    const fileCards = document.querySelectorAll(".file-card")
    fileCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-5px) scale(1.02)"
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)"
      })
    })
  }
}

// Utility Functions
class Utils {
  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  static formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  static smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize managers
  const themeManager = new ThemeManager()
  const fileManager = new FileManager()
  const animationManager = new AnimationManager()
  const toastManager = new ToastManager()

  // Initialize Bootstrap tooltips
  if (window.bootstrap && window.bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.opacity = "0"
        alert.style.transform = "translateY(-20px)"
        setTimeout(() => alert.remove(), 300)
      }
    }, 5000)
  })

  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        Utils.smoothScrollTo(target)
      }
    })
  })

  // Show success message for successful operations
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("success")) {
    toastManager.show("Operation completed successfully!", "success")
  }

  console.log("File Access System initialized successfully!")
})

// Export for global access
window.FileAccessSystem = {
  ThemeManager,
  FileManager,
  AnimationManager,
  ToastManager,
  Utils,
}
