import React, { useEffect } from 'react';

const HoneyBookForm = () => {
  useEffect(() => {
    window._HB_ = window._HB_ || {};
    window._HB_.pid = '65c528b1da8d2a0008681477';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js';

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }, []);

  return (
    <>
      <div className="hb-p-65c528b1da8d2a0008681477-1"></div>
      <img height="1" width="1" style={{ display: 'none' }} src="https://www.honeybook.com/p.png?pid=65c528b1da8d2a0008681477" alt="" />
    </>
  );
};

export default HoneyBookForm;
