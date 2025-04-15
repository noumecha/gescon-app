import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatPersonnelName } from "utils/personnels-utils";

const useCongeState = () => {
    const location = useLocation();
    // recuperation des attributs d'un personnel depuis personnel.js
    const { selectedPerson } = location.state || {};
    const [userConge, setUserConge] = useState([]);
    const [lastPermission, setLastPermission] = useState([]);
    const [typeConge, setTypeConge] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [repriseDate, setRepriseDate] = useState("");
    const [selectedType, setSelectedType] = useState(typeConge.length > 0 ? typeConge[0].libelle_type_conge : "congé administratif");
    const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
    const preposition = selectedPerson ? selectedPerson.preposition_personnel : "au";
    const grade = selectedPerson ? selectedPerson.grade_personnel : "GRADE";
    const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
    const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
    const [selectedDec, setSelectedDec] = useState("");
    const [struc, setStruc] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
    const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
    const sexe = !selectedPerson ? "M" : selectedPerson.sexe_personnel ;
    const nb_jours_conges = selectedPerson ? selectedPerson.id_type_personnel === 1 ? selectedPerson.nb_jours_conges : selectedPerson.nb_jours_conges + selectedPerson.dette_conge : 18;
    const [telephone, setTelphone] = useState(selectedPerson ? selectedPerson.telephone_personnel : 696879475);
    const [demande, setDemande] = useState(null);
    const [document, setDocument] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [generateSuccess, setGenerateSuccess] = useState("");
    const [status, setStatus] = useState(`${formatPersonnelName(sexe, name)} a ${nb_jours_conges} ${nb_jours_conges > 1 ? "jours" : "jour"} de congés disponibles`);
    const [visible, setVisible] = useState(true);
    const [conge, setConge] = useState([]);
    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const id_personnel = selectedPerson ? selectedPerson.id_personnel : "1";
    const loadingText = "Aucune donnée dans la base de données";
    const [actived, setActived] = useState(selectedPerson === undefined ? true : false);
    const [duration, setDuration] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? selectedPerson.nb_jours_conges : selectedPerson.nb_jours_conges + selectedPerson.dette_conge : "");

    return {
        endDate, setEndDate, name, setName, telephone, setTelphone, typeConge, setTypeConge,
        startDate, setStartDate, matricule, setMatricule, type, setType, nb_jours_conges,
        duration, setDuration, poste, setPoste, demande, setDemande, sexe, preposition, grade, id_personnel,
        conge, setConge, lastPermission, setLastPermission, error, setError, success, setSuccess,loadingText,
        visible, setVisible, search, setSearch, statutFilter, setStatutFilter, pageNumber, setPageNumber,
        userConge, setUserConge, loadingSpinner, setLoadingSpinner, actived, setActived, status, setStatus, selectedPerson,
        repriseDate, setRepriseDate, selectedType, setSelectedType, selectedDec, setSelectedDec, struc, setStruc, document, setDocument,
        generateSuccess, setGenerateSuccess
    };
};

export default useCongeState;
