window.marqeta = (function (doc) {
  const baseUrl = doc.currentScript.src;
  const origin = new URL(baseUrl).origin;

  return {
    bootstrap: function (options) {
      let pendingCount = 1;

      function onload() {
        pendingCount--;
        if (
          pendingCount === 0 &&
          options.callbackEvents &&
          options.callbackEvents.onSuccess
        ) {
          options.callbackEvents.onSuccess();
        }
      };

      if (options.showPan) {
        // Attach copy-PAN message listener
        window.addEventListener("message", function (evt) {
          if (
            evt.origin === origin &&
            evt.data === 'copied' &&
            options.showPan.copyCardPan &&
            options.showPan.copyCardPan.onCopySuccess
          ) {
            options.showPan.copyCardPan.onCopySuccess();
          }
        });

        // Create specified PAN-data iframes
        for (const [key, value] of Object.entries(options.showPan)) {
          pendingCount++;
          const src = new URL('show_pan_iframe.html', baseUrl);
          src.hash = btoa(JSON.stringify({ key, token: options.clientAccessToken, value }));
          const iframe = document.createElement('iframe');
          iframe.style.borderStyle = 'none';
          iframe.src = src;
          iframe.onload = onload;
          document.getElementById(value.domId).append(iframe);
        }
      }

      onload();
    }
  };
})(window.document);
