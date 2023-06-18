//Methods
const creditCardItem = document.getElementById('creditCard');
const creditCardSection = document.getElementById('creditCardSection');

const payPalItem = document.getElementById('payPal');
const payPalSection = document.getElementById('payPalSection');

const cashlItem = document.getElementById('cash');
const cashSection = document.getElementById('cashSection');

creditCardItem.addEventListener('click', function () {
    creditCardSection.style.display = 'grid';
    payPalSection.style.display = 'none';
    cashSection.style.display = 'none';

    creditCardItem.classList.add('active');
    payPalItem.classList.remove('active');
    cashlItem.classList.remove('active');
});

payPalItem.addEventListener('click', function () {
    payPalSection.style.display = 'grid';
    creditCardSection.style.display = 'none';
    cashSection.style.display = 'none';

    payPalItem.classList.add('active');
    creditCardItem.classList.remove('active');
    cashlItem.classList.remove('active');
});

cashlItem.addEventListener('click', function () {
    cashSection.style.display = 'grid';
    payPalSection.style.display = 'none';
    creditCardSection.style.display = 'none';

    cashlItem.classList.add('active');
    payPalItem.classList.remove('active');
    creditCardItem.classList.remove('active');
});

// CREDIT CARD expiration date format
const expirationDateInput = document.getElementById('expirationDate');

expirationDateInput.addEventListener('input', function () {
    const enteredValue = expirationDateInput.value;
    const formattedValue = formatExpirationDate(enteredValue);
    expirationDateInput.value = formattedValue;
});

function formatExpirationDate(value) {
    const deletedValue = value.replace(/\D/g, '');
    const month = deletedValue.substr(0, 2);
    const year = deletedValue.substr(2, 4);
    let formattedValue = '';

    switch (true) {
        case Boolean(month):
            formattedValue += month;
            break;
        default:
            break;
    }

    switch (true) {
        case Boolean(year):
            formattedValue += '/' + year;
            break;
        default:
            break;
    }

    return formattedValue;
}

// CREDIT CARD CVV format
const cvvInput = document.getElementById('cvv');

cvvInput.addEventListener('input', function () {
    const enteredValue = cvvInput.value;
    const formattedValue = formatCVV(enteredValue);
    cvvInput.value = formattedValue;
});

function formatCVV(value) {
    const deletedValue = value.replace(/\D/g, '');
    const maxLength = parseInt(cvvInput.getAttribute('max'), 10);
    const formattedValue = deletedValue.substr(0, maxLength);
    return formattedValue;
}

//Modal payment
const confirmPaymentButton = document.querySelector('.main-orders__payment-buttons-item:last-child');
const modalOverlay = document.querySelector('.main-orders__payment-modal'); // ("Payment Successful")
const modalCloseButton = document.querySelector('.main-orders__payment-modal-button');

confirmPaymentButton.addEventListener('click', showPaymentModal);
modalCloseButton.addEventListener('click', hidePaymentModal);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        hidePaymentModal();
    }
});

function showPaymentModal() {
    const paymentMethods = document.querySelectorAll('.main-orders__payment-methods-content-item');
    const fields = [];
    let isPaymentMethodSelected = false;

    paymentMethods.forEach(method => {
        const section = document.getElementById(`${method.id}Section`);
        const methodFields = section.querySelectorAll('.main-orders__payment-methods-content-section-input');

        if (method.classList.contains('active')) {
            isPaymentMethodSelected = true;
            methodFields.forEach(field => fields.push(field));
        }
    });

    if (!isPaymentMethodSelected) {
        Swal.fire({
            title: 'Choose a payment method',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    let allFieldsFilled = true;
    fields.forEach(field => {
        if (field.value.trim() === '') {
            allFieldsFilled = false;
            return;
        }
    });

    if (!allFieldsFilled) {
        Swal.fire({
            title: 'Fill in all fields',
            confirmButtonText: 'OK'
        });
        return;
    }

    modalOverlay.classList.remove('hidden');
}

function hidePaymentModal() {
    modalOverlay.classList.add('hidden');
}

