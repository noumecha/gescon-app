export const fetchDatas = async (setConge, setLoadingSpinner, setSelectedDec, setTypeConge, setLastPermission, selectedPerson, id_personnel) => {
    try {
      window.electronAPI.getConge();
      await window.electronAPI.retrieveConge((event, res) => {
        setConge(res);
        setTimeout(() => 
        setLoadingSpinner(false)
        , 3000);
      })
      window.electronAPI.getSpecificDec(selectedPerson ? selectedPerson.id_type_personnel : 1);
      await window.electronAPI.retrieveSpecificDec((event, res) => {
        const specific_dec = res;
        setSelectedDec(specific_dec[0].numero_decision);
      })
      window.electronAPI.getCongeType();
      await window.electronAPI.retrieveCongeType((event, res) => {
        setTypeConge(res);
      })
      const last_permission_req = `SELECT * FROM permission WHERE id_personnel = ${id_personnel}`;
      window.electronAPI.getLastPermission(last_permission_req);
      await window.electronAPI.retrieveLastPermission((event, res) => {        
          for (let index = 0; index < res.length; index++) {
              res[index].attestation_permission = JSON.parse(res[index].attestation_permission)                                                
          }
          setLastPermission(res);
      })
    } catch (error) {
        console.error("Erreur : " + error.message);
    }
}