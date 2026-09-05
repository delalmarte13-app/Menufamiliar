const form = document.querySelector('#preferences-form');
const message = document.querySelector('#form-message');
const menuSection = document.querySelector('#menu-section');
const menuOutput = document.querySelector('#menu-output');
const menuSummary = document.querySelector('#menu-summary');

const recipes = [
  { name: 'Tacos de pescado y pico de gallo', cuisines: ['fusion', 'mediterranea'], protein: 'pescado', calories: 'estandar' },
  { name: 'Lentejas con verduras', cuisines: ['espanola', 'mediterranea'], protein: 'verduras', calories: 'ligero' },
  { name: 'Pollo al ajillo con arroz', cuisines: ['espanola'], protein: 'carne', calories: 'estandar' },
  { name: 'Salmón con verduras al horno', cuisines: ['mediterranea'], protein: 'pescado', calories: 'ligero' },
  { name: 'Enfrijoladas de pollo', cuisines: ['fusion'], protein: 'carne', calories: 'mixto' },
  { name: 'Curry japonés de tofu', cuisines: ['japonesa'], protein: 'verduras', calories: 'mixto' },
  { name: 'Teriyaki de salmón y brócoli', cuisines: ['japonesa'], protein: 'pescado', calories: 'estandar' },
  { name: 'Bowl mediterráneo de garbanzos', cuisines: ['mediterranea'], protein: 'verduras', calories: 'ligero' }
];

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function scoreRecipe(recipe, preferences) {
  const cuisineScore = recipe.cuisines.some((cuisine) => preferences.cuisines.includes(cuisine)) ? 4 : 0;
  const proteinScore = preferences.protein === 'equilibrado' ? 1 : recipe.protein === preferences.protein ? 3 : 0;
  const calorieScore = preferences.calories === 'mixto' || recipe.calories === preferences.calories ? 2 : 0;
  return cuisineScore + proteinScore + calorieScore;
}

function buildMenu(preferences) {
  const availableDays = Array.from({ length: preferences.duration }, (_, index) => index + 1)
    .filter((day) => !preferences.weekdaysOnly || (day % 7 > 0 && day % 7 < 6));
  const ranked = [...recipes].sort((a, b) => scoreRecipe(b, preferences) - scoreRecipe(a, preferences));

  return availableDays.map((day, index) => ({
    day: `Día ${day} · ${dayNames[day % 7]}`,
    meals: [ranked[index % ranked.length], ranked[(index + 3) % ranked.length]]
  }));
}

function renderMenu(menu, preferences) {
  menuSummary.textContent = `${preferences.duration} días · ${menu.length} días planificados${preferences.weekdaysOnly ? ' · sin fines de semana' : ''}`;
  menuOutput.innerHTML = menu.map(({ day, meals }) => `
    <article class="day-card">
      <h3>${day}</h3>
      <ol>
        <li><span>Comida</span>${meals[0].name}</li>
        <li><span>Cena</span>${meals[1].name}</li>
      </ol>
    </article>
  `).join('');
  menuSection.hidden = false;
  menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const cuisines = data.getAll('cuisine');

  if (!cuisines.length) {
    message.textContent = 'Selecciona al menos un estilo de cocina.';
    form.querySelector('input[name="cuisine"]').focus();
    return;
  }

  const preferences = {
    duration: Number(data.get('duration')),
    cuisines,
    protein: data.get('protein'),
    calories: data.get('calories'),
    weekdaysOnly: data.get('weekdaysOnly') === 'on'
  };

  sessionStorage.setItem('menuPreferences', JSON.stringify(preferences));
  renderMenu(buildMenu(preferences), preferences);
  message.textContent = 'Menú generado según tus preferencias.';
});
