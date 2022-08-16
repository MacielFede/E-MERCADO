//Dependiendo de la categoria a la que se entre buscamos el id que se guarda 
const URL = PRODUCTS_URL + localStorage.getItem('catID') + ".json";

document.addEventListener("DOMContentLoaded", function (e) {

  getJSONData(URL).then(function (resObj) {
    if (resObj.status === "ok") {
      let prod = resObj.data;
      //Portadilla que cambia segun la cateogria de items
      document.getElementById("intro").innerHTML=`Encuentre los mejores articulos en la categoria ${prod.catName} del mercado.`;
      let htmlProducts = "";
      for (let i=0; i<prod.products.length; i++) {
          htmlProducts = `
            
              <div class="product">
                <a href="product-info.html">
                  <div class="img-container">
                    <img src=${prod.products[i].image} alt="${prod.products[i].name}" >
                    <span class="price">${prod.products[i].currency}${prod.products[i].cost}</span>
                  </div>
                </a>
                  <h3 class="text" >${prod.products[i].name}</h3>
                  <p class="text" >${prod.products[i].description}</p>
                  <p class="text" > ${prod.products[i].soldCount} vendidos.</p>
              </div>
              `;
          document.getElementById("product_container").innerHTML += htmlProducts;
      }
    }
  });
});
