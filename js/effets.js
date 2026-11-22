// Effets visuels communs à toutes les pages : apparitions au défilement, notes de musique,
// visionneuse plein écran pour les photos et affiches, compte à rebours et chiffres animés.
// Rien à modifier ici pour mettre à jour le site.
(function () {
  var calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- En-tête qui prend une ombre + barre de progression + retour en haut ---------- */
  var entete = document.querySelector("header");
  var barre = document.createElement("div");
  barre.className = "barre-progression";
  barre.setAttribute("aria-hidden", "true");
  document.body.appendChild(barre);

  var haut = document.createElement("a");
  haut.className = "retour-haut";
  haut.href = "#";
  haut.setAttribute("aria-label", "Revenir en haut de la page");
  haut.textContent = "↑";
  haut.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: calme ? "auto" : "smooth" });
  });
  document.body.appendChild(haut);

  function auDefilement() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barre.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (entete) entete.classList.toggle("ombre", y > 10);
    haut.classList.toggle("visible", y > 600);
  }
  window.addEventListener("scroll", auDefilement, { passive: true });
  auDefilement();

  /* ---------- Apparition des blocs quand on arrive dessus ---------- */
  var blocs = document.querySelectorAll(
    "main h1, main h2, main section > p, main section > ul, .carte, .galerie figure, .photo-une, .video, .chiffres > div"
  );
  var observateur = "IntersectionObserver" in window && !calme
    ? new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px" })
    : null;

  blocs.forEach(function (bloc) {
    if (bloc.closest(".carte") && !bloc.classList.contains("carte")) return;
    if (!observateur) { bloc.classList.add("visible"); return; }
    bloc.classList.add("apparait");
    // Dans une grille, les éléments arrivent les uns après les autres
    var parent = bloc.parentElement;
    if (parent && (parent.classList.contains("galerie") || parent.classList.contains("cartes") || parent.classList.contains("chiffres"))) {
      var rang = Array.prototype.indexOf.call(parent.children, bloc) % 6;
      bloc.style.transitionDelay = rang * 70 + "ms";
    }
    observateur.observe(bloc);
  });

  /* ---------- Notes de musique qui s'envolent dans le bandeau d'accueil ---------- */
  var bandeau = document.querySelector(".bandeau");
  if (bandeau && !calme) {
    var notes = ["♪", "♫", "♬", "♩"];
    for (var i = 0; i < 10; i++) {
      var note = document.createElement("span");
      note.className = "note";
      note.setAttribute("aria-hidden", "true");
      note.textContent = notes[i % notes.length];
      note.style.left = (5 + Math.random() * 90) + "%";
      note.style.fontSize = (1.2 + Math.random() * 1.8) + "rem";
      note.style.animationDuration = (7 + Math.random() * 7) + "s";
      note.style.animationDelay = (-Math.random() * 12) + "s";
      bandeau.appendChild(note);
    }
  }

  /* ---------- Chiffres qui défilent jusqu'à leur valeur ---------- */
  document.querySelectorAll("[data-compte]").forEach(function (el) {
    var fin = parseInt(el.dataset.compte, 10);
    if (calme || !("IntersectionObserver" in window)) { el.textContent = fin; return; }
    el.textContent = "0";
    new IntersectionObserver(function (entrees, obs) {
      if (!entrees[0].isIntersecting) return;
      obs.disconnect();
      var debut = null;
      function pas(t) {
        if (!debut) debut = t;
        var p = Math.min((t - debut) / 1400, 1);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(pas);
      }
      requestAnimationFrame(pas);
    }).observe(el);
  });

  /* ---------- Compte à rebours avant le prochain spectacle ---------- */
  document.querySelectorAll("[data-date-spectacle]").forEach(function (el) {
    var jour = new Date(el.dataset.dateSpectacle + "T00:00:00");
    var maintenant = new Date();
    maintenant.setHours(0, 0, 0, 0);
    var reste = Math.round((jour - maintenant) / 86400000);
    if (isNaN(reste) || reste < 0) return;
    el.hidden = false;
    el.innerHTML = reste === 0
      ? "<strong>C'est aujourd'hui !</strong>"
      : "J-<strong>" + reste + "</strong>";
    el.setAttribute("aria-label", reste === 0 ? "C'est aujourd'hui" : "Plus que " + reste + " jours");
  });

  /* ---------- Visionneuse plein écran pour les galeries ---------- */
  var galeries = document.querySelectorAll(".galerie");
  if (!galeries.length) return;

  var fond = document.createElement("div");
  fond.className = "visionneuse";
  fond.hidden = true;
  fond.setAttribute("role", "dialog");
  fond.setAttribute("aria-modal", "true");
  fond.setAttribute("aria-label", "Image agrandie");
  fond.innerHTML =
    '<button class="fermer" type="button" aria-label="Fermer">×</button>' +
    '<button class="precedent" type="button" aria-label="Image précédente">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="suivant" type="button" aria-label="Image suivante">›</button>';
  document.body.appendChild(fond);

  var grandeImage = fond.querySelector("img");
  var legende = fond.querySelector("figcaption");
  var liste = [];
  var position = 0;
  var dernierFocus = null;

  function montrer(n) {
    position = (n + liste.length) % liste.length;
    var lien = liste[position];
    var mini = lien.querySelector("img");
    var fig = lien.closest("figure");
    var texte = fig && fig.querySelector("figcaption");
    grandeImage.classList.remove("arrivee");
    void grandeImage.offsetWidth;
    grandeImage.src = lien.href;
    grandeImage.alt = mini ? mini.alt : "";
    grandeImage.classList.add("arrivee");
    legende.innerHTML = texte ? texte.innerHTML : "";
  }
  function ouvrir(galerie, lien) {
    liste = Array.prototype.slice.call(galerie.querySelectorAll("a[href$='.jpg'], a[href$='.png']"));
    dernierFocus = lien;
    montrer(liste.indexOf(lien));
    fond.hidden = false;
    document.body.classList.add("sans-defilement");
    fond.querySelector(".fermer").focus();
  }
  function fermer() {
    fond.hidden = true;
    document.body.classList.remove("sans-defilement");
    if (dernierFocus) dernierFocus.focus();
  }

  galeries.forEach(function (galerie) {
    galerie.addEventListener("click", function (e) {
      var lien = e.target.closest("a[href$='.jpg'], a[href$='.png']");
      if (!lien || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      ouvrir(galerie, lien);
    });
  });

  fond.querySelector(".fermer").addEventListener("click", fermer);
  fond.querySelector(".precedent").addEventListener("click", function () { montrer(position - 1); });
  fond.querySelector(".suivant").addEventListener("click", function () { montrer(position + 1); });
  fond.addEventListener("click", function (e) { if (e.target === fond) fermer(); });
  document.addEventListener("keydown", function (e) {
    if (fond.hidden) return;
    if (e.key === "Escape") fermer();
    if (e.key === "ArrowLeft") montrer(position - 1);
    if (e.key === "ArrowRight") montrer(position + 1);
  });

  // Glisser du doigt sur téléphone
  var departX = null;
  fond.addEventListener("touchstart", function (e) { departX = e.touches[0].clientX; }, { passive: true });
  fond.addEventListener("touchend", function (e) {
    if (departX === null) return;
    var ecart = e.changedTouches[0].clientX - departX;
    if (Math.abs(ecart) > 50) montrer(position + (ecart < 0 ? 1 : -1));
    departX = null;
  });
})();
