import React, { useState, useEffect } from "react";
import { Alert, Button, Space } from "antd";
import {  useNavigate } from "react-router-dom";
import { Table,resetTable} from "../src/Componentes/Table";
import { FileExcelOutlined,DeleteOutlined,EditOutlined,UnorderedListOutlined  } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const VistaTabla = () => {

  const navigate = useNavigate();

  const handleEdit = (idPeriodo) => {
    // console.log("id_usuario es", id);
    console.log("id es:", idPeriodo);
    navigate(`/VistaTableDos`,{ state: {idPeriodo: idPeriodo}});
  
  }

  const handleDelete = async (idPeriodo) => {
    console.log("Eliminar registro con idPeriodo:", idPeriodo);
    const urlDelete = 'https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/eliminar/periodo/'+idPeriodo;
   const response =  await fetch(urlDelete,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 
    }
   });
   const dataResponse = await response.json();
    console.log(dataResponse.mensaje);
   console.log(dataResponse);
   if(!dataResponse.error){
    console.log("los datos se eliminaron correctamente");
    resetTable();
    
  }else{
    console.log("error",dataResponse.error);
  }
  };
  
  const handlePut = async (datos)=>{
   console.log("los datos son:",datos);  
   navigate('/form',{state: {dataRecord: datos}});
  }




  const columns = [
    {
      title: "año",
      dataIndex: "anio",
      key: "anio",
    },
    {
      title: "fecha Vigencia",
      dataIndex: "fechaVigencia",
      key: "fechaVigencia",
    },
    {
      title: "fautorizacion DGP",
      dataIndex: "fAutorizacionDGP",
      key: "fAutorizacionDGP",
    },
    {
      title: "PublicacionDOF",
      dataIndex: "fPublicacionDOF",
      key: "fPublicacionDOF",
    },
    {
      title: "liga DOF",
      dataIndex: "ligaDOF",
      key: "ligaDOF",
    },
    {
      title: "arcuerdo Consejo PDF",
      dataIndex: "arcuerdoConsejoPDF",
      key: "arcuerdoConsejoPDF",
    },
    {
      title: "fautorizacion DGP",
      dataIndex: "fAutorizacionDGP",
      key: "fAutorizacionDGP",
    },
    {
      title: "pmdp Sellado PDF",
      dataIndex: "pmdpSelladoPDF",
      key: "pmdpSelladoPDF",
    },
    {
      title: "pmdp Editable Word",
      dataIndex: "pmdpEditableWord",
      key: "pmdpEditableWord",
    },
    {
      title: "Acciones",
      key: "acciones",
      
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" 
          icon={<UnorderedListOutlined />}
          onClick={() => handleEdit(record.id)}>
            Editar
          </Button>
          <Button type="delete"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
          <Button type="danger"
          icon={< EditOutlined/>}
          onClick={() => handlePut(record)}>
          Actualizar
          </Button>
        </Space>
      ),
    },
  ];
 
 
  const excel = async () => {
    console.log("crear excel");
    const urlExcel = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/periodos";
    
    try {
      const response = await fetch(urlExcel, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 

        },
      });
      
      if (response.ok) {
        const dataResponse = await response.json();
        const ws = XLSX.utils.json_to_sheet(dataResponse.datos );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "periodos.xlsx");
      } else {
        console.error('Error al obtener datos:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  

  const jsonButtons=[
    {
        key: "excel",
        type: "button",
        icon: <FileExcelOutlined />,
        text: "Recargar tabla",
        onClick: excel
    }
   ]

  return (
    <>
    <h1>Tabla de Periodos</h1>
          <Button type="primary" style={{ marginTop:16}} onClick={() => navigate('/form')}>Agregar</Button>
    <Table  jsonButtons={jsonButtons} requireButtons={["excel", "reload"]} dataUrl="https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/periodos" columns={columns} />

    </>
    
  );
};

export default VistaTabla;
