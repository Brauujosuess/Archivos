   
// Importamos las librerías necesarias
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, resetTable} from "../src/Componentes/Table";
import dayjs from 'dayjs';
import { FileExcelOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const Tabletres = () => {

  const location = useLocation();
  const dataState = location.state;
  console.log(dataState)
  const navigate = useNavigate();
   
  const handleDelete = async (id) =>{
    console.log("Eliminar registro con id:", id);
    
    const urlDelete = 'https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/eliminar/documento/'+id;
    const response = await fetch(urlDelete,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 
    }
     
  })
  const dataResponse = await response.json();
  console.log(dataResponse);
  if(!dataResponse.error){
    console.log("los datos se eliminaron correctamente");
    resetTable();
  }else{
    console.log("error",dataResponse.error);
  }
  };


 const handleUpdate =  (data) =>{

  // data.fechaCarga = dayjs(data.fechaCarga);
  console.log("Datos después de formatear la fecha:", data);
  // const fechaCargaForm = dayjs(data.fechaCarga);
  // if (fechaCargaForm.isValid()) {
    // data.fechaCarga = fechaCargaForm.toISOString();
    // console.log("Datos después de formatear la fecha:", data);
      navigate('/formtres', {
        state: {
          idPlano: dataState.idPlano,
          idPeriodo: dataState.idPeriodo,
          dataRecord: data
        }
      });
      
    }
  

  const columns = [
    {
      title: "Nombre del Documento",
      dataIndex: "nombreDocumento",
      type: "text",
      key: "nombreDocumento",
    },
    {
      title: "pdf",
      dataIndex: "pdf",
      key: "pdf",
    },
    {
      title: "Autocad",
      dataIndex: "autocad",
      key: "autocad",
    },
    {
      title: "Cesionario",
      dataIndex: "cesionario",
      key: "cesionario",
    },
    {
      title: "Fecha de carga",
      dataIndex: "fechaCarga",
      key: "fechaCarga",
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: "Acciones",
      key: "acciones",

      render: (text, record) => (
        <Space size="middle">
          <Button type="primary"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}>
            actualizar
          </Button>
          <Button type="danger" 
          icon={<DeleteOutlined/>}
          onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
          
        </Space>
      ),
    },
  ];
   

  const excel = async () => {
    console.log("crear excel");
    const urlExcel = 'https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/documentos/' + dataState.idPlano;
    
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
        XLSX.writeFile(wb, "documentos.xlsx");
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




//   useEffect(() => {
// console.log(dayjs("2020-10-09")) ;
//  },[]);


  return (
    <>
     <h1>Documentos</h1>
      <Button
        type="primary"
        style={{ marginTop: 20, borderRadius: '8px', padding: '8px 16px' }}
        onClick={() => navigate('/formtres',{state: dataState})}>
        Agregar
      </Button>
      <Table columns={columns}  jsonButtons={jsonButtons} requireButtons={["excel", "reload"]} dataUrl={"https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/documentos/" + dataState.idPlano} rowKey="id" />
      <Button type="" style={{ marginTop: 16 }} onClick={() => navigate('/VistaTableDos',{state: {idPeriodo: dataState.idPeriodo}})}>Regreso</Button>
    </>
  );
};

export default Tabletres;