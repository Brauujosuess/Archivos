import React from "react";
import { ConstructorForm } from "./ConstructorForm";
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import { IoHandLeft } from "react-icons/io5";

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dataState = location.state;
  console.log(" es:", dataState);

  const handleFinish = async (values) => {
    if (dataState && dataState.dataRecord && dataState.dataRecord.id) {
      values.id = dataState.dataRecord.id;
      handlePut(values);
    } else {
      console.log(values);
      const url = 'https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/guardar/periodo';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 

        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate('/table');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    }
  };

  const handlePut = async (data) => {
    console.log("los Datos: ", data);
    const url = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/actualizar/periodo";
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 

      },
      body: JSON.stringify(data)
    });

    const dataResponse = await response.json();
    console.log(dataResponse);
    if (!dataResponse.error) {
      console.log("los datos se actualizaron correctamente");
      navigate('/table');
    } else {
      console.log("error", dataResponse.error);
    }
  }

  const jsonForm = {
    title: "",
    layout: "vertical",
    onFinish: handleFinish,
    id_usuario: "formNota",
    initialValues: {
      ...dataState?.dataRecord,
      fechaVigencia: dataState?.dataRecord ? dayjs(dataState.dataRecord.fechaVigencia) : null,
      fAutorizacionDGP: dataState?.dataRecord ? dayjs(dataState.dataRecord.fAutorizacionDGP) : null,
      fPublicacionDOF: dataState?.dataRecord ? dayjs(dataState.dataRecord.fPublicacionDOF) : null,
    },
    elements: [
      {
        type: "text",
        row: 1,
        col: 0,
        propsForm: {
          label: "año",
          name: "anio",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "ingresa un año",
        },
      },
      {
        type: "dateTime",
        row: 2,
        col: 0,
        propsForm: {
          label: "fecha Vigencia",
          name: "fechaVigencia",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "ingresa una vigencia",
        },
      },
      {
        type: "dateTime",
        row: 3,
        col: 0,
        propsForm: {
          label: "Fecha Autorizacion DGP",
          name: "fAutorizacionDGP",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "agrega una  fecha de autorizacion",
        },
      },
      {
        type: "dateTime",
        row: 4,
        col: 0,
        propsForm: {
          label: "Fecha Publicacion DOF",
          name: "fPublicacionDOF",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "agrega una fecha de publicacion",
        },
      },
      {
        type: "text",
        row: 5,
        col: 0,
        propsForm: {
          label: "liga DOF",
          name: "ligaDOF",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "agrega la liga del DOF",
        },
      },
      {
        type: "number",
        row: 6,
        col: 0,
        propsForm: {
          label: "arcuerdo Consejo PDF",
          name: "arcuerdoConsejoPDF",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "agrega el acuerdo del consejo en PDF",
        },
      },
      {
        type: "number",
        row: 7,
        col: 0,
        propsForm: {
          label: "pmdp Sellado PDF",
          name: "pmdpSelladoPDF",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: "agrega el pmdp sellado en PDF",
        },
      },
      {
        type: "number",
        row: 8,
        col: 0,
        propsForm: {
          label: "pmdp Editable Word",
          name: "pmdpEditableWord",
          rules: [
            {
              required: true,
              message: "Por favor rellenar campo",
            },
          ],
        },
        propsElement: {
          placeholder: " agrega el pmdp editable en word",
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

  return <ConstructorForm jsonForm={jsonForm} />;
};

export default Form;
