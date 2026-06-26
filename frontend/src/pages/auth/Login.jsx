import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext.jsx";
import JButton from "../../components/JButton.jsx";
import InputField from "../../components/InputField.jsx";

export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [erreurs, setErreurs] = useState({});
    const [messageErreur, setMessageErreur] = useState(null);
    const [enCours, setEnCours] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnCours(true);
        setErreurs({});
        setMessageErreur(null);
        try {
            await login(form);
            // Retour à la page d'origine si fournie, sinon liste des produits
            const destination = location.state?.from || "/produits";
            navigate(destination, { replace: true });
        } catch (err) {
            if (err.response?.status === 422) {
                setErreurs(err.response.data.errors || {});
            } else {
                setMessageErreur("Une erreur est survenue. Réessayez.");
            }
        } finally {
            setEnCours(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: "50px", maxWidth: "480px" }}>
            <h2 className="fw-semibold text-secondary mb-4">Connexion</h2>

            {messageErreur && (
                <div className="alert alert-danger" role="alert">
                    {messageErreur}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
             
                <InputField
                    type="email"
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    error={erreurs.email ? erreurs.email[0] : ""}
                />

                <InputField
                    type="password"
                    name="password"
                    label="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    error={erreurs.password ? erreurs.password[0] : ""}
                />
                   
                <JButton
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={enCours}
                >
                    {enCours ? "Connexion..." : "Se connecter"}
                </JButton>
            </form>

            <p className="text-center text-muted mt-4 mb-0">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-decoration-none">
                    S'inscrire
                </Link>
            </p>
        </div>
    );
}
