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

  actualPassword.addEventListener("input", function() {
    if(actualPassword.value.trim() !== ""){
      password.removeAttribute("disabled")
    }else{
      password.setAttribute("disabled", "disabled");
    }
  })
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

  confirmPassword.addEventListener("input", function () {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Las contraseñas no coinciden");
    } else {
      confirmPassword.setCustomValidity("");
    }
  });
});