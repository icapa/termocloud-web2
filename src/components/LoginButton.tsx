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
                <button onClick={handleLogout} style={buttonStyle}>
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Termocloud Web 2</h2>
            <p>Inicia sesión con tu cuenta de Google</p>
            {authError.value && (
                <p style={{ color: "red" }}>{authError.value}</p>
            )}
            <button onClick={handleLogin} style={buttonStyle}>
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
