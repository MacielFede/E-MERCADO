//Dependiendo de la categoría a la que se entre buscamos el id que se guarda 
const URL = PRODUCTS_URL + localStorage.getItem('catID') + EXT_TYPE;
let ACTUAL_SORT_CRITERIA = ""
let prod=[];
let orderedProd=[];
let minPrice = undefined;
let maxPrice = undefined;
let search = "";

function setProdID(id){
  sessionStorage.setItem("ProdID", id);
  location.href = "product-info.html"
}

function sortAndFilterProducts(){
  //Dado un criterio va a ordenar los productos por orden asc, desc o relevancia de ventas
  if (ACTUAL_SORT_CRITERIA === "1-2"){
      prod.products.sort(function(a, b) {
        return parseInt(a.cost)  - parseInt(b.cost);
      });
  }else if (ACTUAL_SORT_CRITERIA === "2-1"){
      prod.products.sort(function(a, b) {
        return parseInt(b.cost) - parseInt(a.cost);
      });
  }else if (ACTUAL_SORT_CRITERIA === "Cant."){
      prod.products.sort(function(a, b) {
          return parseInt(b.soldCount) - parseInt(a.soldCount);
      });
  }
  orderedProd = prod.products.filter(object => 
  //Filtramos por precio primero (mínimo y máximo)
    ((minPrice == undefined) || (minPrice != undefined && parseInt(object.cost) >= minPrice)) &&
    ((maxPrice == undefined) || (maxPrice != undefined && parseInt(object.cost) <= maxPrice))
  //Esta ultima condición es para el campo de búsqueda, pasamos el nombre a mayúsculas para no tener problemas en caracteres
    && ((search != undefined && (object.name.toUpperCase().includes(search))
    || object.description.toUpperCase().includes(search)))
  );
}

function showProducts(array){
  let htmlProducts = "";
  //limpiamos el html para que no se repitan productos
  document.getElementById("product_container").innerHTML = htmlProducts;
  for (let object of array) {
        htmlProducts += `<div onclick="setProdID(${object.id})" class="product">
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
    document.getElementById("product_container").innerHTML = htmlProducts;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {

  getJSONData(URL).then(function (resObj) {
    if (resObj.status === "ok") {
      prod = resObj.data;
      showProducts(prod.products);
      //Portadilla que cambia según la categoría, como solo necesito que se haga una vez lo dejo aquí
      document.getElementById("btnGroupAddon").innerHTML = `${prod.products[1].currency}`
      document.getElementById("port").innerHTML=`${prod.catName}`;
      document.getElementById("intro").innerHTML=`Encuentre los mejores precios en la categoría ${prod.catName} del mercado.`;
    }
  });

  //Filtrado por relevancia-precio
  document.getElementById("asc").addEventListener("click", function(){
    ACTUAL_SORT_CRITERIA = "1-2";
    sortAndFilterProducts();
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("asc").innerHTML;
    showProducts(orderedProd);
  })

  document.getElementById("des").addEventListener("click", function(){
    ACTUAL_SORT_CRITERIA = "2-1";
    sortAndFilterProducts();
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("des").innerHTML;
    showProducts(orderedProd);
  })
  
  document.getElementById("rel").addEventListener("click", function(){
    ACTUAL_SORT_CRITERIA = "Cant.";
    sortAndFilterProducts();
    document.getElementById("btnGroupDrop1").innerHTML = document.getElementById("rel").innerHTML;
    showProducts(orderedProd);
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
    
    sortAndFilterProducts();
    showProducts(orderedProd);
  });

  //Limpiar filtro de precios
  document.getElementById("limpiar").addEventListener("click", function(){
    minPrice = undefined;
    maxPrice = undefined;
    document.getElementById("desde").value = "";
    document.getElementById("hasta").value = "";
    sortAndFilterProducts();
    showProducts(orderedProd);
  });

  //barra de búsqueda
  document.getElementById("busqueda").addEventListener("input", function(){
    //Busca el valor del campo de búsqueda y lo lleva a mayúsculas
    search = document.getElementById("busqueda").value;
    search = search.toUpperCase();
    sortAndFilterProducts();
    showProducts(orderedProd);
  });
});