$(function () {

    // Header Scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 60) {
            $("header").addClass("fixed-header");
        } else {
            $("header").removeClass("fixed-header");
        }
    });


    // Featured Owl Carousel - Initialized in layout.js to ensure proper jQuery loading


    // Count
    $('.count').each(function () {
        const $this = $(this);
        const targetText = $this.text();
        const target = parseInt($this.attr('data-target')) || 0;
        
        // Store the original text format
        const originalText = targetText;
        
        // Extract the numeric part and any suffix (like K, +, etc.)
        const numericMatch = targetText.match(/^(\d+)(.*)/);
        if (numericMatch) {
            const numericPart = parseInt(numericMatch[1]);
            const suffix = numericMatch[2]; // This will be 'K+', '+', etc.
            
            $this.prop('Counter', 0).animate({
                Counter: numericPart
            }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                    $this.text(Math.ceil(now) + suffix);
                }
            });
        } else {
            // Fallback for simple numbers
            $this.prop('Counter', 0).animate({
                Counter: target
            }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                    $this.text(Math.ceil(now));
                }
            });
        }
    });


    // ScrollToTop - Enhanced version
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Initialize scroll to top button with better error handling
    function initScrollToTop() {
        console.log('Initializing scroll to top button...');
        
        const btn = document.getElementById("scrollToTopBtn");
        const container = document.querySelector(".get-template");
        
        if (!btn) {
            console.error('Scroll to top button not found!');
            return;
        }
        
        if (!container) {
            console.error('Scroll to top container not found!');
            return;
        }
        
        console.log('Scroll to top elements found:', { btn, container });
        
        // Remove any inline display styles that might interfere
        btn.style.removeProperty('display');
        container.style.removeProperty('display');
        
        // Add click event listener
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log('Scroll to top clicked');
            scrollToTop();
        });
        
        // Show/hide button on scroll with better visibility control
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            console.log('Scroll position:', scrollTop);
            
            if (scrollTop > 300) {
                btn.classList.remove('hidden');
                btn.classList.add('visible');
                btn.style.display = 'flex';
                container.style.display = 'block';
                console.log('Button should be visible');
            } else {
                btn.classList.add('hidden');
                btn.classList.remove('visible');
                btn.style.display = 'none';
                container.style.display = 'none';
                console.log('Button should be hidden');
            }
        }
        
        // Initial check
        handleScroll();
        
        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);
        
        // Force show button for testing (remove this after testing)
        setTimeout(() => {
            console.log('Forcing button to be visible for testing...');
            btn.style.display = 'flex';
            container.style.display = 'block';
            btn.classList.remove('hidden');
            btn.classList.add('visible');
        }, 2000);
    }

    // Initialize when DOM is ready
    initScrollToTop();


    // Aos
	AOS.init({
		once: true,
	});

});

