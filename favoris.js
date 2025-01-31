document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("favorite-button");

    if (button) {
        button.addEventListener("click", function() {
            try {
                const text = document.getElementById("favorite-text");
                const btn = document.getElementById("favorite-button");

                text.innerHTML = "⭐ Ajouté à vos favoris !";
                text.style.color = "#FFD700";
                btn.setAttribute("aria-pressed", "true");

                if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                    alert("Appuyez sur le bouton de partage (en bas), puis sur 'Ajouter à l'écran d'accueil'.");
                } else if (navigator.userAgent.match(/Android/i)) {
                    alert("Appuyez sur le menu (⋮) en haut à droite, puis sur 'Ajouter à l'écran d'accueil'.");
                } else {
                    alert("Appuyez sur Ctrl + D (ou Command + D sur Mac) pour ajouter ce site à vos favoris.");
                }
            } catch (e) {
                console.error("Erreur lors de l'ajout aux favoris :", e);
            }
        });
    }
});
