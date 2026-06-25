import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getCsrfCookie } from "../../api.js";
import { useAuth } from "../../contexts/authContext.jsx";
import JButton from "../../components/JButton.jsx";

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

    const champ = (name) => `form-control ${erreurs[name] ? "is-invalid" : ""}`;

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
                <div className="mb-3">
                    <label className="form-label">Libellé</label>
                    <input
                        type="text"
                        name="libelle"
                        className={champ("libelle")}
                        value={form.libelle}
                        onChange={handleChange}
                    />
                    {erreurs.libelle && (
                        <div className="invalid-feedback">{erreurs.libelle[0]}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        className={champ("description")}
                        value={form.description}
                        onChange={handleChange}
                    />
                    {erreurs.description && (
                        <div className="invalid-feedback">
                            {erreurs.description[0]}
                        </div>
                    )}
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Prix de départ (DH)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="prix_initial"
                            className={champ("prix_initial")}
                            value={form.prix_initial}
                            onChange={handleChange}
                        />
                        {erreurs.prix_initial && (
                            <div className="invalid-feedback">
                                {erreurs.prix_initial[0]}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Catégorie</label>
                        <select
                            name="category_id"
                            className={`form-select ${erreurs.category_id ? "is-invalid" : ""}`}
                            value={form.category_id}
                            onChange={handleChange}
                        >
                            <option value="">Choisir...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.libelle || cat.nom || cat.name}
                                </option>
                            ))}
                        </select>
                        {erreurs.category_id && (
                            <div className="invalid-feedback">
                                {erreurs.category_id[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`form-control ${erreurs.image ? "is-invalid" : ""}`}
                        onChange={(e) => setImage(e.target.files[0] || null)}
                    />
                    {erreurs.image && (
                        <div className="invalid-feedback">{erreurs.image[0]}</div>
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
