# Menú Familiar

Menú Familiar es una aplicación web estática para planificar menús familiares personalizados y preparar la compra semanal o quincenal. Está construida con HTML, CSS y JavaScript Vanilla, sin backend ni dependencias pesadas, y está diseñada para funcionar cómodamente desde un teléfono.

## Funcionalidades

La aplicación permite elegir una duración de 7 o 14 días, combinar estilos de cocina, seleccionar un enfoque de proteínas y aplicar un perfil calórico. El generador prioriza las preferencias seleccionadas, evita repetir el mismo plato en comida y cena del mismo día, conserva variedad a lo largo del menú y puede excluir los fines de semana.

La lista de la compra consolida los ingredientes del menú, muestra cantidades legibles y permite marcar artículos como comprados. También admite artículos libres, que pueden añadirse, eliminarse y conservarse en `localStorage` junto con el estado de la checklist. Las preferencias del cuestionario se restauran desde `sessionStorage` durante la sesión.

El bloque de *batch cooking* muestra las bases de sofrito, caldo de verduras y frijoles de la olla, y las presenta separadas de los ingredientes de las recetas para que la relación entre preparación y compra sea clara.

La experiencia móvil incluye controles táctiles amplios, diseño responsive, estados de foco visibles, metadatos para iOS y Android, manifiesto PWA, icono SVG y un service worker limitado a recursos estáticos.

## Aplicación publicada

La aplicación está disponible públicamente mediante esta URL HTTPS de previsualización estática:

<https://htmlpreview.github.io/?https://github.com/delalmarte13-app/Menufamiliar/blob/main/index.html>

La URL ha sido comprobada y renderiza la interfaz desde el repositorio público. GitHub Pages queda pendiente porque la credencial disponible para este entorno no permite crear workflows de despliegue; no se ha añadido un workflow que el repositorio no pueda aceptar.

## Ejecución local

Clona el repositorio y sirve la carpeta con cualquier servidor HTTP estático:

```bash
gh repo clone delalmarte13-app/Menufamiliar
cd Menufamiliar
python3 -m http.server 8000
```

Después abre <http://127.0.0.1:8000/> en el navegador. Servir la aplicación mediante HTTP local permite comprobar el registro del service worker. La URL de previsualización pública ejecuta el menú y la compra, pero sus capacidades PWA pueden depender del comportamiento del servicio intermediario; para una instalación PWA completa se recomienda servir el repositorio desde GitHub Pages u otro hosting estático propio.

## Uso desde un teléfono

Abre la URL pública en Safari o Chrome y completa el cuestionario. Genera el menú y utiliza la lista de la compra marcando cada ingrediente conforme lo encuentres. La aplicación guarda las preferencias durante la sesión y conserva la lista en el almacenamiento local del navegador.

En Android, abre la URL en Chrome, toca el menú de tres puntos y selecciona **Añadir a pantalla de inicio** o **Instalar aplicación**, según la versión del navegador. Confirma el nombre y coloca el acceso directo donde quieras.

En iPhone, abre la URL en Safari, toca **Compartir**, selecciona **Añadir a pantalla de inicio**, revisa el nombre y pulsa **Añadir**. La aplicación se abrirá desde el icono como una experiencia independiente del navegador cuando el sistema lo permita.

## Limitaciones actuales

La consolidación de cantidades conserva sumas textuales como `500 g + 1 kg` cuando las unidades no son homogéneas; no realiza conversiones automáticas entre gramos, kilogramos, piezas o mililitros. Las bases de *batch cooking* se muestran como guía y sus cantidades no se agregan a la lista principal porque no están definidas como recetas cuantificadas. Los datos se guardan únicamente en el navegador actual y no se sincronizan entre dispositivos.

## Licencia

Consulta el archivo [LICENSE](LICENSE) para conocer las condiciones de uso del proyecto.
