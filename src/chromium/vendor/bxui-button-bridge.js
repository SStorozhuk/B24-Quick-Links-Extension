(function () {
  "use strict";

  const hostId = "b24ql-ui-button-host";

  function renderButton() {
    const host = document.getElementById(hostId);
    if (!host) {
      return;
    }

    const form = host.closest("form");
    const fallback = form && form.querySelector("#b24ql-template-open");
    host.replaceChildren();
    host.classList.add("b24ql-hidden");
    if (fallback) {
      fallback.classList.remove("b24ql-hidden");
    }

    if (host.dataset.active !== "true" || !form || !window.BXQLBX || !BXQLBX.UI || !BXQLBX.UI.Button) {
      return;
    }

    try {
      const Button = BXQLBX.UI.Button;
      const colors = BXQLBX.UI.ButtonColor;
      const sizes = BXQLBX.UI.ButtonSize;
      const button = new Button({
        text: host.dataset.text || "Открыть",
        color: colors.PRIMARY,
        size: sizes.MEDIUM,
        noCaps: true
      });
      button.renderTo(host);
      const node = button.getContainer();
      node.type = "button";
      node.dataset.b24qlBundled = "true";
      node.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        form.requestSubmit();
      });
      host.classList.remove("b24ql-hidden");
      fallback.classList.add("b24ql-hidden");
    } catch (error) {
      host.replaceChildren();
      console.warn("BX.UI button could not render; using the original button.", error);
    }
  }

  document.addEventListener("b24ql-ui-render", renderButton);
  document.dispatchEvent(new Event("b24ql-ui-ready"));
})();
