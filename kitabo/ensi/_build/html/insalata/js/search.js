document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.querySelector('#search-input');
  const topicsContainer = document.getElementById('topics-wrapper');
  const topics = Array.from(document.querySelectorAll('.topic'));
  const globe = document.getElementById('globe'); // << NEW grab the globe

  // Create a "no results" message element
  const noResultsMessage = document.createElement('div');
  noResultsMessage.id = 'no-results-message';
  noResultsMessage.textContent = 'No topics found.';
  noResultsMessage.style.display = 'none';
  noResultsMessage.style.color = 'red';
  noResultsMessage.style.marginTop = '10px';
  searchInput.parentNode.appendChild(noResultsMessage);

  // Map links to iframe IDs based on hrefs
  const topicData = {};
  topics.forEach(topic => {
    const href = topic.getAttribute('href');
    const baseName = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
    topicData[baseName] = {
      link: topic,
      iframe: document.getElementById(baseName),
      content: '',
      originalText: topic.innerText,
      title: topic.innerText.toLowerCase()
    };
  });

  // Preload iframe content into memory
  const iframeKeys = Object.keys(topicData);
  let loadedCount = 0;

  iframeKeys.forEach(key => {
    const iframe = topicData[key].iframe;
    iframe.addEventListener('load', function() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        topicData[key].content = doc.body.innerText.toLowerCase();
      } catch (e) {
        console.error('Failed to read iframe:', key, e);
      }
      loadedCount++;
      if (loadedCount === iframeKeys.length) {
        enableSearch();
      }
    });
  });

  function enableSearch() {
    searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase();
      const results = [];
      let totalScore = 0; // << NEW total score tracker

      iframeKeys.forEach(key => {
        const { link, title, content } = topicData[key];
        let score = 0;

        if (title.includes(searchTerm)) score += 10;
        if (content.includes(searchTerm)) {
          const count = content.split(searchTerm).length - 1;
          score += count;
        }

        if (searchTerm.trim() === '') score = 1; // Show all if search is empty

        if (score > 0) {
          results.push({ key, link, score });
          totalScore += score; // << NEW add to total
        }
      });

      // Control the globe spin based on totalScore
      adjustGlobeSpin(totalScore); // << NEW call after scoring

      if (results.length === 0) {
        noResultsMessage.style.display = 'block';
      } else {
        noResultsMessage.style.display = 'none';

        // Sort results
        results.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          } else {
            return a.link.innerText.localeCompare(b.link.innerText);
          }
        });

        // Clear container
        topicsContainer.innerHTML = '';

        // Add matches
        results.forEach(result => {
          const { key, link } = result;
          const data = topicData[key];

          // Reset link text
          link.innerHTML = data.originalText;

          // Highlight matched text in title
          if (searchTerm.trim() !== '') {
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            link.innerHTML = link.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');
          }

          topicsContainer.appendChild(link);

          // Add search snippet below link
          const preview = document.createElement('div');
          preview.className = 'search-preview';
          const snippet = extractSnippet(data.content, searchTerm);
          preview.innerHTML = snippet ? highlightSnippet(snippet, searchTerm) : '';
          topicsContainer.appendChild(preview);
        });
      }
    });
  }

  function adjustGlobeSpin(totalScore) {
    if (!globe) return;
    let spinSpeed = Math.max(10, 60 - totalScore * 2); // Adjust spin speed
    globe.style.animation = `spin ${spinSpeed}s linear infinite`; // << FULL animation reset
  
    if (totalScore > 20) {
      globe.style.filter = 'drop-shadow(0 0 10px #93c5fd)';
    } else if (totalScore > 5) {
      globe.style.filter = 'drop-shadow(0 0 5px #93c5fd)';
    } else {
      globe.style.filter = 'none';
    }
  }
  

  function getBaseName(href) {
    return href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function extractSnippet(content, term) {
    const index = content.indexOf(term);
    if (index === -1) return '';
    const snippetStart = Math.max(0, index - 30);
    const snippetEnd = Math.min(content.length, index + 70);
    return content.substring(snippetStart, snippetEnd) + '...';
  }

  function highlightSnippet(snippet, term) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    return snippet.replace(regex, '<mark class="highlight">$1</mark>');
  }
});
