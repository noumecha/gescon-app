function generateStatsFileName(statType, filter, safeDate, date) {
    let name = "fiche_des_statistiques_.pdf";
    if (statType?.value === "globales") {
        name = `fiche_des_statistiques_globales_${safeDate}_${date}.pdf`;
    }
    if (statType?.value === "structure") {
        name = `fiche_des_statistiques_${filter?.value || "structure"}_${safeDate}_${date}}.pdf`;
    }
    if (statType?.value === "personnel") {
        name = `fiche_des_statistiques_personnels_${safeDate}_${date}.pdf`;
    }

    return name;
}

export {generateStatsFileName};