// ===============================
// coin.js — модуль монетки
// ===============================

// Параметры монетки
export const coinParams = {
  size: 120, // размер монетки в пикселях (можно менять)
  imageSrc: './assets/coin_avers.png', // путь к изображению монеты
};

// Функция создания и отображения монетки
export function startCoin() {
  const coin = document.createElement('img');
  coin.src = coinParams.imageSrc;
  coin.id = 'coin';
  coin.style.position = 'absolute';
  coin.style.width = `${coinParams.size}px`;
  coin.style.height = `${coinParams.size}px`;
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.transform = 'translate(-50%, -50%)';
  coin.style.userSelect = 'none';
  coin.style.pointerEvents = 'auto';
  coin.style.cursor = 'pointer';

  document.body.appendChild(coin);
  return coin;
}