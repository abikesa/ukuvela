document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  document.querySelectorAll("img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", (e) => {
      e.stopPropagation(); // prevents lightbox click event
      lightbox.style.display = "none";
      lightboxImg.src = "";
    });
  }
});
