import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { getCsrfCookie } from "../../api.js";
import { CompteRebours } from "../../components/CompteRebours.jsx";
import JButton from "../../components/JButton.jsx";
import { useAuth } from "../../contexts/authContext.jsx";

export function ProduitDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  // État de l'action « enchérir »
  const [enchereEnCours, setEnchereEnCours] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'danger', texte }

  // Enchère terminée (temps écoulé)
  const [estTermine, setEstTermine] = useState(false);
  const handleTermine = useCallback(() => setEstTermine(true), []);

  const chargerProduit = () => {
    setLoading(true);
    api
      .get(`/produits/${id}`)
      .then((response) => {
        setProduit(response.data);
        setErreur(null);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du produit :", err);
        setErreur(
          err.response?.status === 404
            ? "Ce produit est introuvable."
            : "Une erreur est survenue lors du chargement.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    chargerProduit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Le vendeur ne peut pas enchérir sur son propre produit
  const estProprietaire = !!user && produit?.user_id === user.id;

  // Offre actuelle = meilleure enchère, sinon prix de départ
  const offreActuelle = produit?.encheres_max_prix || produit?.prix_initial;
  const prochaineOffre = offreActuelle
    ? (Number(offreActuelle) * 1.1).toFixed(2)
    : null;

  const encherir = async () => {
    // Non connecté : redirection vers la connexion (retour ici ensuite)
    if (!user) {
      navigate("/login", { state: { from: `/produits/${id}` } });
      return;
    }

    // Le vendeur ne peut pas enchérir sur son propre produit
    if (estProprietaire) return;

    // Enchère terminée
    if (estTermine) return;

    setEnchereEnCours(true);
    setMessage(null);
    try {
      await getCsrfCookie();
      const response = await api.post(`/produits/${id}/encherir`);
      setMessage({
        type: "success",
        texte: response.data.message || "Enchère enregistrée.",
      });
      chargerProduit();
    } catch (err) {
      const texte =
        err.response?.status === 401
          ? "Vous devez être connecté pour enchérir."
          : err.response?.data?.error ||
            err.response?.data?.message ||
            "Impossible d'enregistrer l'enchère.";
      setMessage({ type: "danger", texte });
    } finally {
      setEnchereEnCours(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="alert alert-info text-center my-4" role="alert">
          {erreur}
        </div>
        <div className="text-center">
          <Link to="/produits" className="btn btn-outline-secondary">
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const encheres = produit.encheres || [];
  // Le gagnant est le plus offrant (les enchères sont triées par prix décroissant)
  const gagnant = encheres[0]?.acheteur || null;
  const aGagne = !!user && gagnant?.id === user.id;

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      {/* Fil d'ariane */}
      <nav className="mb-4">
        <Link to="/produits" className="text-decoration-none text-secondary">
          ← Tous les produits
        </Link>
      </nav>

      <div className="row g-4">
        {/* Image */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <img
              className="card-img-top"
              src={`http://localhost:8000/storage/images/${produit.image}`}
              alt={produit.libelle}
              style={{
                height: "400px",
                objectFit: "cover",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        </div>

        {/* Détails */}
        <div className="col-12 col-md-6">
          <h2 className="fw-semibold text-secondary mb-2">{produit.libelle}</h2>

          {produit.proprietaire && (
            <p className="text-muted mb-3">
              Vendu par{" "}
              <span className="fw-semibold">{produit.proprietaire.name}</span>
            </p>
          )}

          <p className="mb-4">{produit.description}</p>

          {/* Bloc prix + minuteur */}
          <div className="card border-0 bg-body-tertiary mb-4">
            <div className="card-body">
              <div className="text-muted small text-uppercase">Prix actuel</div>
              <h3 className="fw-bold mb-1">
                {Number(offreActuelle).toFixed(2)} DH
              </h3>
              {produit.encheres_max_prix ? (
                <div className="small text-muted mb-3">
                  Prix de départ : {Number(produit.prix_initial).toFixed(2)} DH
                </div>
              ) : (
                <div className="small text-muted mb-3">
                  Aucune enchère pour l'instant
                </div>
              )}

              <div className="text-muted small text-uppercase mb-2">
                Temps restant
              </div>
              {produit.date_fin ? (
                <CompteRebours
                  dateFin={produit.date_fin}
                  onTermine={handleTermine}
                />
              ) : (
                <span className="text-muted">Durée non définie</span>
              )}
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.texte}
            </div>
          )}

          {estTermine ? (
            aGagne ? (
              <div className="alert alert-success mb-0" role="alert">
                🎉 Félicitations ! Vous avez remporté ce produit pour{" "}
                <span className="fw-bold">
                  {Number(offreActuelle).toFixed(2)} DH
                </span>
                .
              </div>
            ) : estProprietaire ? (
              <div className="alert alert-secondary mb-0" role="alert">
                Enchère terminée.{" "}
                {gagnant
                  ? `Vendu à ${gagnant.name} pour ${Number(offreActuelle).toFixed(2)} DH.`
                  : "Aucune offre reçue."}
              </div>
            ) : (
              <div className="alert alert-secondary mb-0" role="alert">
                Enchère terminée.{" "}
                {gagnant
                  ? `Remportée par ${gagnant.name}.`
                  : "Aucune offre n'a été faite."}
              </div>
            )
          ) : estProprietaire ? (
            <div className="alert alert-secondary mb-0" role="alert">
              Vous êtes le vendeur de ce produit, vous ne pouvez pas enchérir.
            </div>
          ) : (
            <JButton
              className="btn btn-success btn-lg w-100"
              onClick={encherir}
              disabled={enchereEnCours}
            >
              {enchereEnCours
                ? "Enchère en cours..."
                : !user
                  ? "Connectez-vous pour enchérir"
                  : prochaineOffre
                    ? `Enchérir à ${prochaineOffre} DH`
                    : "Enchérir"}
            </JButton>
          )}
        </div>
      </div>
    </div>
  );
}
