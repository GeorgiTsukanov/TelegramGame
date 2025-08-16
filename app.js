// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Элементы DOM
const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('click-button');
const usernameElement = document.getElementById('username');

// Инициализация счетчика
let counter = 0;

// Функция для работы с cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Загрузка сохраненного счетчика
function loadCounter() {
    const savedCounter = getCookie('clicker_counter');
    if (savedCounter) {
        counter = parseInt(savedCounter);
        updateCounter();
    }
}

// Обновление счетчика на странице
function updateCounter() {
    counterElement.textContent = counter;
    setCookie('clicker_counter', counter, 30); // Сохраняем на 30 дней
}

// Обработчик клика
function handleClick() {
    counter++;
    updateCounter();
}

// Инициализация пользователя Telegram
function initTelegramUser() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        let userName = user.first_name || '';
        if (user.last_name) {
            userName += ' ' + user.last_name;
        }
        if (user.username) {
            userName += ` (@${user.username})`;
        }
        usernameElement.textContent = userName || 'Анонимный пользователь';
        
        // Можно расширять функционал с данными пользователя
        // Например, сохранять счет для конкретного пользователя
    } else {
        usernameElement.textContent = 'Гость (не из Telegram)';
    }
}

// Инициализация приложения
function initApp() {
    // Инициализация пользователя Telegram
    initTelegramUser();
    
    // Загрузка сохраненного счетчика
    loadCounter();
    
    // Назначение обработчика клика
    clickButton.addEventListener('click', handleClick);
    
    // Показываем кнопку, если в Telegram WebApp
    if (tg.platform !== 'unknown') {
        tg.expand(); // Разворачиваем WebApp на весь экран
        tg.enableClosingConfirmation(); // Запрос подтверждения при закрытии
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);
