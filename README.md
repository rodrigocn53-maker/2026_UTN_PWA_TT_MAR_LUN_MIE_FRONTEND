# Slack Clone Frontend - React PWA

Este es el cliente del clon de Slack, una aplicación web moderna, responsiva y de alto rendimiento construida con React y Vite.

## 🚀 Tecnologías Utilizadas

- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción y entorno de desarrollo ultra rápido.
- **React Router**: Gestión de navegación y rutas protegidas.
- **CSS Vanilla**: Estilos personalizados siguiendo la estética premium de Slack.
- **Context API**: Gestión de estado global (Autenticación, Workspaces, Temas).
- **Lucide React**: Set de iconos modernos.

## ✨ Características Principales

### Interfaz de Usuario (UI)
- **Diseño Responsivo**: Adaptación total desde móviles (320px) hasta monitores ultra-wide (2000px).
- **Modo Oscuro/Claro**: Sistema de temas integrado para comodidad del usuario.
- **Estética Slack**: Replicación fiel de la interfaz de espacios de trabajo, canales y chat.

### Funcionalidades
- **Gestión de Sesión**: Flujo completo de Registro, Login, Verificación de Email y Recuperación de Contraseña.
- **Chat en Tiempo Real**: Envío de mensajes de texto, emojis y archivos multimedia.
- **Workspaces & Channels**: Creación de espacios de trabajo, invitación de miembros y organización por canales.
- **Multimedia**: Integración con Cloudinary para subida directa de imágenes y audios desde el cliente.

### PWA (Progressive Web App)
- La aplicación es instalable en dispositivos móviles y escritorio.
- Ofrece una experiencia similar a una app nativa con transiciones suaves.

## ⚙️ Configuración e Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` en la raíz:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## 📂 Estructura de Carpetas
- `/src/components`: Componentes atómicos y funcionales.
- `/src/Screens`: Vistas principales de la aplicación.
- `/src/services`: Capa de comunicación con la API del Backend.
- `/src/Context`: Proveedores de estado global.
- `/src/hooks`: Lógica de React reutilizable.

---
Proyecto desarrollado para el Trabajo Integrador Final - Fullstack (React + Express).
