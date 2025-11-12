// ===============================
// coin.js — модуль монетки
// ===============================

// 🔧 Параметры монеты
export const coinParams = {
  size: 150, // размер монеты в пикселях
  image: './assets/coin_avers.png'
};

// 🪙 Функция для создания монеты
export function createCoin(rootElement) {
  const coin = document.createElement('img');
  coin.src = coinParams.image;
  coin.alt = 'coin';
  coin.id = 'coin';

  // Стили монеты
  coin.style.position = 'absolute';
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.transform = 'translate(-50%, -50%)';
  coin.style.width = `${coinParams.size}px`;
  coin.style.height = `${coinParams.size}px`;
  coin.style.userSelect = 'none';
  coin.style.pointerEvents = 'auto';
  coin.style.cursor = 'pointer';

  rootElement.appendChild(coin);
  return coin;
}