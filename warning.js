document.getElementById('goBackBtn').addEventListener('click', () => {
  window.location.href = chrome.runtime.getURL('dashboard.html');
});

document.getElementById('proceedBtn').addEventListener('click', () => {
  chrome.storage.local.get('stats', ({ stats }) => {
    const unsafeUrl = stats?.lastUnsafeUrl;
    if (unsafeUrl) {
      window.location.href = unsafeUrl;
    } else {
      alert('No URL found.');
    }
  });
});
