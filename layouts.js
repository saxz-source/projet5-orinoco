// Affichage du nombre de produits dans le panier
// +initialisation des variables nécessaires à cette fin.


// initalisation du nombre de produits dans le panier.
var panierEffectif;

// Définition de l'affichage du nombre de produits dans le panier.
panierEffectif = localStorage.nbCommandes;
if (localStorage.nbCommandes === undefined) localStorage.nbCommandes = 0;

let nbCommandes = document.getElementById("contenuPanier");
nbCommandes.innerHTML = localStorage.nbCommandes;


