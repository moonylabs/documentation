(function() {
  if (typeof window === 'undefined') return;
  
  function addIconToHeader() {
    const h1 = document.querySelector('h1');
    if (!h1 || h1.hasAttribute('data-icon')) return;
    
    const pageTitle = h1.textContent.trim();
    let iconName = '';
    
    // Map page titles to icons
    const iconMap = {
      'Moony (MNY)': 'coins',
      'Moony Reserve': 'vault',
      'Proof of Capital': 'shield-check',
      'Pricing Curve': 'chart-line',
      'Overview': function() {
        // Check parent section for overview pages
        const path = window.location.pathname;
        if (path.includes('/protocol/')) return 'layer-group';
        if (path.includes('/economy/')) return 'chart-pie';
        if (path.includes('/network/')) return 'network-wired';
        return 'layer-group';
      },
      'P2P Payments': 'money-bill-transfer',
      'Micropayments': 'wallet',
      'Capital Markets': 'chart-bar',
      'Stakeholders': 'users',
      'Participation': 'user-plus',
      'Resources': 'book',
      'Welcome to Moony': 'rocket',
      'Quickstart': 'rocket',
      'Development': 'code'
    };
    
    if (iconMap[pageTitle]) {
      iconName = typeof iconMap[pageTitle] === 'function' ? iconMap[pageTitle]() : iconMap[pageTitle];
    } else {
      // Try to find icon from navigation
      const navLinks = document.querySelectorAll('nav a, aside a, [role="navigation"] a');
      for (const link of navLinks) {
        if (link.textContent.trim() === pageTitle || link.getAttribute('aria-label') === pageTitle) {
          const iconEl = link.querySelector('[data-icon], svg[data-icon]');
          if (iconEl) {
            iconName = iconEl.getAttribute('data-icon');
            break;
          }
        }
      }
    }
    
    if (iconName) {
      h1.setAttribute('data-icon', iconName);
    }
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addIconToHeader);
  } else {
    addIconToHeader();
  }
  
  // Also watch for changes
  setTimeout(addIconToHeader, 100);
  setTimeout(addIconToHeader, 500);
  
  const observer = new MutationObserver(addIconToHeader);
  observer.observe(document.body, { childList: true, subtree: true });
})();
