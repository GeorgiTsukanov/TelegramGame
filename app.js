// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Проверяем, открыто ли приложение в Telegram
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    // Получаем данные пользователя
    const user = tg.initDataUnsafe.user;
    
    // Форматируем данные для отображения
    const userDataHTML = `
        <img src="${user.photo_url || 'https://via.placeholder.com/100'}" alt="Avatar" class="avatar">
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Имя:</strong> ${user.first_name}</p>
        ${user.last_name ? `<p><strong>Фамилия:</strong> ${user.last_name}</p>` : ''}
        ${user.username ? `<p><strong>Username:</strong> @${user.username}</p>` : ''}
        ${user.language_code ? `<p><strong>Язык:</strong> ${user.language_code}</p>` : ''}
        <p><strong>Платформа:</strong> ${tg.platform}</p>
        <p><strong>Цветовая схема:</strong> ${tg.colorScheme}</p>
    `;
    
    // Вставляем данные в DOM
    document.getElementById('user-data').innerHTML = userDataHTML;
    
    // Развертываем приложение на весь экран (опционально)
    tg.expand();
} else {
    // Если приложение открыто не в Telegram
    document.getElementById('user-data').innerHTML = `
        <p>Это приложение предназначено для работы внутри Telegram.</p>
        <p>Пожалуйста, откройте его через Telegram бота или мини-приложение.</p>
    `;
}

// Пример обработчика кнопки
function sendDataToBot() {
    const data = {
        user_id: tg.initDataUnsafe.user.id,
        action: 'button_click'
    };
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify(data));
    
    // Закрываем приложение (опционально)
    tg.close();
}
