(function () {
  "use strict";

  // The bundled UI component gets its own namespace while reusing portal core dependencies.
  if (!window.BX || !window.BX.UI) {
    return;
  }

  const namespace = Object.create(window.BX);
  namespace.UI = Object.create(window.BX.UI);
  window.BXQLBX = namespace;
})();
