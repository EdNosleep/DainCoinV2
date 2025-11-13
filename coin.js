// ===============================
// Dain_Coin — COIN MODULE (v2 with Inspector support)
// ===============================

export const coinInspector = {
  'Размер монеты (px)':   { min: 80,  max: 300,  step: 1,    value: 170,   param: 'coinSize' },
  'Скорость вращения':    { min: 30,  max: 200,  step: 1,    value: 75,    param: 'baseSpeed' },
  'Высота прыжка':        { min: 20,  max: 200,  step: 1,    value: 60,    param: 'jumpHeight' },
  'Длительность броска':  { min: 0,   max: 3,    step: 0.1,  value: 0.2,   param: 'spinDuration' },
  'Скорость в полёте':    { min: 200, max: 2000, step: 10,   value: 1600,  param: 'boostSpeed' },
  'Шанс аверса (%)':      { min: 0,   max: 100,  step: 1,    value: 50,    param: 'headsChance' }
};

export function startCoin(parentContainer) {
  // === ПАРАМЕТРЫ ===
  const params = {
    coinSize: coinInspector['Размер монеты (px)'].value,
    edgeWidth: 0.1,
    baseSpeed: coinInspector['Скорость вращения'].value,
    jumpHeight: coinInspector['Высота прыжка'].value,
    landingDepth: 50,
    jumpDuration: 0.2,
    accelDuration: 0.2,
    spinDuration: coinInspector['Длительность броска'].value,
    boostSpeed: coinInspector['Скорость в полёте'].value,
    slowDuration: 2.4,
    pauseDuration: 0.5,
    headsChance: coinInspector['Шанс аверса (%)'].value / 100
  };

  // === СОЗДАЁМ СВОЙ СЛОЙ ===
  const coinLayer = document.createElement('div');
  coinLayer.id = 'coin-layer';
  Object.assign(coinLayer.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  });
  parentContainer.appendChild(coinLayer);

  // === ОБЁРТКА МОНЕТЫ ===
  const coinWrap = document.createElement('div');
  coinWrap.id = 'coin-wrap';
  Object.assign(coinWrap.style, {
    position: 'relative',
    width: params.coinSize + 'px',
    height: params.coinSize + 'px',
    cursor: 'pointer',
    willChange: 'transform',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    outline: 'none',
    pointerEvents: 'auto',
  });
  coinLayer.appendChild(coinWrap);

  // === СЛОИ МОНЕТЫ ===
  const obvEl = createLayer('./assets/coin_avers.png', 1);
  const revEl = createLayer('./assets/coin_revers.png', 0);
  const edgeEl = createLayer('./assets/coin_edge.png', 0);
  edgeEl.style.transition = 'opacity 0.08s linear';
  coinWrap.append(obvEl, revEl, edgeEl);

  function createLayer(src, opacity) {
    const img = document.createElement('img');
    img.src = src;
    Object.assign(img.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      opacity: opacity,
      transformOrigin: 'center',
    });
    return img;
  }

  // === КОНСТАНТЫ ===
  const radSpeed = Math.PI / 180;
  const twoPI = Math.PI * 2;
  const fpsLimit = 60;
  const frameDuration = 1000 / fpsLimit;
  let angle = 0, lastTime = performance.now(), lastFrame = 0, spinSpeed = params.baseSpeed;
  let activeAnim = null;

  // === ОСНОВНОЙ ЦИКЛ ===
  function loop(now) {
    requestAnimationFrame(loop);
    if (now - lastFrame < frameDuration) return;
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    lastFrame = now;

    angle = (angle + spinSpeed * radSpeed * dt) % twoPI;
    const c = Math.cos(angle);
    const absC = Math.abs(c);
    const scaleX = Math.max(absC, 0.04);

    if (absC < params.edgeWidth) {
      edgeEl.style.opacity = 1 - absC / params.edgeWidth;
      obvEl.style.opacity = 0;
      revEl.style.opacity = 0;
    } else {
      edgeEl.style.opacity = 0;
      if (c >= 0) { obvEl.style.opacity = 1; revEl.style.opacity = 0; }
      else { obvEl.style.opacity = 0; revEl.style.opacity = 1; }
    }

    obvEl.style.transform = `scaleX(${scaleX})`;
    revEl.style.transform = `scaleX(${scaleX})`;
    edgeEl.style.transform = `scaleX(0.6)`;
  }
  requestAnimationFrame(loop);

  // === КЛИК ===
  coinWrap.addEventListener('click', () => {
    if (activeAnim) activeAnim.cancelled = true;
    startSpinSequence();
  });

  async function startSpinSequence() {
    const token = { cancelled: false };
    activeAnim = token;
    coinWrap.style.transform = 'translateY(0)';
    spinSpeed = params.baseSpeed;

    const accel = animateOver(params.accelDuration, t => {
      spinSpeed = lerp(params.baseSpeed, params.boostSpeed, easeOutQuad(t));
    }, token);

    const jumpUp = animateOver(params.jumpDuration / 2, t => {
      const y = -params.jumpHeight * Math.sin(t * Math.PI / 2);
      coinWrap.style.transform = `translateY(${y}px)`;
    }, token);

    await Promise.all([accel, jumpUp]);
    await animateOver(params.jumpDuration / 2, t => {
      const y = -params.jumpHeight * Math.cos(t * Math.PI / 2);
      coinWrap.style.transform = `translateY(${y}px)`;
    }, token);

    await animateOver(0.2, t => {
      const e = Math.sin(t * Math.PI);
      coinWrap.style.transform = `translateY(${e * 50}px)`;
    }, token);
    coinWrap.style.transform = 'translateY(0)';

    await wait(params.spinDuration, token);
    await animateOver(params.slowDuration, t => {
      const eased = 1 - easeOutCubic(t);
      spinSpeed = params.boostSpeed * eased;
    }, token);
    spinSpeed = 0;

    const heads = Math.random() < params.headsChance;
    const target = heads ? 0 : Math.PI;
    const startAngle = angle % twoPI;

    await animateOver(0.4, t => {
      angle = lerpAngleRad(startAngle, target, easeOutQuad(t));
    }, token);

    angle = target;
    obvEl.style.opacity = heads ? 1 : 0;
    revEl.style.opacity = heads ? 0 : 1;

    await wait(params.pauseDuration, token);
    await animateOver(0.5, t => {
      spinSpeed = params.baseSpeed * t;
    }, token);
    spinSpeed = params.baseSpeed;
  }

  // === УТИЛИТЫ ===
  const animateOver = (duration, cb, token) => new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
      if (token.cancelled) return resolve();
      let t = (now - start) / (duration * 1000);
      if (t > 1) t = 1;
      cb(t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });

  const wait = (sec, token) => new Promise(resolve => {
    const end = performance.now() + sec * 1000;
    function check(now) {
      if (token.cancelled) return resolve();
      if (now < end) requestAnimationFrame(check);
      else resolve();
    }
    requestAnimationFrame(check);
  });

  const easeOutCubic = x => 1 - Math.pow(1 - x, 3);
  const easeOutQuad = x => 1 - (1 - x) * (1 - x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAngleRad = (a, b, t) => {
    let d = (b - a + twoPI) % twoPI;
    if (d > Math.PI) d -= twoPI;
    return a + d * t;
  };

  // === API для Inspector ===
  window.__coinModule = {
    params,
    applyParam: (key, value) => {
      params[key] = value;
      if (key === 'coinSize') {
        coinWrap.style.width = value + 'px';
        coinWrap.style.height = value + 'px';
      }
    }
  };

  console.log('Coin module initialized (centered + inspector-ready)');
}