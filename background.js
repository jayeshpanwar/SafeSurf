// Open signup page on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("signup.html")
  });
});

// Check visited tabs for malicious domains
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');

    // Load the local malicious domain list
    fetch(chrome.runtime.getURL('malicious_sites.json'))
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.get(['stats'], (result) => {
          let stats = result.stats || { total: 0, threats: 0, threatsList: [] };
          stats.total += 1;

          // If the domain is in the malicious list
          if (data.malicious_domains.includes(domain)) {
            stats.threats += 1;
            stats.threatsList.push({ domain, timestamp: new Date().toISOString() });

            // Save unsafe URL and THEN redirect
            chrome.storage.local.set({ lastUnsafeUrl: tab.url, stats }, () => {
              chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL('warning.html')
              });
            });
          } else {
            // If no threat, just update stats
            chrome.storage.local.set({ stats });
          }
        });
      })
      .catch(err => console.error("Failed to fetch malicious_sites.json:", err));
  }
});

// Open dashboard page on icon click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});
