// Promesses pour les requêtes API, en GET ou POST.
//  - Retourne une promesse
//  - Si la requête est arrivée au bout (onload),
//    et si le statut renvoyé est un succès :
//    on récupère la réponse que l'on convertit en JS,
//    et on résout la promesse.
//  - Si le statut renvoyé n'est pas un succès :
//    on revoie une erreur.


function makeRequest(method, url, envoi) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open(method, url);
    request.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        var response = JSON.parse(this.responseText);
        resolve(response);
      } else {

        reject({
          status: this.status,
          statusText: request.statusText

        });
      }
    };
    request.onerror = function () {
      reject({
        status: this.status,
        statusText: request.statusText
      });
    };
    if (method == "GET") {
      request.send();
    } else if (method == "POST") {
      request.setRequestHeader("Content-Type", "application/json");
      request.send(envoi);
    };
  });
};

