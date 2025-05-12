function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', function () {
  // === Text Size Controls ===
  const smallText = document.getElementById('small-text');
  const normalText = document.getElementById('normal-text');
  const largeText = document.getElementById('large-text');

  if (smallText) smallText.addEventListener('click', () => {
    document.body.style.fontSize = '14px';
  });
  if (normalText) normalText.addEventListener('click', () => {
    document.body.style.fontSize = '16px';
  });
  if (largeText) largeText.addEventListener('click', () => {
    document.body.style.fontSize = '18px';
  });

  // === Width Controls ===
  const standardWidth = document.getElementById('standard-width');
  const wideWidth = document.getElementById('wide-width');

  if (standardWidth) standardWidth.addEventListener('click', () => {
    const main = document.querySelector('main');
    if (main) main.style.maxWidth = '800px';
  });
  if (wideWidth) wideWidth.addEventListener('click', () => {
    const main = document.querySelector('main');
    if (main) main.style.maxWidth = '1200px';
  });

  // === Lightbox Functionality ===
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (modal && modalImg) {
    document.querySelectorAll('#content img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === closeBtn) {
        modal.style.display = 'none';
        modalImg.src = '';
      }
    });
  }
    // === Mobile TOC Toggle ===
    const tocToggleBtn = document.getElementById('toc-toggle');
    const toc = document.getElementById('toc');
  
    if (tocToggleBtn && toc) {
      tocToggleBtn.addEventListener('click', () => {
        if (toc.style.display === 'block') {
          toc.style.display = 'none';
        } else {
          toc.style.display = 'block';
        }
      });
    }
  
});
