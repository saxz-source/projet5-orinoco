// 0 AFFICHAGE DU NOMBRE DE PRODUITS DANS LE PANIER
// > from "layouts.js"

// I  RÉSUMÉ DU PANIER

//  - 1/ On identifie l'emplacement HTML où injecter le résumé.
let emplacement = document.getElementById("corpsPanier");

//  - 2/ Si le panier est vide, on cache les éléments de la page ainsi que le loader. 
if (localStorage.nbCommandes < 1) {
    $(".spinner-border").hide();
    $("#messagePanierVide").show();
};

//  - 3/ Création d'une variable qui contient les données 
//    de la commande stockée dans le localStorage (Id + vernis);
let commandeFinale = JSON.parse(localStorage.commande);

//   - 4/ Fonction du calcul du total de la commande et
//     récupération de son emplacement d'affichage.
let somme = 0;
let sommePanier = function (cout) {
    somme = somme + parseInt(cout.price / 100);
    return somme;
};

let coutTotal = document.getElementById("facture");

//  - 5/ On implémente le résumé de la commande :
//     - Pour chaque item de la commande, on clone la "div" du document, que l'on modifie avec les
//     informations relatives aux produits du panier.
//     - De même, on y ajoute un bouton pour supprimer l'article indésirable.
//          ce bouton :
//              - au clic, on affiche une fenetre de confirmation
//              - si le retrait est acté, on cible la ligne du tableau à retirer
//              - on supprime l'item "commande" du Storage
//              - que l'on réinsère actualisé
//              - même processus avec l'indicateur du nombre de produits dans le panier
//              - on recharge la page
//      - Calcul de la somme avec la fonction de calcul de la somme
//      - Effacement du loader et affichage des éléments
//      - Si erreur : Effacement du loader affichage du message d'erreur


for (let i in commandeFinale) {
    makeRequest('GET', `http://localhost:3000/api/furniture/${commandeFinale[i].id}`)
        .then(function (response) {

            let newRow = $(".panierRow").last().clone();
            newRow.find(".nameSlot").html(response.name);
            newRow.find(".varnishSlot").html(commandeFinale[i].vernis);
            newRow.find(".priceSlot").html(response.price / 100 + " €");
            newRow.find(".removeButton").click(function (e) {
                e.preventDefault();
                if (confirm("Retirer cet article ?")) {
                    var pos = commandeFinale.indexOf(commandeFinale[i]);
                    commandeFinale.splice(pos, 1);
                    localStorage.removeItem("commande");
                    let commandeFinaleToStorage = JSON.stringify(commandeFinale);
                    localStorage.setItem("commande", `${commandeFinaleToStorage}`);
                    document.location.reload();
                    let nombrePanier = JSON.parse(localStorage.nbCommandes);
                    nombrePanier--;
                    localStorage.setItem("nbCommandes", `${nombrePanier}`);
                };
            });

            newRow.removeClass("toHide");
            newRow.appendTo(emplacement);
            coutTotal.innerHTML = "Total : " + sommePanier(response) + " €";
            $(".spinner-border").hide();
            $("#corpsPanier").show();
            $("#formContact").show();
        })
        .catch(function (err) {
            console.error("Erreur. Les données du panier n'ont pas pu être affichées.", err.statusText);
            $(".spinner-border").hide();
            $(".hiddenError").show();

        });
};


//  II FORMULAIRE

//  - 1/ Fonction d'affichage des erreurs d'entrée.
const verif = function (champForm) {
    champForm.addEventListener("input", function (e) {
        if (!champForm.validity.valid) {
            champForm.classList.add("is-invalid");
        } else if (champForm.validity.valid) {
            champForm.classList.add("is-valid");
            champForm.classList.remove("is-invalid");
        };
    });
}

//  - 2/ Récupération des éléments input (les values) et exécution de l'affichage de la vérification.
let prenom = document.getElementById("prenom");
verif(prenom);
let nom = document.getElementById("nom");
verif(nom);
let ville = document.getElementById("ville");
verif(ville);
let adresse = document.getElementById("adresse");
verif(adresse);
let mail = document.getElementById("mail");
verif(mail);

// III ENVOI

//  - 1/ Récupération des id des produits commandés.
let products = [];

for (let i in commandeFinale) {
    const produitCommande = new Object();
    produitCommande._id = commandeFinale[i].id;
    products.push(produitCommande);
};

//  - 2/ On configure le bouton d'envoi :
//      - Ecoute de clic sur le bouton
//      - On vérifie si toutes les données formulaires sont valides
//      - On prévient l'effet submit
//      - On construit l'objet "contact"
//      - On construit l'objet "cestParti" contenant les objets 
//          "contact" et "products" attendus par le serveur.
//      - On envoie les données au serveur
//      - On récupère sa réponse que l'on stocke dans le Storage
//      - On redirige l'utilisateur vers la page de confirmation de commande.

document.getElementById("envoiCommande").addEventListener("click", function (e) {
    if (prenom.validity.valid && nom.validity.valid && adresse.validity.valid && ville.validity.valid & mail.validity.valid && localStorage.commande) {
        e.preventDefault();
        const contact = new Object();
        contact.firstName = prenom.value;
        contact.lastName = nom.value;
        contact.city = ville.value;
        contact.address = adresse.value;
        contact.email = mail.value;

        const cestParti = new Object();
        cestParti.contact = contact;
        cestParti.products = products;
        console.log(cestParti);
        let formatCestParti = JSON.stringify(cestParti);

        makeRequest("POST", "http://localhost:3000/api/furniture/order", formatCestParti)
            .then(function (response) {
                if (confirm("Valider votre commande ?")) {

                    var commandeId = JSON.stringify(response.orderId);
                    localStorage.setItem("commandeId", `${commandeId}`);
                    var amount = JSON.stringify(somme);
                    localStorage.setItem("amount", `${amount}`);
                    var utilisateurName = JSON.stringify(response.contact.firstName);
                    localStorage.setItem("userName", `${utilisateurName}`);
                    window.location = "commande.html";

                };
            })
            .catch(function (err) {
                console.error("Echec du stockage des données", err.statusText);
                $(".hiddenError").show();
                $("#corpsPanier").hide();
                $("#formContact").hide();
                $("#facture").hide();
            });

    } else if (!localStorage.commande) {
        window.location.reload;
    };

});
