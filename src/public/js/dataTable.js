new DataTable('#example');
function dataToEdit(id, firstname, lastname, email, phoneNumber, consultationPrice, category, active ) {

    const data = {
      id, firstname, lastname, email, phoneNumber, consultationPrice, category, active
    }
  console.log(data)

  document.cookie = data;
}