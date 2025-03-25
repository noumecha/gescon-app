import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePermissionState = () => {
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    
    const [endDate, setEndDate] = useState("");
    const [repDate, setRepDate] = useState("");
    const [name, setName] = useState(selectedPerson?.nom_prenom_personnel || "TCHUENTE");
    const [telephone, setTelephone] = useState(selectedPerson?.telephone_personnel || "653465348");
    const [startDate, setStartDate] = useState("");
    const [matricule, setMatricule] = useState(selectedPerson?.matricule_personnel || "XD3 566");
    const [type, setType] = useState(selectedPerson?.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle");
    const [structure, setStructure] = useState(selectedPerson?.structure_personnel || "Service Général");
    const [duration, setDuration] = useState("");
    const [poste, setPoste] = useState(selectedPerson?.poste_personnel || "Contrôleur");
    const [demande, setDemande] = useState(null);
    
    const sexe = selectedPerson?.sexe_personnel || "M";
    const preposition = selectedPerson?.preposition_personnel || "au";
    const grade = selectedPerson?.grade_personnel || "au";
    const id_personnel = selectedPerson?.id_personnel || "1";
    
    const [permission, setPermission] = useState([]);
    const [lastPermission, setLastPermission] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [visible, setVisible] = useState(true);
    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [userConge, setUserConge] = useState([]);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const [actived, setActived] = useState(selectedPerson === undefined);

    const nb_jours_permission = selectedPerson?.nb_jours_permission || 0;
    const [status, setStatus] = useState(
        nb_jours_permission === 0
            ? `Les nouvelles permissions de ${sexe === 'M' ? 'M.' : 'Mme'} ${name} seront déduites de ses jours de congés`
            : `${sexe === 'M' ? 'M.' : 'Mme'} ${name} a ${nb_jours_permission} ${nb_jours_permission > 1 ? "jours" : "jour"} de permission disponible`
    );

    return {
        endDate, setEndDate, repDate, setRepDate, name, setName, telephone, setTelephone,
        startDate, setStartDate, matricule, setMatricule, type, setType, structure, setStructure,
        duration, setDuration, poste, setPoste, demande, setDemande, sexe, preposition, grade, id_personnel,
        permission, setPermission, lastPermission, setLastPermission, error, setError, success, setSuccess,
        visible, setVisible, search, setSearch, statutFilter, setStatutFilter, pageNumber, setPageNumber,
        perPage, userConge, setUserConge, loadingSpinner, setLoadingSpinner, actived, setActived, status, setStatus, selectedPerson
    };
};

export default usePermissionState;
