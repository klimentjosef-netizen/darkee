(function () {
  'use strict'

  var script = document.currentScript
  var merchantId = script.getAttribute('data-merchant')
  var theme = script.getAttribute('data-theme') || 'dark'
  var position = script.getAttribute('data-position') || 'bottom-right'
  var label = script.getAttribute('data-label') || '\u2726 Pomoc s d\u00E1rkem'
  var baseUrl = 'https://darkee.cz'

  if (!merchantId) {
    console.warn('[D\u00E1rkee] Chyb\u00ED atribut data-merchant na script tagu.')
    return
  }

  var positionStyle = {
    'bottom-right': 'bottom:24px;right:24px',
    'bottom-left': 'bottom:24px;left:24px',
  }[position] || 'bottom:24px;right:24px'

  var css = '\
    #_darkee-btn {\
      position:fixed;' + positionStyle + ';z-index:2147483646;\
      display:flex;align-items:center;gap:8px;\
      padding:14px 20px;border:none;border-radius:0;\
      background:#C9A84C;color:#0A0A0B;\
      font-family:system-ui,sans-serif;font-size:14px;font-weight:600;\
      cursor:pointer;\
      box-shadow:0 4px 24px rgba(201,168,76,0.35);\
      transition:transform 0.2s ease,box-shadow 0.2s ease;\
    }\
    #_darkee-btn:hover {\
      transform:translateY(-2px);\
      box-shadow:0 8px 32px rgba(201,168,76,0.45);\
    }\
    #_darkee-frame {\
      position:fixed;' + positionStyle.replace('bottom:24px', 'bottom:80px') + ';\
      z-index:2147483645;width:400px;height:640px;\
      border:none;display:none;\
      box-shadow:0 24px 80px rgba(0,0,0,0.5);\
    }\
    @media(max-width:480px){\
      #_darkee-frame{width:100vw;height:100%;bottom:0;right:0;left:0;top:0;}\
    }\
  '

  var style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  var btn = document.createElement('button')
  btn.id = '_darkee-btn'
  btn.textContent = label
  document.body.appendChild(btn)

  var iframe = document.createElement('iframe')
  iframe.id = '_darkee-frame'
  iframe.src = baseUrl + '/pruvodce?widget=1&merchant=' + encodeURIComponent(merchantId) + '&theme=' + theme
  iframe.allow = 'clipboard-write'
  iframe.title = 'D\u00E1rkee \u2014 D\u00E1rkov\u00FD asistent'
  document.body.appendChild(iframe)

  var isOpen = false

  btn.addEventListener('click', function () {
    isOpen = !isOpen
    iframe.style.display = isOpen ? 'block' : 'none'
    btn.textContent = isOpen ? '\u2715 Zav\u0159\u00EDt' : label
  })

  window.addEventListener('message', function (e) {
    if (e.origin !== baseUrl) return
    if (e.data && e.data.type === 'darkee:close') {
      isOpen = false
      iframe.style.display = 'none'
      btn.textContent = label
    }
    if (e.data && e.data.type === 'darkee:click' && window.dataLayer) {
      window.dataLayer.push({
        event: 'darkee_product_click',
        darkee_product_id: e.data.productId,
        darkee_merchant: merchantId,
      })
    }
  })
})()
