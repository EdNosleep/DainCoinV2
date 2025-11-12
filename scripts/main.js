// ===============================
// Nosleep Game — MAIN ENTRY POINT
// ===============================

// === ИМПОРТЫ ===
// import { startCoin } from './scripts/coin.js';
// import { initEffects } from './scripts/coineffect.js';
// import { params } from './scripts/params.js'; // (если будет использоваться)

// === НАСТРОЙКА ОСНОВНОЙ СЦЕНЫ ===
const root = document.getElementById('game-root');

// Создаём контейнер для всей игры
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
gameContainer.style.position = 'relative';
gameContainer.style.width = '100%';
gameContainer.style.height = '100%';
gameContainer.style.display = 'flex';
gameContainer.style.flexDirection = 'column';
gameContainer.style.justifyContent = 'flex-end';
gameContainer.style.alignItems = 'center';
root.appendChild(gameContainer);

// === ВРЕМЕННЫЙ ТЕКСТ ДЛЯ ПРОВЕРКИ ===
const loadingText = document.createElement('div');
loadingText.innerText = 'Nosleep Game Framework Ready';
loadingText.style.color = 'white';
loadingText.style.opacity = '0.7';
loadingText.style.fontSize = '0.8rem';
loadingText.style.marginBottom = '8vh';
gameContainer.appendChild(loadingText);

// === ПОДКЛЮЧЕНИЕ МОДУЛЕЙ ===
// startCoin();

// === АДАПТАЦИЯ ПОД ТЕЛЕФОНЫ ===
function resizeGame() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // 🔒 Игнорируем горизонтальный режим — всегда считаем экран портретным
  const portraitWidth = Math.min(w, h * 9 / 16); // Соотношение 9:16 — базовое
  const scale = Math.min(portraitWidth / 390, h / 844); // ориентир iPhone 12
  
  gameContainer.style.transform = `scale(${scale})`;
  gameContainer.style.transformOrigin = 'center bottom';
}
window.addEventListener('resize', resizeGame);
resizeGame();

// === ЗАПРЕТ ПОВОРОТА ЭКРАНА ===
if (screen.orientation && screen.orientation.lock) {
  screen.orientation.lock('portrait').catch(() => {});
}

// На случай, если устройство всё же повернулось
window.addEventListener('orientationchange', () => {
  if (window.orientation !== 0) {
    // Возвращаем в портрет и не даём интерфейсу сдвинуться
    document.body.style.transform = 'rotate(0deg)';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    resizeGame();
  }
});

// === TELEGRAM SAFE MODE ===
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.expand();
  Telegram.WebApp.ready();
  Telegram.WebApp.disableVerticalSwipes();
  console.log('%c[Telegram] WebApp expanded and ready', 'color:#0f0');
}