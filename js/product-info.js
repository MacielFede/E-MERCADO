const PROD_URL= PRODUCT_INFO_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const COMMENT_URL = PRODUCT_INFO_COMMENTS_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
let ProdInfo = [];
let ProdComments = [];
let imgContent = ""
let htmlContent = "";
let activeImage;
let smallImages;


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

function showProductInfo(obj){
//Muestra la información del producto usando el DOM
     obj.images.forEach((img, i) => {
          if(i===0){
               imgContent += `<img src="${img}" class="smImg active">`;
          }else{
               imgContent += `<img src="${img}" class="smImg">`;
          }
     });
     htmlContent = `
     <div id="imagesContainer" class="w-75">
          <img src="${obj.images[0]}" id="ogImg" class="w-100">
          <div class="smallImg mt-3 w-50 d-flex justify-content-start">
               ${imgContent}
          </div>
     </div>
     <div id="ProdDescription" class="">
          <h2 class="row">${obj.category} > ${obj.name}</h2>
          <span class="row">${obj.description}</span>
          <span class="row d-flex align-items-center">${obj.currency} <h3 class="fs-4 col">${obj.cost}</h3></span>
          <span class="row">${obj.soldCount} vendidos hasta el momento.</span>
     </div>
     `;
     document.getElementById("Info").innerHTML = htmlContent;
}

function ShowProductComments(obj){
//Muestra los comentarios y puntuaciones del producto mostrado.
     for(let comment of obj){
          htmlContent = `
               <div id="comentario" class="rounded mb-2 w-50">
                    <span class="ps-3 pt-1 fs-5">${comment.user} - ${comment.score}</span>
                    <span class="ps-3 pt-1 text-muted">${comment.dateTime}</span>
                    <span class="ps-3 pt-1 fs-5">${comment.description}</span>
               </div>
          `;
          document.getElementById("Comment").innerHTML += htmlContent;
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
     });

     getJSONData(COMMENT_URL).then(function (resObj) {
          if (resObj.status === "ok") {
               ProdComments = resObj.data;
          }
          //Verificamos si el localStorage cuenta con algún comentario puesto por el usuario en su pc.
          if(localStorage.getItem("ThisPcComments") != undefined){
               ProdComments += JSON.parse(localStorage.getItem("ThisPcComments"));
          }
          ShowProductComments(ProdComments);
     });

     let smallImages = document.getElementsByClassName("smImg");
     let activeImage = document.getElementsByClassName("active");
     for(let i=0;i<smallImages.length;i++){
          smallImages[i].addEventListener("mouseover", function(e){
               if(activeImage.length > 0){
                    activeImage[0].classList.remove("active");
               }
               this.classList.add("active");
               document.getElementById("ogImg").src = this.src;
          });
     }

});



//Al agregar un comentario debo usar localStorage.setItem("", JSON.stringify(...)) para que quede bien guardado en el local storage