/**
 * Pure JavaScript Accordion Implementation
 * Completely replaces Bootstrap accordion behavior to prevent auto-collapse
 */

(function() {
    'use strict';
    
    console.log('🔧 Pure JS Accordion: Initializing...');
    
    let accordionInitialized = false;
    
    function initPureAccordion() {
        if (accordionInitialized) {
            console.log('🔧 Pure JS Accordion: Already initialized, skipping');
            return;
        }
        
        // Find all accordion containers
        const accordions = document.querySelectorAll('.accordion');
        
        if (accordions.length === 0) {
            console.log('🔧 Pure JS Accordion: No accordions found');
            return;
        }
        
        accordions.forEach(accordion => {
            console.log('🔧 Pure JS Accordion: Setting up accordion', accordion.id);
            
            // Find all accordion buttons in this accordion
            const buttons = accordion.querySelectorAll('.accordion-button');
            
            buttons.forEach(button => {
                // Remove all Bootstrap attributes and event listeners
                button.removeAttribute('data-bs-toggle');
                button.removeAttribute('data-bs-target');
                button.removeAttribute('aria-expanded');
                
                // Clone button to remove all event listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Get the target collapse element
                const targetId = newButton.getAttribute('data-bs-target') || 
                                newButton.getAttribute('href') || 
                                '#' + newButton.getAttribute('aria-controls');
                
                if (!targetId || targetId === '#') {
                    // Try to find target by looking at the next sibling
                    const accordionItem = newButton.closest('.accordion-item');
                    const collapseElement = accordionItem ? accordionItem.querySelector('.accordion-collapse') : null;
                    
                    if (collapseElement) {
                        setupAccordionButton(newButton, collapseElement, accordion);
                    }
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        setupAccordionButton(newButton, targetElement, accordion);
                    }
                }
            });
        });
        
        accordionInitialized = true;
        console.log('🔧 Pure JS Accordion: Initialization complete');
    }
    
    function setupAccordionButton(button, targetElement, accordion) {
        // Remove Bootstrap classes and attributes from target
        targetElement.removeAttribute('data-bs-parent');
        targetElement.classList.remove('collapse');
        
        // Set initial state
        const isExpanded = !button.classList.contains('collapsed');
        targetElement.style.display = isExpanded ? 'block' : 'none';
        button.setAttribute('aria-expanded', isExpanded);
        
        console.log('🔧 Pure JS Accordion: Button setup complete for', targetElement.id);
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔧 Pure JS Accordion: Button clicked', targetElement.id);
            
            const isCurrentlyExpanded = targetElement.style.display === 'block';
            
            if (isCurrentlyExpanded) {
                // Close this item
                closeAccordionItem(button, targetElement);
                console.log('🔧 Pure JS Accordion: Closing item', targetElement.id);
            } else {
                // Close all other items in this accordion first
                const allItems = accordion.querySelectorAll('.accordion-collapse');
                const allButtons = accordion.querySelectorAll('.accordion-button');
                
                allItems.forEach((item, index) => {
                    if (item !== targetElement && item.style.display === 'block') {
                        closeAccordionItem(allButtons[index], item);
                        console.log('🔧 Pure JS Accordion: Auto-closing other item', item.id);
                    }
                });
                
                // Open this item
                openAccordionItem(button, targetElement);
                console.log('🔧 Pure JS Accordion: Opening item', targetElement.id);
            }
        });
    }
    
    function openAccordionItem(button, targetElement) {
        targetElement.style.display = 'block';
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        targetElement.classList.add('show');
    }
    
    function closeAccordionItem(button, targetElement) {
        targetElement.style.display = 'none';
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        targetElement.classList.remove('show');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPureAccordion);
    } else {
        initPureAccordion();
    }
    
    // Also initialize after a short delay to catch dynamically loaded content
    setTimeout(initPureAccordion, 1000);
    
    console.log('🔧 Pure JS Accordion: Script loaded');
})();