(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

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
  //Eliminar doctores
  const actions = document.getElementById('action');
  if(actions){
    actions.addEventListener('click', actionList);
  };

  //Eliminar usuarios
  const userEdit = document.getElementById('userEdit');
  if(userEdit){
    userEdit.addEventListener('click', deleteUser);
  }

  //Eliminar citas

  const appointment = document.getElementById('appointment');
  if(appointment){
    appointment.addEventListener('click', deleteAppointment);
  }
  
});

//Eliminar doctores
const actionList = e => {
  e.preventDefault();
  if(e.target.dataset.id){
    const title = "Deseas eliminar al Doctor?";
    const text = "Una vez eliminado, no se puede recuperar.";
    const id = e.target.dataset.id;
    const route = "doctor"
    alert(title,text, route, id);
  }else if(e.target.dataset.edit){
    window.location.href = e.target.href;
  }
}

//Eliminar Usuarios
const deleteUser = e => {
  e.preventDefault();
  if(e.target.dataset.delete){
    const title = "Deseas eliminar al Paciente?";
    const text = "Una vez eliminado, no se puede recuperar.";
    const id = e.target.dataset.id;
    const route = "user"
    alert(title,text, route, id);
  }else if(e.target.dataset.edit){
    window.location.href = e.target.href;
  }
}

//Eliminar citas
const deleteAppointment = e => {
  e.preventDefault();
  if(e.target.dataset.id){
    const title = "Deseas eliminar la cita?";
    const text = "Una vez eliminada, no se puede recuperar.";
    const id = e.target.dataset.id;
    const route = "appointment"
    alert(title,text, route, id);
  }else if(e.target.dataset.edit){
    window.location.href = e.target.href;
  }
}

function alert(title, text, route, id ){
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar!',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${location.origin}/${route}/${id}`;
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
  })
}

document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.href === window.location.href) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
  }
});