// Move social icons to second row in left column below logo
(function() {
  let hasMoved = false; // Prevent multiple executions

  function moveSocialIcons() {
    if (hasMoved) return; // Already moved, don't run again
    
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Find all social links - only get visible ones, not already moved
    const allSocialLinks = Array.from(footer.querySelectorAll('a[href*="x.com"], a[href*="linkedin"], a[href*="github"]'));
    const socialLinks = allSocialLinks.filter(link => {
      // Only get links that are visible and not already in our container
      return link.offsetParent !== null && !link.closest('.social-icons-container');
    });

    if (socialLinks.length === 0) return;

    // Find the footer links container
    const footerLinksContainer = footer.querySelector('div[class*="links"], div > div');
    if (!footerLinksContainer) return;

    // Find the logo/brand area (first child)
    const logoArea = footerLinksContainer.firstElementChild;
    if (!logoArea) return;

    // Check if container already exists
    let socialContainer = logoArea.querySelector('.social-icons-container');
    if (socialContainer) {
      hasMoved = true;
      return; // Already created, don't duplicate
    }

    // Create container for social icons
    socialContainer = document.createElement('div');
    socialContainer.className = 'social-icons-container';
    socialContainer.style.display = 'flex';
    socialContainer.style.flexDirection = 'row';
    socialContainer.style.gap = '0.75rem';
    socialContainer.style.marginTop = '1.5rem';

    // Move (not clone) each social link to the container
    socialLinks.forEach(link => {
      // Move the actual element, not a clone
      socialContainer.appendChild(link);
    });

    // Add container to logo area
    logoArea.appendChild(socialContainer);
    hasMoved = true;
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveSocialIcons);
  } else {
    moveSocialIcons();
  }

  // Also run after delays in case Mintlify loads footer dynamically
  setTimeout(moveSocialIcons, 500);
  setTimeout(moveSocialIcons, 1000);
  setTimeout(moveSocialIcons, 2000);
})();
