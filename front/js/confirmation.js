// On récupère les données de confirmation
let confirmation = sessionStorage.getItem("confirmation");

const init = {
    method : "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body : confirmation,
};

fetch("http://localhost:3000/api/products/order", init)
.then((response) => response.json())
.then((data) => {

    // On affiche le numéro dans la page
    const id = document.getElementById("orderId");
    id.innerText = data.orderId;

    // On clear la mémoire
    sessionStorage.clear();

});

