document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const logo = document.getElementById('logo');
  const lightRadio = document.getElementById('light-mode');
  const darkRadio = document.getElementById('dark-mode');
  const toggleBtn = document.getElementById('toggle-theme');

  // 🧭 Dynamically determine logo path depth
  const pathDepth = window.location.pathname.split('/').length - 1;
  const imagePrefix = pathDepth > 2 ? '../images/' : 'images/';
  const LIGHT_LOGO = imagePrefix + 'ukubona-light-fixed.png';
  const DARK_LOGO = imagePrefix + 'ukubona-dark-fixed.png';

  // ⚙️ Theme setter
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (logo) logo.src = theme === 'dark' ? DARK_LOGO : LIGHT_LOGO;
    if (toggleBtn) toggleBtn.textContent = theme === 'dark' ? '🌙' : '🌞';
  }

  // ⏳ Load stored theme or fallback
  const storedTheme = localStorage.getItem('theme') || 'light';
  setTheme(storedTheme);
  if (lightRadio && darkRadio) {
    (storedTheme === 'dark' ? darkRadio : lightRadio).checked = true;
  }

  // 🎚️ Theme switching controls
  if (lightRadio) lightRadio.addEventListener('change', () => {
    if (lightRadio.checked) setTheme('light');
  });

  if (darkRadio) darkRadio.addEventListener('change', () => {
    if (darkRadio.checked) setTheme('dark');
  });

  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (logo) logo.src = theme === 'dark' ? DARK_LOGO : LIGHT_LOGO;
  if (toggleBtn) toggleBtn.textContent = theme === 'dark' ? '🌙' : '🌞';

  // Apply theme class to iframe wrapper(s)
  document.querySelectorAll('.video-frame-wrapper').forEach(wrapper => {
    wrapper.classList.toggle('dark-wrapper', theme === 'dark');
    wrapper.classList.toggle('light-wrapper', theme === 'light');
  });
}
