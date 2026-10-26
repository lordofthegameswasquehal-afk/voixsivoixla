# Voix Si Voix la — site de la chorale

Site statique (HTML + CSS, sans outil à installer) publié avec GitHub Pages.

## Les pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil (prochain concert + bouton « Nous rejoindre ») |
| `chorale.html` | La chorale |
| `agenda.html` | Agenda des concerts |
| `nous-rejoindre.html` | Nous rejoindre |
| `ecouter-et-voir.html` | Photos et vidéos |
| `contact.html` | Contact |
| `mentions-legales.html` | Mentions légales |

Le style commun à toutes les pages est dans `css/style.css`, les photos vont dans `images/`.

## Textes à compléter

Tous les textes provisoires sont **surlignés en jaune** sur le site (classe `a-completer`).
Quand un texte est remplacé par le vrai contenu, retirer aussi la balise `<span class="a-completer">…</span>` qui l'entoure.

## Modifier une page depuis GitHub

1. Ouvrir le fichier sur GitHub, cliquer sur le crayon ✏️ « Edit this file ».
2. Modifier le texte (ne toucher qu'au texte entre les balises).
3. Cliquer sur « Commit changes ». Le site est mis à jour en une ou deux minutes.

Pour ajouter un concert dans `agenda.html`, copier-coller un bloc `<article class="carte"> … </article>` et changer la date, le titre et le lieu. Penser à mettre à jour aussi le « Prochain concert » de `index.html`.
