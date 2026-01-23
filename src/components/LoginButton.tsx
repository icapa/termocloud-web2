import { currentUser, isLoading, authError, signInWithGoogle, logout } from "../stores/authStore";

export function LoginButton() {
    const handleLogin = async () => {
        await signInWithGoogle();
    };

    const handleLogout = async () => {
        await logout();
    };

    if (isLoading.value) {
        return <div>Cargando...</div>;
    }

    if (currentUser.value) {
        return (
            <div style={{ textAlign: "center", padding: "0px" }}>
                <button onClick={handleLogout} className="htb-button" style={{ marginTop: '10px' }}>
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: 'var(--accent)' }}>Termocloud Web 2</h2>
            <div style={{ margin: '1rem 0' }}>
                <img src="/termocloud-icon.svg" alt="Termocloud Icon" style={{ width: '160px', height: '160px' }} />
            </div>
            {authError.value && (
                <p style={{ color: "red" }}>{authError.value}</p>
            )}
            <button onClick={handleLogin} className="htb-button" style={{ marginTop: '10px' }}>
                🔐 Iniciar Sesión con Google
            </button>
        </div>
    );
}

const buttonStyle = {
    padding: "12px 24px",
    fontSize: "14px",
    backgroundColor: "#4285f4",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
};
