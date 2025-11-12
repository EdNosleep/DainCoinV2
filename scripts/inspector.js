// ===============================
// Inspector.js — универсальный визуальный инспектор
// ===============================

export function initInspector(modules = []) {
  // === Создаём кнопку открытия ===
  const btn = document.createElement('button');
  btn.innerText = '⚙️ Настройки';
  btn.style.position = 'fixed';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.zIndex = '1000';
  btn.style.padding = '10px 14px';
  btn.style.border = 'none';
  btn.style.borderRadius = '12px';
  btn.style.background = 'rgba(0,0,0,0.7)';
  btn.style.color = '#fff';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '16px';
  document.body.appendChild(btn);

  // === Создаём саму панель ===
  const panel = document.createElement('div');
  panel.id = 'inspector-panel';
  panel.style.position = 'fixed';
  panel.style.left = '0';
  panel.style.bottom = '-400px';
  panel.style.width = '100%';
  panel.style.height = '400px';
  panel.style.background = 'rgba(20, 20, 20, 0.95)';
  panel.style.backdropFilter = 'blur(8px)';
  panel.style.transition = 'bottom 0.4s ease';
  panel.style.color = 'white';
  panel.style.padding = '20px';
  panel.style.boxSizing = 'border-box';
  panel.style.zIndex = '999';
  panel.style.overflowY = 'auto';
  document.body.appendChild(panel);

  let isOpen = false;
  btn.onclick = () => {
    isOpen = !isOpen;
    panel.style.bottom = isOpen ? '0' : '-400px';
  };

  // === Генерация контролов ===
  modules.forEach((m) => {
    const header = document.createElement('h3');
    header.innerText = m.inspectorConfig.moduleName;
    header.style.marginTop = '10px';
    header.style.fontSize = '18px';
    header.style.color = '#ffcc66';
    panel.appendChild(header);

    m.inspectorConfig.params.forEach((p) => {
      const container = document.createElement('div');
      container.style.margin = '10px 0';

      const label = document.createElement('label');
      label.innerText = `${p.label}: `;
      label.style.display = 'block';
      label.style.marginBottom = '4px';
      container.appendChild(label);

      if (p.type === 'range') {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = p.min;
        slider.max = p.max;
        slider.step = p.step;
        slider.value = p.get();

        const valLabel = document.createElement('span');
        valLabel.innerText = p.get();
        valLabel.style.marginLeft = '10px';

        slider.oninput = (e) => {
          const val = parseFloat(e.target.value);
          valLabel.innerText = val;
          p.set(val);
        };

        container.appendChild(slider);
        container.appendChild(valLabel);
      }

      panel.appendChild(container);
    });
  });
}
