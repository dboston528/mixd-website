import React, { useEffect } from 'react';

const HoneyBookForm = (window) => {
  useEffect(() => {
    // Function to initialize HoneyBook form
    const initializeHoneyBookForm = () => {
      window._HB_ = window._HB_ || {};
      window._HB_.pid = '65c528b1da8d2a0008681477';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js';
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    // Call the function to initialize HoneyBook form
    initializeHoneyBookForm();
  }, []);

  return (
    <div className="hb-p-65c528b1da8d2a0008681477"></div>
  );
};

export default HoneyBookForm;
