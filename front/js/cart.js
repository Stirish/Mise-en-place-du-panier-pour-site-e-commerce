//----------------------------------------Affichage du panier--------------------------------------------
const itemsSection = document.getElementById('cart__items');
const inputsQuantity = document.getElementsByClassName('itemQuantity');
const deleteBtn = document.getElementsByClassName("deleteItem");
const totalQuantity = document.getElementById("totalQuantity");
let showTotalPrice = 0;

let basket = JSON.parse(localStorage.getItem("basket")) || [];
console.log(basket);

// Fonction exécuter au chargement de la page
// Cette fonction parcourt le localStorage
// récupère les produits du localStorage
(async function onPageload() {
	for (let product of basket) {
		const baseProduct =  await getProduct(product.id);
		itemsSection.innerHTML += buildProduct(product, baseProduct);
		showTotalPrice += baseProduct.price * product.quantity;
		updateQuantity();
		deleteProduct();
		totalProduct();
		totalPrice();
		validateForm();
	}
	
})();
 
// appel API 
async function getProduct(productId) {
	const response = await fetch(`http://localhost:3000/api/products/${productId}`);
	if (!response.ok) {
		throw new Error(`Erreur HTTP ! statut : ${response.status}`);
	}
	return   response.json();
}

// contenu du html 
function buildProduct(product, baseProduct){
	return `
    <article class="cart__item" " id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
            <img src="${baseProduct.imageUrl}" alt="${baseProduct.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${product.color}</p>
            <p>${baseProduct.price} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}"  id="quantity-${product.id} quantity-${product.color}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem" id="del-${product.id} del-${product.color}">Supprimer</p>
            </div>
            </div>
        </div>
    </article> `;
}

//----------------------------------------Gestion du panier--------------------------------------------


//Changement de quantité
function updateQuantity() {
	for (let input of inputsQuantity) {
		input.addEventListener('change', ()=> {
			let modifyQuantity = parseInt(input.value);
			if (parseInt(modifyQuantity) > 0 && parseInt(modifyQuantity) <= 100) {
				basket.forEach(p => {
					if (("quantity-"+p.id + ' quantity-'+p.color) === input.id) {
						p.quantity = modifyQuantity;
					}
				});
				localStorage.setItem("basket", JSON.stringify(basket));
				location.reload();
			}
		})
	}
}

//Gestion du bouton supprimer l'article
function deleteProduct() {
	for (let input of deleteBtn) {
		input.addEventListener('click', ()=> {
			if (window.confirm("Voulez-vous vraiment supprimer le produit sélectionné?")) 
			{
			let i = 0;
			basket.forEach(p => {
				if (("del-"+p.id + ' del-'+p.color) === input.id) {
					basket.splice(i, 1);
				}
				i++;
			});
			localStorage.setItem("basket", JSON.stringify(basket));
			location.reload();
			}
		})
	}
}

//Calcul et affichage des quantités
function totalProduct() {
	const quantityProduct = document.querySelectorAll(".itemQuantity");
	let totalNumber = 0;
	quantityProduct.forEach((quantity) => {
		totalNumber += parseInt(quantity.value);
	});
	totalQuantity.innerText = totalNumber;
}

// Calcul du prix total
function totalPrice() {
	const getTotalPrice = document.getElementById("totalPrice");
	getTotalPrice.innerText = showTotalPrice;
}

//-------------------------------------------Formulaire-----------------------------------------------

// Recup bouton "Commander!" et envoi dans le localStorage des valeurs remplies du formulaire
function validateForm() {

	// declaration des constantes des input
	const firstName = document.getElementById("firstName");
	const lastName = document.getElementById("lastName");
	const address = document.getElementById("address");
	const city = document.getElementById("city");
	const email = document.getElementById("email");

	// declaration des messages erreurs
	const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
	const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
	const addressErrorMsg = document.getElementById("addressErrorMsg");
	const cityErrorMsg = document.getElementById("cityErrorMsg");
	const emailErrorMsg = document.getElementById("emailErrorMsg");

	// création regex
	const regexFirstLastName = /^[A-Za-z\é\è\ê\-]{3,20}$/;
	const regexaddress = /^[A-Za-z0-9\é\è\ê\-\s\.\,]{5,100}$/;
	const regexCity = /^[A-Za-z\é\è\ê\ \,\-]{2,20}$/;
	const regexEmail = /^[A-Za-z0-9\-\.\_]+@([A-Za-z]+\.)+[A-Za-z]{2,4}$/;

	// condition validation regex input et affichage erreur
	firstName.addEventListener("input", () => {
		if (regexFirstLastName.test(firstName.value)) {
			firstNameErrorMsg.innerText = "";
		} else {
			firstNameErrorMsg.innerText =
				"Le prénom doit contenir entre 3 et 20 lettres et un tiret au besoin";
		}
	});
	lastName.addEventListener("input", () => {
		if (regexFirstLastName.test(lastName.value)) {
			lastNameErrorMsg.innerText = "";
		} else {
			lastNameErrorMsg.innerText =
				"Le nom doit contenir entre 3 et 20 lettres et un tiret au besoin";
		}
	});
	address.addEventListener("input", () => {
		if (regexaddress.test(address.value)) {
			addressErrorMsg.innerText = "";
		} else {
			addressErrorMsg.innerText =
				"L'adresse doit contenir entre 5 et 100 caractères et ne doit pas avoir de caractères spéciaux";
		}
	});
	city.addEventListener("input", () => {
		if (regexCity.test(city.value)) {
			cityErrorMsg.innerText = "";
		} else {
			cityErrorMsg.innerText =
				"La ville doit contenir entre 2 et 20 lettres uniquement";
		}
	});
	email.addEventListener("input", () => {
		if (regexEmail.test(email.value)) {
			emailErrorMsg.innerText = "";
		} else {
			emailErrorMsg.innerText =
				"Veuillez respecter la convention (Exemple : kanap.kanap@kanap.com)";
		}
	});

	// Gestion envoie commande
	const btnCommand = document.getElementById("order");
	btnCommand.addEventListener("click", (e) => {
		e.preventDefault();
		if (
			regexFirstLastName.test(firstName.value) &&
			regexFirstLastName.test(lastName.value) &&
			regexaddress.test(address.value) &&
			regexCity.test(city.value) &&
			regexEmail.test(email.value)
		) {
			let productOrder = [];
			basket.forEach(order => {
				productOrder.push(order.id);
			});
			const order = {
				contact: {
					firstName: firstName.value,
					lastName: lastName.value,
					address: address.value,
					city: city.value,
					email: email.value,
				},
				products: productOrder,
			};
			addServer(order);
		} else {
			e.preventDefault();
			alert("Veuillez vérifier le formulaire.");
		}
	});
}

// gestion envoi au backend
function addServer(order) {
	fetch("http://localhost:3000/api/products/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order),
	})
		.then((response) => response.json())
		.then((response) => {
			localStorage.clear();
			window.location.href = "./confirmation.html?orderId=" + response.orderId;
		})
		.catch((error) => {
			alert(
				"Problème de chargement des produits.\nVeuillez nous excuser du désagrément.\nNous mettons tout en oeuvre pour régler le problème.\n" +
				error.message,
			);
		});
}