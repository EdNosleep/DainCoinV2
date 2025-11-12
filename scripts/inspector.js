// ===============================
// Inspector.js — визуальный инспектор
// ===============================

// Модули, с которыми он работает (дописываешь сам)
import * as coinModule from './coin.js';

// Список подключённых модулей
const modules = [coinModule];

// === СТИЛИ ПАНЕЛИ ===
const panelStyle = `
#inspector-toggle {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: #222;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  z-index: 9999;
}
#inspector-panel {
  position: fixed;
  bottom: -300px;
  left: 0;
  width: 100%;
  background: rgba(30,30,30,0.95);
  color: white;
  border-top: 2px solid #555;
  border-radius: 16px 16px 0 0;
  transition: bottom 0.3s ease;
  padding: 20px;
  z-index: 9998;
  font-family: sans-serif;
}
#inspector-panel.open {
  bottom: 0;
}
.inspector-module {
  margin-bottom: 16px;
}
.inspector-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.inspector-slider {
  width: 100%;
}
`;

// Добавляем стили
const styleTag = document.createElement('style');
styleTag.textContent = panelStyle;
document.head.appendChild(styleTag);

// === СОЗДАНИЕ ИНСПЕКТОРА ===
export function initInspector() {
  // Кнопка
  const toggle = document.createElement('button');
  toggle.id = 'inspector-toggle';
  toggle.textContent = 'Инспектор ⚙️';
  document.body.appendChild(toggle);

  // Панель
  const panel = document.createElement('div');
  panel.id = 'inspector-panel';
  document.body.appendChild(panel);

  toggle.onclick = () => panel.classList.toggle('open');

  // Создаём элементы под каждый модуль
  for (const mod of modules) {
    if (!mod.inspectorSchema) continue;

    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'inspector-module';

    const title = document.createElement('h3');
    title.textContent = mod.inspectorSchema.moduleName;
    moduleDiv.appendChild(title);

    for (const p of mod.inspectorSchema.params) {
      const wrap = document.createElement('div');
      wrap.className = 'inspector-param';

      const label = document.createElement('div');
      label.className = 'inspector-label';
      label.innerHTML = `<span>${p.label}</span><span id="val-${p.key}">${mod.coinParams?.[p.key]}</span>`;
      wrap.appendChild(label);

      if (p.type === 'slider') {
        const input = document.createElement('input');
        input.type = 'range';
        input.min = p.min;
        input.max = p.max;
        input.step = p.step || 1;
        input.value = mod.coinParams?.[p.key];
        input.className = 'inspector-slider';
        wrap.appendChild(input);

        input.addEventListener('input', () => {
          mod.coinParams[p.key] = parseFloat(input.value);
          document.getElementById(`val-${p.key}`).textContent = input.value;

          // Автообновление, если в модуле есть функция updateCoinSize()
          if (mod.updateCoinSize) mod.updateCoinSize();
        });
      }

      moduleDiv.appendChild(wrap);
    }

    panel.appendChild(moduleDiv);
  }
}
