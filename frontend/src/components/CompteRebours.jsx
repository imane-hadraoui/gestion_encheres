import { useEffect, useState } from "react";
import "./CompteRebours.css";

export function CompteRebours({ dateFin, onTermine }) {
    const calculer = () => {
        const difference = new Date(dateFin).getTime() - Date.now();
        if (difference <= 0) return null;
        return {
            jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
            heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            secondes: Math.floor((difference / 1000) % 60),
            total: difference,
        };
    };

    const [temps, setTemps] = useState(calculer);

    useEffect(() => {
        const intervalle = setInterval(() => setTemps(calculer()), 1000);
        return () => clearInterval(intervalle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFin]);

    // Prévient le parent lorsque le temps est écoulé
    useEffect(() => {
        if (!temps && onTermine) onTermine();
    }, [temps, onTermine]);

    if (!temps) {
        return (
            <span className="badge bg-secondary fs-6">Enchère terminée</span>
        );
    }

    const urgent = temps.total < 1000 * 60 * 60; // moins d'une heure

    const segments = [
        { label: "Jours", value: temps.jours },
        { label: "Heures", value: temps.heures },
        { label: "Min", value: temps.minutes },
        { label: "Sec", value: temps.secondes },
    ];

    return (
        <div className={`compte-rebours ${urgent ? "urgent" : ""}`}>
            {segments.map((segment) => (
                <div className="cr-segment" key={segment.label}>
                    <div className="cr-box">
                        {/* La clé force le remontage à chaque changement -> rejoue l'animation */}
                        <span className="cr-value" key={segment.value}>
                            {String(segment.value).padStart(2, "0")}
                        </span>
                    </div>
                    <div className="cr-label">{segment.label}</div>
                </div>
            ))}
        </div>
    );
}
