let cart = [];

// 1 - Récupérer l'id dans l'url d'appel
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const addToCart=document.getElementById('addToCart');

// 2 - Charger ce produit en appelant l'Api /:id
let productData;
const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products/"+id)
    .then((res) => res.json()).then((data) => (productData = data));
};


const productDisplay = async () =>{
    await fetchProduct();

    document.querySelector(".item__img").innerHTML=`<img src=${productData.imageUrl} alt=${productData.altTxt}></img>`;
    document.getElementById("title").innerHTML= `${productData.name}`
    document.getElementById("price").innerHTML= `${productData.price}`
    document.getElementById("description").innerHTML= `${productData.description}`
    document.getElementById("colors").innerHTML = `<option value="">--SVP, choisissez une couleur --</option>`;
    document.getElementById("colors").innerHTML += productData.colors.map((color) =>
    `
    <option value="${color}">${color}</option>

    `).join("");
};

productDisplay();

// 3 - listener - j'agis au clic du bouton "ajouter au panier"
addToCart.addEventListener("click",() => {

// Initialisation des éléments DOM
let colorsElement = document.getElementById("colors");
let qtyElement = document.getElementById('quantity');
let qty = qtyElement.value;

// Validation du formulaire produit
let error=false; 
qtyElement.classList.remove("error");
colorsElement.classList.remove("error");

// Est-ce qu'une couleur a été choisie ?
let selectedColor = getSelectValue('colors');


if (!selectedColor)
{
    // Indiquer le message d'erreur
    colorsElement.classList.add("error")
    error=true;
};

if (qty <= 0 || qty > 100)
{
    // indiquer message d'erreur
    qtyElement.classList.add("error")
    error=true;
};

// Fin Validation du formulaire produit

if(!error)
{

    // Ajout au panier
    productData.qty=qty;
    productData.selectedColor=selectedColor;

    // On cumule les articles identiques dans le panier
    cart = JSON.parse(sessionStorage.getItem('cart'));    // On va chercher le panier en cours

    if( cart && cart.length > 0)    // Est-que le panier en cours est vide ?
    {
        let identique = false;
        for(i=0; i < cart.length; i++)
        {

            o=cart[i];
    
            if(o._id == productData._id && o.selectedColor == productData.selectedColor)     // On verifie si le couple ID / Couleur choisi est identique dans le panier
            {

                o.qty = parseInt(o.qty) + parseInt(productData.qty);
                cart[i]=o;
                sessionStorage.setItem('cart',JSON.stringify(cart))
                identique=true;
                break;
            }
        };

        if (!identique) // On push un nouvel article car pas d'identique dans le panier en cours
        {
            cart.push(productData);
            sessionStorage.setItem('cart',JSON.stringify(cart))
        }

        alert(`Votre commande de ${productData.qty} ${productData.name} ${productData.selectedColor} a bien été ajouté à votre panier`);

    }
    else
    {
        // Initialisation du premier article dans le panier
        let cart=[];
        cart.push(productData);
        sessionStorage.setItem('cart',JSON.stringify(cart))
        
        alert(`Votre commande de ${productData.qty} ${productData.name} ${productData.selectedColor} a bien été ajouté à votre panier`);
    }


    qtyElement.value= '0';          // Remise à zéro du champ qty
    resetSelectValue('colors');     // On pointe sur la valeur par défaut du Select
}

});  //  End listener

function getSelectValue(selectId)
{
	// On récupère l'élement html <select>
	var selectElmt = document.getElementById(selectId);

	// selectElmt.options correspond au tableau des balises <option> du select
	// selectElmt.selectedIndex correspond à l'index du tableau options qui est actuellement sélectionné

	return selectElmt.options[selectElmt.selectedIndex].value;
}

function resetSelectValue(selectId)
{
	// On récupère l'élement html <select>
	var selectElmt = document.getElementById(selectId);

    for(var i, j = 0; i = selectElmt.options[j]; j++) {
        if(i.value != false) {
            selectElmt.selectedIndex = false;
            break;
        }
    }
}
