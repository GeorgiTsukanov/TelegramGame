// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Игровые переменные
let clicks = 0;
let clicksPerSecond = 0;
let upgrades = [];

// Элементы DOM
const clicksElement = document.getElementById('clicks');
const cpsElement = document.getElementById('cps');
const clickButton = document.getElementById('click-button');
const upgradeButtons = document.querySelectorAll('.upgrade');

// Инициализация игры
function initGame() {
    // Проверяем, есть ли сохраненные данные в cookies
    const savedData = getCookie('clickerData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        clicks = data.clicks || 0;
        clicksPerSecond = data.clicksPerSecond || 0;
        upgrades = data.upgrades || [];
        
        // Восстанавливаем состояния улучшений
        upgradeButtons.forEach(button => {
            const upgradeId = button.id;
            if (upgrades.includes(upgradeId)) {
                button.disabled = true;
            }
        });
    }
    
    // Если открыто в Telegram, используем тему Telegram
    if (tg.initDataUnsafe) {
        tg.expand(); // Разворачиваем на весь экран
        tg.enableClosingConfirmation(); // Запрос подтверждения при закрытии
    }
    
    updateUI();
    startAutoClicker();
}

// Функция клика
function handleClick() {
    clicks++;
    updateUI();
    saveGame();
}

// Автокликер
function startAutoClicker() {
    setInterval(() => {
        if (clicksPerSecond > 0) {
            clicks += clicksPerSecond;
            updateUI();
            saveGame();
        }
    }, 1000);
}

// Покупка улучшения
function buyUpgrade(button) {
    const cost = parseInt(button.dataset.cost);
    const cps = parseInt(button.dataset.cps);
    
    if (clicks >= cost) {
        clicks -= cost;
        clicksPerSecond += cps;
        button.disabled = true;
        upgrades.push(button.id);
        updateUI();
        saveGame();
    } else {
        alert('Недостаточно кликов!');
    }
}

// Обновление интерфейса
function updateUI() {
    clicksElement.textContent = clicks;
    cpsElement.textContent = clicksPerSecond;
    
    // Обновляем доступность кнопок улучшений
    upgradeButtons.forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = upgrades.includes(button.id) || clicks < cost;
    });
}

// Сохранение игры в cookies
function saveGame() {
    const gameData = {
        clicks,
        clicksPerSecond,
        upgrades
    };
    
    setCookie('clickerData', JSON.stringify(gameData), 365);
}

// Работа с cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Обработчики событий
clickButton.addEventListener('click', handleClick);
upgradeButtons.forEach(button => {
    button.addEventListener('click', () => buyUpgrade(button));
});

// Запуск игры при загрузке страницы
window.addEventListener('DOMContentLoaded', initGame);
}
