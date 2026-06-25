import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext.jsx";
import JButton from "../../components/JButton.jsx";
import InputField from "../../components/InputField.jsx";
import SelectGroupe from "../../components/SelectGroupe.jsx";

const typeOptions = [
    { value: "acheteur", label: "Acheteur" },
    { value: "vendeur", label: "Vendeur" },
];

export function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        telephone: "",
        type: "acheteur",
        password: "",
        password_confirmation: "",
    });
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
            await register(form);
            navigate("/produits", { replace: true });
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

    // Laravel renvoie un tableau de messages par champ -> on prend le premier
    const err = (name) => erreurs[name]?.[0];

    return (
        <div className="container" style={{ marginTop: "50px", maxWidth: "520px" }}>
            <h2 className="fw-semibold text-secondary mb-4">Créer un compte</h2>

            {messageErreur && (
                <div className="alert alert-danger" role="alert">
                    {messageErreur}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    label="Nom complet"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={err("name")}
                />

                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={err("email")}
                />

                <div className="row">
                    <div className="col-md-6">
                        <InputField
                            label="Téléphone"
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            error={err("telephone")}
                        />
                    </div>

                    <div className="col-md-6">
                        <SelectGroupe
                            className="mb-3"
                            label="Type de compte"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            options={typeOptions}
                        />
                    </div>
                </div>

                <InputField
                    label="Mot de passe"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={err("password")}
                />

                <InputField
                    label="Confirmer le mot de passe"
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    error={err("password_confirmation")}
                />

                <JButton
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={enCours}
                >
                    {enCours ? "Création..." : "S'inscrire"}
                </JButton>
            </form>

            <p className="text-center text-muted mt-4 mb-0">
                Déjà inscrit ?{" "}
                <Link to="/login" className="text-decoration-none">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}
