import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { ATable } from "../../components/ATable.jsx";
import { useAuth } from "../../contexts/authContext.jsx";

export function EnchereIndex() {
    const { user, loading: authLoading } = useAuth();

    const [encheres, setEncheres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        // On attend de connaître l'état d'authentification
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        api.get("/encheres")
            .then((response) => {
                setEncheres(response.data || []);
                setErreur(null);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des enchères :", err);
                setErreur("Impossible de charger les enchères.");
            })
            .finally(() => setLoading(false));
    }, [user, authLoading]);

    const columns = [
        {
            selector: "produit",
            label: "Produit",
            render: (item) =>
                item.produit ? (
                    <Link
                        to={`/produits/${item.produit.id}`}
                        className="text-decoration-none fw-semibold"
                    >
                        {item.produit.libelle}
                    </Link>
                ) : (
                    "—"
                ),
        },
        {
            selector: "acheteur",
            label: "Acheteur",
            render: (item) => item.acheteur?.name || "—",
        },
        {
            selector: "prix",
            label: "Montant",
            render: (item) => (
                <span className="fw-bold">{Number(item.prix).toFixed(2)} DH</span>
            ),
        },
        {
            selector: "date_enchere",
            label: "Date",
            render: (item) =>
                item.date_enchere
                    ? new Date(item.date_enchere).toLocaleString("fr-FR")
                    : "—",
        },
    ];

    return (
        <div className="container" style={{ marginTop: "50px" }}>
            <h2 className="mb-4 fw-semibold text-secondary">Toutes les enchères</h2>

            {/* Non connecté */}
            {!authLoading && !user ? (
                <div className="alert alert-warning" role="alert">
                    Vous devez être connecté pour consulter les enchères.{" "}
                    <Link to="/login" className="alert-link">
                        Se connecter
                    </Link>
                </div>
            ) : loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : erreur ? (
                <div className="alert alert-danger" role="alert">
                    {erreur}
                </div>
            ) : encheres.length > 0 ? (
                <>
                    <div className="mb-3 text-muted small">
                        {encheres.length} enchère{encheres.length > 1 ? "s" : ""}
                    </div>
                    <ATable columns={columns} data={encheres} />
                </>
            ) : (
                <div className="alert alert-info" role="alert">
                    Aucune enchère pour le moment.
                </div>
            )}
        </div>
    );
}
