const filterPersonnel = (datas, search, statutFilter, type) => {
    if (search !== "" || statutFilter !== "") {
        if (type === "conge") {
            return datas.filter(data => 
                data.statut_conge.includes(statutFilter) && (
                    data.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) 
                    || data.matricule_personnel.toLowerCase().includes(search.toLowerCase()))
            );
        } else {
            return datas.filter(data => 
                data.statut.includes(statutFilter) &&
                (data.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) || 
                 data.matricule_personnel.toLowerCase().includes(search.toLowerCase()))
            );
        }
        
    }
    return datas;
};

export default filterPersonnel;