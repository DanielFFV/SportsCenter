# 🏃‍♂️ Sports Center Registry Front (Sports Events System)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Interfaz frontend de un Sistema para inscripción en eventos deportivos de diversas disciplinas. Es un proyecto personal diseñado con un enfoque estructurado, modular y escalable para optimizar la administración de carreras y la seguridad.

## ✨ Características Principales

- **Gestión Multi-Perfil**: 
  - **Perfiles Individuales**: Gestión de información y estadísticas para competidores únicos.
  - **Grupos en Competencias Colectivas**: Inscripción y administración de equipos y grupos deportivos.
  - **Registro de Menores**: Funcionalidad para inscribir y asociar menores de edad a perfiles de adultos responsables o tutores.
- **Gestión de Carreras**: Administración y listado de eventos deportivos disponibles.
- **Arquitectura Modular**: Código fuertemente desacoplado para asegurar la fácil escalabilidad del proyecto.
- **Listado de Inscritos**: Visualización de todos los corredores y equipos registrados por evento.

## 🛠️ Tecnologías Utilizadas

- **Angular 18**: Framework core para la lógica de la SPA (Single Page Application).
- **Ionic Framework 8**: Framework de interfaz de usuario para lograr un diseño responsivo, limpio y adaptable a múltiples plataformas (Web, iOS, Android).
- **TypeScript**: Superset de JavaScript que permite un tipado estricto y seguro.
- **Capacitor 6**: Ecosistema para futura exportación y empaquetado nativo en dispositivos móviles.
- **RxJS**: Para el manejo de reactividad y peticiones asíncronas HTTP.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada, 18+ o superior)
- `npm` instalado
- CLI de Angular (`npm install -g @angular/cli`)
- CLI de Ionic (`npm install -g @ionic/cli`)

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Ingresa al directorio del proyecto y desplázate a la carpeta `Front`:
   ```bash
   cd runners-registry-front/Front
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## 🏃 Ejecución en Desarrollo

Para iniciar el servidor local de desarrollo con recarga en vivo (Live Reloading):

```bash
ionic serve
# o alternativamente:
npm run start
```

La aplicación estará disponible y se abrirá por defecto en `http://localhost:8100` (o `http://localhost:4200` dependiendo de tu configuración de Angular CLI).

## 📦 Build para Producción

Para generar la versión optimizada para producción:

```bash
ionic build
# o usar el script directo:
npm run build
```

Los archivos minificados y listos para despliegue se generarán típicamente en el directorio de salida (e.g. `www` o `dist`).

## 🧹 Linting y Pruebas

Para verificar las reglas de estilo del código (ESLint):
```bash
npm run lint
```

Para correr las pruebas unitarias configuradas con Karma/Jasmine:
```bash
npm run test
```

## 📝 Configuración

Las variables de entorno u orígenes de API se pueden definir según los estándares de Angular, configurando los archivos en la ruta `src/environments/environment.ts` y `src/environments/environment.prod.ts`.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un branch específico para tus cambios (`git checkout -b feature/nueva-opcion`) y envía un Pull Request detallando las modificaciones aportadas.
