let lastRightClickPos = { x: 0, y: 0 };

// 1. BYPASS ANTI-KLIK KANAN & REKAM KOORDINAT
// Dijalankan pada fase capture (true) agar berjalan lebih dulu sebelum script pemblokir milik website
window.addEventListener("contextmenu", (event) => {
  lastRightClickPos = {
    x: event.clientX,
    y: event.clientY
  };

  // Hentikan script website yang mencoba mematikan menu klik kanan
  event.stopImmediatePropagation();
}, true);

// Hapus atribut oncontextmenu inline pada body/document saat halaman selesai dimuat
window.addEventListener("DOMContentLoaded", () => {
  document.oncontextmenu = null;
  if (document.body) {
    document.body.oncontextmenu = null;
  }
});

// 2. SHORTCUT SUPER CEPAT: ALT + KLIK KIRI LANGSUNG DOWNLOAD
window.addEventListener("click", (event) => {
  if (event.altKey && event.button === 0) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const result = findBestImageAtPoint(event.clientX, event.clientY);
    if (result.success) {
      showToast("Gas! Lagi download gambar...", "success");
      chrome.runtime.sendMessage({
        action: "DIRECT_DOWNLOAD",
        url: result.url,
        filename: result.filename
      });
    } else {
      showToast("Waduh, nggak ketemu gambar di titik ini bro.", "error");
    }
  }
}, true);

// 3. DENGARKAN PERINTAH DARI KLIK KANAN (BACKGROUND SCRIPT)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FIND_IMAGE_AT_CLICK") {
    const result = findBestImageAtPoint(lastRightClickPos.x, lastRightClickPos.y);
    if (result.success) {
      showToast("Gas! Lagi download gambar...", "success");
    } else {
      showToast("Waduh, nggak ketemu gambar di titik ini bro.", "error");
    }
    sendResponse(result);
  }
  return true;
});

// 4. ENGINE PENCARI GAMBAR TEMBUS LAPISAN (X-RAY DETECTOR)
function findBestImageAtPoint(x, y) {
  const elements = document.elementsFromPoint(x, y);
  let candidates = [];

  for (const el of elements) {
    // A. Cek tag <img> langsung
    if (el.tagName === "IMG") {
      const url = getHighestResImgUrl(el);
      if (url) candidates.push({ url, priority: 1, area: el.offsetWidth * el.offsetHeight });
    }

    // B. Cek tag <picture> / <source> atau <img> tersembunyi di dalam container pembungkus (seperti zoom wrapper)
    if (el.querySelectorAll) {
      const innerImgs = el.querySelectorAll("img");
      innerImgs.forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          const url = getHighestResImgUrl(img);
          if (url) candidates.push({ url, priority: 2, area: rect.width * rect.height });
        }
      });
    }

    // C. Cek CSS background-image
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== "none" && bgImage.includes("url(")) {
      const matches = bgImage.match(/url\(["']?(.*?)["']?\)/);
      if (matches && matches[1] && !matches[1].startsWith("data:image/svg")) {
        try {
          const fullUrl = new URL(matches[1], window.location.href).href;
          candidates.push({ url: fullUrl, priority: 3, area: el.offsetWidth * el.offsetHeight });
        } catch (e) {}
      }
    }

    // D. Cek elemen <canvas> (untuk viewer 3D / texture configurator)
    if (el.tagName === "CANVAS") {
      try {
        const dataUrl = el.toDataURL("image/png");
        candidates.push({ url: dataUrl, priority: 4, area: el.offsetWidth * el.offsetHeight });
      } catch (e) {}
    }
  }

  if (candidates.length === 0) {
    return { success: false };
  }

  // Pilih gambar dengan area terluas (mengabaikan ikon kecil/watermark) & prioritas terbaik
  candidates.sort((a, b) => {
    if (Math.abs(b.area - a.area) > 500) return b.area - a.area;
    return a.priority - b.priority;
  });

  const best = candidates[0];
  return {
    success: true,
    url: best.url,
    filename: generateCleanFilename(best.url)
  };
}

// 5. EKSTRAKTOR RESOLUSI TERTINGGI
function getHighestResImgUrl(img) {
  const highResAttrs = [
    "data-zoom-image",
    "data-large-image",
    "data-large",
    "data-original",
    "data-full",
    "data-highres",
    "data-src"
  ];

  for (const attr of highResAttrs) {
    const val = img.getAttribute(attr);
    if (val) {
      try {
        return new URL(val, window.location.href).href;
      } catch (e) {}
    }
  }

  if (img.srcset) {
    const sources = img.srcset.split(",").map(s => {
      const parts = s.trim().split(/\s+/);
      const url = parts[0];
      const width = parts[1] ? parseInt(parts[1].replace(/\D/g, ""), 10) : 0;
      return { url, width };
    });
    sources.sort((a, b) => b.width - a.width);
    if (sources[0] && sources[0].url) {
      try {
        return new URL(sources[0].url, window.location.href).href;
      } catch (e) {}
    }
  }

  return img.currentSrc || img.src || null;
}

// 6. PENAMAAN FILE OTOMATIS BERDASARKAN NAMA PRODUK / HALAMAN
function generateCleanFilename(url) {
  const pageTitle = document.title
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .substring(0, 45);

  if (url.startsWith("data:image/")) {
    return `${pageTitle || "material"}_${Date.now()}.png`;
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const rawName = pathname.substring(pathname.lastIndexOf("/") + 1);

    if (rawName && /\.(jpg|jpeg|png|webp|avif)$/i.test(rawName)) {
      return pageTitle ? `${pageTitle}_${rawName}` : rawName;
    }
  } catch (e) {}

  return `${pageTitle || "material_sample"}_${Date.now()}.jpg`;
}

// 7. NOTIFIKASI TOAST MINIMALIS MONOKROM
function showToast(message, type = "success") {
  const existing = document.getElementById("gldb-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "gldb-toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: "2147483647",
    backgroundColor: type === "success" ? "#111111" : "#ffffff",
    color: type === "success" ? "#ffffff" : "#111111",
    border: "1.5px solid #111111",
    padding: "10px 16px",
    borderRadius: "6px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    opacity: "0",
    transform: "translateY(10px)",
    transition: "all 0.2s ease"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 200);
  }, 2400);
}