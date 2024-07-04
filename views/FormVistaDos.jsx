import React, { useEffect } from "react";
import { ConstructorForm } from "../src/Componentes/ConstructorForm";
import { useLocation, useNavigate } from 'react-router-dom';

const FormvistaDos =()=>{

const navigate = useNavigate();
const location = useLocation();
 const dataState = location.state;
 console.log("los id son:", dataState);
   const data  = dataState.idPeriodo;

const handleFinish =(values) =>{

if(dataState.dataRecord && dataState.dataRecord.id){

   values.id = dataState.dataRecord.id;
   console.log(values);
     handlePut(values);
}else{
  const idPeriodo = data;
  console.log("idPeriodo",idPeriodo);
  values.idPeriodo = idPeriodo;
     console.log(values);
     handleOpenFinish(values);
    }
};

const handleOpenFinish = async (values) =>{
  console.log("los valores son:",values);
  const url = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/guardar/planos";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 
    },
    body: JSON.stringify(values)
  });
  const res = await response.json();
    console.log(res);
    navigate("/VistaTableDos", { state: { idPeriodo: values.idPeriodo } });

 if(!res.error){  
  console.log("los datos se agregaron con exito",res);  

 }else{
  console.log("error",res.error);

 }

}
///---------><------///
const handlePut = async (datos) => { 
  //agregar el idperiodo a datos
  datos.idPeriodo = dataState.idPeriodo;
  console.log("los datos:",datos);
  const url = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/actualizar/plano";
  const response = await fetch(url,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M'  
  },
  body: JSON.stringify(datos)
});
    
const dataResponse = await response.json();
console.log(dataResponse);

    if (!dataResponse.error) {
      console.log("Los datos se actualizaron correctamente");
      navigate("/VistaTableDos", { state: { idPeriodo: datos.idPeriodo } });
    } else {
      console.log("error", dataResponse.error);
    }
};

const jsonForm = {
    title: "",
    layout: "vertical",
    onFinish: handleFinish,
    id: "formNota",
    initialValues: {
   ...dataState.dataRecord,
    },
    elements: [
      {
        type: "text",
        row: 1,
        col: 0,
        propsForm: {
          label: "nombre Plano",
          name: "nombrePlano",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "",
        },
      },
      {
        type: "number",
        row: 2,
        col: 0,
        propsForm: {
          label: "kmz",
          name: "kmz",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "",
        },
      }
    ],
    buttons: [
      {
        type: "submit",
        text: "Agregar",
        propsElement: {
          className: "btnSubmit",
          type: "primary",
          style: {},
        },
      },
    ],
};




return(
<ConstructorForm jsonForm={jsonForm} />



);

}

export default FormvistaDos;