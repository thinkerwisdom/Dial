# DIal

Demo de selector circular controlado con rueda, clic y doble clic.

## Estructura

- `dist/config/menu.json`: navegación recursiva con IDs únicos.
- `dist/actividades/<ruta>/index.html`: actividades independientes.
- `dist/app.js`: motor de navegación.

Cada actividad usa una ruta de carpeta en el JSON. El motor completa automáticamente `actividades/<ruta>/index.html`, compatible con el enfoque previsto para PHP Desktop.
