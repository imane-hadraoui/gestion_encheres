import { createAction } from "@reduxjs/toolkit";
import React from "react";

// Tableau de styles Bootstrap
const cardStyles = [
  { bg: "bg-warning-subtle", text: "text-warning-emphasis" },
  { bg: "bg-success-subtle", text: "text-success-emphasis" },
  { bg: "bg-primary-subtle", text: "text-primary-emphasis" },
  { bg: "bg-info-subtle", text: "text-info-emphasis" },
  { bg: "bg-secondary-subtle", text: "text-secondary-emphasis" },
  { bg: "bg-danger-subtle", text: "text-danger-emphasis" },
  { bg: "bg-light-subtle", text: "text-secondary-emphasis" },
  { bg: "bg-danger bg-gradient bg-opacity-75", text: "text-light" },
];

export default function CategoriesModal({ data, isOpen, onClose, onSelect }) {
  // Si le modal n'est pas ouvert, on ne l'affiche pas
  if (!isOpen) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start pt-5"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1050,
          overflowY: "auto",
        }}
        onClick={onClose}
      >
        <div
          className="bg-white w-100 rounded-bottom shadow-lg p-4 mx-3"
          style={{ maxWidth: "1140px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-b">
            <h2 className="fw-bold text-dark m-0">Catégories</h2>
            <button
              type="button"
              className="btn-close fs-4 shadow-none"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Liste des catégories  */}
          <div className="row g-4">
            {data &&
              data?.map((cat, index) => {
                const style = cardStyles[index % cardStyles.length];
                return (
                  <div key={cat.id} className="col-12 col-md-6 col-lg-4">
                    {/* header div  */}
                    <div
                      className={`card ${style.bg} ${style.text} h-100 border-0 overflow-hidden position-relative shadow-sm`}
                      style={{
                        minHeight: "140px",
                        cursor: "pointer",
                        borderRadius: "12px",
                      }}
                      onClick={() => onSelect?.(cat)}
                    >
                      {/* div title  */}
                      <div
                        className="card-body d-flex align-items-center pe-5"
                        style={{ width: "65%", zIndex: 2 }}
                      >
                        <h5 className="card-title fw-bold m-0 lh-base">
                          {cat.nom}
                        </h5>
                      </div>

                      {/* div image */}
                      <div
                        className="position-absolute top-0 bottom-0 end-0 bg-white d-flex align-items-center justify-content-center"
                        style={{
                          width: "35%",
                          borderBottomLeftRadius: "100px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={`http://localhost:8000/storage/images/${cat.image}`}
                          alt={cat.nom}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
