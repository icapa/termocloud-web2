import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import type { User, Auth } from "firebase/auth";
import { auth } from "../firebase";

export interface IAuthService {
    user: User | null;
    signInWithGoogle(): Promise<User>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

export class FirebaseAuthService implements IAuthService {
    private _auth: Auth;

    constructor(authInstance: Auth = auth) {
        this._auth = authInstance;
    }

    get user(): User | null {
        return this._auth.currentUser;
    }

    async signInWithGoogle(): Promise<User> {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this._auth, provider);
        return result.user;
    }

    async logout(): Promise<void> {
        await signOut(this._auth);
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(this._auth, callback);
    }
}

export const authService = new FirebaseAuthService();
