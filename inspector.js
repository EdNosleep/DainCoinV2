// ===============================
// Dain_Coin — UNIVERSAL INSPECTOR MODULE
// ===============================

import { coinInspector } from './coin.js'; // пример, потом можно добавлять новые

export function startInspector(parentContainer) {
  const inspectorModules = [
    { name: 'Монетка', source: coinInspector, target: window.__coinModule }
  ];

  // === СОЗДАЁМ КНОПКУ ⚙️ ===
  const button = document.createElement('button');
  button.innerText = '⚙️';
  Object.assign(button.style, {
    position: 'absolute',
    right: '3vw',
    bottom: '3vh',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    fontSize: '24px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    zIndex: 50,
    transition: 'opacity 0.2s ease',
  });
  button.addEventListener('touchstart', e => e.stopPropagation());
  button.addEventListener('click', togglePanel);
  parentContainer.appendChild(button);

  // === СОЗДАЁМ ПАНЕЛЬ ===
  const panel = document.createElement('div');
  panel.id = 'inspector-panel';
  Object.assign(panel.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '-60%',
    height: '60%',
    background: 'rgba(20,20,20,0.9)',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -6px 16px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    padding: '16px',
    overflowY: 'auto',
    transition: 'bottom 0.35s ease',
    zIndex: 999,
  });
  document.body.appendChild(panel);

  let open = false;
  function togglePanel() {
    open = !open;
    panel.style.bottom = open ? '0' : '-60%';
  }

  // === СОЗДАЁМ КОНТЕНТ ===
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
        if (mod.target?.applyParam) {
          mod.target.applyParam(p.param, p.param === 'headsChance' ? val / 100 : val);
        }
      };

      wrap.append(title, input, valueLabel);
      panel.appendChild(wrap);
    }
  });

  console.log('Inspector initialized');
}