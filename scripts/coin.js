// ===============================
// Nosleep Coin Module
// ===============================

export function startCoin(container) {

  // === Создаём HTML монетки ===
  const coinWrap = document.createElement('div');
  coinWrap.id = 'coin-wrap';
  coinWrap.style.position = 'relative';
  coinWrap.style.width = '170px';
  coinWrap.style.height = '170px';
  coinWrap.style.cursor = 'pointer';
  coinWrap.style.userSelect = 'none';
  coinWrap.style.WebkitUserSelect = 'none';
  coinWrap.style.willChange = 'transform';
  coinWrap.style.transform = 'translateZ(0)';
  container.appendChild(coinWrap);

  const obvEl = document.createElement('img');
  obvEl.id = 'coinObverse';
  obvEl.src = './assets/coin_obverse.png';
  obvEl.style.position = 'absolute';
  obvEl.style.inset = '0';
  obvEl.style.width = '100%';
  obvEl.style.height = '100%';
  obvEl.style.objectFit = 'contain';
  obvEl.style.opacity = '1';
  obvEl.style.willChange = 'transform,opacity';
  obvEl.style.backfaceVisibility = 'hidden';
  coinWrap.appendChild(obvEl);

  const revEl = document.createElement('img');
  revEl.id = 'coinReverse';
  revEl.src = './assets/coin_reverse.png';
  Object.assign(revEl.style, obvEl.style);
  revEl.style.opacity = '0';
  coinWrap.appendChild(revEl);

  const edgeEl = document.createElement('img');
  edgeEl.id = 'coinEdge';
  edgeEl.src = './assets/coin_edge.png';
  Object.assign(edgeEl.style, obvEl.style);
  edgeEl.style.opacity = '0';
  edgeEl.style.transition = 'opacity 0.08s linear';
  edgeEl.style.transformOrigin = 'center';
  coinWrap.appendChild(edgeEl);

  // === Настройки ===
  const params = {
    coinSize: 170,
    edgeWidth: 0.1,
    baseSpeed: 75,
    jumpHeight: 60,
    landingDepth: 50,
    jumpDuration: 0.2,
    accelDuration: 0.2,
    spinDuration: 1.2,
    boostSpeed: 1600,
    slowDuration: 2.4,
    pauseDuration: 0.5,
    headsChance: 0.5
  };

  const radSpeed = Math.PI / 180;
  const twoPI = Math.PI * 2;
  const fpsLimit = 60;
  const frameDuration = 1000 / fpsLimit;

  let angle = 0,
      lastTime = performance.now(),
      lastFrame = 0,
      spinSpeed = params.baseSpeed;
  let activeAnim = null,
      currentSideHeads = true;

  function applyCoinSize(size) {
    coinWrap.style.width = size + 'px';
    coinWrap.style.height = size + 'px';
  }
  applyCoinSize(params.coinSize);

  // === Основной цикл ===
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

  // === Клик ===
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
      coinWrap.style.transform = `translateY(${e * params.landingDepth}px)`;
    }, token);
    coinWrap.style.transform = 'translateY(0)';

    await wait(params.spinDuration, token);
    await animateOver(params.slowDuration, t => {
      const eased = 1 - easeOutCubic(t);
      spinSpeed = params.boostSpeed * eased;
    }, token);
    spinSpeed = 0;

    const heads = Math.random() < params.headsChance;
    currentSideHeads = heads;
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

  // === Утилиты ===
  function animateOver(duration, cb, token) {
    return new Promise(resolve => {
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
  }

  function wait(sec, token) {
    return new Promise(resolve => {
      const end = performance.now() + sec * 1000;
      function check(now) {
        if (token.cancelled) return resolve();
        if (now < end) requestAnimationFrame(check);
        else resolve();
      }
      requestAnimationFrame(check);
    });
  }

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeOutQuad(x) { return 1 - (1 - x) * (1 - x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpAngleRad(a, b, t) {
    let d = (b - a + twoPI) % twoPI;
    if (d > Math.PI) d -= twoPI;
    return a + d * t;
  }
}