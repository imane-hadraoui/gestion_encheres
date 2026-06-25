import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import CategoriesModal from "../components/CategoriesModal";
import api from '../api';
import { useAuth } from "../contexts/authContext.jsx";

export const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/produits");
    };

    const handleCategorySelect = (cat) => {
        setIsModalOpen(false);
        navigate(`/produits?category=${cat.id}&cat_nom=${encodeURIComponent(cat.nom)}`);
    };

    useEffect(() => {
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur chargement catégories:", err));
    }, []);

   
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/produits?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate("/produits"); 
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold" to="/produits">Enchères</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* Links */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/produits">Products</Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link text-decoration-none border-0 bg-transparent fallback-button-style"
                                    onClick={() => setIsModalOpen(true)}
                                    type="button"
                                >
                                    Catégories
                                </button>
                            </li>
                            {user && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/encheres">Enchères</Link>
                                </li>
                            )}
                        </ul>

                        {/* Search Input */}
                        <form 
                            className="mx-auto my-2 my-lg-0" 
                            style={{ width: '100%', maxWidth: '450px' }}
                            onSubmit={handleSearchSubmit}
                        >
                            <div className="input-group bg-light rounded-pill px-3 py-1 align-items-center" style={{ border: 'none' }}>
                                <span 
                                    className="p-0 me-2 d-flex align-items-center" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={handleSearchSubmit}
                                >
                                    <FaSearch className="text-primary" size={16} />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 shadow-none p-1" 
                                    placeholder="Rechercher un produit..." 
                                    aria-label="Search" 
                                    name="searchInput"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {/* Authentification */}
                        <div className="d-flex align-items-center gap-2">
                            {user ? (
                                <>
                                    <span className="text-secondary me-1">
                                        Bonjour, <span className="fw-semibold">{user.name}</span>
                                    </span>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                        type="button"
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link className="btn btn-outline-success" to="/login">
                                        Connexion
                                    </Link>
                                    <Link className="btn btn-success" to="/register">
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal des catégories */}
                <CategoriesModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={categories}
                    onSelect={handleCategorySelect}
                />
            </nav>
        </>
    );
};