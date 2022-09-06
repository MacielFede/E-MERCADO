//Dependiendo de la categoría a la que se entre buscamos el id que se guarda 
const URL = PRODUCTS_URL + localStorage.getItem('catID') + EXT_TYPE;
const ORDER_ASC_BY_PRICE = "1-2";
const ORDER_DESC_BY_PRICE = "2-1";
const ORDER_BY_PROD_RELEVANCE = "Cant.";
let prod=[];
let minPrice = undefined;
let maxPrice = undefined;
let search = "";

function setProdID(id){
  sessionStorage.setItem("ProdID", id);
  
}

function sortProducts(criteria){
  //Dado un criterio va a ordenar los productos por orden asc, desc o relevancia de ventas
  if (criteria === ORDER_ASC_BY_PRICE){
      prod.products.sort(function(a, b) {
        return parseInt(a.cost)  - parseInt(b.cost);
      });
  }else if (criteria === ORDER_DESC_BY_PRICE){
      prod.products.sort(function(a, b) {
        return parseInt(b.cost) - parseInt(a.cost);
      });
  }else if (criteria === ORDER_BY_PROD_RELEVANCE){
      prod.products.sort(function(a, b) {
          return parseInt(b.soldCount) - parseInt(a.soldCount);
      });
  }
}

function showProducts(){
  let htmlProducts = "";
  //limpiamos el html para que no se repitan productos
  document.getElementById("product_container").innerHTML = htmlProducts;
  for (let object of prod.products) {
    if(((minPrice == undefined) || (minPrice != undefined && parseInt(object.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(object.cost) <= maxPrice))
        //Esta ultima condición es para el campo de búsqueda, pasamos el nombre a mayúsculas para no tener problemas en caracteres
            && ((search != undefined && (object.name.toUpperCase().includes(search)
            || object.description.toUpperCase().includes(search))))){

        htmlProducts += `
            <div onclick="setProdID(${object.id})" class="product">
              <a href="product-info.html">
                <div class="img-container">
                  <img src=${object.image} alt="${object.name}" >
                  <span class="price">${object.currency}${object.cost}</span>
                </div>
              </a>
                <h3 class="text" >${object.name}</h3>
                <p class="text" >${object.description}</p>
                <p class="text" > ${object.soldCount} vendidos.</p>
            </div>
            `;
    }
    document.getElementById("product_container").innerHTML = htmlProducts;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
//Username agregado al header
  document.getElementById("u_n").innerHTML = localStorage.getItem("UserName");

  getJSONData(URL).then(function (resObj) {
    if (resObj.status === "ok") {
      prod = resObj.data;
      showProducts();
      //Portadilla que cambia según la categoría, como solo necesito que se haga una vez lo dejo aquí
      document.getElementById("btnGroupAddon").innerHTML = `${prod.products[1].currency}`
      document.getElementById("port").innerHTML=`${prod.catName}`;
      document.getElementById("intro").innerHTML=`Encuentre los mejores precios en la categoría ${prod.catName} del mercado.`;
    }
  });

  //Filtrado por relevancia-precio
  document.getElementById("asc").addEventListener("click", function(){
    sortProducts(ORDER_ASC_BY_PRICE);
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("asc").innerHTML;
    showProducts();
  })

  document.getElementById("des").addEventListener("click", function(){
    sortProducts(ORDER_DESC_BY_PRICE);
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("des").innerHTML;
    showProducts();
  })
  
  document.getElementById("rel").addEventListener("click", function(){
    sortProducts(ORDER_BY_PROD_RELEVANCE);
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("rel").innerHTML;
    showProducts();
  })
  //filtrado por max-min precio
  document.getElementById("filtrar").addEventListener("click", function(){
    minPrice = document.getElementById("desde").value;
    maxPrice = document.getElementById("hasta").value;
    //Verifica si pasamos un numero, un carácter o nada
    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
      minPrice = parseInt(minPrice);
    }
    else{ minPrice = undefined; }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
    }
    else{ maxPrice = undefined; }
    
    showProducts();
  });

  //Limpiar filtro de precios
  document.getElementById("limpiar").addEventListener("click", function(){
    minPrice = undefined;
    maxPrice = undefined;
    document.getElementById("desde").value = "";
    document.getElementById("hasta").value = "";
    showProducts();
  });

  //barra de búsqueda
  document.getElementById("busqueda").addEventListener("input", function(){
    //Busca el valor del campo de búsqueda y lo lleva a mayúsculas
    search = document.getElementById("busqueda").value;
    search = search.toUpperCase();
    showProducts();
  });
});