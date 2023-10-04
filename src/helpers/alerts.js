export const showAlerts = ( errors= {}, alerts) => {

    const category = Object.keys(errors);
    let html = '';
    if(category.length){
        errors[category].forEach(element => {
            html += `<div class="alert ${category} alert-dismissible fade-in show" role="alert">
                ${element}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
        })
    }
    
    let hola = alerts.fn().html;
    return  hola = html;
}
