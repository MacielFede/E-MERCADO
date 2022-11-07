class userInformation{
     constructor(email, firstName1, firstName2, lastName1, lastName2, celphone, image){
          this.email = email;
          this.firstName1 = firstName1;
          this.firstName2 = firstName2;
          this.lastName1 = lastName1;
          this.lastName2 = lastName2;
          this.celphone = celphone;
          this.image = image;
     }
}
let userI = JSON.parse(localStorage.getItem(`${localStorage.getItem("UserName")}Info`));

document.addEventListener("DOMContentLoaded",function(){
     //Me guardo toda la info de la pagina en variables y cargo lo traído del local storage
     let emailAdress = document.getElementById("emailAdress");
     let firstname1 = document.getElementById("firstname1");
     let firstname2 = document.getElementById("firstname2");
     let lastname1 = document.getElementById("lastname1");
     let lastname2 = document.getElementById("lastname2");
     let contactNumber = document.getElementById("contactNumber");
     if(userI != undefined && userI.email == localStorage.getItem("UserName")){
          emailAdress.value = userI.email;
          firstname1.value = userI.firstName1;
          firstname2.value = userI.firstName2;
          lastname1.value = userI.lastName1;
          lastname2.value = userI.lastName2;
          contactNumber.value = userI.celphone;
     }else{
          emailAdress.value = localStorage.getItem("UserName");
     }

     document.getElementById("formFile").addEventListener("change", function(){
          if(this.value == ""){
               switchClasses("d-block", "is-invalid", "formFile");
               this.setCustomValidity("");
          }else{
               const size = this.files[0].size;
               if(size >= 1000000){
                    //Si la imagen es muy pesada no la puedo guardar en el local storage
                    switchClasses("is-invalid", "is-valid", "formFile");
                    this.setCustomValidity("invalid");
               }else{
                    switchClasses("d-block", "is-invalid", "formFile");
                    //Agrego la clase d-block porque si dejo el parametro vacio hay un error
                    this.setCustomValidity("");
               }
          }
     });

     document.getElementsByTagName("form")[0].addEventListener("submit",function(event){
          event.preventDefault();
          event.stopPropagation();
          if(this.checkValidity()){
               //guardo la info en el local storage y actualizo

               //Disclaimer: tuve que hacer todo el proceso 2 veces debido a que la informacion agregada en reader.onleadend
               //era borrada una vez terminada la funcion
               if(userI != null && userI.email == localStorage.getItem("UserName")){
                    if(document.getElementById("formFile").value != ""){
                         const file = document.getElementById("formFile").files[0];
                         const reader = new FileReader();
                         reader.onloadend = function() {
                              let data=(reader.result).split(',')[1];
                              userI.image = atob(data);
                              userI.firstName1 = firstname1.value;
                              userI.firstName2 = firstname2.value;
                              userI.lastName1 = lastname1.value;
                              userI.lastName2 = lastname2.value;
                              userI.celphone = contactNumber.value;
                              userI.email = emailAdress.value;
                              localStorage.removeItem(`${localStorage.getItem("UserName")}Info`);
                              //Elimino la informacion anterior para agregar la nueva en caso de que cambie el email
                              localStorage.setItem("UserName", userI.email);
                              localStorage.setItem(`${localStorage.getItem("UserName")}Info`, JSON.stringify(userI));
                              localStorage.removeItem("imgSRC");
                         }
                         reader.readAsDataURL(file);
                    }else{
                         userI.image = "";
                         userI.firstName1 = firstname1.value;
                         userI.firstName2 = firstname2.value;
                         userI.lastName1 = lastname1.value;
                         userI.lastName2 = lastname2.value;
                         userI.celphone = contactNumber.value;
                         userI.email = emailAdress.value;
                         localStorage.removeItem(`${localStorage.getItem("UserName")}Info`);
                         //Elimino la informacion anterior para agregar la nueva en caso de que cambie el email
                         localStorage.setItem("UserName", userI.email);
                         localStorage.setItem(`${localStorage.getItem("UserName")}Info`, JSON.stringify(userI));
                    }
               }else{
                    if(document.getElementById("formFile").value != ""){
                         const file = document.getElementById("formFile").files[0];
                         const reader = new FileReader();
                         reader.onloadend = function() {
                              let data=(reader.result).split(',')[1];
                              userI = new userInformation(emailAdress.value, firstname1.value, firstname2.value,lastname1.value, lastname2.value, contactNumber.value, atob(data));
                              localStorage.removeItem(`${localStorage.getItem("UserName")}Info`);
                              //Elimino la informacion anterior para agregar la nueva en caso de que cambie el email
                              localStorage.setItem("UserName", userI.email);
                              localStorage.setItem(`${localStorage.getItem("UserName")}Info`, JSON.stringify(userI));
                         }
                         reader.readAsDataURL(file);
                    }else{
                         userI = new userInformation(emailAdress.value, firstname1.value, firstname2.value,lastname1.value, lastname2.value, contactNumber.value, "");
                         localStorage.removeItem(`${localStorage.getItem("UserName")}Info`);
                         //Elimino la informacion anterior para agregar la nueva en caso de que cambie el email
                         localStorage.setItem("UserName", userI.email);
                         localStorage.setItem(`${localStorage.getItem("UserName")}Info`, JSON.stringify(userI));
                    }
               }
               location.reload();
          }
          this.classList.add('was-validated');
     }, false);
});