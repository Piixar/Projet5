// J'appel l'API
const fetchProducts = async () => {
    await fetch("http://localhost:3000/api/products")
    .then((res) => res.json()).then((data) => (productsData = data));
};

// Je map l'API
const productsDisplay = async () =>{
    await fetchProducts();
    for(let product of productsData){
        document.getElementById("items").innerHTML +=
        `
        <a href="./product.html?id=${product._id}">
        <article>
        <img src=${product.imageUrl} alt=${product.altTxt}>
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>
        </a>
        `
    }
};
productsDisplay();
