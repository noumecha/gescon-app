function generateStatsFileName(statType, filter, safeDate, date) {
    let name = "fiche_des_statistiques_.pdf";
    if (statType?.value === "globales") {
        name = `fiche_des_statistiques_globales_${safeDate}_${date}.pdf`;
    }
    if (statType?.value === "structure") {
        console.log(filter);
        // set the first element of the filter array as the value 
        let structure = filter[0]
        name = `fiche_des_statistiques_${structure?.value || "structure"}_${safeDate}_${date}}.pdf`;
    }
    if (statType?.value === "personnel") {
        name = `fiche_des_statistiques_personnels_${safeDate}_${date}.pdf`;
    }

    return name;
}

export {generateStatsFileName};