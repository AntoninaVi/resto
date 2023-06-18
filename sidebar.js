// Sidebar buttons and its sections
const sidebarButtons = document.querySelectorAll('.main-sidebar__btn');

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
