import { signal, effect } from "@preact/signals";
import type { User } from "firebase/auth";
import { authService } from "../services/auth";

// Signals for auth state
export const currentUser = signal<User | null>(null);
export const isLoading = signal<boolean>(true);
export const authError = signal<string | null>(null);

// Initialize auth state listener
effect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
        currentUser.value = user;
        isLoading.value = false;
    });

    return unsubscribe;
});

// Auth actions
export const signInWithGoogle = async () => {
    try {
        isLoading.value = true;
        authError.value = null;
        const user = await authService.signInWithGoogle();
        currentUser.value = user;
    } catch (error: any) {
        authError.value = error.message || "Error al iniciar sesión";
        console.error("Login error:", error);
    } finally {
        isLoading.value = false;
    }
};

export const logout = async () => {
    try {
        isLoading.value = true;
        authError.value = null;
        await authService.logout();
        currentUser.value = null;
    } catch (error: any) {
        authError.value = error.message || "Error al cerrar sesión";
        console.error("Logout error:", error);
    } finally {
        isLoading.value = false;
    }
};
