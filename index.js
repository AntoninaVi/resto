import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, orderBy, query, setDoc, collection, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRFEYlAtoACnTpswgXq5DajkuqemVtJR0",
    authDomain: "resto-ae0b5.firebaseapp.com",
    projectId: "resto-ae0b5",
    storageBucket: "resto-ae0b5.appspot.com",
    messagingSenderId: "671527093331",
    appId: "1:671527093331:web:5c457adda2e4cd06a6b2a6"
};
// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const dishesRef = collection(db, 'dishes');

// Add data to Firebase
// addDoc(dishesRef, {
//     image: 'img/dishes/misosoup.jpg',
//     title: 'Miso Soup',
//     price: '$ 1.89',
//     availability: '13 Bowls available',
//     type: 'soup'
// })
//     .then((docRef) => {
//         console.log('Dish has been added', docRef.id);
//     })
//     .catch((error) => {
//         console.error('Error adding dish: ', error);
//     });

const mainContent = document.querySelector('.main-content__offers');
const tabs = document.querySelectorAll('.main-tabs__tab');
const dateToday = document.querySelector('.header-date');
const searchInput = document.querySelector('.header-search__input');
const mainOrdersSection = document.querySelector('.main-orders');
const sidebarButtons = document.querySelectorAll('.main-sidebar__btn');
let totalAmount = 0;
const loader = document.getElementById('loader');
//payment
const continueToPaymentButton = document.querySelector('.main-orders__content-button');
const paymentMethodsContainer = document.querySelector('.main-orders__payment');
const confirmationTitle = document.querySelector('.main-orders__title');
const orderNumber = document.querySelector('#orderNumber');
const backButtonArrow = document.querySelector('.main-orders__payment-back-btn');
const itemTitles = document.querySelector('.main-orders__content-titles');
const overlay = document.getElementById('overlay');
const mainOrdersContent = document.querySelector('.main-orders__content');
const cancelButton = document.querySelector('.main-orders__payment-buttons-item:first-child');
const toggleOrdersButton = document.querySelector('.toggle-orders-btn'); //responsive version


getDocs(dishesRef)
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {

            const dishData = doc.data();

            const mainArticle = document.createElement('article');
            mainArticle.className = 'main-content__offers-dish';
            mainArticle.dataset.type = dishData.type; // type filter


            const imageMainArticle = document.createElement('img');
            imageMainArticle.className = 'main-content__offers-dish-img';
            imageMainArticle.src = dishData.image;
            mainArticle.appendChild(imageMainArticle);

            const infoMainArticle = document.createElement('div');
            infoMainArticle.className = 'main-content__offers-dish-info';
            mainArticle.appendChild(infoMainArticle);


            const titleMainArticle = document.createElement('h2');
            titleMainArticle.className = 'main-content__offers-dish-title';
            titleMainArticle.textContent = dishData.title;
            infoMainArticle.appendChild(titleMainArticle);

            const priceMainArticle = document.createElement('p');
            priceMainArticle.className = 'main-content__offers-dish-price';
            priceMainArticle.textContent = dishData.price;
            infoMainArticle.appendChild(priceMainArticle);

            const availabilityMainArticle = document.createElement('p');
            availabilityMainArticle.className = 'main-content__offers-dish-amount';
            availabilityMainArticle.textContent = dishData.availability;
            infoMainArticle.appendChild(availabilityMainArticle);

            mainContent.appendChild(mainArticle);

            showLoader();
        });
        setTimeout(hideLoader, 300);
    });

//Loader
function showLoader() {
    loader.style.display = 'block';
}
function hideLoader() {
    loader.style.display = 'none';
}
//Tabs filter
function filterDishesByType(type) {
    const dishes = document.querySelectorAll('.main-content__offers-dish');

    dishes.forEach((dish) => {
        const dishType = dish.dataset.type;
        if (type === 'all' || dishType === type) {
            dish.style.display = 'block';
        } else {
            dish.style.display = 'none';
        }
    });
}
tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((tab) => {
            tab.classList.remove('active');  //active class for tabs
        });
        tab.classList.add('active');
        const selectedType = tab.textContent.toLowerCase(); // filter for tabs
        filterDishesByType(selectedType);
        clearSearchInput();
    });
});

//date
const today = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayOfWeek = daysOfWeek[today.getDay()];
const day = today.getDate();
const month = months[today.getMonth()];
const year = today.getFullYear();

const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
dateToday.textContent = formattedDate;

//search
let dishNotFoundMessage = null;

searchInput.addEventListener('input', handleSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') { // delete message when deleting letters from search input
        if (searchInput.value === '') {
            clearSearchInput();
        }
    }
});

function handleSearch() {
    const searchText = searchInput.value.toLowerCase();
    const dishes = document.querySelectorAll('.main-content__offers-dish');
    const activeTab = document.querySelector('.main-tabs__tab.active');
    let dishFound = false;

    dishes.forEach((dish) => {
        const dishType = dish.dataset.type;
        const dishTitleElement = dish.querySelector('.main-content__offers-dish-title');
        const dishTitle = dishTitleElement ? dishTitleElement.textContent.toLowerCase() : '';

        if ((activeTab.textContent.toLowerCase() === 'all' || dishType === activeTab.textContent.toLowerCase()) && dishTitle.includes(searchText)) {
            dish.style.display = '';
            dishFound = true;
        } else {
            dish.style.display = 'none';
        }
    });

    if (!dishFound) {
        if (!dishNotFoundMessage) {
            dishNotFoundMessage = document.createElement('p');
            dishNotFoundMessage.className = 'main-content__offers-dish-message';
            dishNotFoundMessage.textContent = "Dish wasn't found 😔";
            mainContent.appendChild(dishNotFoundMessage);
        }
    } else {
        if (dishNotFoundMessage) {
            dishNotFoundMessage.remove();
            dishNotFoundMessage = null;
        }
    }
}

function clearSearchInput() {
    searchInput.value = '';
    handleSearch();
    if (dishNotFoundMessage) {
        dishNotFoundMessage.remove();
        dishNotFoundMessage = null;
    }
}
//Orders
function addDishToOrder(event) {
    showLoader();
    const selectedDish = event.target.closest('.main-content__offers-dish');
    const dishTitle = selectedDish.querySelector('.main-content__offers-dish-title').textContent;
    const dishPrice = selectedDish.querySelector('.main-content__offers-dish-price').textContent;
    const dishImage = selectedDish.querySelector('.main-content__offers-dish-img').src;

    const orderContent = document.querySelector('.main-orders__content-order');

    const existingOrderItems = Array.from(orderContent.getElementsByClassName('main-orders__content-order-item'));

    const existingOrderItem = existingOrderItems.find(item => {
        const title = item.querySelector('.main-orders__content-text-item:first-child').textContent;
        return title === dishTitle;
    });

    if (existingOrderItem) {
        const quantityInput = existingOrderItem.querySelector('.main-orders__content-text-input');
        const currentQuantity = parseInt(quantityInput.value);
        const newQuantity = currentQuantity + 1;
        quantityInput.value = newQuantity;
    } else {
        const orderItem = document.createElement('div');
        orderItem.className = 'main-orders__content-order-item';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'main-orders__content-info';
        orderItem.appendChild(itemInfo);

        const itemImage = document.createElement('img');
        itemImage.className = 'main-orders__content-dish-image';
        itemImage.src = dishImage;
        itemInfo.appendChild(itemImage);

        const itemsText = document.createElement('div');
        itemsText.className = 'main-orders__content-text-items';
        itemInfo.appendChild(itemsText);
        const itemTitle = document.createElement('p');
        itemTitle.className = 'main-orders__content-text-item';
        itemTitle.textContent = dishTitle;
        itemsText.appendChild(itemTitle);

        const itemPrice = document.createElement('p');
        itemPrice.className = 'main-orders__content-text-item';  //orders sub total price
        itemPrice.textContent = dishPrice;
        itemsText.appendChild(itemPrice);

        const itemQty = document.createElement('input');
        itemQty.className = 'main-orders__content-text-input';
        itemQty.type = 'number';
        itemQty.value = '1';                   // count total sum when quantity of items changes
        itemQty.min = '1';
        itemQty.max = '10';
        itemInfo.appendChild(itemQty);
        itemQty.addEventListener('input', function () {
            if (parseInt(itemQty.value) > 10) {
                itemQty.value = '10';
            }
        });

        const orderTotal = document.createElement('div');
        orderTotal.className = 'main-orders__content-order-total'; // price total for each
        orderTotal.textContent = dishPrice;
        itemInfo.appendChild(orderTotal);

        const itemOptions = document.createElement('div');
        itemOptions.className = 'main-orders__content-options';
        orderItem.appendChild(itemOptions);

        const itemNote = document.createElement('input');
        itemNote.className = 'main-orders__content-text-note';
        itemNote.type = 'text';
        itemNote.placeholder = 'Order Note...';
        itemOptions.appendChild(itemNote);

        const itemDelete = document.createElement('button');
        itemDelete.className = 'main-orders__content-order-button'; //delete item from order
        itemOptions.appendChild(itemDelete);
        itemDelete.addEventListener('click', deleteOrderItem);

        orderContent.appendChild(orderItem);

    }
    setTimeout(() => {
        hideLoader();
    }, 300);
    updateTotalAmount();
}

document.addEventListener('click', function (event) {
    if (event.target.matches('.main-content__offers-dish') || event.target.closest('.main-content__offers-dish-img') || event.target.matches('.main-content__offers-dish-title')) {
        addDishToOrder(event);
    }
});

function deleteOrderItem(event) {
    const orderItem = event.target.closest('.main-orders__content-order-item');
    const itemPrice = orderItem.querySelector('.main-orders__content-text-item').textContent;
    const price = parseFloat(itemPrice.substring(1));

    totalAmount -= price;
    orderItem.remove();
    updateTotalAmount();

    // Remove dish from local storage
    const dishTitle = orderItem.querySelector('.main-orders__content-text-item').textContent;
    const existingOrder = localStorage.getItem('order');
    if (existingOrder) {
        const order = JSON.parse(existingOrder);
        const updatedOrder = order.filter((dish) => dish.title !== dishTitle);
        localStorage.setItem('order', JSON.stringify(updatedOrder));
    }
}

//update sum Sub total
function updateTotalAmount() {
    const orderItems = document.querySelectorAll('.main-orders__content-order-item');
    totalAmount = 0;

    orderItems.forEach((orderItem) => {
        const itemQty = orderItem.querySelector('.main-orders__content-text-input');
        const itemPrice = orderItem.querySelector('.main-orders__content-text-item:last-child').textContent;
        const price = parseFloat(itemPrice.substring(1));
        const quantity = itemQty && itemQty.value ? parseInt(itemQty.value, 10) : 0;

        const subtotal = price * quantity;
        totalAmount += subtotal;
    });

    const subTotalText = document.querySelector('#ordersPriceSpan');
    if (!isNaN(totalAmount)) {
        subTotalText.textContent = `$${totalAmount.toFixed(2)}`;
    }
}

//Payment
continueToPaymentButton.addEventListener('click', function () {
    backButtonArrow.style.display = 'block';
    continueToPaymentButton.classList.add('hidden');
    paymentMethodsContainer.classList.remove('hidden');

    confirmationTitle.textContent = 'Confirmation';
    confirmationTitle.style.fontSize = '28px';
    confirmationTitle.style.marginBottom = '0.5em';

    orderNumber.style.display = 'block';
    itemTitles.style.display = 'none';
    orderNumber.innerHTML = 'Orders #22';
    overlay.style.display = 'block';
    mainOrdersContent.style.borderTop = '1px solid #393c49';
    updateMainOrdersPaymentButton();
});

function updateMainOrdersPaymentButton() {
    switch (false) {
        case (window.innerWidth >= 290):
            mainOrdersSection.style.right = '5em';
            break;
        case (window.innerWidth >= 330):
            mainOrdersSection.style.right = '4em';
            break;
        case (window.innerWidth >= 395):
            mainOrdersSection.style.right = '1em';
            break;
        case (window.innerWidth >= 450):
            mainOrdersSection.style.right = '1em';
            break;
        case (window.innerWidth >= 640):
            mainOrdersSection.style.right = '25em';
            break;
        case (window.innerWidth >= 850):
            mainOrdersSection.style.right = '34em';
            break;
        case (window.innerWidth >= 925):
            mainOrdersSection.style.right = '30em';
            break;
        case (window.innerWidth >= 1300):
            mainOrdersSection.style.right = '25em';
            break;
        case (window.innerWidth >= 1500):
            mainOrdersSection.style.right = '27em';
            break;
        default:
            mainOrdersSection.style.right = '22em';
            break;
    }
}
window.addEventListener('resize', updateMainOrdersPaymentButton);

// Back button <--
backButtonArrow.addEventListener('click', function () {
    paymentMethodsContainer.classList.add('hidden');
    confirmationTitle.textContent = 'Orders #22';
    confirmationTitle.style.fontSize = '20px';
    confirmationTitle.style.marginBottom = '5em';
    orderNumber.style.display = 'none';
    continueToPaymentButton.classList.remove('hidden');
    backButtonArrow.style.display = 'none';
    overlay.style.display = 'none';
    itemTitles.style.display = 'flex';
    mainOrdersContent.style.borderTop = 'none';
    updateMainOrdersBackButton();
});

function updateMainOrdersBackButton() {
    switch (false) {
        case (window.innerWidth >= 340):
            mainOrdersSection.style.right = '4.5em';
            break;
        case (window.innerWidth >= 390):
            mainOrdersSection.style.right = '3em';
            break;
        case (window.innerWidth >= 450):
            mainOrdersSection.style.right = '1em';
            break;
        case (window.innerWidth >= 730):
        case (window.innerWidth >= 830):
            mainOrdersSection.style.right = '25em';
            break;
        case (window.innerWidth >= 922):
            mainOrdersSection.style.right = '28em';
            break;
        case (window.innerWidth >= 980):
            mainOrdersSection.style.right = '9em';
            break;
        case (window.innerWidth >= 1290):
            mainOrdersSection.style.right = '-1em';
            break;
        case (window.innerWidth >= 1500):
            mainOrdersSection.style.right = '-1.5em';
            break;
        default:
            mainOrdersSection.style.right = '-1.5em';
            break;
    }
}
window.addEventListener('resize', updateMainOrdersBackButton);

// Cancel
cancelButton.addEventListener('click',
    function cancelPayment() {
        continueToPaymentButton.classList.remove('hidden');
        paymentMethodsContainer.classList.add('hidden');
        orderNumber.style.display = 'none';
        confirmationTitle.textContent = 'Order #22';
        backButtonArrow.style.display = 'none';
        itemTitles.style.display = 'flex';
        overlay.style.display = 'none';
        mainOrdersContent.style.borderTop = 'none';
        updateMainOrdersCancelButton();
    });


function updateMainOrdersCancelButton() {
    switch (false) {
        case (window.innerWidth >= 340):
            mainOrdersSection.style.right = '4.5em';
            break;
        case (window.innerWidth >= 390):
            mainOrdersSection.style.right = '3em';
            break;
        case (window.innerWidth >= 450):
            mainOrdersSection.style.right = '1em';
            break;
        case (window.innerWidth >= 730):
        case (window.innerWidth >= 830):
            mainOrdersSection.style.right = '25em';
            break;
        case (window.innerWidth >= 922):
            mainOrdersSection.style.right = '28em';
            break;
        case (window.innerWidth >= 980):
            mainOrdersSection.style.right = '9em';
            break;
        case (window.innerWidth >= 1290):
            mainOrdersSection.style.right = '-1em';
            break;
        case (window.innerWidth >= 1500):
            mainOrdersSection.style.right = '-1.5em';
            break;
        default:
            mainOrdersSection.style.right = '-1.5em';
            break;
    }
}

window.addEventListener('resize', updateMainOrdersCancelButton);

// Basket button responsive version 970px
toggleOrdersButton.addEventListener('click', function () {
    mainOrdersSection.style.display = 'block';
    closeButtonResponsive.style.display = 'block';
    overlay.style.display = 'block';
    updateMainOrdersToggleButton();
});

function updateMainOrdersToggleButton() {
    switch (false) {
        case (window.innerWidth >= 340):
            mainOrdersSection.style.right = '4.5em';
            break;
        case (window.innerWidth >= 450):
            mainOrdersSection.style.right = '1em';
            break;
        case (window.innerWidth >= 730):
        case (window.innerWidth >= 830):
            mainOrdersSection.style.right = '25em';
            break;
        case (window.innerWidth >= 970):
            mainOrdersSection.style.right = '31em';
            break;
        default:
            mainOrdersSection.style.right = '0em';
            break;
    }
}
window.addEventListener('resize', updateMainOrdersToggleButton);

//Button 'close' for main-orders section 970px and less
const closeButtonResponsive = document.querySelector('.main-orders__button-close-responsive');

closeButtonResponsive.addEventListener('click', function () {
    mainOrdersSection.style.display = 'none';
    overlay.style.display = 'none';
    overlay.style.display = 'none';
});

window.addEventListener('resize', function () {
    if (window.innerWidth <= 970) {
        closeButtonResponsive.style.display = 'block';
    } else {
        closeButtonResponsive.style.display = 'none';
    }
});

//Modal
const confirmPaymentButton = document.querySelector('.main-orders__payment-buttons-item:last-child');
const modalOverlay = document.querySelector('.main-orders__payment-modal');
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

// Sidebar buttons and its sections
sidebarButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        sidebarButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    });
});

const homeSectionButton = document.getElementById('home');
const discountSectionButton = document.getElementById('discount');
const dashboardSectionButton = document.getElementById('dashboard');
const mainTitle = document.querySelector('.main-title');

const mainPage = document.querySelector('.main-content__offers');
const discountSection = document.querySelector('#discountSection');
const dashboardSection = document.querySelector('#dashboardSection');

homeSectionButton.addEventListener('click', function () {
    mainPage.style.display = 'grid';
    discountSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    mainTitle.textContent = "Choose Dishes";
    colorMenu.style.display = 'none';
});
document.addEventListener('DOMContentLoaded', () => {
    homeSectionButton.classList.add('active');
});

discountSectionButton.addEventListener('click', function () {
    mainPage.style.display = 'none';
    discountSection.style.display = 'block';
    colorMenu.style.display = 'none';
    mainTitle.textContent = 'There are no available discounts for you';
});
dashboardSectionButton.addEventListener('click', function () {
    mainPage.style.display = 'none';
    discountSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    colorMenu.style.display = 'none';
    mainTitle.textContent = 'Our restaurant is happy to see you again! ☺';
});


// Additional color wrapper change
const settingsButton = document.getElementById('settings');
const colorMenu = document.getElementById('colorMenu');
const colorOptions = colorMenu.querySelectorAll('input[name="color"]');
const wrapper = document.querySelector('.wrapper');

settingsButton.addEventListener('click', function () {
    colorMenu.style.display = 'flex';
    mainPage.style.display = 'none';
    discountSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    mainTitle.textContent = 'Select Background Color';
});

colorOptions.forEach(function (option) {
    option.addEventListener('change', function () {
        const selectedColor = this.value;
        wrapper.style.backgroundColor = selectedColor;
    });
});


//  Swiper for tabs (responsive version)
var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 10,
});

switch (true) {
    case (window.innerWidth <= 970):
        swiper.init();
        break;
    default:
        swiper.destroy();
        break;
}
