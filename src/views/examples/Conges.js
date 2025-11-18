import { Container } from "reactstrap";
// custom compontents :
import CongesTable from "views/customs-components/CongesTable";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import CongesForm from "views/customs-components/CongesForm";
// useful functions
import { fetchDatas } from "utils/fetchDatas";
import useCongeState from "hooks/useCongeState";
// CRUDs functions
import { saveConge } from "utils/saveConge";
import { updateConge } from "utils/updateConge";

const Conges = () => {
  
  const {
    endDate, setEndDate, name, setName, telephone, setTelphone, typeConge, setTypeConge,
    startDate, setStartDate, matricule, setMatricule, type, setType,nb_jours_conges,setSelectedPerson,
    duration, setDuration, poste, setPoste, demande, setDemande, sexe, preposition, grade, id_personnel,
    conge, setConge, lastPermission, setLastPermission, error, setError, success, setSuccess,loadingText,
    visible, setVisible, search, setSearch, statutFilter, setStatutFilter, userConge, setUserConge,loadingSpinner,
    setLoadingSpinner, actived, setActived, status, setStatus, selectedPerson, repriseDate, setRepriseDate, selectedType,
    setSelectedType, selectedDec, setSelectedDec, struc, setStruc, document, setDocument, generateSuccess, setGenerateSuccess
  } = useCongeState();

  const [action, setAction] = useState("create");
  const [personnel, setPersonnel] = useState([]);
  const [congeToEdit, setCongeToEdit] = useState(null);

  // conge CRUD handlers
  const handleSaveConge = () => {
    saveConge(
      selectedPerson,selectedType,typeConge,name,startDate,endDate,duration,setDuration,
      repriseDate,matricule,type,selectedDec,struc,poste,userConge,lastPermission,setError,sexe,nb_jours_conges,
      setSuccess,setActived,grade,demande,preposition,setStatus,document
    )
  }

  const handleUpdateConge = () => {
    updateConge(
      congeToEdit, duration, setError, startDate, typeConge, personnel, setSuccess, endDate, repriseDate, setStatus,
      demande, document, setDuration
    );
  }

  //
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  
  const handleStatutFilter = (e) => {
    setStatutFilter(e.target.value);
  }
  const onDismiss = () => setVisible(false)

  const handleFilterChange = (setState) => (selectedOption) => {
    setState(selectedOption);
  };

  const handleInputChange = (setStateFunction) => (e) => {
    setStateFunction(e.target.value);
  };

  const handleFileChange = (setStateFunction) => (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64 = reader.result;
        setStateFunction(base64);
    }
    reader.readAsDataURL(file);
  }

  const saveAttestationRepConge = async (c) => {
    try {
      c.attestation_conge = JSON.stringify(c.attestation_conge);
      c.attestation_conge = JSON.parse(c.attestation_conge);
      const attestation_reprise = {
        name: c.attestation_conge.name,
        matricule: c.attestation_conge.matricule,
        sexe: c.attestation_conge.sexe,
        poste: c.attestation_conge.poste,
        type: c.attestation_conge.type,
        decision: c.attestation_conge.decision,
        duration: c.attestation_conge.duration,
        structure: c.attestation_conge.structure,
        startDate: c.attestation_conge.startDate,
        endDate: c.attestation_conge.endDate,
        repriseDate: c.attestation_conge.repriseDate,
        typeConge: c.attestation_conge.typeConge,
        preposition : c.attestation_conge.preposition,
        grade : c.attestation_conge.grade,
        created_at : new Date().toISOString().slice(0,19).replace('T',' ')
      }
      const created_at_att_rep_conge = new Date().toISOString().slice(0,19).replace('T',' ');
      const req = `UPDATE conge SET created_at_reprise_service = "${created_at_att_rep_conge}",attestation_reprise_service='${JSON.stringify(attestation_reprise)}',statut_att_rep_conge="non archivé" WHERE ${c.id_conge}=conge.id_conge`; 
      window.electronAPI.addArchiveAttestationRepConge(req);
      await window.electronAPI.addArchiveAttCongeRepSuccess((event, res) => {
        setGenerateSuccess("Attestation de reprise générer avec succès");
      });
      setTimeout(() => {
        setGenerateSuccess("");
      }, 3000)
      setActived(true);
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
  }

  // refresh the conges table
  const handleRefresh = () => {
    try {
      setLoadingSpinner(true);
      setTimeout(() =>
      setLoadingSpinner(false)
      , 3000);
      fetchDatas(setConge, setLoadingSpinner, setSelectedDec, setTypeConge, setLastPermission, selectedPerson, id_personnel);
    } catch (err) {
      console.error("error on refresh : " + err.message);
    }
  }

  // edit specific conge :
  const handleEditConge = (congeToEdit) => {
    setName(congeToEdit.nom_prenom_personnel);
    setMatricule(congeToEdit.matricule_personnel);
    const start_date = new Date(congeToEdit.date_debut_conge);
    start_date.setDate(start_date.getDate() + parseInt(1));
    setStartDate(start_date.toISOString().split("T")[0]);
    setDuration(congeToEdit.duree_conge);
    setSelectedType(congeToEdit.libelle_type_conge);
    setPoste(congeToEdit.poste_personnel);
    setType(congeToEdit.attestation_conge.type);
    setStruc(congeToEdit.structure_personnel);
    // Set selected type for editing (must be object)
    setSelectedType({
      value: congeToEdit.attestation_conge.typeConge,
      label: congeToEdit.attestation_conge.typeConge
    });
    setTypeConge([
      {
        libelle_type_conge: congeToEdit.attestation_conge.typeConge,
        value: congeToEdit.attestation_conge.typeConge,
        label: congeToEdit.attestation_conge.typeConge
      }
    ]);
    setActived(true);
    setAction("update");
    setCongeToEdit(congeToEdit);
    getSpecificPersonnel(congeToEdit.id_personnel);
    setStatus("Mofification du "+ congeToEdit.attestation_conge.typeConge + " de " + congeToEdit.nom_prenom_personnel);
  };

  // useEffect change duration
  useEffect(() =>  {
    const changeDuration = () => {
      if (selectedPerson && selectedType === "congé maternité" && selectedPerson.sexe_personnel !== "M") {
        setDuration("98");
      }
      if (selectedPerson && selectedType === "congé paternité" && selectedPerson.sexe_personnel === "M") {
        setDuration("3");
      }
      if (selectedPerson && selectedType === "congé mariage") {
        setDuration("5");
      }
      if (selectedPerson && selectedType === "congé maladie") {
        setDuration("90");
      }
      if (selectedPerson && selectedType === "congé décès") {
        setDuration("3");
      }
    };
    changeDuration();
  },[selectedPerson, selectedType])

  // useEffect changing libelle : {typeConge.map((t) => ({ value: t.libelle_type_conge, label: t.libelle_type_conge }))}
  useEffect(() => {
    // changer congé maternité en paternité si la personne est de sexe masculin (M)
    setTypeConge((prevTypes) =>
      prevTypes.map((t) => {
        console.log("type", t)
        console.log("sexe", selectedPerson?.sexe_personnel)
        if (t.libelle_type_conge === "congé maternité" && selectedPerson?.sexe_personnel === "M") {
          return {
            ...t,
            libelle_type_conge: "congé paternité"
          };
        }

        // si la personne est féminine, on remet l’original
        if (t.libelle_type_conge === "congé paternité" && selectedPerson?.sexe_personnel === "F") {
          return {
            ...t,
            libelle_type_conge: "congé maternité"
          };
        }

        return t;
      })
    );
  }, [selectedPerson]);

  // useEffect for calculate the end conge date base on the start date and duration
  useEffect(() => {
    const calculateEndDate = () => {
      if (startDate && duration) {
        if (selectedPerson && selectedPerson.id_type_personnel === 2 && (selectedType?.value === "congé administratif")) {
          let st = new Date(startDate);
          let weekdaysToAdd = duration - 1;
          while (weekdaysToAdd > 0) {
            st.setDate(st.getDate() + parseInt(1));
            if (st.getDay() !== 0 && st.getDay() !== 6) {
              weekdaysToAdd--;
            }
          }
          let next_day = new Date(st);
          let rep = new Date(st);
          next_day.setDate(next_day.getDate() + parseInt(1));
          if (next_day.getDay() === 0 || next_day.getDay() === 6) {
            rep.setDate(st.getDate() + parseInt(3));
          } else {
            rep.setDate(st.getDate() + parseInt(1));
          }
          setEndDate(st.toISOString().split("T")[0]);
          setRepriseDate(rep.toISOString().split("T")[0]);
        } else {
          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + parseInt(duration - 1));
          setEndDate(end.toISOString().split("T")[0]);
          const repDate = new Date(end);
          repDate.setDate(end.getDate() + parseInt(1));
          setRepriseDate(repDate.toISOString().split("T")[0]);
        }
      }
    };
    calculateEndDate();
  }, [startDate, duration, selectedType, selectedPerson?.id_type_personnel]);

  /** useEffect for updating personnel and congé base on some state of current date */
  useEffect(() => {
    const updatePersonnelState = async () => {
      try {
      //const statut = currrent date >= conge_data.startDate && currrent date <= conge_data.endDate ? "en congé" : "en poste";
      if (conge.length > 0) {
        let date = new Date();
        for (let x = 0; x < conge.length; x++) {
          conge[x].attestation_conge = JSON.parse(conge[x].attestation_conge);
          conge[x].attestation_conge.repriseDate = conge[x].attestation_conge.repriseDate.split('/');
          conge[x].attestation_conge.repriseDate = new Date(conge[x].attestation_conge.repriseDate[2], conge[x].attestation_conge.repriseDate[1], conge[x].attestation_conge.repriseDate[0]);
          if (date >= conge[x].date_debut_conge && date <= conge[x].date_fin_conge) {
            const statut = "en congé";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
          }
          if ((date.getDate() === conge[x].date_fin_conge.getDate() && date.getMonth() === conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear())) {
            const statut_conge = "terminé";
            const req_conge = `UPDATE conge SET statut_conge = "${statut_conge}" WHERE id_conge = ${conge[x].id_conge}`;
            window.electronAPI.addConge(req_conge);
          }
          if (date.getMonth() > conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear()) {
            const statut_conge = "terminé";
            const req_conge = `UPDATE conge SET statut_conge = "${statut_conge}" WHERE id_conge = ${conge[x].id_conge}`;
            window.electronAPI.addConge(req_conge);
          }
          if (date.getDate() === conge[x].attestation_conge.repriseDate.getDate() && date.getMonth() === conge[x].attestation_conge.repriseDate.getMonth() && date.getFullYear() === conge[x].attestation_conge.repriseDate.getFullYear()) {
            const statut = "en poste";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
          }
          if (date.getMonth() > conge[x].attestation_conge.repriseDate.getMonth() && date.getFullYear() === conge[x].attestation_conge.repriseDate.getFullYear()) {
            const statut = "en poste";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
          }
          setTimeout(() => { setSuccess(""); }, 3000)
        }
      }
      } catch (err) {
        console.error("Erreur : " + err.message);
      }
    }
    updatePersonnelState()
  }, [conge]);

  // useEffect for getting conge for a specific user
  useEffect(() => {
    const getSpecificConge = async () => {
      try {
        const specific_conge_query = `SELECT * FROM conge WHERE id_personnel = ${id_personnel} ORDER BY id_conge DESC`;
        window.electronAPI.getSpecificConge(specific_conge_query);
        await window.electronAPI.retrieveSpecificConge((event, res) => {
          for (let index = 0; index < res.length; index++) {
            res[index].attestation_conge = JSON.parse(res[index].attestation_conge)
          }
          setUserConge(res);
        })
      } catch (error) {
        console.error("Erreur : " + error.message);
      }
    }
    getSpecificConge();
    fetchDatas(setConge, setLoadingSpinner, setSelectedDec, setTypeConge, setLastPermission, selectedPerson, id_personnel);
  },[id_personnel, selectedPerson]);

  // useEffect for getting specific personnel data
  const getSpecificPersonnel = (personnelId) => {
    try {
      const personnel_query = `SELECT * FROM personnel WHERE id_personnel = ${personnelId}`;
      window.electronAPI.getData(personnel_query);
      window.electronAPI.retrieveSpecificData((event, res) => {
        setPersonnel(res);
        if (Array.isArray(res) && res.length > 0) {
          setSelectedPerson(res[0]);
        }
      });
    } catch (error) {
      console.error("Erreur : " + error.message);
    }
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
          <CongesForm
            name={name}
            status={status}
            visible={visible}
            onDismiss={onDismiss}
            setName={setName}
            setTelphone={setTelphone}
            telephone={telephone}
            matricule={matricule}
            setMatricule={setMatricule}
            poste={poste}
            setPoste={setPoste}
            type={type}
            setType={setType}
            struc={struc}
            setStruc={setStruc}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            typeConge={typeConge}
            handleFileChange={handleFileChange}
            setDemande={setDemande}
            setDocument={setDocument}
            handleInputChange={handleInputChange}
            handleFilterChange={handleFilterChange}
            setStartDate={setStartDate}
            startDate={startDate}
            duration={duration}
            setDuration={setDuration}
            endDate={endDate}
            selectedDec={selectedDec}
            error={error}
            success={success}
            buttonClass={action && action === "update" ? "success" : "primary"}
            buttonText={action && action === "update" ? "Mettre à jour l'attestation" : "Générer l'attestion"}
            saveConge={action && action === "update" ? handleUpdateConge : handleSaveConge}
            actived={actived}
          />
          <CongesTable
            loadingText={loadingText}
            saveAttestationRepConge={saveAttestationRepConge}
            handleStatutFilter={handleStatutFilter}
            statutFilter={statutFilter}
            handleSearch={handleSearch}
            setSuccess={setSuccess}
            setError={setError}
            setStatus={setStatus}
            search={search}
            generateSuccess={generateSuccess}
            handleRefresh={handleRefresh}
            loadingSpinner={loadingSpinner}
            conge={conge}
            handleEditConge={handleEditConge}
          />
      </Container>
    </>
  );
};

export default Conges;