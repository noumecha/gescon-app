export const personConge = async (personnel_id) => {
    try {
        const specific_conge_query = `SELECT * FROM conge WHERE id_personnel = ${personnel_id}`;
        window.electronAPI.getSpecificConge(specific_conge_query);
        await window.electronAPI.retrieveSpecificConge((event, res) => {
            for (let index = 0; index < res.length; index++) {
                res[index].attestation_conge = JSON.parse(res[index].attestation_conge)                                                
            }
            return res; 
        })
    } catch (error) {
        return "Erreur : " + error.message;
    }
}