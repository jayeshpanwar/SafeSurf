document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['stats'], ({ stats }) => {
      if (!stats || !stats.threatsList) return;
  
      const todayList = document.getElementById('day-list'); // corrected ID
      const weekList = document.getElementById('week-list');
      const monthList = document.getElementById('month-list');
      const logoutButton = document.getElementById('logout-button');
      
      const now = new Date();
      const today = now.toDateString();
      
      // Calculate week start (Sunday at 00:00)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      // Calculate month start
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      
      stats.threatsList.forEach(entry => {
        const { domain, timestamp } = typeof entry === 'string'
          ? { domain: entry, timestamp: new Date().toISOString() }
          : entry;
      
        const visitDate = new Date(timestamp);
        const item = document.createElement('li');
        item.textContent = `${domain} - ${visitDate.toLocaleString()}`;
      
        if (visitDate.toDateString() === today) {
          todayList.appendChild(item);
        }
        if (visitDate >= weekStart) {
          weekList.appendChild(item.cloneNode(true));
        }
        if (visitDate >= monthStart) {
          monthList.appendChild(item.cloneNode(true));
        }
      });

      // Logout functionality
      logoutButton.addEventListener('click', () => {
        chrome.storage.local.remove(['stats'], () => {
          alert('Logged out successfully');
          // Optionally, redirect to the login page
          chrome.tabs.create({ url: chrome.runtime.getURL("login.html") });
        });
      });

      chrome.action.onClicked.addListener(() => 
        { chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }); });
    });
});
