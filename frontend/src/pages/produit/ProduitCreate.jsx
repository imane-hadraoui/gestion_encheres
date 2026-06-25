import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getCsrfCookie } from "../../api.js";
import { useAuth } from "../../contexts/authContext.jsx";
import JButton from "../../components/JButton.jsx";
import InputField from "../../components/InputField.jsx";
import TextareaInput from "../../components/TextareaInput.jsx";
import SelectGroupe from "../../components/SelectGroupe.jsx";

export function ProduitCreate() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        libelle: "",
        description: "",
        prix_initial: "",
        category_id: "",
    });
    const [image, setImage] = useState(null);
    const [erreurs, setErreurs] = useState({});
    const [messageErreur, setMessageErreur] = useState(null);
    const [enCours, setEnCours] = useState(false);

    // Réservé aux vendeurs
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login", { state: { from: "/produits/nouveau" } });
        } else if (user.type !== "vendeur") {
            navigate("/produits", { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        api.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Erreur chargement catégories:", err));
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // Laravel renvoie un tableau de messages par champ -> on prend le premier
    const err = (name) => erreurs[name]?.[0];

    // Options de la liste déroulante des catégories (avec un choix par défaut)
    const categoryOptions = [
        { value: "", label: "Choisir..." },
        ...categories.map((cat) => ({
            value: cat.id,
            label: cat.libelle || cat.nom || cat.name,
        })),
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnCours(true);
        setErreurs({});
        setMessageErreur(null);

        const data = new FormData();
        data.append("libelle", form.libelle);
        data.append("description", form.description);
        data.append("prix_initial", form.prix_initial);
        data.append("category_id", form.category_id);
        if (image) data.append("image", image);

        try {
            await getCsrfCookie();
            await api.post("/produits", data, {
                // Laisse axios définir le bon Content-Type (multipart + boundary)
                headers: { "Content-Type": undefined },
            });
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

    return (
        <div className="container" style={{ marginTop: "50px", maxWidth: "640px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-semibold text-secondary mb-0">
                    Ajouter un produit
                </h2>
                <Link to="/produits" className="text-decoration-none text-secondary">
                    ← Retour
                </Link>
            </div>

            {messageErreur && (
                <div className="alert alert-danger" role="alert">
                    {messageErreur}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    label="Libellé"
                    name="libelle"
                    value={form.libelle}
                    onChange={handleChange}
                    error={err("libelle")}
                />

                <TextareaInput
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    error={err("description")}
                />

                <div className="row">
                    <div className="col-md-6">
                        <InputField
                            label="Prix de départ (DH)"
                            type="number"
                            name="prix_initial"
                            value={form.prix_initial}
                            onChange={handleChange}
                            error={err("prix_initial")}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <SelectGroupe
                            label="Catégorie"
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            options={categoryOptions}
                            error={err("category_id")}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`form-control ${err("image") ? "is-invalid" : ""}`}
                        onChange={(e) => setImage(e.target.files[0] || null)}
                    />
                    {err("image") && (
                        <div className="invalid-feedback">{err("image")}</div>
                    )}
                </div>

                <JButton
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={enCours}
                >
                    {enCours ? "Enregistrement..." : "Créer le produit"}
                </JButton>
            </form>
        </div>
    );
}