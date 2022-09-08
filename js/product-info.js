const PROD_URL= PRODUCT_INFO_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const COMMENT_URL = PRODUCT_INFO_COMMENTS_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
let ProdInfo = [];
let ProdComments = [];
let imgContent = ""
let htmlContent = "";
let smallImages = [];
let userComment = {
     product: sessionStorage.getItem("ProdID"),
     score: "",
     description: "",
     user: "",
     dateTime: ""
};
let firstTime = true;


// function getData(URL){
// //Hago 2 funciones para asi no tener que repetir código al buscar las urls
//      getJSONData(URL).then(function (resObj) {
//           if (resObj.status === "ok") {
//                //Uso += para que los comentarios del usuario aparezcan aunque apague la pc
//                if(flag){
//                     ProdInfo = resObj.data;
//                     flag = false;
//                }else{
//                     ProdComments += resObj.data;
//                }
//           }
//      });
// }

function ImagesAnim(obj){
     obj.forEach((img, i) => {
     smallImages[i] = document.getElementById(`smImg${i}`);
     });
     for(let i=0;i<smallImages.length;i++){
          smallImages[i].addEventListener("mouseover", function(e){
               document.getElementById("ogImg").src = smallImages[i].src;
          });
     }
}

function showProductInfo(obj){
//Muestra la información del producto usando el DOM
     obj.images.forEach((img, i) => {
          imgContent += `<img src="${img}" id="smImg${i}">
`;
     });
     htmlContent = `
     <div id="imagesContainer" class="w-75">
          <img src="${obj.images[0]}" id="ogImg" class="w-100">
          <div class="smallImg mt-3 w-50 d-flex justify-content-start">
               ${imgContent}
          </div>
     </div>
     <div id="ProdDescription">
          <h2 class="row">${obj.category} > ${obj.name}</h2>
          <span class="row">${obj.description}</span>
          <span class="row d-flex align-items-center">${obj.currency} <h3 class="fs-4 col">${obj.cost}</h3></span>
          <span class="row">${obj.soldCount} vendidos hasta el momento.</span>
     </div>
     `;
     //Botón de compra
     //<div class="btn btn-primary row w-25">botón</div>
     
     document.getElementById("Info").innerHTML = htmlContent;
}

function ShowProductComments(obj){
//Muestra los comentarios y puntuaciones del producto mostrado.
     document.getElementById("Comment").innerHTML = "";
     for(let comment of obj){
          if(firstTime || comment.score > 0){
               let stars = comment.score;
               comment.score="";
               for(let i=0; i<5; i++){
                    if(i<stars){
                         comment.score += `<span class="fa fa-star checked"></span>`
                    }
                    else{
                         comment.score += `<span class="fa fa-star"></span>`
                    }
               }
          }
          htmlContent = `
               <div id="comentario" class="rounded mb-2 w-100">
                    <span class="ps-3 pt-1 fs-5">${comment.user} - ${comment.score}</span>
                    <span class="ps-3 pt-1 text-muted">${comment.dateTime}</span>
                    <span class="ps-3 pt-1 fs-5">${comment.description}</span>
               </div>
          `;
          document.getElementById("Comment").innerHTML += htmlContent;
     }
     firstTime = false;
}

function showUserCommOption(){
     htmlContent = `
     <div id="tuComentario" class="w-100">
          <h2 id="title" class="fs-3 col">Escribe tu opinión</h2>
          <div class="mb-3">
               <label for="exampleFormControlTextarea1" class="form-label">Tu comentario</label>
               <textarea id="com" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Me encanto porque..."></textarea>
          </div>
          <select id="punt" class="form-select class="w-50" aria-label="Default select example">
               <option selected hidden>Tu puntuación</option>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
          </select>
          <div class="col-12">
               <button id="enviarCom" class="btn btn-primary mt-3" type="submit">Enviar opinión</button>
          </div>
     </div>
     `;
     document.getElementById("Comment").innerHTML += htmlContent;
}

function sendUserComment(obj){
          let com = document.getElementById("com").value;
          let punt = document.getElementById("punt").selectedIndex;
          if(com == undefined || com == ""  || punt == undefined || punt == ""){
               if((com == undefined || com == "") && (punt == undefined || punt == "")){
                    alert("Debes ingresar una opinión y una puntuación!");
               }else if(com == undefined || com == ""){
                    alert("Debes ingresar una opinión!");
               }else if(punt == undefined || punt == ""){
                    alert("Debes ingresar una puntuación!");
               }
          }else{
               let date = new Date();
               userComment.description = com;
               userComment.score = parseInt(punt);
               userComment.user = localStorage.getItem("UserName");
               userComment.dateTime = date.getFullYear() + '-' + (date.getMonth()+1)+ '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               obj.push(userComment);
               localStorage.setItem("ThisPcComments", JSON.stringify(userComment));
               location.reload();
          }
}


document.addEventListener("DOMContentLoaded", function(e){
     document.getElementById("u_n").innerHTML = localStorage.getItem("UserName");

     //Lo tuve que hacer asi porque no me copiaba el objeto response a los arreglos ya creados
     getJSONData(PROD_URL).then(function (resObj) {
          if (resObj.status === "ok") {
               ProdInfo = resObj.data;
          }
          showProductInfo(ProdInfo);
          ImagesAnim(ProdInfo.images);
     }).then(function(){
          getJSONData(COMMENT_URL).then(function (resObj) {
               if (resObj.status === "ok") {
                    ProdComments = resObj.data;
               }
               //Verificamos si el localStorage cuenta con algún comentario puesto por el usuario en su pc.
               if(localStorage.getItem("ThisPcComments") != null){
                    ProdComments.push(JSON.parse(localStorage.getItem("ThisPcComments")));
               }
               ShowProductComments(ProdComments);
               showUserCommOption();
               
               document.getElementById("enviarCom").addEventListener("click", function(e){
                    if(localStorage.getItem("ThisPcComments") == null){
                         sendUserComment(ProdComments);
                    }else{
                         if(confirm("Ya hiciste tu comentario! No se pueden hacer 2.\nQuieres eliminar tu comentario actual?")){
                              localStorage.removeItem("ThisPcComments");
                              location.reload();
                         }
                    }
               });
          });
     });

});