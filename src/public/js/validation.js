// import Swal from 'sweetalert2.js';
// Swal = require('sweetalert2.js');



// (() => {
//   "use strict";

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll(".needs-validation");

//   // Loop over them and prevent submission
//   Array.from(forms).forEach((form) => {
//     form.addEventListener(
//       "submit",
//       (event) => {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// })();

//PASSWORD VALIDATION

document.addEventListener("DOMContentLoaded", function () {
  const actualPassword = document.getElementById("password");
  const password = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  if(actualPassword){
    actualPassword.addEventListener("input", function() {
    if(actualPassword.value.trim() !== ""){
      password.removeAttribute("disabled")
    }else{
      password.setAttribute("disabled", "disabled");
    }
  })}
 
  if(password){
    password.addEventListener("input", function () {
      if (password.value.trim() !== "") {
        confirmPassword.setAttribute("required", "required");
        confirmPassword.removeAttribute("disabled")
        actualPassword.setAttribute("required", "required");
      } else {
        confirmPassword.removeAttribute("required");
        confirmPassword.setAttribute("disabled", "disabled");
        actualPassword.removeAttribute("required");
      }
    });
  }

  if(confirmPassword){
    confirmPassword.addEventListener("input", function () {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Las contraseñas no coinciden");
      } else {
        confirmPassword.setCustomValidity("");
      }
    });
  }

  const actions = document.getElementById('action');
  if(actions){
    actions.addEventListener('click', actionList);
  }
});

//Eliminar doctores
const actionList = e => {
  e.preventDefault();
  if(e.target.dataset.id){
    Swal.fire({
      title: 'Deseas eliminar al Doctor?',
      text: "Una vez eliminado, no se puede recuperar.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        const url = `${location.origin}/doctor/${e.target.dataset.id}`

        fetch(url, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
              title: 'Eliminado',
              text: `${data.message}`,
              icon: 'success',
              timer: 3000,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading();
              }
            }).then(() => {
              window.location.href = window.location.href;
            });
        })
      }
      // 
    })
  }else if(e.target.dataset.edit){
    window.location.href = e.target.href;
  }
}
