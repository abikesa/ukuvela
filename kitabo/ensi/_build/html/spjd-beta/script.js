document.addEventListener("DOMContentLoaded", function () {
  // Light/Dark mode toggle
  const modeToggle = document.getElementById("modeToggle");
  const headerIcon = document.getElementById("headerIcon");

  modeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      modeToggle.textContent = "🌙 Dark Mode";
      headerIcon.style.filter = "invert(1)";
    } else {
      modeToggle.textContent = "🌞 Light Mode";
      headerIcon.style.filter = "invert(0)";
    }
  });

  // Summary text toggle between + Expand and − Collapse
  document.querySelectorAll("details.custom-details").forEach((detail) => {
    const summary = detail.querySelector("summary");

    const updateLabel = () => {
      summary.textContent = detail.open ? "− Collapse" : "+ Expand";
      summary.style.color = "grey"; // keep the grey love
    };

    // Initial state
    updateLabel();

    // Toggle listener
    detail.addEventListener("toggle", updateLabel);
  });
});
