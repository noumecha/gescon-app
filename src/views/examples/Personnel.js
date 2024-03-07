/* eslint-disable no-unused-vars */
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState } from "react";
import * as XLSX from "xlsx";

const Personnel = () => {

    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [excelData, setExcelData] = useState(null);

    const handleFileSubmit = (e) => {
        e.preventDefault();
        if(excelFile!==null) {
            const workbook = XLSX.read(excelFile, {type: 'base64'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data.slice(0,10));
        } else {
            setTypeError("Veuillez selectionner un fichier Excel");
        }
    }

    const handleFile = (e) => {
        let fileTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ]
        let selectedFile = e.target.files[0];
        if(selectedFile) {
            if(selectedFile&&fileTypes.includes(selectedFile.type)){
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                }
            } else {
                setTypeError("Veuillez selectionner un fichier Excel");
                setExcelFile(null);
            }
        } else {
            console.log("Please select a file");
        }
    } 

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col">
                    <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                        <input type="file" className="form-control" required onChange={handleFile}/>
                        <button type="submit" className="mt-3 btn btn-primary btn-md">Importer le fichier</button>
                        {typeError&&(
                            <div className="mt-3 alert alert-danger" role="alert">
                                {typeError}
                            </div>
                        )}
                    </form>
                </div>
            </Row>
            <Row>
                <div className="col">
                    {excelData ? (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {Object.keys(excelData[0]).map((key) => (
                                            <th key={key}>
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((row, index) => (
                                        <tr key={index}>
                                            {Object.keys(row).map((key) => (
                                                <td key={key}>
                                                    {row[key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div> Aucun fichier importer </div>
                    )}
                </div>
            </Row>
        </Container>
      </>
    );  
}
export default Personnel;