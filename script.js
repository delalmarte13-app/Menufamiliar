const form = document.querySelector('#preferences-form');
const message = document.querySelector('#form-message');
const menuSection = document.querySelector('#menu-section');
const menuOutput = document.querySelector('#menu-output');
const menuSummary = document.querySelector('#menu-summary');
const shoppingSection = document.querySelector('#shopping-section');
const shoppingOutput = document.querySelector('#shopping-output');
const shoppingMessage = document.querySelector('#shopping-message');
const batchOutput = document.querySelector('#batch-output');
const addOnInput = document.querySelector('#add-on-input');
const addOnButton = document.querySelector('#add-on-button');
const recipesSection = document.querySelector('#recipes-section');
const recipesOutput = document.querySelector('#recipes-output');

const recipes = [
  { name: 'Tacos de pescado y pico de gallo', cuisines: ['fusion', 'mediterranea'], protein: 'pescado', calories: 'estandar', ingredients: [['pescado blanco', '1 kg'], ['tortillas de maíz', '24'], ['tomate', '6'], ['limón', '6']], steps: ['Marina el pescado con limón, ajo y sal durante 15 minutos.', 'Cocínalo a la plancha y desmenúzalo.', 'Mezcla tomate, cebolla y limón; sirve en tortillas calientes.'] },
  { name: 'Lentejas con verduras', cuisines: ['espanola', 'mediterranea'], protein: 'verduras', calories: 'ligero', ingredients: [['lentejas', '500 g'], ['zanahoria', '4'], ['calabacín', '2'], ['cebolla', '2']], steps: ['Sofríe la cebolla y añade zanahoria y calabacín.', 'Agrega lentejas y caldo; cuece 35 minutos.', 'Rectifica de sal y deja reposar antes de servir.'] },
  { name: 'Pollo al ajillo con arroz', cuisines: ['espanola'], protein: 'carne', calories: 'estandar', ingredients: [['pollo', '1 kg'], ['arroz', '500 g'], ['ajo', '2 cabezas'], ['perejil', '1 manojo']], steps: ['Dora el pollo en trozos con el ajo.', 'Añade agua o caldo y cocina 20 minutos.', 'Prepara el arroz y sirve con perejil fresco.'] },
  { name: 'Salmón con verduras al horno', cuisines: ['mediterranea'], protein: 'pescado', calories: 'ligero', ingredients: [['salmón', '1 kg'], ['brócoli', '2 piezas'], ['pimiento', '3'], ['limón', '2']], steps: ['Coloca salmón, brócoli y pimiento en una bandeja.', 'Aliña con limón, aceite y pimienta.', 'Hornea a 200 °C durante 18 minutos.'] },
  { name: 'Enfrijoladas de pollo', cuisines: ['fusion'], protein: 'carne', calories: 'mixto', ingredients: [['pollo', '800 g'], ['frijoles cocidos', '1 kg'], ['tortillas de maíz', '18'], ['queso fresco', '250 g']], steps: ['Tritura los frijoles con caldo y caliéntalos.', 'Rellena las tortillas con pollo deshebrado.', 'Baña con frijol y termina con queso fresco.'] },
  { name: 'Curry japonés de tofu', cuisines: ['japonesa'], protein: 'verduras', calories: 'mixto', ingredients: [['tofu', '600 g'], ['arroz', '500 g'], ['zanahoria', '3'], ['cebolla', '2']], steps: ['Dora el tofu y reserva.', 'Sofríe cebolla y zanahoria; añade curry y caldo.', 'Incorpora tofu, cocina 10 minutos y sirve con arroz.'] },
  { name: 'Teriyaki de salmón y brócoli', cuisines: ['japonesa'], protein: 'pescado', calories: 'estandar', ingredients: [['salmón', '800 g'], ['brócoli', '2 piezas'], ['salsa teriyaki', '250 ml'], ['arroz', '400 g']], steps: ['Pinta el salmón con salsa teriyaki.', 'Cocínalo al horno o plancha hasta que esté hecho.', 'Saltea el brócoli y sirve con arroz.'] },
  { name: 'Bowl mediterráneo de garbanzos', cuisines: ['mediterranea'], protein: 'verduras', calories: 'ligero', ingredients: [['garbanzos cocidos', '800 g'], ['pepino', '3'], ['tomate', '5'], ['feta', '250 g']], steps: ['Escurre y aliña los garbanzos con aceite y limón.', 'Corta pepino y tomate.', 'Monta el bowl y añade feta desmenuzado.'] }
];

const batchBases = [
  ['Sofrito base', 'cebolla, tomate, pimiento y ajo'],
  ['Caldo de verduras', 'apio, zanahoria, puerro y agua'],
  ['Frijoles de la olla', 'frijol seco, cebolla y laurel']
];
const batchProducts = [['cebolla', '6 piezas'], ['tomate', '8 piezas'], ['pimiento', '4 piezas'], ['ajo', '2 cabezas'], ['apio', '1 manojo'], ['zanahoria', '8 piezas'], ['puerro', '2 piezas'], ['agua', '5 litros'], ['frijol seco', '500 g'], ['laurel', '1 paquete']];
const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function scoreRecipe(recipe, preferences) {
  const cuisineScore = recipe.cuisines.some((cuisine) => preferences.cuisines.includes(cuisine)) ? 4 : 0;
  const proteinScore = preferences.protein === 'equilibrado' ? 1 : recipe.protein === preferences.protein ? 3 : 0;
  const calorieScore = preferences.calories === 'mixto' || recipe.calories === preferences.calories ? 2 : 0;
  return cuisineScore + proteinScore + calorieScore;
}

function buildMenu(preferences) {
  const availableDays = Array.from({ length: preferences.duration }, (_, index) => index)
    .filter((day) => !preferences.weekdaysOnly || day % 7 < 5);
  const ranked = [...recipes].sort((a, b) => scoreRecipe(b, preferences) - scoreRecipe(a, preferences));
  let cursor = 0;
  return availableDays.map((day) => {
    const meals = [];
    while (meals.length < 2) {
      const candidate = ranked[cursor % ranked.length];
      cursor += 1;
      if (!meals.includes(candidate)) meals.push(candidate);
    }
    return { day: `Día ${day + 1} · ${dayNames[day % 7]}`, meals };
  });
}

function renderMenu(menu, preferences) {
  menuSummary.textContent = `${preferences.duration} días · ${menu.length} días planificados${preferences.weekdaysOnly ? ' · sin fines de semana' : ''}`;
  menuOutput.innerHTML = menu.map(({ day, meals }) => `
    <article class="day-card"><h3>${day}</h3><ol>
      <li><span>Comida</span>${meals[0].name}</li><li><span>Cena</span>${meals[1].name}</li>
    </ol></article>`).join('');
  menuSection.hidden = false;
  renderShopping(menu);
  menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function consolidateIngredients(menu) {
  const totals = new Map();
  menu.flatMap(({ meals }) => meals).forEach((recipe) => recipe.ingredients.forEach(([name, amount]) => {
    const key = name.toLowerCase();
    totals.set(key, totals.has(key) ? `${totals.get(key)} + ${amount}` : amount);
  }));
  return totals;
}

function readShoppingItems() {
  try { return JSON.parse(localStorage.getItem('shoppingItems')) || []; } catch { return []; }
}

function saveShoppingItems(items) {
  localStorage.setItem('shoppingItems', JSON.stringify(items));
}

function renderShoppingItems(items) {
  shoppingOutput.replaceChildren();
  items.forEach((item, index) => {
    const row = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    const name = document.createElement('span');
    const amount = document.createElement('strong');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(item.checked);
    checkbox.dataset.index = index;
    name.textContent = item.name;
    amount.textContent = item.amount;
    label.append(checkbox, name);
    row.append(label, amount);
    row.classList.toggle('is-checked', Boolean(item.checked));
    if (item.custom) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-item';
      remove.dataset.removeIndex = index;
      remove.setAttribute('aria-label', `Eliminar ${item.name}`);
      remove.textContent = 'Eliminar';
      row.append(remove);
    }
    shoppingOutput.append(row);
  });
}

function renderShopping(menu) {
  batchOutput.innerHTML = `<h3>Bases de batch cooking</h3><p>Estas bases se preparan una vez y sus ingredientes aparecen diferenciados de los platos del menú.</p><ul>${batchBases.map(([name, ingredients]) => `<li><strong>${name}:</strong> ${ingredients}</li>`).join('')}</ul>`;
  const customItems = readShoppingItems().filter((item) => item.custom);
  const items = [...consolidateIngredients(menu)].map(([name, amount]) => ({ name, amount, custom: false, checked: false }));
  batchProducts.forEach(([name, amount]) => {
    const existing = items.find((item) => item.name === name);
    if (existing) existing.amount += ` + ${amount}`;
    else items.push({ name, amount, custom: false, checked: false });
  });
  renderShoppingItems([...items, ...customItems]);
  saveShoppingItems([...items, ...customItems]);
  shoppingSection.hidden = false;
}

function renderRecipes(menu) {
  const selected = [...new Set(menu.flatMap(({ meals }) => meals))];
  recipesOutput.innerHTML = selected.map((recipe) => `<article class="recipe-card"><h3>${recipe.name}</h3><p class="recipe-meta">Proteína: ${recipe.protein} · Perfil: ${recipe.calories}</p><strong>Ingredientes</strong><ul>${recipe.ingredients.map(([name, amount]) => `<li>${amount} de ${name}</li>`).join('')}</ul><strong>Preparación</strong><ol>${recipe.steps.map((step) => `<li>${step}</li>`).join('')}</ol></article>`).join('');
  recipesSection.hidden = false;
}

function setFormMessage(text, isError = true) {
  message.textContent = text;
  message.dataset.state = isError ? 'error' : 'success';
}

function validatePreferences(data) {
  const cuisines = data.getAll('cuisine');
  const required = ['duration', 'protein', 'calories'];
  const missing = required.find((field) => !data.get(field));
  if (missing) return { error: 'Completa todos los campos obligatorios del cuestionario.', focus: form.elements[missing] };
  if (!cuisines.length) return { error: 'Selecciona al menos un estilo de cocina.', focus: form.querySelector('input[name="cuisine"]') };
  const duration = Number(data.get('duration'));
  if (![7, 14].includes(duration)) return { error: 'Selecciona una duración válida de 7 o 14 días.', focus: form.elements.duration };
  return { cuisines, duration };
}

function restorePreferences() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('menuPreferences'));
    if (!saved) return;
    form.elements.duration.value = String(saved.duration || '');
    form.elements.protein.value = saved.protein || '';
    form.elements.calories.value = saved.calories || '';
    form.elements.weekdaysOnly.checked = Boolean(saved.weekdaysOnly);
    form.querySelectorAll('input[name="cuisine"]').forEach((input) => { input.checked = saved.cuisines?.includes(input.value); });
    setFormMessage('Tus preferencias anteriores se han restaurado.', false);
  } catch {
    sessionStorage.removeItem('menuPreferences');
  }
}

addOnButton.addEventListener('click', () => {
  const item = addOnInput.value.trim();
  if (!item) {
    shoppingMessage.textContent = 'Escribe un artículo antes de añadirlo.';
    addOnInput.focus();
    return;
  }
  const items = readShoppingItems();
  items.push({ name: item, amount: 'Libre', custom: true, checked: false });
  saveShoppingItems(items);
  renderShoppingItems(items);
  shoppingMessage.textContent = `${item} se ha añadido a la lista.`;
  addOnInput.value = '';
  addOnInput.focus();
});

addOnInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addOnButton.click();
  }
});

shoppingOutput.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const items = readShoppingItems();
  const index = Number(event.target.dataset.index);
  if (!items[index]) return;
  items[index].checked = event.target.checked;
  saveShoppingItems(items);
  event.target.closest('li').classList.toggle('is-checked', event.target.checked);
});

shoppingOutput.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-index]');
  if (!button) return;
  const items = readShoppingItems();
  items.splice(Number(button.dataset.removeIndex), 1);
  saveShoppingItems(items);
  renderShoppingItems(items);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const validation = validatePreferences(data);
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  if (validation.error) {
    setFormMessage(validation.error);
    validation.focus?.setAttribute('aria-invalid', 'true');
    validation.focus?.focus();
    return;
  }
  const preferences = {
    duration: validation.duration,
    cuisines: validation.cuisines,
    protein: data.get('protein'),
    calories: data.get('calories'),
    weekdaysOnly: data.get('weekdaysOnly') === 'on'
  };
  sessionStorage.setItem('menuPreferences', JSON.stringify(preferences));
  const menu = buildMenu(preferences);
  renderMenu(menu, preferences);
  renderRecipes(menu);
  setFormMessage('Menú y lista de compra generados según tus preferencias.', false);
});

restorePreferences();
const savedShoppingItems = readShoppingItems();
if (savedShoppingItems.length) {
  batchOutput.innerHTML = `<h3>Bases de batch cooking</h3><p>Estas bases se preparan una vez y sus ingredientes aparecen diferenciados de los platos del menú.</p><ul>${batchBases.map(([name, ingredients]) => `<li><strong>${name}:</strong> ${ingredients}</li>`).join('')}</ul>`;
  renderShoppingItems(savedShoppingItems);
  shoppingSection.hidden = false;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
