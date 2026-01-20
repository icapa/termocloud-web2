import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseAuthService } from '../src/services/auth';
import { User } from 'firebase/auth';

// Mock Firebase Auth
const mockUser = { uid: '123', displayName: 'Test User' } as User;
const mockSignInWithPopup = vi.fn().mockResolvedValue({ user: mockUser });
const mockSignOut = vi.fn().mockResolvedValue(undefined);
const mockOnAuthStateChanged = vi.fn((_auth, cb) => {
    cb(mockUser);
    return () => { };
});

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
    signOut: (...args: any[]) => mockSignOut(...args),
    onAuthStateChanged: (...args: any[]) => mockOnAuthStateChanged(...args),
}));

// Mock the firebase.ts file to avoid real initialization
vi.mock('../src/firebase', () => ({
    auth: {},
}));

describe('FirebaseAuthService', () => {
    let service: FirebaseAuthService;

    beforeEach(() => {
        service = new FirebaseAuthService({} as any); // Pass mock auth instance
        vi.clearAllMocks();
    });

    it('should sign in with Google', async () => {
        const user = await service.signInWithGoogle();
        expect(mockSignInWithPopup).toHaveBeenCalled();
        expect(user).toEqual(mockUser);
    });

    it('should sign out', async () => {
        await service.logout();
        expect(mockSignOut).toHaveBeenCalled();
    });

    it('should subscribe to auth state changes', () => {
        const callback = vi.fn();
        service.onAuthStateChanged(callback);
        expect(mockOnAuthStateChanged).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(mockUser);
    });
});
