export const getPerson = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT * FROM personnel WHERE id_personnel = ${id}`;
            window.electronAPI.getData(query);
            window.electronAPI.retrieveSpecificData((event, res) => {
                resolve(res[0]);
            });
        } catch (error) {
            reject("Erreur : " + error.message);
        }
    });
};