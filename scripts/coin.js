// ===============================
// coin.js — модуль монетки
// ===============================

export const coinParams = {
  size: 120,
  imageSrc: './assets/coin_avers.png',
};

// 👇 Этот объект будет прочитан Inspector.js
export const inspectorSchema = {
  moduleName: 'Монетка',
  params: [
    {
      key: 'size',
      label: 'Размер монетки',
      type: 'slider',
      min: 50,
      max: 300,
      step: 1,
    },
  ],
};

// ====== ФУНКЦИИ ======
export function startCoin() {
  const coin = document.createElement('img');
  coin.src = coinParams.imageSrc;
  coin.id = 'coin';
  coin.style.position = 'absolute';
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.transform = 'translate(-50%, -50%)';
  coin.style.userSelect = 'none';
  coin.style.pointerEvents = 'auto';
  coin.style.cursor = 'pointer';

  // применяем размер
  updateCoinSize();

  document.body.appendChild(coin);
  return coin;
}

export function updateCoinSize() {
  const coin = document.getElementById('coin');
  if (coin) {
    coin.style.width = `${coinParams.size}px`;
    coin.style.height = `${coinParams.size}px`;
  }
}
