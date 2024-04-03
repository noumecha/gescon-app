import React from "react";
import { useLocation } from "react-router-dom";

const PersonnelDetails = () => {
    
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    // Display detailed information about the personnel
    return (
        <div>
            <h2>Personnel Details</h2>
            <p>Matricule: {selectedPerson.matricule_personnel} </p>
            <p>Nom & Prenom: {selectedPerson.nom_prenom_personnel} </p>
            {/* Add other details as needed */}
        </div>
    );
};

export default PersonnelDetails;