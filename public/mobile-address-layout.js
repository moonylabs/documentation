// Mobile address container layout fix
// Override inline styles to make code full width and buttons below
(function() {
  function fixMobileAddressLayout() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Find all address cards
    const addressCards = document.querySelectorAll('.address-card, #mint-address-card, #authority-address-card, #reserve-address-card, #usdf-vault-card, #moony-vault-card');
    
    addressCards.forEach(card => {
      // Find the parent container with flexDirection: column
      const parentContainer = card.querySelector('div[style*="flexDirection"]');
      if (!parentContainer) return;
      
      // Find the inner div with code and button (has inline display: flex)
      const innerDiv = parentContainer.querySelector('div[style*="display: flex"]:has(code)');
      if (!innerDiv) return;
      
      // Override inline styles to make it a column
      innerDiv.style.setProperty('display', 'flex', 'important');
      innerDiv.style.setProperty('flex-direction', 'column', 'important');
      innerDiv.style.setProperty('align-items', 'stretch', 'important');
      innerDiv.style.setProperty('gap', '0.75rem', 'important');
      
      // Make code full width
      const codeElement = innerDiv.querySelector('code');
      if (codeElement) {
        codeElement.style.setProperty('width', '100%', 'important');
        codeElement.style.setProperty('max-width', '100%', 'important');
        codeElement.style.setProperty('flex', 'none', 'important');
      }
      
      // Position button below code
      const button = innerDiv.querySelector('button');
      if (button) {
        button.style.setProperty('align-self', 'flex-start', 'important');
        button.style.setProperty('width', 'fit-content', 'important');
        button.style.setProperty('margin-top', '0.75rem', 'important');
      }
      
      // Find verify link and position it next to button
      const verifyLink = parentContainer.querySelector('a[href*="explorer.solana.com"]');
      if (verifyLink) {
        verifyLink.style.setProperty('margin-top', '0', 'important');
        verifyLink.style.setProperty('margin-left', '0.5rem', 'important');
        verifyLink.style.setProperty('display', 'inline-block', 'important');
      }
    });
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMobileAddressLayout);
  } else {
    fixMobileAddressLayout();
  }
  
  // Run after delays in case content loads dynamically
  setTimeout(fixMobileAddressLayout, 500);
  setTimeout(fixMobileAddressLayout, 1000);
  setTimeout(fixMobileAddressLayout, 2000);
  
  // Run on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixMobileAddressLayout, 200);
  });
})();
