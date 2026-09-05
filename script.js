const form = document.querySelector('#preferences-form');
const message = document.querySelector('#form-message');
const menuSection = document.querySelector('#menu-section');
const menuOutput = document.querySelector('#menu-output');
const menuSummary = document.querySelector('#menu-summary');
const shoppingSection = document.querySelector('#shopping-section');
const shoppingOutput = document.querySelector('#shopping-output');
const batchOutput = document.querySelector('#batch-output');
const addOnInput = document.querySelector('#add-on-input');
const addOnButton = document.querySelector('#add-on-button');

const recipes = [
  { name: 'Tacos de pescado y pico de gallo', cuisines: ['fusion', 'mediterranea'], protein: 'pescado', calories: 'estandar', ingredients: [['pescado blanco', '1 kg'], ['tortillas de maíz', '24'], ['tomate', '6'], ['limón', '6']] },
  { name: 'Lentejas con verduras', cuisines: ['espanola', 'mediterranea'], protein: 'verduras', calories: 'ligero', ingredients: [['lentejas', '500 g'], ['zanahoria', '4'], ['calabacín', '2'], ['cebolla', '2']] },
  { name: 'Pollo al ajillo con arroz', cuisines: ['espanola'], protein: 'carne', calories: 'estandar', ingredients: [['pollo', '1 kg'], ['arroz', '500 g'], ['ajo', '2 cabezas'], ['perejil', '1 manojo']] },
  { name: 'Salmón con verduras al horno', cuisines: ['mediterranea'], protein: 'pescado', calories: 'ligero', ingredients: [['salmón', '1 kg'], ['brócoli', '2 piezas'], ['pimiento', '3'], ['limón', '2']] },
  { name: 'Enfrijoladas de pollo', cuisines: ['fusion'], protein: 'carne', calories: 'mixto', ingredients: [['pollo', '800 g'], ['frijoles cocidos', '1 kg'], ['tortillas de maíz', '18'], ['queso fresco', '250 g']] },
  { name: 'Curry japonés de tofu', cuisines: ['japonesa'], protein: 'verduras', calories: 'mixto', ingredients: [['tofu', '600 g'], ['arroz', '500 g'], ['zanahoria', '3'], ['cebolla', '2']] },
  { name: 'Teriyaki de salmón y brócoli', cuisines: ['japonesa'], protein: 'pescado', calories: 'estandar', ingredients: [['salmón', '800 g'], ['brócoli', '2 piezas'], ['salsa teriyaki', '250 ml'], ['arroz', '400 g']] },
  { name: 'Bowl mediterráneo de garbanzos', cuisines: ['mediterranea'], protein: 'verduras', calories: 'ligero', ingredients: [['garbanzos cocidos', '800 g'], ['pepino', '3'], ['tomate', '5'], ['feta', '250 g']] }
];

const batchBases = [
  ['Sofrito base', 'cebolla, tomate, pimiento y ajo'],
  ['Caldo de verduras', 'apio, zanahoria, puerro y agua'],
  ['Frijoles de la olla', 'frijol seco, cebolla y laurel']
];
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

function renderShopping(menu) {
  batchOutput.innerHTML = `<h3>Bases de batch cooking</h3><ul>${batchBases.map(([name, ingredients]) => `<li><strong>${name}:</strong> ${ingredients}</li>`).join('')}</ul>`;
  shoppingOutput.innerHTML = [...consolidateIngredients(menu)].map(([name, amount]) => `<li><span>${name}</span><strong>${amount}</strong></li>`).join('');
  shoppingSection.hidden = false;
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
  if (!item) return;
  const row = document.createElement('li');
  row.innerHTML = `<span></span><strong>Libre</strong>`;
  row.firstElementChild.textContent = item;
  shoppingOutput.append(row);
  addOnInput.value = '';
  addOnInput.focus();
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
  renderMenu(buildMenu(preferences), preferences);
  setFormMessage('Menú y lista de compra generados según tus preferencias.', false);
});

restorePreferences();
