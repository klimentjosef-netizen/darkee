(function() {
  var script = document.currentScript;
  var merchantId = script.getAttribute('data-merchant');
  var lang = script.getAttribute('data-lang') || 'cs';
  var theme = script.getAttribute('data-theme') || 'light';

  if (!merchantId) return console.warn('Darkee widget: chybi data-merchant atribut');

  // Inject styles
  var style = document.createElement('style');
  style.textContent = '\
    #darkee-widget-btn {\
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;\
      background: #E07A5F; color: #fff; border: none; border-radius: 50px;\
      padding: 14px 22px; font-size: 15px; font-weight: 600;\
      cursor: pointer; box-shadow: 0 4px 20px rgba(224,122,95,0.4);\
      display: flex; align-items: center; gap: 8px;\
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
    }\
    #darkee-widget-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(224,122,95,0.5); }\
    #darkee-widget-iframe {\
      position: fixed; bottom: 80px; right: 24px; z-index: 9998;\
      width: 420px; height: 620px; border: none; border-radius: 20px;\
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);\
      display: none; transition: opacity 0.3s ease;\
    }\
    @media (max-width: 480px) {\
      #darkee-widget-iframe { width: 100vw; height: 100vh; bottom: 0; right: 0; border-radius: 0; }\
    }\
  ';
  document.head.appendChild(style);

  // Button
  var btn = document.createElement('button');
  btn.id = 'darkee-widget-btn';
  btn.innerHTML = '\uD83C\uDF81 Pomoc s d\u00E1rkem';
  document.body.appendChild(btn);

  // iFrame
  var iframe = document.createElement('iframe');
  iframe.id = 'darkee-widget-iframe';
  iframe.src = 'https://darkee.cz/pruvodce?widget=1&merchant=' + merchantId + '&theme=' + theme + '&lang=' + lang;
  iframe.allow = 'clipboard-write';
  document.body.appendChild(iframe);

  var open = false;
  btn.addEventListener('click', function() {
    open = !open;
    iframe.style.display = open ? 'block' : 'none';
    btn.innerHTML = open ? '\u2715 Zav\u0159\u00EDt' : '\uD83C\uDF81 Pomoc s d\u00E1rkem';
  });

  // Listen for messages from iframe
  window.addEventListener('message', function(e) {
    if (e.origin !== 'https://darkee.cz') return;
    if (e.data && e.data.type === 'darkee:click') {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'darkee_click', product_id: e.data.productId });
      }
    }
    if (e.data && e.data.type === 'darkee:close') {
      open = false;
      iframe.style.display = 'none';
      btn.innerHTML = '\uD83C\uDF81 Pomoc s d\u00E1rkem';
    }
  });
})();
