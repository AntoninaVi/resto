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
const mainOrdersSection = document.querySelector('.main-orders');
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
        filterDishesByType('hot dishes');
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
document.addEventListener('DOMContentLoaded', function () {
    const firstTab = document.querySelector('.main-tabs__tab:first-child');
    firstTab.classList.add('active');
    const selectedType = firstTab.textContent.toLowerCase();
    filterDishesByType(selectedType);
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

//Payment section
function continueToPayment() {
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
    updateElementPosition(mainOrdersSection, '22em');
}
continueToPaymentButton.addEventListener('click', continueToPayment);

// Back button <-- and Cancel button functions
function cancelPayment() {
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
};

function updateElementPosition(element, defaultValue) {
    switch (false) {
        case (window.innerWidth >= 290):
            element.style.right = '5em';
            break;
        case (window.innerWidth >= 335):
            element.style.right = '4em';
            break;
        case (window.innerWidth >= 450):
            element.style.right = '1em';
            break;
        case (window.innerWidth >= 675):
            element.style.right = '25em';
            break;
        case (window.innerWidth >= 975):
            element.style.right = '32em';
            break;
        default:
            element.style.right = defaultValue;
            break;
    }
}

function addResizeListener(element, updateFunction, defaultValue) {
    window.addEventListener('resize', function () {
        updateFunction(element, defaultValue);
    });
}
addResizeListener(mainOrdersSection, updateElementPosition, '-1.5em');

backButtonArrow.addEventListener('click', function () {
    updateElementPosition(mainOrdersSection);
    cancelPayment()
    updateElementPosition(mainOrdersSection, '-1.5em');
});

cancelButton.addEventListener('click', function () {
    updateElementPosition(mainOrdersSection);
    cancelPayment()
    updateElementPosition(mainOrdersSection, '-1.5em');
});

toggleOrdersButton.addEventListener('click', function () {
    updateElementPosition(mainOrdersSection);
    mainOrdersSection.style.display = 'block';
    closeButtonResponsive.style.display = 'block';
    overlay.style.display = 'block';
});

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