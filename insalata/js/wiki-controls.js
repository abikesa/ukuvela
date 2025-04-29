// wiki-controls.js

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', function () {
  // Text size buttons
  document.getElementById('small-text').addEventListener('click', function () {
    document.body.style.fontSize = '14px';
  });
  document.getElementById('normal-text').addEventListener('click', function () {
    document.body.style.fontSize = '16px';
  });
  document.getElementById('large-text').addEventListener('click', function () {
    document.body.style.fontSize = '18px';
  });

  // Page width buttons
  document.getElementById('standard-width').addEventListener('click', function () {
    document.querySelector('main').style.maxWidth = '800px';
  });
  document.getElementById('wide-width').addEventListener('click', function () {
    document.querySelector('main').style.maxWidth = '1200px';
  });
});
