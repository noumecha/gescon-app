/**
 * function to delete a conge
 * @param {Object} conge - The conge object to be deleted
 */
const deleteConge = (conge) => {
    try {
        console.log("deleteConge", conge);
    } catch (error) {
        console.log("Error when deleting conge : ", error);
    }
}

export { deleteConge }