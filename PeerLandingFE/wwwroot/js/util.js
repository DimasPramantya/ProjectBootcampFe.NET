function validateForm(formId, buttonId) {
    const form = document.getElementById(formId);
    const saveButton = document.getElementById(buttonId);

    // If the form is valid, enable the button; otherwise, disable it
    if (form.checkValidity()) {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

function closeConfirmationModal(){
    $('#confirmationModal').modal('hide');
}