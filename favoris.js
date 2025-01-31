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

                if (window.sidebar && window.sidebar.addPanel) { 
                    // Firefox
                    window.sidebar.addPanel(document.title, window.location.href, "");
                } else if (window.external && ('AddFavorite' in window.external)) { 
                    // Internet Explorer
                    window.external.AddFavorite(window.location.href, document.title);
                } else if (window.opera && window.print) { 
                    // Opera
                    this.title = document.title;
                } else { 
                    // Autres navigateurs
                    alert("Appuyez sur Ctrl + D (ou Command + D sur Mac) pour ajouter ce site à vos favoris.");
                }
            } catch (e) {
                console.error("Erreur lors de l'ajout aux favoris :", e);
            }
        });
    }
});
