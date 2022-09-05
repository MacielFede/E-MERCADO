const PROD_URL= PRODUCT_INFO_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const COMMENT_URL = PRODUCT_INFO_COMMENTS_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const ProdInfo = [];
let ProdComments = [];
let htmlContent = "";

function getData(URL, array){
//Hago 2 funciones para asi no tener que repetir código al buscar las urls
     getJSONData(URL).then(function (resObj) {
          if (resObj.status === "ok") {
               //Uso += para que los comentarios del usuario aparezcan aunque apague la pc
               array += resObj.data
          }
     });
}

function showProductInfo(obj){
//Muestra la información del producto usando el DOM
     //Prod category > prod name 
     //prod description 
     //Prod currency - prod cost 
     //Prod sold count 
     htmlContent = `
     <div id="imagesContainer">

     </div>
     <div id="ProdName"> hola
     </div>
     <div id="ProdCost">
     </div>
     `;
     document.getElementById("Info").innerHTML = htmlContent;
}

function ShowProductComments(obj){
//Muestra los comentarios y puntuaciones del producto mostrado.
     for(let comment of obj){
          htmlContent = `
     
          `;
          document.getElementById("Comment").innerHTML += htmlContent;
     }
}



document.addEventListener("DOMContentLoaded", function(){
     document.getElementById("u_n").innerHTML = localStorage.getItem("UserName");
//Verificamos si el localStorage cuenta con algún comentario puesto por el usuario en su pc.
     if(localStorage.getItem("ThisPcComments") != undefined){
          ProdComments = JSON.parse(localStorage.getItem("ThisPcComments"));
     }

     getData(PROD_URL, ProdInfo);
     getData(COMMENT_URL, ProdComments);
     showProductInfo(ProdInfo);
     ShowProductComments(ProdComments);
});



//Al agregar un comentario debo usar localStorage.setItem("", JSON.stringify(...)) para que quede bien guardado en el local storage