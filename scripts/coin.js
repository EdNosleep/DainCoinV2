// ===============================
// coin.js — модуль монетки
// ===============================

export const coinParams = {
  size: 120,
  imageSrc: './assets/coin_avers.png',
};

let coinElement = null;

// Функция создания монетки
export function startCoin() {
  if (coinElement) coinElement.remove();

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
  coinElement = coin;
  return coin;
}

// Функция обновления монетки (для инспектора)
export function updateCoin() {
  if (coinElement) {
    coinElement.style.width = `${coinParams.size}px`;
    coinElement.style.height = `${coinParams.size}px`;
  }
}

// ===============================
// 🔑 Конфигурация для Inspector.js
// ===============================
export const inspectorConfig = {
  moduleName: 'Монетка',
  params: [
    {
      key: 'size',
      label: 'Размер монетки',
      type: 'range',
      min: 50,
      max: 300,
      step: 1,
      get: () => coinParams.size,
      set: (val) => {
        coinParams.size = val;
        updateCoin();
      },
    },
  ],
};
