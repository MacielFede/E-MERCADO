const URL = CART_INFO_URL + "25801" + EXT_TYPE ;
let products;
let taxes = 0.15;
let total = 0;
let USDtoday;
let myHeaders = new Headers();
myHeaders.append("apikey", "S1UdVqa9oDhXDhf3ZbUHVJkoKcTO28FE");
let requestOptions = {
     method: 'GET',
     redirect: 'follow',
     headers: myHeaders
};
async function myFunction () {
     //Usamos una api para buscar el valor del dolar en pesos uruguayos
     const res = await fetch("https://api.apilayer.com/exchangerates_data/convert?to=UYU&from=USD&amount=1", requestOptions);
     const data = await res.json();
     USDtoday = data.result;
}


const showProducts = obj => {
//Muestra los productos del json y los que el usuario agrego por su cuenta al mismo
     htmlContent = "";
     total = 0;
     if(products.articles.length == 0){
          document.getElementById("delivery").innerHTML = "<strong>Esto esta vació!</strong>"
     }else{
          for (let [index, product] of obj.articles.entries()) {
               if(index > 0 && product.id != 50924 || index == 0){
                    //Esta validacion es usada para saber si el usuario agrego al carrito el auto peugot 208
                    htmlContent += `
                    <div class="row h-25 pe-0">
                         <img src="${product.image}" alt="product image" class="col-md-4 col-sm-7" >
                         <div class="col-sm-6 col-md-4 d-grid" style="height:fit-content">
                              <span class="fw-bold" id="hola">${product.name}</span>
                              <span>Cantidad: <input id="i${index}" onkeydown="return false" onInput="subtotal(${index})" style="width: 3rem" type="number" value="${product.count}" min="1"> </span>
                              <a style="width: fit-content" onClick="deleteProd(${index})" href=#>Eliminar producto</a>
                         </div>
                         <div class="allPrice col pe-0 text-end">
                              <span class="unitPrice">${product.currency}${product.unitCost} - </span><strong id="cost-${index}">${product.currency}${product.unitCost}</strong>
                         </div>
                    </div>
                    <hr class="mt-3">
                    `;
                    if(product.currency === "USD"){
                         total += product.count * product.unitCost;
                    }else{
                         total += Math.round(product.count * (product.unitCost / USDtoday));
                    }
               }
          }
          updateCosts();
     }
     document.getElementById("prodList").innerHTML = htmlContent;
}

function subtotal(index){
//Actualiza el subtotal del producto donde cambia la cantidad
     let count = document.getElementById(`i${index}`).value;
     products.articles[index].count = count;
     document.getElementById(`cost-${index}`).innerHTML = `${products.articles[index].currency}${products.articles[index].unitCost * count}`;
     total += products.articles[index].unitCost
     updateCosts();
}

function deleteProd(index){
//Elimina el producto del carrito
     if(index > 0 || 
     index == 0 && localStorage.getItem("cartProducts") != null && 
     products.articles.length == JSON.parse(localStorage.getItem("cartProducts")).length){
          prodDeleted = JSON.parse(localStorage.getItem("cartProducts"));
          prodDeleted.splice(index-1, 1);
          localStorage.setItem("cartProducts", JSON.stringify(prodDeleted));
     }else if(index == 0 && localStorage.getItem("cartProducts") != null && 
     products.articles.length != JSON.parse(localStorage.getItem("cartProducts")).length &&
     products.articles[index].id == 50924){
          prodDeleted = JSON.parse(localStorage.getItem("cartProducts"));
          let i = 0;
          let flag = false;
          while(i < prodDeleted.length && !flag){
               if(prodDeleted[i].id == 50924){
                    prodDeleted.splice(i, 1);
                    localStorage.setItem("cartProducts", JSON.stringify(prodDeleted));
                    flag = true;
                    if(i == 0){
                         products.articles.splice(i,1);
                    }
               }else{
                    i++;
               }
          }
     }
     products.articles.splice(index,1);

     showProducts(products);
}

function updateCosts(){
     document.getElementById("costText").innerHTML = "USD" + total.toLocaleString('en-US');
     document.getElementById("taxText").innerHTML = "USD" + Math.round(total*taxes).toLocaleString('en-US');
     document.getElementById("totalCostText").innerHTML = "USD" + Math.round((total*taxes) + total).toLocaleString('en-US');
}


document.addEventListener("DOMContentLoaded", e =>{
     
     myFunction().then(e =>{
          getJSONData(URL).then(function(resObj){
               if(resObj.status === "ok"){
                    products = resObj.data;
                    if(localStorage.getItem("cartProducts") != null){
                         products.articles = products.articles.concat(JSON.parse(localStorage.getItem("cartProducts")));
                    }
               }
               showProducts(products);
          });
     })

     document.getElementsByClassName("btn")[0].addEventListener("click", function(){
          document.getElementById("delivery").classList.add("was-validated");
     });

     document.getElementById("premium").addEventListener("change", function(){
          taxes = 0.15;
          updateCosts();
     });

     document.getElementById("express").addEventListener("change", function(){
          taxes = 0.07;
          updateCosts();
     });

     document.getElementById("standard").addEventListener("change", function(){
          taxes = 0.05;
          updateCosts();
     });
});