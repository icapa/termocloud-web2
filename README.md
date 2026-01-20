# Termocloud Web 2

Aplicación web moderna construida con **Preact**, **Firebase** y **TypeScript**, siguiendo metodología **TDD** (Test-Driven Development).

## 🚀 Características

- ✅ **Autenticación con Google** (Firebase Auth)
- ✅ **Gestión de estado** con Preact Signals
- ✅ **Testing** con Vitest
- 🔄 **Base de datos Firestore** (próximamente)
- 🎨 **Componentes modulares** (próximamente)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar Firebase
cp .env.example .env
# Edita .env con tus credenciales de Firebase
```

## 🔧 Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** → **Google Sign-In**
4. Copia las credenciales del proyecto a tu archivo `.env`

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch
```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes de UI
├── services/        # Servicios (Auth, Database)
├── stores/          # Estado global (Signals)
├── firebase.ts      # Configuración de Firebase
└── app.tsx          # Componente principal

test/                # Tests unitarios
```

## 🎯 Próximos Pasos

- [ ] Módulo de Base de Datos (Firestore)
- [ ] Componente de Estado
- [ ] Componente de Registros
- [ ] Componente de Configuración
- [ ] Componente de Consumo
