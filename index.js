// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, orderBy, query, setDoc, collection, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries


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
//     image: 'img/dishes/grill12.png',
//     title: 'Combo grill',
//     price: '$ 5.29',
//     availability: '16 Bowls available',
//     type: 'dessert'
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



getDocs(dishesRef)
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            const dishData = doc.data();

            const mainArticle = document.createElement('article');
            mainArticle.className = 'main-content__offers-dish';
            mainArticle.dataset.type = dishData.type; // type filter


            const imageMainArticle = document.createElement('img')
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

            mainContent.appendChild(mainArticle)
        })
    })


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
        const selectedType = tab.textContent.toLowerCase();
        filterDishesByType(selectedType);
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
searchInput.addEventListener('input', handleSearch);
function handleSearch() {
    const searchText = searchInput.value.toLowerCase();

    const dishes = document.querySelectorAll('.main-content__offers-dish');
    dishes.forEach((dish) => {
        const dishTitle = dish.querySelector('.main-content__offers-dish-title').textContent.toLowerCase();
        if (dishTitle.includes(searchText)) {
            dish.style.display = '';
        } else {
            dish.style.display = 'none';
        }
    });
}



//Orders


