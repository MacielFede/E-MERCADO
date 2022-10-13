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
                    <img src="${product.image}" alt="product image" class="col-md-4 col-sm-7" >
                    <div class="col-sm-6 col-md-4 d-grid" style="height:fit-content">
                         <span class="fw-bold" id="hola">${product.name}</span>
                         <span>Cantidad: <input id="i${index}" onInput="subtotal(${index})" style="width: 3rem" type="number" value="${product.count}" min="1"> </span>
                         <a style="width: fit-content" onClick="deleteProd(${index})" href=#>Eliminar producto</a>
                    </div>
                    <div class="allPrice col pe-0 text-end">
                         <span class="unitPrice">${product.currency}${product.unitCost} - </span><strong id="cost-${index}">${product.currency}${product.unitCost}</strong>
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
     let count = document.getElementById(`i${index}`).value;
     products.articles[index].count = count;
     document.getElementById(`cost-${index}`).innerHTML = `${products.articles[index].currency}${products.articles[index].unitCost * count}`;
}

function deleteProd(index){
//Elimina el producto del carrito
     if(index > 0 || index == 0 && localStorage.getItem("cartProducts") != null && products.articles.length == JSON.parse(localStorage.getItem("cartProducts")).length){
          prodDeleted = JSON.parse(localStorage.getItem("cartProducts"));
          prodDeleted.splice(index-1, 1);
          localStorage.setItem("cartProducts", JSON.stringify(prodDeleted));
     }
     products.articles.splice(index,1);

     showProducts(products);
}

document.addEventListener("DOMContentLoaded", e =>{
     getJSONData(URL).then(function(resObj){
          if(resObj.status === "ok"){
               products = resObj.data;
               if(localStorage.getItem("cartProducts") != null){
                    products.articles = products.articles.concat(JSON.parse(localStorage.getItem("cartProducts")));
               }
          }
          showProducts(products);
     });

     document.getElementsByClassName("btn")[0].addEventListener("click", function(){
          document.getElementById("delivery").classList.add("was-validated");
     });
});