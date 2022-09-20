//Manejamos las animaciones fuera del click para no sobrecargar la función
function emailAnimation(){
     //Agregamos las animaciones y colores del email
     document.getElementById("err1").style.display="block";
     document.getElementById("email").style.borderColor="red";
     document.getElementById("email").classList.toggle("shake");
     document.getElementById("email").addEventListener("animationend", e => 
          document.getElementById("email").classList.toggle("shake"));
}
function passwordAnimation(){
     //Agregamos las animaciones y colores de la password
     document.getElementById("err2").style.display="block";
     document.getElementById("passw").style.borderColor="red";
     document.getElementById("passw").classList.toggle("shake");
     document.getElementById("passw").addEventListener("animationend", e => 
          document.getElementById("passw").classList.toggle("shake"));
}
//Estas 2 funciones son para quitar la animación si el campo cumple con las condiciones
function emailAnimOff(){
     document.getElementById("err1").style.display="none";
     document.getElementById("email").style.borderColor="#4f4f4f";
}
function passwordAnimOff(){
     document.getElementById("err2").style.display="none";
     document.getElementById("passw").style.borderColor="#4f4f4f";
}

function submitLogIn(){
     //Verificamos los valores dentro del evento para saber como están en ese momento
     let email = document.getElementById("email").value;
     let password = document.getElementById("passw").value;

     if (email != "" &&  password != "" ){
     //Usamos esto para ir al inicio permitiendo volver a la pagina de login y probarla a fondo
          localStorage.setItem("UserName", email);
          location.href = "index.html";
     }else{
          if(email == ""){
               emailAnimation();
          }else{
               emailAnimOff();
          }

          if(password == ""){
               passwordAnimation();
          }else{
               passwordAnimOff();
          }
     }
}

document.addEventListener("keypress", function(e){
     if(event.key === "Enter"){
          submitLogIn();
     }
})

document.getElementById("enter").addEventListener("click", function (a) {
     submitLogIn();
});
