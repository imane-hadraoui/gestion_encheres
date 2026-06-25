import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getCsrfCookie } from "../../api.js";
import { CarteProduit } from "../../components/CarteProduit.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { useSearchParams } from "react-router";
import { BarreTri } from "../../components/BarreTri.jsx";
import { useAuth } from "../../contexts/authContext.jsx";
import { toast } from "react-toastify";

export function ProduitIndex() {

    const { user } = useAuth();
    const estVendeur = user?.type === "vendeur";

    const [produits, setProduits] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [tri, setTri] = useState("temps_restant");

    // pour select du BarreTri
    const [optionsTri] = useState([
        { value: 'temps_restant', label: 'Temps restant' },
        { value: 'rec_ajoutes', label: 'Récement ajoutés' }
    ]); 

    // Récupération des filtres depuis l'URL (?search=... & ?category=...)
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get("search") || "";
    const categoryId = searchParams.get("category") || "";
    const categoryNom = searchParams.get("cat_nom") || "";

    //  Réinitialiser la page à 1 quand un filtre change
    useEffect(() => {
        setPage(1);
    }, [searchKeyword, categoryId]);

    //  Charger les données quand la page, les filtres OU le rôle change
    useEffect(function() {
        setLoading(true);

        api.get("/produits", {
            params: {
                page,
                search: searchKeyword,
                category: categoryId || undefined,
                // Vendeur : on ne récupère que ses propres produits
                mine: estVendeur ? 1 : undefined,
            },
        })
            .then(response => {
                setProduits(response.data.data || []);
                setPagination(response.data);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des produits :", err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [page, searchKeyword, categoryId, estVendeur]);

    //  Suppression d'un produit (vendeur). Refusée côté serveur si déjà enchéri.
    const handleSupprimer = async (produit) => {
        // Garde-fou côté client : un produit déjà enchéri ne peut pas être supprimé
        if (produit.encheres_max_prix) {
            toast.error("Impossible de supprimer un produit déjà enchéri.");
            return;
        }

        if (!window.confirm(`Supprimer « ${produit.libelle} » ?`)) {
            return;
        }

        try {
            await getCsrfCookie();
            await api.delete(`/produits/${produit.id}`);
            setProduits((liste) => liste.filter((p) => p.id !== produit.id));
            toast.success("Produit supprimé avec succès.");
        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Impossible de supprimer ce produit.";
            toast.error(message);
        }
    };

    return (
        <>
            <div className="container" style={{ marginTop: "50px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-semibold text-secondary mb-0">
                            {searchKeyword
                                ? `Résultats pour "${searchKeyword}"`
                                : categoryId
                                ? `Catégorie : ${categoryNom || "produits"}`
                                : estVendeur
                                ? "Mes produits"
                                : "Tous les produits en vente"}
                        </h2>

                        {categoryId && (
                            <Link
                                to="/produits"
                                className="text-decoration-none small text-secondary"
                            >
                                ✕ Retirer le filtre
                            </Link>
                        )}
                    </div>

                    {estVendeur && (
                        <Link to="/produits/nouveau" className="btn btn-success">
                            + Ajouter un produit
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {produits.length > 0 && (
                            <div className="mb-3">
                                <BarreTri 
                                    total={pagination?.total || produits.length} 
                                    // triActuel={tri}
                                    // onChangementTri={setTri}
                                    // optionsTri={optionsTri} 
                                />
                            </div>
                        )}
             
                        {/* On passe la liste des produits */}
                        {produits.length > 0 ? (
                            <CarteProduit
                                data={produits}
                                showAcheteur={estVendeur}
                                onDelete={estVendeur ? handleSupprimer : undefined}
                            />
                        ) : (
                            <div className="alert alert-info text-center my-4" role="alert">
                                Aucun produit disponible.
                            </div>
                        )}

                        {pagination && produits.length > 0 && (
                            <Pagination 
                                data={pagination} 
                                onPageChange={(numero) => setPage(numero)} 
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}