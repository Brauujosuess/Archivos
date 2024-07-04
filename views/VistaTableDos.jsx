import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { Table,resetTable } from "../src/Componentes/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { FileExcelOutlined,DeleteOutlined,EditOutlined,UnorderedListOutlined  } from '@ant-design/icons';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
///---------><------///
const VistaTableDos = () => {
  const location = useLocation();
  const dataState = location.state;
 
  const handleUpdate = (data) => {
    console.log("Datos después de formatear la fecha:", data);
    navigate('/FormVistaDos', {
      state: {
        idPlano: dataState.idPlano,
        idPeriodo: dataState.idPeriodo,
        dataRecord: data
      }
    });
  };





  const handleDelete = async (idPlano) => {
 console.log("Eliminar registro con idPlano:", idPlano);
    const urlDelete = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/eliminar/plano/" + idPlano;
    const response = await fetch (urlDelete,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 
      }
    });
    const dataResponse = await response.json();
     console.log(dataResponse);
     if(!dataResponse.error){
      console.log("los datos se eliminaron correctamente");
      resetTable();
    }else{
      console.log("error",dataResponse.error);
    }
  };

  const navigate = useNavigate();
       
  const handleEdit = (idPlano) => {
    navigate('/tabletres', {state: {
      idPlano: idPlano,
      idPeriodo: dataState.idPeriodo
    }});
  };
  // const postApi = async () => {
  //   try {
  //     const response = await fetch('https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/actualizar/plano', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer'+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M'
  //       },
  //       body: JSON.stringify(JSON.stringify()),
  //     });
  //     if (!response.ok) {
  //       const errorInfo = await response.json();
  //       console.error('Error en la solicitud:', errorInfo);
  //     } else {
  //       const data = await response.json();
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.error('Error en la comunicación con la API:', error);
  //   }
  // };

  const columns = [
    {
      title: "nombre Plano",
      dataIndex: "nombrePlano",
      key: "nombrePlano",
    },
    {
      title: "kmz",
      dataIndex: "kmz",
      key: "kmz",
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
    const urlExcel = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/planos/" +  dataState.idPeriodo;
    
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
        XLSX.writeFile(wb, "planos.xlsx");
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
    <h1>Tabla de planos</h1>
      <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/FormVistaDos',{state: {idPeriodo: dataState.idPeriodo}})}>Agregar</Button>
      <Table columns={columns}  jsonButtons={jsonButtons} requireButtons={["excel", "reload"]} dataUrl ={"https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/lista/planos/" +  dataState.idPeriodo} rowKey="id" />
      <Button  style={{ marginTop: 16 }} onClick={() => navigate('/table')}>Regreso</Button>
    </>
  );
}

export default VistaTableDos;
