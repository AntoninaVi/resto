//search
const searchInput = document.querySelector('.header-search__input');
const mainContent = document.querySelector('.main-content__offers');
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