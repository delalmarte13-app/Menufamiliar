const form = document.querySelector('#preferences-form');
const message = document.querySelector('#form-message');

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
  message.textContent = 'Preferencias guardadas. El generador de menú estará disponible en el siguiente módulo.';
});
