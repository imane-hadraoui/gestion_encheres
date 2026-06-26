import { CompteReste } from "./CompteReste.jsx";
import  JButton  from "./JButton.jsx";
import { Link } from "react-router-dom";

export function CarteProduit({data, showAcheteur = false, onDelete}) {

    return (
        <div className="row row-cols-1 row-cols-md-4 g-3 mb-3" >
            { data.map((produit) => (
                <div className="col mt-4" key={produit.id} >
                    <Link to={`/produits/${produit.id}`} className="text-decoration-none text-reset">
                    <div className="card h-100 position-relative" style={{ cursor: 'pointer' }}>
                        {onDelete && (
                            <JButton
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                                style={{ zIndex: 2, width: '32px', height: '32px', padding: 0 }}
                                title="Supprimer le produit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(produit);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </JButton>
                        )}
                        <img
                            className="card-img-top" 
                            fetchPriority="high"
                            src={`http://localhost:8000/storage/images/${produit.image}`} 
                            alt={produit.libelle}
                            style={{ height: '160px',  backgroundColor: '#f8f9fa' }}
                        />                    
                        <div className="card-body">
                            <h5 className="card-title">{produit.libelle}</h5>
                            <p className="card-text text-truncate">{produit.description}</p>
                        </div>
                        <div className="card-footer bg-white border-0 pb-3">
                            <div className="text-muted small text-uppercase " >
                               {produit.encheres_max_prix ? "Offre actuelle" : "Prix de départ"}
                            </div> 
                            <h5 className="fw-bold mb-2">
                                {produit.encheres_max_prix || produit.prix_initial} DH
                            </h5>
                           <div className="text-muted small mb-1">
                                <CompteReste dateFinCalcule={produit.date_fin} />
                            </div>

                            {showAcheteur && (
                                <div className="small mt-1">
                                    <span className="text-muted">Dernier enchérisseur : </span>
                                    {produit.derniere_enchere?.acheteur ? (
                                        <span className="fw-semibold">
                                            {produit.derniere_enchere.acheteur.name}
                                        </span>
                                    ) : (
                                        <span className="fst-italic">Aucune enchère</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    </Link>
                </div>
            ))}
        </div>
        
    )
}