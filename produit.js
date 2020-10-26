// 0 AFFICHAGE DU NOMBRE DE PRODUITS DANS LE PANIER
// > from "layouts.js"

// I Récupération de l'id dans l'URL

let url = new URL(document.location);
var search_params = new URLSearchParams(url.search);
let productId = search_params.get('id');

// II AFFICHAGE DYMANIQUE DU PRODUIT
//  - 1 / Récupération des éléments DOM
let productName = document.getElementById("name");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let productCustomise = document.getElementById("optionsCustomise");
let productImage = document.getElementById("imageProduit");
let messageAjout = document.getElementById("messageAjout");

//  - 2/ On effectue une requête auprès de l'API.
//  - 3/ Si la promesse est résolue :
//      on crée les éléments liés au produit,
//      on efface le loader avant d'afficher les éléments.
//  - 4/ S'il y a une erreur :
//      on donne l'information de l'erreur à la console,
//      on efface le loader avant d'afficher le message d'erreur.

makeRequest('GET', `http://localhost:3000/api/furniture/${productId}`)
  .then(function (response) {

    productName.innerHTML = response.name;
    productImage.setAttribute("src", `${response.imageUrl}`);
    productPrice.innerHTML = response.price / 100 + " €";
    productDescription.innerHTML = response.description;

    let nbOptions = response.varnish;
    for (let j in nbOptions) {
      let newOption = document.createElement("option");
      optionsCustomise.appendChild(newOption);
      newOption.innerHTML = response.varnish[j];
      newOption.setAttribute("value", `${response.varnish[j]}`);
      newOption.setAttribute("class", "optionVernis");
      if (j == 0) newOption.setAttribute("selected", "")
    };
    $(".spinner-border").hide();
    $(".sectionProduit").show();
    $("#formCustomise").show();
  })
  .catch(function (err) {
    console.error("Erreur, nous ne parvenons à afficher votre produit", err.statusText);
    $(".spinner-border").hide();
    $(".hiddenError").show();
  });


// III AJOUT D'UN PRODUIT AU PANIER

//  - 1/ Création de la commande :
let commande = [];
//  - 2/ Ajout d'un événement onclick sur le bouton.
//  - 3/ Au clic :
//      - Incrémentation du nombre de produits dans le panier, affichage, puis stockage dans le Storage.
//      - Récupération l'array de la commande que l'on convertit en Js pour être utilisable
//      - Création d'un nouveau produit que l'on ajoute à l'array de la commande
//      - Envoi du produit au Storage.
//      - Affichage d'un message de succès à l'utilisateur.

document.getElementById("ajoutAuPanier").addEventListener("click", function (e) {
  e.preventDefault();
  if (panierEffectif === undefined) panierEffectif = 0;

  panierEffectif++;
  nbCommandes.innerHTML = panierEffectif;
  localStorage.setItem("nbCommandes", `${panierEffectif}`);

  if (localStorage.commande) commande = JSON.parse(localStorage.commande);
 
  const item = new Object();
  item.id = productId;
  item.vernis = productCustomise.value;
  commande.push(item);

  let commandeToStorage = JSON.stringify(commande);
  localStorage.setItem("commande", `${commandeToStorage}`);
  messageAjout.innerHTML = "Le produit a bien été ajouté au panier";
});