const PROD_URL= PRODUCT_INFO_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const COMMENT_URL = PRODUCT_INFO_COMMENTS_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
let ProdInfo = [];
let ProdComments = [];
let imgContent = ""
let htmlContent = "";
//Este arreglo esta creado ya que no me dejaba iterar con una HTMLCollection
let smallImages = [];
//Dejamos definido el objeto del comentario del usuario
let userComment = {
     product: sessionStorage.getItem("ProdID"),
     score: "",
     description: "",
     user: "",
     dateTime: ""
};

class toCart{
     constructor(id, name, count, unitCost, currency, image){
          this.id = id;
          this.name = name;
          this.count = count;
          this.unitCost = unitCost;
          this.currency = currency;
          this.image = image;
     }
}

function ImagesAnim(obj){
//Agrega la animación de hover a cada imagen del producto
     obj.forEach((img, i) => {
     //Uso el indice de cada imagen para saber que id utiliza
     smallImages[i] = document.getElementById(`smImg${i}`);
     });
     for(let i=0;i<smallImages.length;i++){
          smallImages[i].addEventListener("mouseover", function(e){
               //Lo que hacemos es cambiar la referencia de la imagen original
               document.getElementById("ogImg").src = smallImages[i].src;
          });
     }
}

function showProductInfo(obj){
//Muestra la información del producto usando el DOM
     //Evaluamos si la pantalla del dispositivo es un celular o no, para saber si usamos carousel o no
     if(window.innerWidth <= 767){
          imgContent = `<div id="carouselExampleControls" class="carousel slide" data-bs-interval="false" data-bs-ride="carousel">
          `
          imgContent += `
          <div class="carousel-inner">`;
          obj.images.forEach((img, i) => {
               if(i == 0){
                    imgContent += `
                    <div class="carousel-item active">
                         <img src="${img}" class="d-block w-100" alt="prodImage">
                    </div>`;
               }else{
                    imgContent += `
                    <div class="carousel-item">
                         <img src="${img}" class="d-block w-100" alt="prodImage">
                    </div>`;
               }
          });
          imgContent +=`
               </div>
               <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
               </button>
               <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
               </button>
          </div>`
     }else{
          imgContent = `
          <img src="${obj.images[0]}" id="ogImg" class="w-75">
          <div class="smallImg mt-3 d-flex w-75">
          `;
          obj.images.forEach((img, i) => {
               imgContent +=`
               <img src="${img}" class="w-25" alt="product image" id="smImg${i}">
               `;
          });
          imgContent += `
          </div>`;
     }

     //Creamos la plantilla HTML
     htmlContent = `
     <div id="imagesContainer" class="col-md-6 col-sm-12">
          ${imgContent}
     </div>
     <div id="ProdDescription" class="mt-2 col-md-6 col-sm-12 d-flex flex-column">
               <h2 class="p-0"> ${obj.category} > ${obj.name}</h2>
               <span class="">${obj.description}</span>
               <span class=" d-flex align-items-center py-2">${obj.currency}<h3 class="col">  ${obj.cost}</h3></span>
               <span class="">${obj.soldCount} vendidos hasta el momento.</span>
          <button id="addToCart" class="mt-2 p-3 d-flex justify-content-center align-items-center bg-success btn btn-success">
          <svg class="me-2"xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
          <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"></path>
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z">
          </path></svg>Agregar al carrito</button>   
     </div>
     `;
     
     document.getElementById("Info").innerHTML = htmlContent;
}

function ShowProductComments(obj){
//Muestra los comentarios y puntuaciones del producto mostrado.
     document.getElementById("Comment").innerHTML = `<h2 class="title fs-3 col">Opiniones destacadas</h2>`;
     for(let comment of obj){
          //Al recargar la pagina cada vez que se interactúa con el formulario de ingresar comentario no necesitamos chequear 
          //el tipo de dato de comment.score
          let stars = "";
          for(let i=0; i<5; i++){
               if(i<comment.score){
               //Asigna las estrellas según la puntuación del comentario.
                    stars += `<span class="fa fa-star checked"></span>`;
               }
               else{
                    stars += `<span class="fa fa-star"></span>`;
               }
          }
          htmlContent = `
               <div id="comentario" class="rounded py-2 mb-2 w-100">
                    <span class="ps-3 pt-1 fs-5">${comment.user} - ${stars}</span>
                    <span class="ps-3 pt-1 text-muted">${comment.dateTime}</span>
                    <span class="ps-3 pt-1 fs-5">${comment.description}</span>
               </div>
          `;
          document.getElementById("Comment").innerHTML += htmlContent;
     }
}

function showUserCommOption(){
//Muestra el formulario para ingresar el comentario. Lo hago asi porque tendría un problema de formato si no.
     htmlContent = `
     <div id="tuComentario" class="mb-5">
          <h2 class="title fs-3">Escribe tu opinión</h2>
          <div id="uc" class="mb-1 w-100">
               <label for="exampleFormControlTextarea1" class="form-label">Tu comentario:</label>
               <textarea id="com" class="form-control" maxlength="200" id="exampleFormControlTextarea1" rows="3" placeholder="Me encanto porque..."></textarea>
               <div id="the-count" class="float-end mb-1 fs-6">
                    <span id="current">0</span>
                    <span>/ 200</span>
               </div>     
          </div>
          <div id="err1">Es necesario ingresar un comentario.</div>
          <select id="punt" class="form-select w-50" aria-label="Default select example" >
               <option selected hidden value="0">Tu puntuación</option>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
          </select>
          <div id="err2">Es necesario poner una calificación.</div>
          <div class="col-12">
               <button id="enviarCom" class="btn btn-primary mt-3" type="submit">Enviar opinión</button>
               <button id="eliminarCom" class="btn btn-outline-danger mt-3 ms-3 pt-3 pb-3" type="submit">Eliminar opinión</button>
          </div>
     </div>
     `;
     document.getElementById("Comment").innerHTML += htmlContent;
     if(localStorage.getItem("UserName") == null){
          document.getElementById("com").setAttribute("disabled", true);
          document.getElementById("punt").setAttribute("disabled", true);
          document.getElementById("enviarCom").setAttribute("disabled", true);
          document.getElementById("eliminarCom").setAttribute("disabled", true);
     }
}

function sendUserComment(obj){
//Maneja la interacción con el botón de enviar comentario
          let com = document.getElementById("com").value;
          let punt = document.getElementById("punt").selectedIndex;
          if( com == ""  || punt == ""){
               if(( com == "") && ( punt == "")){
                    document.getElementById("err1").style.display="block";
                    document.getElementById("com").style.borderColor="red";
                    document.getElementById("err2").style.display="block";
                    document.getElementById("punt").style.borderColor="red";
               }else if(com == ""){
                    document.getElementById("err1").style.display="block";
                    document.getElementById("com").style.borderColor="red";
                    document.getElementById("err2").style.display="none";
                    document.getElementById("punt").style.borderColor="#4f4f4f";
               }else if(punt == ""){
                    document.getElementById("err2").style.display="block";
                    document.getElementById("punt").style.borderColor="red";
                    document.getElementById("err1").style.display="none";
                    document.getElementById("com").style.borderColor="#4f4f4f";
               }
          }else{
               //Esto obtiene la fecha y hora actual del sistema.
               let date = new Date();
               userComment.description = com;
               userComment.score = parseInt(punt);
               userComment.user = localStorage.getItem("UserName");
               //Debemos usar el slice para que quede en formato correcto la fecha
               userComment.dateTime = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' +
               ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
               //Define el comentario en el localStorage para que siga apareciendo mas tarde
               localStorage.setItem(`${userComment.product}`+"Comments", JSON.stringify(userComment));
               location.reload();
          }
}

function showRelatedProducts(){
     for(let related of ProdInfo.relatedProducts){
          htmlContent = `
          <div onclick="setProdID(${related.id})" class="product mb-2">
               <div class="img-container">
                    <img src=${related.image} alt="${related.name}" >
               </div>
               <h3 class="title ps-3" >${related.name}</h3>
          </div>
          `;
          document.getElementById("relatedProd").innerHTML += htmlContent;
     }
}

function setProdID(id){
     //Setae el productId dado al Clickea en los productos relacionados.
     sessionStorage.setItem("ProdID", id);
     location.reload();
}

document.addEventListener("DOMContentLoaded", function(e){
     //Lo tuve que hacer asi porque no me copiaba el objeto response a los arreglos ya creados
     //(No se arregla con la anidación del getJSONData)
     getJSONData(PROD_URL).then(function (resObj) {
          if (resObj.status === "ok") {
               ProdInfo = resObj.data;
          }
          showProductInfo(ProdInfo);
          if(window.innerWidth > 767){
               ImagesAnim(ProdInfo.images);
          }
          showRelatedProducts();
          let cart = JSON.parse(localStorage.getItem("cartProducts"));
          document.getElementById("addToCart").addEventListener("click", function(){
               //Cuando se presiona el boton de agregar al carrito
               if(localStorage.getItem("cartProducts") != null){
                    //Si existen otros productos en el carrito
                    let cart = JSON.parse(localStorage.getItem("cartProducts"));
                    let flag = false;
                    let i=0;
                    while(!flag && i<cart.length){
                         if(cart[i].id == ProdInfo.id){
                              //Si ya existe el elemento en el carrito
                              document.getElementById("productInCart").classList.remove("d-none");
                              document.getElementById("productInCart").classList.add("d-inline");
                              document.getElementById("addToCart").setAttribute("disabled", true);
                              flag = true;
                         }else{
                              i++;
                         }
                    }
                    if(!flag){
                         itemToAdd = new toCart(ProdInfo.id, ProdInfo.name, 1, ProdInfo.cost, ProdInfo.currency, ProdInfo.images[0]);
                         if(itemToAdd.id ==50924){
                              cart.unshift(itemToAdd);
                         }else{
                              cart.push(itemToAdd);
                         }
                         localStorage.setItem("cartProducts", JSON.stringify(cart));
                         window.location.href = "cart.html";
                    }
               }else{
                    //si no existe otro producto en el carrito
                    itemToAdd = new toCart(ProdInfo.id, ProdInfo.name, 1, ProdInfo.cost, ProdInfo.currency, ProdInfo.images[0]);
                    let cart = [itemToAdd];
                    localStorage.setItem("cartProducts", JSON.stringify(cart));
                    window.location.href = "cart.html";
               }
          });
     }).then(function(){
          getJSONData(COMMENT_URL).then(function (resObj) {
               if (resObj.status === "ok") {
                    ProdComments = resObj.data;
               }
               //Verificamos si el localStorage cuenta con algún comentario puesto por el usuario en su pc.
               if(localStorage.getItem(`${userComment.product}`+"Comments") != null &&
               localStorage.getItem(`${userComment.product}`+"Comments").includes(`${ProdInfo.id}`)){
                    ProdComments.push(JSON.parse(localStorage.getItem(`${userComment.product}`+"Comments")));
               }
               ShowProductComments(ProdComments);
               showUserCommOption();
               //Agregamos un eventListener al botón de submit
               document.getElementById("enviarCom").addEventListener("click", function(e){
                    if(localStorage.getItem(`${userComment.product}`+"Comments") == null){
                         sendUserComment(ProdComments);
                    }else if(confirm("Ya hiciste tu comentario! No se pueden hacer 2.\nQuieres editar tu comentario actual?")){
                         //Editamos el comentario
                         sendUserComment(ProdComments);
                    }else{
                    //Descartamos todo lo dado por el usuario
                         document.getElementById("com").value = "";
                         document.getElementById("punt").selectedIndex = 0;
                    }
               });
               //Comportamiento de eliminar un comentario
               document.getElementById("eliminarCom").addEventListener("click",function(e){
                    if(localStorage.getItem(`${userComment.product}`+"Comments") != null
                    //confirmamos si el usuario quiere eliminar su opinion
                    && confirm("Estas seguro que quieres eliminar tu comentario?")){
                         //Eliminamos el comentario y recargamos la pagina
                         localStorage.removeItem(`${userComment.product}`+"Comments");
                         location.reload();
                    }else if(localStorage.getItem(`${userComment.product}`+"Comments") == null){
                    //Avisamos que no hay comentarios para eliminar y desactivamos el botón.
                         document.getElementById("noCommentAlert").classList.remove("d-none");
                         document.getElementById("noCommentAlert").classList.add("d-inline");
                         document.getElementById("eliminarCom").setAttribute("disabled", true);
                    }
               });

               document.getElementById("com").addEventListener("keyup", function() {
                    let characterCount = this.value.length;
                    document.getElementById("current").innerHTML = characterCount;
                    if(characterCount === 200){
                         document.getElementById("the-count").style.color = "red";
                    }else{
                         document.getElementById("the-count").style.color = "black";
                    }
               });
          });
     });
});