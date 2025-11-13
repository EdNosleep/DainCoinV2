// ===============================
// Dain_Coin — UNIVERSAL INSPECTOR MODULE (v2 with autosave + reset)
// ===============================

import { coinInspector } from './coin.js';

export function startInspector() {
  const STORAGE_KEY = 'DainCoin_InspectorParams';
  const inspectorModules = [
    { name: 'Монетка', source: coinInspector, target: window.__coinModule }
  ];

  // === ВОССТАНОВЛЕНИЕ ПАРАМЕТРОВ ===
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  inspectorModules.forEach(mod => {
    const source = mod.source;
    for (const label in source) {
      const p = source[label];
      const savedVal = saved[p.param];
      if (savedVal !== undefined) {
        p.value = savedVal;
        if (mod.target?.applyParam)
          mod.target.applyParam(p.param, p.param === 'headsChance' ? savedVal / 100 : savedVal);
      }
    }
  });

  // === ЗАТЕМНЕНИЕ ФОНА ===
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.0)',
    backdropFilter: 'blur(0px)',
    opacity: '0',
    transition: 'opacity 0.35s ease, backdrop-filter 0.35s ease',
    zIndex: 9997,
    pointerEvents: 'none',
  });
  document.body.appendChild(overlay);

  // === ПАНЕЛЬ ===
  const panel = document.createElement('div');
  panel.id = 'inspector-panel';
  Object.assign(panel.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '-60%',
    height: '60%',
    background: 'rgba(20,20,20,0.92)',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -6px 16px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    padding: '16px',
    overflowY: 'auto',
    transition: 'bottom 0.35s ease',
    zIndex: 9998,
  });
  document.body.appendChild(panel);

  // === КНОПКА ⚙️ ===
  const button = document.createElement('button');
  button.innerText = '⚙️';
  Object.assign(button.style, {
    position: 'fixed',
    right: '3vw',
    bottom: '3vh',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: 'none',
    fontSize: '24px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    zIndex: 10000,
    transition: 'transform 0.3s ease',
  });
  document.body.appendChild(button);

  // === КНОПКА СБРОСА ===
  const resetBtn = document.createElement('button');
  resetBtn.innerText = 'Сбросить настройки';
  Object.assign(resetBtn.style, {
    width: '100%',
    marginTop: '16px',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  });
  resetBtn.onmouseenter = () => (resetBtn.style.background = 'rgba(255,255,255,0.2)');
  resetBtn.onmouseleave = () => (resetBtn.style.background = 'rgba(255,255,255,0.1)');
  resetBtn.onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };

  let open = false;
  button.addEventListener('click', togglePanel);
  overlay.addEventListener('click', togglePanel);

  function togglePanel() {
    open = !open;

    panel.style.bottom = open ? '0' : '-60%';
    button.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';

    if (open) {
      overlay.style.pointerEvents = 'auto';
      overlay.style.opacity = '1';
      overlay.style.background = 'rgba(0,0,0,0.4)';
      overlay.style.backdropFilter = 'blur(4px)';
    } else {
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
      overlay.style.background = 'rgba(0,0,0,0.0)';
      overlay.style.backdropFilter = 'blur(0px)';
    }
  }

  // === КОНТЕНТ ===
  inspectorModules.forEach(mod => {
    const header = document.createElement('div');
    header.textContent = mod.name;
    Object.assign(header.style, {
      fontWeight: 'bold',
      fontSize: '16px',
      margin: '8px 0 4px 0',
      opacity: '0.85',
    });
    panel.appendChild(header);

    const source = mod.source;
    for (const label in source) {
      const p = source[label];
      const wrap = document.createElement('div');
      wrap.style.marginBottom = '12px';

      const title = document.createElement('div');
      title.textContent = label;
      Object.assign(title.style, {
        fontSize: '13px',
        marginBottom: '2px',
        opacity: '0.8',
      });

      const input = document.createElement('input');
      Object.assign(input, {
        type: 'range',
        min: p.min,
        max: p.max,
        step: p.step,
        value: p.value
      });
      Object.assign(input.style, {
        width: '100%',
        accentColor: '#00ffff'
      });

      const valueLabel = document.createElement('div');
      valueLabel.textContent = p.value;
      Object.assign(valueLabel.style, {
        fontSize: '12px',
        textAlign: 'right',
        opacity: '0.7'
      });

      input.oninput = e => {
        const val = parseFloat(e.target.value);
        valueLabel.textContent = val;
        p.value = val;

        // === Сохранение в localStorage ===
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        stored[p.param] = val;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

        // === Применение параметра ===
        if (mod.target?.applyParam) {
          mod.target.applyParam(p.param, p.param === 'headsChance' ? val / 100 : val);
        }
      };

      wrap.append(title, input, valueLabel);
      panel.appendChild(wrap);
    }
  });

  panel.appendChild(resetBtn);
  console.log('Inspector initialized (autosave + reset)');
}