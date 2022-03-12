// affichage du numéro de commande dans la page confirmation.html
const OrderNumber = new URL(location.href).searchParams.get("orderId");
document.getElementById("orderId").innerText = OrderNumber + "\n Merci beaucoup et à bientôt!";