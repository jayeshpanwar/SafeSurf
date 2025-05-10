document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['stats'], ({ stats }) => {
      if (!stats || !stats.threatsList) return;
  
      const uniqueDomains = new Set();
      let total = 0;
      let maliciousCount = 0;
  
      const tbody = document.getElementById('maliciousTableBody');
  
      stats.threatsList.forEach(entry => {
        const { domain, timestamp, isMalicious } = entry;
        total++;
        uniqueDomains.add(domain);
  
        if (isMalicious) {
          maliciousCount++;
  
          const tr = document.createElement('tr');
  
          const dateTd = document.createElement('td');
          dateTd.textContent = new Date(timestamp).toLocaleDateString();
          tr.appendChild(dateTd);
  
          const domainTd = document.createElement('td');
          const link = document.createElement('a');
          link.href = `http://${domain}`;
          link.textContent = domain;
          link.target = "_blank";
          domainTd.appendChild(link);
          tr.appendChild(domainTd);
  
          const statusTd = document.createElement('td');
          statusTd.textContent = 'Malicious';
          statusTd.classList.add('malicious');
          tr.appendChild(statusTd);
  
          tbody.appendChild(tr);
        }
      });
  
      document.getElementById('totalCount').textContent = total;
      document.getElementById('uniqueCount').textContent = uniqueDomains.size;
      document.getElementById('maliciousCount').textContent = maliciousCount;
    });
  });
  