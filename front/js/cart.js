// 1 - Je récupère la storageSession cart que je met dans un tableau
let cart = JSON.parse(sessionStorage.getItem('cart'));
let products = [];

// Initialisation des variables
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');
const items = document.getElementById("cart__items");
const inputQty= document.querySelector('input[type="number]')
let total = 0;
let total_qty = 0;
let qty = 0;
let new_qty = 0;
let prix = 0;
let color = '';
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
let firstName, lastName, address, city, email;
const form = document.querySelector("form");

// 2 - Je map le panier
if(cart===null){
    document.querySelector('h1').textContent += " est vide !"
}else {
    cart.map((product) => {
    
    // cumul du prix pour le total de la commande
    total += product.price * product.qty;
    total_qty += parseInt(product.qty);
    products.push(product);

    items.innerHTML += 
    `
    <article class="cart__item" data-id="${product._id}" data-color="${product.selectedColor}">
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>

        <div class="cart__item__content">

            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.selectedColor}</p>
                <p>${product.price} €</p>
            </div>

            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>
    `
    }).join("");

} // End Map


// 3 - Je mets à jours total et qty après mapping
totalPrice.innerHTML=total;
totalQuantity.innerHTML=total_qty;

// 4 - Traitement des modifications qty et suppression
// Création d'un évenement global pour deux actions possédant des valeurs communes
items.addEventListener('click', (e) => {
    e.preventDefault();
    let res = []

    switch(e.target.className)
    {
        case 'deleteItem':

            // On recherche l'item à supprimer
            res = getPath(e);

            // On supprime l'article dans la variable panier
            products = products.filter(element => element._id !== res.id || element.selectedColor !== res.color);
            store(products);    // On met à jour le sessionStorage
            new_qty=-res.qty;   // On récupère la quantité à supprimer du total

            // On supprime la ligne de l'article dans l'affichage du panier
            res.node.style.display='none';

        break;

        case 'itemQuantity' :

            // On recherche l'Item à mettre à jour 
            res = getPath(e);

            // On pointe sur l'article modifié
            let row = products.find(element => element._id == res.id && element.selectedColor == res.color);

            // calcul de la variation de la quantité
            new_qty = row.qty - res.qty;
            if (new_qty > 0)
            {
                row.qty--;
                new_qty = -1;
            }
            else
            {
                if (new_qty != 0)
                {
                    row.qty++;
                    new_qty = 1;
                }
                else new_qty = 0;
            }

            store(products); // On met à jour le sessionStorage

        break;
    }

    // On met à jour les champs nombre d'articles et prix total de la commande
    total = total + (res.prix * new_qty);
    total_qty = total_qty + new_qty;           
    totalPrice.innerHTML=total;
    totalQuantity.innerHTML=total_qty;
});

function store(products)
{
    let rows=[];
    products.map((o) => {
        rows.push(o)
    } )
    sessionStorage.setItem("cart", JSON.stringify(rows));
};


// Permet de trouver l'id du parent "article" de l'élément cliqué en remontant les noeuds parents jusqu'à la balise article qui contient le data-id du produit concerné
function getPath(e)
{

    let node = e.target.closest('article');    // Noeud qui est envoyé par l'évènement click
    let res = {'id':'','qty':0,'color':'','prix':0,'node':''};
    // let end = false;
    // do 
    // {
    //     let parent = node.parentElement;    // Je vais chercher le parent de l'élément en cours
    //     if (parent.parentNode != null)      // J'évite le cas des noeuds null pour éviter une erreur sur le querySelector
    //     {
    //         if (parent.parentNode.querySelector('article')) // Si la balise article est trouvée on sort de la boucle
    //             end=true;
    //     }

    //     node = parent; // On mémorise l'élément parent qui nous concerne

    // }while(!end)
    
    res.id=node.getAttribute('data-id');                    // On récupère l'attribut data-id du produit concerné        
    res.qty=parseInt(node.querySelector('input').value);    // On en profite pour chercher la quantité dans le panier
    res.node=node;                                          // On passe aussi l'élément HTML dans la cas d'une suppression

    let datas = node.getElementsByTagName('p');             // On va récupérer le prix et la couleur selectionnée au sein du node 
    res.color=datas[0].textContent;                         // pour la mise à jour des totaux et la suppression dans le panier
    
    let prix = datas[1].textContent;
    prix = prix.split(' ');
    res.prix=parseInt(prix[0]);

    return res;    // On renvoi le tableau des valeurs
};


// Envoi de la commande si OK
form.addEventListener('submit', (e) => {
    e.preventDefault();

        // je récupère les id des produits que je push dans un tableau.
        let products = [];
        for (let i = 0; i<cart.length;i++) {
            products.push(cart[i]._id);
        }

        // Je crée l'objet contact
    if(firstName && lastName && address && city && email) {
        let contact = {
            firstName,  
            lastName,
            address,
            city,
            email,
        } 

        // Je merge contact et products dans un objet pour l'envoi de la réponse finale au serveur
        let confirmation = {
            contact,
            products
        }

        // Je mémorise la réponse pour la gestion de la confirmation du panier
        sessionStorage.setItem('confirmation',JSON.stringify(confirmation));

        // On clear le formulaire de saisie
        inputs.forEach((input) => (input.value = ""));

        // On appel la page de confirmation
        document.location.href = "confirmation.html";
        alert("Votre commande a bien été validée ! ")
    } 
});

// 5 - Vérification des inputs du formulaire

// Fonction pour gérer les erreurs

const errorDisplay = (tag, message, valid) => {
    const p = document.querySelector("#" + tag + "ErrorMsg")

    if(!valid){
        p.textContent = message;
    } else{
        p.textContent = message;
    }
};


const firstNameChecker = (value) => {
    if (!value.match(/^[a-zA-ZÀ-ÿ-. ]*$/)){

        errorDisplay("firstName", "Votre prénom comporte des caractères spéciaux");
        firstName = null;
    } else{
        errorDisplay("firstName","",true);
        firstName = value;
    }
};

const lastNameChecker = (value) => {
    if (!value.match(/^[a-zA-ZÀ-ÿ-. ]*$/)){
        errorDisplay("lastName", "Votre nom comporte des caractères spéciaux");
        lastName = null;
    } else{
        errorDisplay("lastName","",true);
        lastName = value;
    }
};

const addressChecker = (value) => {
    if (!value){
        errorDisplay("address", "Votre adresse comporte des caractères spéciaux");
        address = null;
    } else{
        errorDisplay("address","",true);
        address = value;
    }
    
};

const cityChecker = (value) => {
    if (!value.match(/^[a-zA-ZÀ-ÿ-. ]*$/)){
        errorDisplay("city", "Votre ville comporte des caractères spéciaux");
        city = null;
    } else{
        errorDisplay("city","",true);
        city = value;
    }
};

const emailChecker = (value) =>{
    if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
        errorDisplay("email","Votre email n'est pas valide");
        email = null;
    } else {
        errorDisplay("email", "", true);
        email = value;
    }
};

// Création d'évenements sur tous les inputs
inputs.forEach((input) =>{
    input.addEventListener("input",(e) => {
        switch(e.target.id) {
            case "firstName":
                firstNameChecker(e.target.value)
                break;
            case "lastName":
                lastNameChecker(e.target.value)
                break;
            case "address":
                addressChecker(e.target.value)
            break;
            case "city":
                cityChecker(e.target.value)
            break;
            case "email":
                emailChecker(e.target.value)
            break;
            default:
                null;
        };
    })
});


