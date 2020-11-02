$(".spinner-border").show();

let displayProducts = document.getElementById("apercusPlace")


makeRequest('GET', `http://localhost:3000/api/furniture`)
    .then(function (response) {
        console.log(response)
        for (let i in response) {
            let oneItem = document.createElement("li");
            displayProducts.appendChild(oneItem);
            oneItem.setAttribute("class", "apercus_cadre col-5 col-md-3")
            let linkItem = document.createElement("a");
            oneItem.appendChild(linkItem);
            linkItem.setAttribute("href", `./lib_html/produit.html?id=${response[i]._id}`)
            let divCadre = document.createElement("div");
            linkItem.appendChild(divCadre);
            let divCadreImage = document.createElement("div");
            divCadreImage.setAttribute("class", "cadreImage")
            divCadre.appendChild(divCadreImage);
            let imageItem = document.createElement("img");
            divCadreImage.appendChild(imageItem);
            imageItem.setAttribute("class", "image-responsive");
            imageItem.setAttribute("src", `${response[i].imageUrl}`);
            imageItem.setAttribute("alt", `${response[i].name}`);
            
            let listInfos = document.createElement("ul");
            divCadre.appendChild(listInfos);
            let nameLi = document.createElement("li");
            listInfos.appendChild(nameLi)
            nameLi.innerHTML = response[i].name
            let priceLi = document.createElement("li");
            listInfos.appendChild(priceLi)
            priceLi.innerHTML = response[i].price / 100 + " €"
        }
        $(".spinner-border").hide();

    })
    .catch(function (err) {
        displayProducts.innerHTML = "Erreur, nous ne parvenons à afficher vos produits. Réessayez plus tard";
        console.log(err.statusText);
        $(".spinner-border").hide();
    });