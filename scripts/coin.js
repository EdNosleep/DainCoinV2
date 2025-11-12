// ===============================
// coin.js — модуль монетки
// ===============================

// Параметры монетки
export const coinParams = {
  size: 120, // размер монетки в пикселях (можно менять)
  imageSrc: './assets/coin_avers.png', // путь к изображению монеты
};

// ✅ Универсальный ключ для Inspector.js
// Этот объект сообщает инспектору, какие параметры нужно отображать
export const coinInspector = {
  moduleName: 'Монетка',
  params: {
    size: {
      label: 'Размер монетки',
      min: 50,
      max: 300,
      step: 1,
      type: 'range',
      get: () => coinParams.size,
      set: (v) => {
        coinParams.size = v;
        const coin = document.getElementById('coin');
        if (coin) {
          coin.style.width = `${v}px`;
          coin.style.height = `${v}px`;
        }
      },
    },
  },
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
