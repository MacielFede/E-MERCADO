const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

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
document.addEventListener("DOMContentLoaded", e => {
  if(localStorage.getItem("UserName") != null){
    document.getElementById("u_n").innerHTML = `
    <div class="btn-group h-100 " role="group" aria-label="Button group with nested dropdown">
        <div class="btn-group" role="group">
          <button type="button" 
            class="btn btn-default dropdown-toggle rounded border-dark text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
            ${localStorage.getItem("UserName")}
          </button>
          <ul class="dropdown-menu bg-dark" aria-labelledby="btnGroupDrop1">
            <li> <a class="text-secondary nav-link dropdown-item " href="my-profile.html" >Mi perfil</a> </li>
            <li> <button id="logOut" class="p-2 dropdown-item text-secondary" >Cerrar sesión</button> </li>
          </ul>
        </div>
      </div>
    `;

    document.getElementById("logOut").addEventListener("click", e => {
      localStorage.removeItem("UserName")
      if(window.location.pathname.includes("my-profile.html") || window.location.pathname.includes("cart.html") || window.location.pathname.includes("sell.html")){
        location.href = "index.html";
      }else{
        location.reload();
      }
    });
  }else{
    document.getElementById("u_n").innerHTML = `
      <a class="nav-link" href="logIn.html">Iniciar sesión</a>
    `;
  }
});