// ===============================
// Nosleep Game — MAIN ENTRY POINT
// ===============================

// Импорт базовых модулей
import { initInspector } from './inspector.js';
import { startCoin, inspectorConfig } from './coin.js';
// (позже добавим)
// import { startCoin } from './coin.js';
// import { initEffects } from './coineffect.js';

// ========== НАСТРОЙКА СЦЕНЫ ==========
const root = document.getElementById('game-root');

// Основной контейнер игры
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

// ========== ДОБАВЛЯЕМ ТЕСТОВЫЙ ЭЛЕМЕНТ ==========
const loadingText = document.createElement('div');
loadingText.innerText = 'Nosleep Game Framework Ready';
loadingText.style.color = 'white';
loadingText.style.opacity = '0.7';
loadingText.style.fontSize = '0.8rem';
loadingText.style.marginBottom = '8vh';
gameContainer.appendChild(loadingText);

// ========== ПОДКЛЮЧЕНИЕ МОДУЛЕЙ ==========
startCoin();
initInspector([ { inspectorConfig } ]);
// initEffects(gameContainer);

// ========== АДАПТАЦИЯ ПОД ТЕЛЕФОНЫ ==========
function resizeGame() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Сохраняем реальный размер в params (может пригодиться)
  params.screenWidth = w;
  params.screenHeight = h;

  // Автоматически масштабируем интерфейс, если нужно
  const scale = Math.min(w / 390, h / 844); // ориентир iPhone 12
  gameContainer.style.transform = `scale(${scale})`;
  gameContainer.style.transformOrigin = 'center bottom';
}
window.addEventListener('resize', resizeGame);
resizeGame();

// ========== TELEGRAM SAFE MODE ==========
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.expand();
  Telegram.WebApp.ready();
  Telegram.WebApp.disableVerticalSwipes();
  console.log('%c[Telegram] WebApp expanded and ready', 'color:#0f0');
}
