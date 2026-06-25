import React from 'react';
import JButton from './JButton';

export function Pagination({ data, onPageChange }) {
    // Si pas de données ou une seule page, inutile d'afficher la pagination
    if (!data || data.last_page <= 1) return null;

    const { current_page, last_page } = data;
    
    return (
        <nav className="d-flex justify-content-center mt-5">
            <ul className="pagination shadow-sm">
                
                {/* Bouton Précédent */}
                <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                    <JButton 
                        className="page-link" 
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page === 1} 
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </JButton>
                </li>

                {/* Numéros de pages */}
                {[...Array(last_page).keys()].map((n) => {
                    const numeroPage = n + 1;
                    return (
                        <li 
                            key={numeroPage} 
                            className={`page-item ${current_page === numeroPage ? 'active' : ''}`}
                        >
                            <JButton 
                                className="page-link" 
                                onClick={() => onPageChange(numeroPage)}
                            >
                                {numeroPage}
                            </JButton>
                        </li>
                    );
                })}

                {/* Bouton Suivant */}
                <li className={`page-item ${current_page === last_page ? 'disabled' : ''}`}>
                    <JButton 
                        type="button"
                        className="page-link" 
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page === last_page}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </JButton>
                </li>

            </ul>
        </nav>
    );
}