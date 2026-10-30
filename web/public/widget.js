/**
 * diBISAlitas 3D Rian POLMAN — Universal Embeddable Widget v1.0
 * Zero-dependency, isolated Shadow DOM, bidirectional postMessage bridge.
 *
 * Penggunaan pada Website Eksternal:
 * <script src="http://localhost:3000/widget.js" data-position="bottom-right" defer></script>
 */
(function () {
  "use strict";

  // Mencegah inisialisasi ganda jika skrip dimuat lebih dari sekali
  if (window.__DIBISA_WIDGET_INITIALIZED__) {
    return;
  }
  window.__DIBISA_WIDGET_INITIALIZED__ = true;

  // 1. Ekstraksi Konfigurasi dari Tag Script
  const currentScript =
    document.currentScript ||
    document.querySelector('script[src*="widget.js"]') ||
    document.querySelector('script[data-dibisa-widget]');

  let scriptOrigin = "http://localhost:3000";
  if (currentScript && currentScript.src) {
    try {
      const url = new URL(currentScript.src);
      scriptOrigin = url.origin;
    } catch (e) {
      // Fallback ke origin default
    }
  }

  const CONFIG = {
    server: (currentScript && currentScript.getAttribute("data-server")) || scriptOrigin,
    position: (currentScript && currentScript.getAttribute("data-position")) || "bottom-right", // 'bottom-right' | 'bottom-left'
    primaryColor: (currentScript && currentScript.getAttribute("data-color")) || "#1B9981",
    autoOpen: (currentScript && currentScript.getAttribute("data-auto-open")) === "true",
    selectionHelper: (currentScript && currentScript.getAttribute("data-selection-helper")) !== "false",
    initialText: (currentScript && currentScript.getAttribute("data-text")) || "",
  };

  // State Internal Widget
  const state = {
    isOpen: false,
    isIframeReady: false,
    queuedText: CONFIG.initialText || "",
    listeners: {},
  };

  // 2. Pembuatan Host Container dengan Shadow DOM (Isolasi CSS 100%)
  const hostElement = document.createElement("div");
  hostElement.id = "dibisa-widget-container";
  hostElement.style.cssText = "position: relative; z-index: 2147483647;";
  document.body.appendChild(hostElement);

  const shadow = hostElement.attachShadow({ mode: "open" });

  // 3. Inject Styling Khusus ke Shadow DOM
  const style = document.createElement("style");
  const isRight = CONFIG.position !== "bottom-left";

  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* Floating Action Button (FAB) */
    .dibisa-fab {
      position: fixed;
      bottom: 24px;
      ${isRight ? "right: 24px;" : "left: 24px;"}
      width: 58px;
      height: 58px;
      border-radius: 20px;
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, #2EC4B6 100%);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 10px 25px rgba(27, 153, 129, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 2147483647;
      outline: none;
      user-select: none;
    }

    .dibisa-fab:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 35px rgba(27, 153, 129, 0.5), 0 6px 15px rgba(0, 0, 0, 0.15);
    }

    .dibisa-fab:active {
      transform: scale(0.94);
    }

    /* Pulse Glow Animation */
    .dibisa-pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 24px;
      border: 2px solid ${CONFIG.primaryColor};
      opacity: 0.75;
      animation: dibisa-pulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
      pointer-events-none;
    }

    @keyframes dibisa-pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.18);
        opacity: 0;
      }
      100% {
        transform: scale(1.18);
        opacity: 0;
      }
    }

    /* Tooltip Banner on Hover */
    .dibisa-tooltip {
      position: fixed;
      bottom: 34px;
      ${isRight ? "right: 92px;" : "left: 92px;"}
      background: rgba(15, 23, 42, 0.92);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(${isRight ? "8px" : "-8px"});
      transition: all 0.25s ease-out;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dibisa-fab:hover + .dibisa-tooltip {
      opacity: 1;
      transform: translateX(0);
    }

    /* Popover Iframe Container */
    .dibisa-popover {
      position: fixed;
      bottom: 94px;
      ${isRight ? "right: 24px;" : "left: 24px;"}
      width: 335px;
      height: 535px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 30px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.85);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      transform: translateY(24px) scale(0.92);
      transform-origin: ${isRight ? "bottom right" : "bottom left"};
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2147483646;
    }

    .dibisa-popover.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dibisa-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
      background: transparent;
    }

    /* Floating Selection Pill Helper */
    .dibisa-selection-pill {
      position: absolute;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      display: none;
      align-items: center;
      gap: 6px;
      z-index: 2147483645;
      transform: translate(-50%, -100%);
      transition: transform 0.15s ease, opacity 0.15s ease;
      border: 1px solid rgba(255, 255, 255, 0.15);
      user-select: none;
    }

    .dibisa-selection-pill:hover {
      background: ${CONFIG.primaryColor};
      transform: translate(-50%, -108%);
    }

    .dibisa-selection-pill svg {
      width: 14px;
      height: 14px;
    }
  `;
  shadow.appendChild(style);

  // 4. Render DOM Elemen Widget ke dalam Shadow DOM
  // a. FAB Button
  const fab = document.createElement("button");
  fab.className = "dibisa-fab";
  fab.setAttribute("aria-label", "Buka Penerjemah Isyarat 3D Rian POLMAN");
  fab.innerHTML = `
    <div class="dibisa-pulse-ring"></div>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
    </svg>
  `;

  // b. Tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "dibisa-tooltip";
  tooltip.innerHTML = `<span>3D BISINDO Interpreter</span><span style="opacity:0.6;">(Rian POLMAN)</span>`;

  // c. Popover Box & Iframe
  const popover = document.createElement("div");
  popover.className = "dibisa-popover";

  const iframe = document.createElement("iframe");
  iframe.className = "dibisa-iframe";
  iframe.title = "diBISAlitas 3D Rian POLMAN";
  iframe.setAttribute("allow", "autoplay; microphone");
  iframe.src = `${CONFIG.server}/embed/rian`;

  popover.appendChild(iframe);

  // d. Selection Pill Helper (Muncul saat user menyeleksi teks di host page)
  const selectionPill = document.createElement("div");
  selectionPill.className = "dibisa-selection-pill";
  selectionPill.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
    </svg>
    <span>Peragakan Isyarat 3D</span>
  `;

  shadow.appendChild(fab);
  shadow.appendChild(tooltip);
  shadow.appendChild(popover);
  shadow.appendChild(selectionPill);

  // 5. Komunikasi PostMessage Antara Host dan Embed Iframe
  function postToIframe(payload) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(payload, "*");
    }
  }

  window.addEventListener("message", function (event) {
    let data = event.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return;
      }
    }

    if (!data || data.source !== "DIBISA_WIDGET") return;

    switch (data.type) {
      case "DIBISA_READY":
        state.isIframeReady = true;
        emitEvent("ready");
        if (state.queuedText) {
          postToIframe({ type: "PLAY_SIGN", text: state.queuedText });
          state.queuedText = "";
        }
        break;

      case "DIBISA_PLAY_FINISHED":
        emitEvent("finished", { sentence: data.sentence });
        break;

      case "DIBISA_TOKEN_CHANGE":
        emitEvent("word", { word: data.word, index: data.index, total: data.total });
        break;

      case "DIBISA_CLOSE_REQUEST":
        closeWidget();
        break;
    }
  });

  function emitEvent(eventName, eventData) {
    if (state.listeners[eventName]) {
      state.listeners[eventName].forEach(function (callback) {
        try {
          callback(eventData);
        } catch (err) {
          console.error("[diBISAlitas Widget] Listener error:", err);
        }
      });
    }
  }

  // 6. Logika Kontrol Buka / Tutup Popover
  function openWidget() {
    state.isOpen = true;
    popover.classList.add("open");
    fab.style.transform = "rotate(90deg)";
    emitEvent("open");
  }

  function closeWidget() {
    state.isOpen = false;
    popover.classList.remove("open");
    fab.style.transform = "none";
    emitEvent("close");
  }

  function toggleWidget() {
    if (state.isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  fab.addEventListener("click", toggleWidget);

  // 7. Terjemahkan Teks ke Isyarat Secara Programmatic
  function translateText(text) {
    if (!text || !text.trim()) return;
    openWidget();

    if (state.isIframeReady) {
      postToIframe({ type: "PLAY_SIGN", text: text.trim() });
    } else {
      state.queuedText = text.trim();
    }
  }

  // 8. Seleksi Teks Otomatis di Host Website
  if (CONFIG.selectionHelper) {
    let currentSelectedText = "";

    document.addEventListener("mouseup", function (e) {
      // Abaikan jika klik terjadi di dalam widget
      if (hostElement.contains(e.target)) return;

      setTimeout(function () {
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : "";

        if (text && text.length > 1 && text.length < 150) {
          currentSelectedText = text;
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          selectionPill.style.display = "flex";
          selectionPill.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
          selectionPill.style.top = `${rect.top + window.scrollY - 8}px`;
        } else {
          selectionPill.style.display = "none";
          currentSelectedText = "";
        }
      }, 50);
    });

    selectionPill.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (currentSelectedText) {
        translateText(currentSelectedText);
        selectionPill.style.display = "none";
      }
    });

    document.addEventListener("selectionchange", function () {
      const selection = window.getSelection();
      if (!selection || !selection.toString().trim()) {
        selectionPill.style.display = "none";
      }
    });
  }

  // Auto Open jika dikonfigurasi
  if (CONFIG.autoOpen) {
    setTimeout(openWidget, 800);
  }

  // 9. Ekspos Public JavaScript API ke window.DiBISAWidget
  window.DiBISAWidget = {
    version: "1.0.0",
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
    translate: translateText,
    stop: function () {
      postToIframe({ type: "STOP_SIGN" });
    },
    setSpeed: function (spd) {
      postToIframe({ type: "SET_SPEED", speed: spd });
    },
    on: function (eventName, callback) {
      if (!state.listeners[eventName]) {
        state.listeners[eventName] = [];
      }
      state.listeners[eventName].push(callback);
    },
  };

  console.log(
    "%c[diBISAlitas]%c 3D Rian POLMAN Widget siap digunakan. Panggil window.DiBISAWidget.translate('...')",
    "background: #1B9981; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
    "color: #1B9981; font-weight: bold; margin-left: 6px;"
  );
})();

