# TurboList-QS- 

Visualizador interactivo de quicksort configurable ejecutable 100% en el navegador. 

## Uso rápido

1. Visita <https://<tu_usuario>.github.io/TurboList-QS-/> (cambia `<tu_usuario>` por tu usuario de GitHub).
2. Selecciona un dataset y el motor (JS / Pyodide / WASM).
3. Pulsa **Sort** para ver la animación paso a paso.

Todo se carga vía CDN: no se necesitan instalaciones locales.

## Características

- Quicksort con estrategias de pivote y partición configurables.
- Visualizador en canvas con controles de reproducción.
- Motores en JavaScript, Python (Pyodide) y C++ (WASM) con fallback automático.
- Tests en el navegador con Mocha, Chai y fast-check.
- Publicación automática en GitHub Pages.

## Desarrollo

Para desarrollar en local se necesita un servidor web sencillo. Desde la
carpeta `web` puedes ejecutar, por ejemplo:

```bash
cd web
python -m http.server 8000
```

Luego visita <http://localhost:8000/> en tu navegador. Abrir el archivo
directamente con `file://` produce errores de CORS con los módulos ES.

## Licencia

[MIT](LICENSE)
