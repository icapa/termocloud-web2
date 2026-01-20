# Documentación Técnica: Módulo de Base de Datos

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Modelo de Datos](#modelo-de-datos)
4. [Capa de Servicio](#capa-de-servicio)
5. [Testing](#testing)
6. [Configuración](#configuración)
7. [Decisiones de Diseño](#decisiones-de-diseño)
8. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Arquitectura General

El módulo de base de datos sigue una **arquitectura en capas** para mantener el código desacoplado, testeable y mantenible:

```
┌─────────────────────────────────────┐
│   UI Layer (Components)             │  ← React/Preact Components
├─────────────────────────────────────┤
│   Service Layer (Business Logic)    │  ← database.ts (IDatabaseService)
├─────────────────────────────────────┤
│   Type Definitions                  │  ← database.ts (interfaces)
├─────────────────────────────────────┤
│   Firebase Realtime Database SDK    │  ← firebase/database
└─────────────────────────────────────┘
```

### ¿Por qué esta arquitectura?

- **Separación de responsabilidades**: Cada capa tiene una función específica.
- **Testabilidad**: Podemos mockear Firebase sin afectar la lógica de negocio.
- **Mantenibilidad**: Cambios en Firebase no afectan a la UI directamente.
- **Type Safety**: TypeScript garantiza la integridad de los datos.
- **Escalabilidad**: Fácil añadir nuevas operaciones o tablas.

---

## Estructura de Archivos

```
src/
├── firebase.ts                    # Configuración de Firebase
├── types/
│   └── database.ts                # Interfaces TypeScript
├── services/
│   └── database.ts                # Servicio de base de datos

test/
├── setup.ts                       # Configuración de tests
└── database.test.ts               # Tests del servicio (26 tests)
```

---

## Modelo de Datos

### Estructura de la Base de Datos

Firebase Realtime Database organiza los datos en formato JSON jerárquico:

```
{
  "00000000bceb13f1": {           // Device ID
    "conf": { ... },              // Configuración de horarios
    "control": { ... },           // Modo de control actual
    "estado": { ... },            // Estado actual del dispositivo
    "eventos": { ... },           // Eventos históricos
    "registros": { ... }          // Registros periódicos
  }
}
```

### Tablas Principales

#### 1. **conf** - Configuración de Horarios

Almacena programas de temperatura con horarios específicos.

```typescript
interface ConfigEntry {
  D: boolean;           // Domingo
  J: boolean;           // Jueves
  L: boolean;           // Lunes
  M: boolean;           // Martes
  S: boolean;           // Sábado
  V: boolean;           // Viernes
  X: boolean;           // Miércoles
  enabled: boolean;     // Si está activo
  estadoForm: string;   // "off" | "automatico" | "on"
  hh_ff: string;        // Hora fin (HH:mm)
  hh_ii: string;        // Hora inicio (HH:mm)
  id: string;           // ID único
  temperatura: string | number;  // Temperatura objetivo
}
```

#### 2. **control** - Modo de Control

Define el modo de operación actual del dispositivo.

```typescript
interface DeviceControl {
  automatico: { temperatura: number };
  modo: string;  // "automatico" | "on" | "off"
  off: { encendido: 0 };
  on: { encendido: 1 };
}
```

#### 3. **estado** - Estado Actual

Representa el estado en tiempo real del dispositivo.

```typescript
interface DeviceEstado {
  encendido: 0 | 1;     // 0 = apagado, 1 = encendido
  fecha: string;        // ISO 8601 timestamp
  registro: string;     // Log/información adicional
  temperatura: number;  // Temperatura actual
  temperaturaObjetivo: number;  // Temperatura deseada
}
```

#### 4. **eventos** - Eventos Históricos

Registra cambios de estado organizados por fecha y hora (`eventos/YYYY-MM-DD/HH:mm:ss`).

#### 5. **registros** - Registros Periódicos

Almacena logs periódicos del sistema organizados por fecha y hora (`registros/YYYY-MM-DD/HH:mm`).

---

## Capa de Servicio

### `src/services/database.ts`

Este archivo implementa la **lógica de negocio** para interactuar con Firebase Realtime Database.

#### 1. Interfaz `IDatabaseService`

Define operaciones para cada tabla, incluyendo lectura, escritura, actualización y escuchas en tiempo real (`listeners`).

#### 2. Clase `FirebaseDatabaseService`

Implementación concreta usando el SDK de Firebase. Utiliza inyección de dependencias para permitir el testeo con mocks.

```typescript
export const databaseService = new FirebaseDatabaseService();
```

---

## Testing

### `test/database.test.ts`

Usa **Vitest** con mocks exhaustivos del SDK de Firebase.

**Resultados:**
- **26 tests** pasando correctamente ✅.
- Cobertura completa de todas las operaciones CRUD y listeners.
- Ejecución rápida e independiente de la red.

---

## Decisiones de Diseño

1. **Interfaces Estrictas**: Uso de TypeScript para evitar errores de tipo en tiempo de ejecución.
2. **Estructura Jerárquica por Fecha**: Optimiza las consultas para `eventos` y `registros`.
3. **Partial Updates**: Uso de `update` en lugar de `set` cuando solo se requiere cambiar campos específicos.
4. **Singleton Pattern**: Una única instancia del servicio para toda la aplicación.
5. **Separación de Tipos**: Las interfaces residen en `src/types/database.ts` para evitar dependencias circulares.

---

## Ejemplos de Uso

### Suscribirse al Estado en Tiempo Real

```typescript
useEffect(() => {
  const unsubscribe = databaseService.onEstadoChange(deviceId, (estado) => {
    setEstado(estado);
  });
  return unsubscribe;
}, [deviceId]);
```

### Actualizar Modo de Control

```typescript
await databaseService.updateDeviceControl(deviceId, {
  modo: 'automatico'
});
```

---

**Autor**: TermoCloud Team  
**Fecha**: 2026-01-21  
**Versión**: 1.0.0  
**Tests**: 26/26 passing ✅
