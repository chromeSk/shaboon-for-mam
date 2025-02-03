let currentMemeId = null;

// Функция для генерации случайного мема
async function generateMeme() {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        const memes = data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];

        document.getElementById('memeImage').src = randomMeme.url;
        document.getElementById('memeTitle').innerText = randomMeme.name;
        currentMemeId = randomMeme.id;

        loadReviews(); // Загружаем отзывы для нового мема
    } catch (error) {
        console.error('Ошибка при получении мема:', error);
    }
}

// Функция для установки куки
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Функция для получения куки
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Функция для загрузки отзывов из куки
function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = ''; // Очищаем список отзывов

    if (currentMemeId) {
        const reviews = getCookie(`reviews_${currentMemeId}`);
        if (reviews) {
            const reviewsArray = JSON.parse(reviews);
            reviewsArray.forEach(review => {
                const newReview = document.createElement('li');
                newReview.textContent = review;
                reviewsList.appendChild(newReview);
            });
        }
    }
}

// Функция для добавления отзыва
function addReview() {
    const reviewInput = document.getElementById('reviewInput');
    const reviewText = reviewInput.value.trim();
    if (reviewText && currentMemeId) {
        const reviewsList = document.getElementById('reviewsList');
        const newReview = document.createElement('li');
        newReview.textContent = reviewText;
        reviewsList.appendChild(newReview);

        // Сохраняем отзыв в куки
        let reviews = getCookie(`reviews_${currentMemeId}`);
        reviews = reviews ? JSON.parse(reviews) : [];
        reviews.push(reviewText);
        setCookie(`reviews_${currentMemeId}`, JSON.stringify(reviews), 365);

        reviewInput.value = '';
    }
}

// Инициализируем генерацию мема при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    generateMeme();
});

// Находим кнопку по ID
const button = document.getElementById('generateMemeButton');

// Функция для обработки нажатий на кнопку
button.addEventListener('click', generateMeme);

// Находим кнопку отправки отзыва по ID
const submitReviewButton = document.getElementById('submitReviewButton');

// Функция для обработки нажатий на кнопку отправки отзыва
submitReviewButton.addEventListener('click', addReview);
