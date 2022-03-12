// Variable contenant la liste des produits
const itemsSection = document.getElementById('items');

// Fonction exécuter au chargement de la page
// Cette fonction permet d'affiache les produits sur la page index
(async function onPageload() {
  try {
    //On récupère la liste des produits du serveur
    let products = await getProducts();
    products.forEach((product) => {
      itemsSection.innerHTML += displayProduct(product);
    })
  } catch(e) {
    console.log(e);
  }
})(); //fonction autoexecutable

// Fonction permettant de récupérer la liste de produit du serveur
async function getProducts() {
  const response = await fetch('http://localhost:3000/api/products');
  if (!response.ok) {
    throw new Error(`Erreur HTTP ! statut : ${response.status}`);
  }
  return  response.json();
}

//contenu du html
function displayProduct(product) {
  return `
  <a href="${"./product.html?id=" + product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a> `;
}