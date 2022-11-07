const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const switchClasses = (classToAdd, classToDelete, elementId)=>{
     //Dado un elemento, agrega una clase y elimina otra clase.
     document.getElementById(elementId).classList.add(classToAdd);
     document.getElementById(elementId).classList.remove(classToDelete);
}

let showSpinner = function () {
     document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
     document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
     let result = {};
     showSpinner();
     return fetch(url)
     .then((response) => {
          if (response.ok) {
          return response.json();
          } else {
          throw Error(response.statusText);
          }
     })
     .then(function (response) {
          result.status = "ok";
          result.data = response;
          hideSpinner();
          return result;
     })
     .catch(function (error) {
          result.status = "error";
          result.data = error;
          //hideSpinner();
          return result;
     });
};

//Controla si el usuario tiene un username o no y lo redirecciona según donde este
document.addEventListener("DOMContentLoaded", (e) => {
	let imgSRC;
	if (localStorage.getItem("UserName") != null) {
          const active = window.location.href.includes("cart.html") || window.location.href.includes("my-profile") ? "active" : "";
          if (localStorage.getItem(`${localStorage.getItem("UserName")}Info`) != undefined && localStorage.getItem(`${localStorage.getItem("UserName")}Info`)) {
               let imagen = JSON.parse(localStorage.getItem(`${localStorage.getItem("UserName")}Info`));
               if(imagen.image != ""){
                    imgSRC = "data:image/jpeg;base64," + btoa(imagen.image);
               }
               else{
                    imgSRC = "img/img_perfil.png";
               }
          } else{
               imgSRC = "img/img_perfil.png";
          }
          document.getElementById("u_n").innerHTML = `
               <li class="nav-item dropdown">
               <img src=${imgSRC} class="img-thumbnail float-start me-3" alt="userImage" style="width: 40px; height: 40px;">
               <a class="nav-link ${active} dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
               ${localStorage.getItem("UserName")}</a>
               <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                    <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
                    <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
                    <li><a id="logOut" class="dropdown-item" href="logIn.html">Cerrar sesión</a></li>
               </ul>
               </li>
          `;

          document.getElementById("logOut").addEventListener("click", (e) => {
               localStorage.removeItem("UserName");
               window.location.href = "logIn.html";
          });
	} else {
          document.getElementById("u_n").innerHTML = `<a class="nav-link" href="logIn.html">Iniciar sesión</a>
	`;
	}
});
