// Pasang menu klik kanan saat ekstensi diinstal/di-update
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "gas-langsung-download-bro",
      title: "Gas Langsung Download Bro!",
      contexts: ["all"]
    });
  });
});

// Eksekusi saat menu klik kanan dipilih
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "gas-langsung-download-bro" && tab?.id) {
    chrome.tabs.sendMessage(
      tab.id,
      { action: "FIND_IMAGE_AT_CLICK" },
      { frameId: info.frameId },
      (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          return;
        }
        triggerDownload(response.url, response.filename);
      }
    );
  }
});

// Eksekusi saat shortcut Alt + Klik Kiri digunakan dari content.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "DIRECT_DOWNLOAD" && request.url) {
    triggerDownload(request.url, request.filename);
  }
});

function triggerDownload(url, filename) {
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: false
  });
}