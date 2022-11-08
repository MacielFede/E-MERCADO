const URL = CART_INFO_URL + "25801" + EXT_TYPE ;
let products;
let taxes = 0.15;
let total = 0;
let USDtoday;
let ccNumber = document.getElementById("ccNumber");
let ccSecurity = document.getElementById("ccSecurity");
let ccExpiry = document.getElementById("ccExpiry");
let creditCardRadioB = document.getElementById("credit");
let transferRadioB = document.getElementById("transfer");
let bankAcountNumber = document.getElementById("bankNumber");

let myHeaders = new Headers();
myHeaders.append("apikey", "S1UdVqa9oDhXDhf3ZbUHVJkoKcTO28FE");
let requestOptions = {
     //Seteo los argumentos para pasarle al fetch de myfunction()
     method: 'GET',
     redirect: 'follow',
     headers: myHeaders
};
async function myFunction () {
     //Usamos una api para buscar el valor del dolar en pesos uruguayos
     const res = await fetch("https://api.apilayer.com/exchangerates_data/convert?to=UYU&from=USD&amount=1", requestOptions);
     const data = await res.json();
     if(data.success){
          USDtoday = data.result;
     }else{
          //alert("El servicio de cambio de moneda dejo de funcionar. Por favor deje un mail en federicomaciel.dev@gmail.com indicando el problema");
          USDtoday = 43;
     }
}


const showProducts = obj => {
//Muestra los productos del json y los que el usuario agrego por su cuenta al mismo o la ultima compra del usuario
     htmlContent = "";
     total = 0;
     if(products.articles.length == 0){
          if(localStorage.getItem("previusPurchases") != null){
               let previusPurchase = JSON.parse(localStorage.getItem("previusPurchases"));
               USDtoday = localStorage.getItem("previusUSD");
               taxes = localStorage.getItem("previusTaxes");
               //Me traigo todos los valores de la ultima compra del usuario
               //Si estos no existen(porque no realizo compras previas) simplemente se le muestra 0 en el total, esto se debe a que JS cambia NULL por 0
               for (let [index, product] of previusPurchase.entries()) {
                    if(index > 0 && product.id != 50924 || index == 0){
                         //Esta validacion es usada para saber si el usuario compro el auto peugot 208 (2 veces)
                         htmlContent += `
                         <div class="row h-25 pe-0">
                              <img src="${product.image}" alt="product image" class="col-md-4 col-sm-7" >
                              <div class="col-sm-6 col-md-4 d-grid" style="height:fit-content">
                                   <span class="fw-bold">${product.name}</span>
                                   <span>Cantidad: ${product.count} </span>
                              </div>
                              <div class="allPrice col pe-0 text-end">
                                   <span class="unitPrice">${product.currency}${product.unitCost} - </span><strong>${product.currency}${(product.unitCost * product.count)}</strong>
                              </div>
                         </div>
                         <hr class="mt-3">
                         `;
                         //Hago las sumatorias dentro del if, ya que si el usuario agrega el peugot 208 va a sumar 2 veces
                         if(product.currency === "USD"){
                              total += product.count * product.unitCost;
                         }else{
                              total += Math.round(product.count * (product.unitCost / USDtoday));
                         }
                    }
               }
          }
          document.getElementById("prodList").innerHTML = "";
          //Limpio la lista de productos para que no me apoarezcan 2 listas iguales
          document.getElementById("delivery").innerHTML = `<strong>Esto esta vació!</strong> 
          <p>Tu ultima compra: </p>
          ${htmlContent}
          <section class="row gy-2 mt-0">
               <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                         <div>
                              <h6 class="my-0">Subtotal</h6>
                              <small class="text-muted">Suma de todos los productos</small>
                         </div>
                         <span class="text-muted">USD${total.toLocaleString('en-US')}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                         <div>
                              <h6 class="my-0">Porcentaje</h6>
                              <small class="text-muted">Según el tipo de envió</small>
                         </div>
                         <span class="text-muted" >USD${Math.round(total*taxes).toLocaleString('en-US')}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                         <span>Total (USD)</span>
                         <strong>USD${Math.round((total*taxes) + total).toLocaleString('en-US')}</strong>
                    </li>
               </ul>
               <hr>
          </section>`;
     }else{
          for (let [index, product] of obj.articles.entries()) {
               if(index > 0 && product.id != 50924 || index == 0){
                    //Esta validacion es usada para saber si el usuario agrego al carrito el auto peugot 208
                    let disabled;
                    //Esta variables es usada para habilitar o no el boton para disminuir la cantidad de productos
                    if(product.count==1){ disabled = "disabled"; }
                    else { disabled = ""}
                    htmlContent += `
                    <div class="row h-25 pe-0">
                         <img src="${product.image}" alt="product image" class="col-md-4 col-sm-7" >
                         <div class="col-sm-6 col-md-4" style="height:fit-content">
                              <span class="fw-bold row m-0" id="hola">${product.name}</span>
                              <span class="">Cantidad: <span id="i${index}" style="width: 3rem">${product.count}</span>
                              <div class="btn-group btn-group-sm" role="group">
                                   <button id="${index}button" type="button" onClick="subtotal(${index}, false)" class="btn btn-light" ${disabled}>-</button>
                                   <button type="button" onClick="subtotal(${index}, true)" class="btn btn-light">+</button>
                              </div></span>
                              <div id="quantityFeedback${index}" class="invalid-feedback">No puedes dejar la cantidad en un numero menor o igual a 0</div>
                              <a class="row m-0" style="width: fit-content" onClick="deleteProd(${index})" href=#>Eliminar producto</a>
                         </div>
                         <div class="allPrice col pe-0 text-end">
                              <span class="unitPrice">${product.currency}${product.unitCost} - </span><strong id="cost-${index}">${product.currency}${(product.unitCost * product.count)}</strong>
                         </div>
                    </div>
                    <hr class="mt-3">
                    `;
                    //Hago las sumatorias dentro del if, ya que si el usuario agrega el peugot 208 va a sumar 2 veces
                    if(product.currency === "USD"){
                         total += product.count * product.unitCost;
                    }else{
                         total += Math.round(product.count * (product.unitCost / USDtoday));
                    }
               }
          }
          updateCosts();
          document.getElementById("prodList").innerHTML = htmlContent;
     }
}

function subtotal(index, sumo){
     //Actualiza el subtotal del producto donde cambia la cantidad y reimprime el arreglo
     //Pre: sumo debe ser true para sumar, false en caso contrario
     if(sumo){
          products.articles[index].count += 1;
          document.getElementById(`${index}button`).disabled = false;
     }else{
          products.articles[index].count -= 1;
          if(products.articles[index].count == 1){
               document.getElementById(`${index}button`).disabled = true;
          }
     }
     let cartInLS = JSON.parse(localStorage.getItem("cartProducts"));
     if(cartInLS != null && cartInLS[index-1] != undefined && products.articles[index].name == cartInLS[index-1].name){
          cartInLS[index-1].count = products.articles[index].count;
     }else if(cartInLS == null || (cartInLS[index] != undefined && products.articles[index].name == cartInLS[index].name)){
          cartInLS[index].count = products.articles[index].count;
     }
     localStorage.setItem("cartProducts", JSON.stringify(cartInLS));
     showProducts(products);
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

function paymentValidity(){
     if(!transferRadioB.checked && !creditCardRadioB.checked){
          switchClasses("d-block", "d-none", "selectPayment");
          switchClasses("is-invalid", "is-valid", "credit");
          switchClasses("is-invalid", "is-valid", "transfer");
          return false;
     }else{
          switchClasses("d-none", "d-block", "selectPayment");
          switchClasses("is-valid", "is-invalid", "credit");
          switchClasses("is-valid", "is-invalid", "transfer");
          return paymentValidityInfo();
     }
}

function paymentValidityInfo(){
     if(transferRadioB.checked){
          //Si la casilla de transferencia bancaria esta chequeada, debo verificar si tiene toda la info
          if(bankAcountNumber.value == ""){
               switchClasses("is-invalid", "is-valid", "bankNumber");
               switchClasses("d-block", "d-none", "givePaymentInfo");
               return false;
          }else{
               switchClasses("is-valid", "is-invalid", "bankNumber");
               switchClasses("d-none", "d-block", "givePaymentInfo");
               return true;
          }
     }else{
          //Significa que la casilla de credit card esta chequeada, verifico si tengo toda la informacion
          if(ccNumber.value == "" || ccSecurity.value == "" || ccExpiry.value == ""){
               if(ccNumber.value == ""){
                    switchClasses("is-invalid", "is-valid", "ccNumber");
               }else{
                    switchClasses("is-valid", "is-invalid", "ccNumber");
               }
               if(ccSecurity.value == ""){
                    switchClasses("is-invalid", "is-valid", "ccSecurity");
               }else{
                    switchClasses("is-valid", "is-invalid", "ccSecurity");
               }
               if(ccExpiry.value == ""){
                    switchClasses("is-invalid", "is-valid", "ccExpiry");
               }else{
                    switchClasses("is-valid", "is-invalid", "ccExpiry");
               }
               switchClasses("d-block", "d-none", "givePaymentInfo");
               return false;
          }else{
               switchClasses("d-none", "d-block", "givePaymentInfo");
               switchClasses("is-valid", "is-invalid", "ccNumber");
               switchClasses("is-valid", "is-invalid", "ccSecurity");
               switchClasses("is-valid", "is-invalid", "ccExpiry");
               return true;
          }
     }
}

function quantityValidity(iter){
     //Itera entre todos los input de las cantidades de los productos del carrito para saber si alguno tiene cero
     //Pre: la primer llamada debe ser con iter=0
     if(document.getElementById(`i${iter}`) == null){
          return true;
     }else if(document.getElementById(`i${iter}`).value <=0){
          document.getElementById(`i${iter}`).classList.add("is-invalid");
          switchClasses("d-block", "d-none", `quantityFeedback${iter}`)
          return false;
     }else{
          return quantityValidity(iter+1);
     } 
}

document.addEventListener("DOMContentLoaded", () =>{
     myFunction().then(() =>{
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
     
     creditCardRadioB.addEventListener("click", function(){
          ccNumber.disabled = false;
          ccSecurity.disabled = false;
          ccExpiry.disabled = false;
          bankAcountNumber.disabled = true;
          transferRadioB.checked = false;
          bankAcountNumber.className = "num form-control";
          document.getElementById("payment").innerHTML = `Tarjeta de crédito <a href="" data-bs-toggle="modal" data-bs-target="#paymentModal">Cambiar forma de pago</a>`;
     });
     transferRadioB.addEventListener("click", function(){
          ccNumber.disabled = true;
          ccSecurity.disabled = true;
          ccExpiry.disabled = true;
          bankAcountNumber.disabled = false;
          creditCardRadioB.checked = false;
          ccExpiry.className = "form-control";
          ccNumber.className = "num form-control";
          ccSecurity.className = "num form-control";
          document.getElementById("payment").innerHTML = `Transferencia bancaria <a href="" data-bs-toggle="modal" data-bs-target="#paymentModal">Cambiar forma de pago</a>`;
     });
     document.getElementById("paymentModal").addEventListener("keyup", function(){
          if(paymentValidity()){
               paymentValidityInfo();
          }     
     });

     document.getElementById("delivery").addEventListener('submit', function (event) {
          if (!quantityValidity(0) || !paymentValidity() || !this.checkValidity()) {
               event.preventDefault();
               event.stopPropagation();
          }else{
               event.preventDefault();
               switchClasses("d-block", "d-none", "purchaseCompleted");
               localStorage.setItem("previusPurchases", JSON.stringify(products.articles));
               localStorage.setItem("previusTaxes", taxes);
               localStorage.setItem("previusUSD", USDtoday);
               localStorage.removeItem("cartProducts");
               products.articles = [];
               showProducts(products);
          }
          this.classList.add('was-validated')
     }, false);
});