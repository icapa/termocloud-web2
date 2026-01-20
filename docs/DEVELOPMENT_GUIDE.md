# Guía de Desarrollo: Ejecución y Testing

Este manual resume los pasos necesarios para poner en marcha el proyecto, realizar pruebas de desarrollo y ejecutar la suite de tests unitarios.

## 🏁 Inicio Rápido

### 1. Requisitos Previos
Asegúrate de tener instalado:
- **Node.js** (v18 o superior recomendado)
- **npm** (v9 o superior)

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración del Entorno
Copia el archivo de ejemplo y rellena tus credenciales de Firebase:
```bash
cp .env.example .env
```

**Variables Requeridas:**
- `VITE_FIREBASE_API_KEY`: Tu clave de API de Firebase.
- `VITE_FIREBASE_AUTH_DOMAIN`: Dominio de autenticación de tu proyecto.
- `VITE_FIREBASE_PROJECT_ID`: ID del proyecto de Firebase.
- `VITE_FIREBASE_STORAGE_BUCKET`: Tu bucket de almacenamiento.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: ID del remitente de mensajes.
- `VITE_FIREBASE_DATABASE_URL`: **IMPORTANTE** - URL de tu base de datos Realtime Database. Puedes encontrarla en la pestaña "Realtime Database" de tu consola de Firebase.

---

## 🏃 Modo Desarrollo (HMR)

Para ejecutar la aplicación localmente con recarga en caliente (Hot Module Replacement):

```bash
npm run dev
```

- **URL predeterminada**: `http://localhost:5173`
- El servidor se reiniciará automáticamente si modificas el archivo `.env` o el código fuente.

---

## 🧪 Ejecución de Tests (Vitest)

El proyecto utiliza **Vitest** con mocks exhaustivos del SDK de Firebase para garantizar que los tests sean rápidos, deterministas e independientes de la red.

### Ejecutar todos los tests una vez:
```bash
npm test
```

### Ejecutar un archivo de test específico:
```bash
npm test -- database.test.ts
```

### Modo Watch (Recomendado para TDD):
```bash
npm test -- --watch
```

### Estructura de Tests:
- `test/auth.test.ts`: Verifica la lógica de inicio y cierre de sesión.
- `test/database.test.ts`: Suite de 26 tests que verifican todas las operaciones CRUD y listeners de las 5 tablas (`conf`, `control`, `estado`, `eventos`, `registros`).

---

## 🛠️ Cómo Probar Funcionalidades RTDB

Dada la naturaleza reactiva del sistema, puedes probar la sincronización de la siguiente manera:

1. Inicia la app con `npm run dev`.
2. Abre tu **Firebase Console** en otra ventana.
3. Ve a **Realtime Database**.
4. Modifica un valor manualmente (por ejemplo, cambia la temperatura en `estado/temperatura`).
5. Observa cómo la UI en tu navegador se actualiza instantáneamente gracias al hook `useDevice` y los listeners integrados.

---

## 📋 Comandos Útiles de Git

```bash
# Verificar estado de cambios
git status

# Añadir cambios
git add .

# Confirmar cambios con mensaje
git commit -m "Descripción del cambio"

# Subir al repositorio remoto
git push origin main
```

---

**Última actualización**: 2026-01-21  
**Módulos Documentados**: Auth, Database (RTDB), UI (HTB Style)
