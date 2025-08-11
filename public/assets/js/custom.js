$(function () {
  // Check if we're on an admin page
  const isAdminPage = window.location.pathname.startsWith("/admin");

  // Header Scroll - Only apply if header exists
  if (!isAdminPage && $("header").length > 0) {
    $(window).scroll(function () {
      if ($(window).scrollTop() >= 60) {
        $("header").addClass("fixed-header");
      } else {
        $("header").removeClass("fixed-header");
      }
    });
  }

  // Featured Owl Carousel - Initialized in layout.js to ensure proper jQuery loading

  // Count - Only apply if count elements exist
  if ($(".count").length > 0) {
    $(".count").each(function () {
      const $this = $(this);
      const targetText = $this.text();
      const target = parseInt($this.attr("data-target")) || 0;

      // Store the original text format
      const originalText = targetText;

      // Extract the numeric part and any suffix (like K, +, etc.)
      const numericMatch = targetText.match(/^(\d+)(.*)/);
      if (numericMatch) {
        const numericPart = parseInt(numericMatch[1]);
        const suffix = numericMatch[2]; // This will be 'K+', '+', etc.

        $this.prop("Counter", 0).animate(
          {
            Counter: numericPart,
          },
          {
            duration: 1000,
            easing: "swing",
            step: function (now) {
              $this.text(Math.ceil(now) + suffix);
            },
          }
        );
      } else {
        // Fallback for simple numbers
        $this.prop("Counter", 0).animate(
          {
            Counter: target,
          },
          {
            duration: 1000,
            easing: "swing",
            step: function (now) {
              $this.text(Math.ceil(now));
            },
          }
        );
      }
    });
  }

  // ScrollToTop - Enhanced version
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Initialize scroll to top button with better error handling
  function initScrollToTop() {
    // Check if we're on an admin page (which doesn't have scroll-to-top button)
    if (isAdminPage) {
      return; // Skip initialization on admin pages
    }

    const btn = document.getElementById("scrollToTopBtn");
    const container = document.querySelector(".get-template");

    if (!btn || !container) {
      return; // Silently exit if elements don't exist
    }

    // Remove any inline display styles that might interfere
    btn.style.removeProperty("display");
    container.style.removeProperty("display");

    // Add click event listener
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToTop();
    });

    // Show/hide button on scroll with better visibility control
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 300) {
        btn.classList.remove("hidden");
        btn.classList.add("visible");
        btn.style.display = "flex";
        container.style.display = "block";
      } else {
        btn.classList.add("hidden");
        btn.classList.remove("visible");
        btn.style.display = "none";
        container.style.display = "none";
      }
    }

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
  }

  // Initialize when DOM is ready
  initScrollToTop();

  // AOS - Only initialize if AOS is available and not on admin pages
  if (typeof AOS !== "undefined" && !isAdminPage) {
    AOS.init({
      once: true,
    });
  }
});
