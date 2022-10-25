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

const switchClasses = (classToAdd, classToDelete, elementId)=>{
     //Dado un elemento, agrega una clase y elimina otra clase.
     document.getElementById(elementId).classList.add(classToAdd);
     document.getElementById(elementId).classList.remove(classToDelete);
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
                              <span class="unitPrice">${product.currency}${product.unitCost} - </span><strong id="cost-${index}">${product.currency}${(product.unitCost * product.count)}</strong>
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
//Actualiza el subtotal del producto donde cambia la cantidad y reimprime el arreglo
     products.articles[index].count = document.getElementById(`i${index}`).value;
     localStorage.setItem("cartProducts", JSON.stringify(products.articles));
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
          console.log(!paymentValidity());
          console.log(!this.checkValidity());
          if (!paymentValidity() || !this.checkValidity()) {
               event.preventDefault();
               event.stopPropagation();
          }else{
               event.preventDefault();
               switchClasses("d-block", "d-none", "purchaseCompleted");
               localStorage.setItem("previusPurchases", JSON.stringify(products.articles));
               localStorage.removeItem("cartProducts");
               products.articles = [];
               showProducts(products);
          }
          this.classList.add('was-validated')
     }, false);
});