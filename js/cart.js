const URL = CART_INFO_URL + "25801" + EXT_TYPE ;
let products;

const showProducts = obj => {
//Muestra los productos del json y los que el usuario agrego por su cuenta al mismo
     htmlContent = "";
     for (let [index, product] of obj.articles.entries()) {
          if(index > 0 && product.name == "Peugeot 208"){
          }else{
               htmlContent += `
               <div class="row h-25 pe-0">
                    <img src="${product.image}" alt="product image" class="col w-25" >
                    <div class="col d-grid h-50">
                         <span class="fw-bold" id="hola">${product.name}</span>
                         <span>Cantidad: <input id="${index}" onInput="subtotal(${index})" style="width: 3rem" type="number" value="${product.count}" min="1"> </span>
                         <a style="width: fit-content" onClick="deleteProd(${index})" href=#>Eliminar producto</a>
                    </div>
                    <div class="col pe-0"> 
                         <span class="pe-0 float-end">${product.currency}${product.unitCost} - <strong id="cost-${index}">${product.currency}${product.unitCost}</strong></span>
                    </div>
               </div>
               <hr class="mt-3">
               `;
          }
     }
     document.getElementById("prodList").innerHTML = htmlContent;
     if(products.articles.length == 0){
          document.getElementById("delivery").innerHTML = "<strong>Esto esta vació!</strong>"
     }
}

function subtotal(index){
//Actualiza el subtotal del producto donde cambia la cantidad
     let count = document.getElementById(`${index}`).value;
     products.articles[index].count = count;
     document.getElementById(`cost-${index}`).innerHTML = `${products.articles[index].currency}${products.articles[index].unitCost * count}`;
}

function deleteProd(index){
//Elimina el producto del carrito
     products.articles.splice(index,1);
     if(index != 0){
          //Si el producto eliminado es un producto agregado por el usuario lo eliminamos del local storage también
          if(JSON.parse(localStorage.getItem("cartProducts")).length == 1){
               //Si solo hay un elemento en el carrito puesto por el usuario borro el local storage y listo
               localStorage.removeItem("cartProducts");
          }else{
               prodDeleted = JSON.parse(localStorage.getItem("cartProducts"));
               prodDeleted.splice(index-1, 1);
               localStorage.setItem("cartProducts", JSON.stringify(prodDeleted));
               console.log(JSON.parse(localStorage.getItem("cartProducts")));
          }
     }
     showProducts(products);
}

document.addEventListener("DOMContentLoaded", e =>{
     getJSONData(URL).then(function(resObj){
          if(resObj.status === "ok"){
               products = resObj.data;
               if(localStorage.getItem("cartProducts") != undefined){
                    products.articles = products.articles.concat(JSON.parse(localStorage.getItem("cartProducts")));
               }
          }
          showProducts(products);
     });

     document.getElementsByClassName("btn")[0].addEventListener("click", function(){
          document.getElementById("delivery").classList.add("was-validated");
     });
});