// Miniatures YouTube : affiche l'image de la vidéo, puis la lance sur place au clic.
document.querySelectorAll(".video-mini").forEach(function (bouton) {
  var id = bouton.dataset.id;
  var titre = bouton.textContent.trim();
  bouton.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
  bouton.setAttribute("aria-label", "Lire la vidéo : " + titre);
  bouton.innerHTML = '<span class="video-titre"></span>';
  bouton.querySelector(".video-titre").textContent = titre;

  bouton.addEventListener("click", function () {
    var cadre = document.createElement("div");
    cadre.className = "video";
    var lecteur = document.createElement("iframe");
    lecteur.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
    lecteur.title = titre;
    lecteur.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    lecteur.allowFullscreen = true;
    cadre.appendChild(lecteur);
    bouton.replaceWith(cadre);
  });
});
