
// Récupération des données dans le Storage.

let amount = JSON.parse(localStorage.amount);
let commandeId = JSON.parse(localStorage.commandeId);
let userName = JSON.parse(localStorage.userName);

//Ecriture des messages de remerciement et de conclusion.
document.getElementById("conclusion").innerHTML = "Votre commande au montant de " + amount + " €" + " a pour identifiant " + "&nbsp;<strong>" + commandeId + "</strong>" + ".";
document.getElementById("merciUser").innerHTML = userName.charAt(0).toUpperCase() + userName.substring(1).toLowerCase() + ", nous vous remercions pour votre achat.";

// Retrait des éléments du panier.
localStorage.clear();