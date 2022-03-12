// Déclaration des variables
const productId = new URL(location.href).searchParams.get('id'); // on récupère l'ID du produit de l'adresse de la page
const productImageContainer = document.querySelector('.item__img'); // on sélectionne la div contenant la balise image
const productTitleContainer = document.querySelector('#title');
const productPriceContainer = document.querySelector('#price');
const productDescriptionContainer = document.querySelector('#description');
const productColorContainer = document.querySelector('#colors');

(async function onPageload() {
    try {
        //On récupère la liste des produits du serveur
        let product = await getProduct();
        setProductData(product);
    } catch(e) {
        console.log(e);
    }
})(); //fonction autoexecutable

async function getProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }
    return  response.json();
}

function setProductData(product) {
    // insertion des données dans l'HTML
    productImageContainer.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productTitleContainer.innerHTML = product.name;
    productPriceContainer.innerHTML = product.price;
    productDescriptionContainer.innerHTML = product.description;

    for (product.color of product.colors) {
        productColorContainer.innerHTML += `<option value="${product.color}">${product.color}</option>`;
    }
    handleAddToCartAction(product);
}

//------------------------------------------------Panier------------------------------------------------//

//Gestion du bouton d'ajout de produit dans le localStorage
function handleAddToCartAction(product) {
    const btnAddCart = document.querySelector('#addToCart');
    btnAddCart.addEventListener("click", () => {
        // data recuperé de l'utilisateur pour le localStorage
        let selectedProduct = {
            name: product.name,
            id: productId,
            quantity: parseInt(document.querySelector('#quantity').value),
            color: productColorContainer.value
        };
        // si l'utilisateur ne rentre pas de couleur ou de quantité non valide
        if (selectedProduct.quantity <= 0 || selectedProduct.quantity > 100) {
            alert('Veuillez entrez une quantité de 1 à 100')
        }else if (selectedProduct.color === "") {
            alert('Veuillez entrez une couleur')
        } else {

            addProductStorage(selectedProduct);
        }
    });
}

// Envoyer les données recuperer dans le tableau Panier dans le localstorage avec conditions,
// si le produit est déja dans le panier changer la quantité.
function addProductStorage(selectedProduct) {
    // creation d'un tableau panier pour y stocker les produits
    let storage = JSON.parse(localStorage.getItem('basket')) || [];

    //Vérifier l'existence du produit sélectionné par l'utilisateur dans le localStorage
    const existingProduct = storage.find(product => product.id === selectedProduct.id && product.color === selectedProduct.color);
    if (existingProduct){
        existingProduct.quantity += selectedProduct.quantity;
    }else{
        storage.push(selectedProduct);
    }
    localStorage.setItem('basket', JSON.stringify(storage));
    popupValidate(selectedProduct.name, selectedProduct.quantity, selectedProduct.color);
}

// Popup choix après ajout au panier
function popupValidate(name, quantity, color) {
	if (
		window.confirm(
			`${quantity} ${name} de couleur ${color} ont été ajoutés à votre panier.\nCliquez sur OK pour continuer vos achats ou ANNULER pour aller au panier`,
		)
	) {
		window.location.href = "index.html";
	} else {
		window.location.href = "cart.html";
	}
}