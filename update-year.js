document.addEventListener("DOMContentLoaded", function () {
    var yearElements = document.querySelectorAll("#current-year");
    yearElements.forEach(el => el.textContent = new Date().getFullYear());
});
