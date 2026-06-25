import React, { useState, useEffect } from 'react';

export function CompteReste({ dateFinCalcule }) {
    const [tempsRestant, setTempsRestant] = useState("");

    useEffect(() => {

        const dateFin = new Date(dateFinCalcule).getTime();

        const calculerTemps = () => {
            const maintenant = new Date().getTime();
            const difference = dateFin - maintenant;

            if (difference <= 0) {
                setTempsRestant("Enchère terminée");
                return;
            }

            // Conversions de temps
            const secondes = Math.floor((difference / 1000) % 60);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const heures = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const jours = Math.floor(difference / (1000 * 60 * 60 * 24));

            // Application de vos règles d'affichage :
            if (jours >= 1) {
                // Plus de 24h restantes -> On affiche en Jours (ex: Il reste 2 jours)
                // On ajoute 1 pour inclure la journée en cours commencée
                const joursAffiches = jours + (heures > 0 ? 1 : 0);
                setTempsRestant(`Il reste ${joursAffiches} jours`);
            } else if (heures >= 1) {
                // Moins de 24h -> On affiche en heures (ex: Il reste 18 heures)
                setTempsRestant(`Il reste ${heures} heure${heures > 1 ? 's' : ''}`);
            } else if (minutes >= 1) {
                // Moins d'une heure -> On affiche en minutes
                setTempsRestant(`Il reste ${minutes} minute${minutes > 1 ? 's' : ''}`);
            } else {
                // Moins d'une minute -> On affiche en secondes
                setTempsRestant(`Il reste ${secondes} seconde${secondes > 1 ? 's' : ''}`);
            }
        };

        // Lancer immédiatement le calcul au montage
        calculerTemps();

        // Mettre à jour toutes les secondes pour le mode dynamique (minutes/secondes)
        const intervalle = setInterval(calculerTemps, 1000);

        return () => clearInterval(intervalle);
    }, [dateFinCalcule]);

    return <span>{tempsRestant}</span>;
}