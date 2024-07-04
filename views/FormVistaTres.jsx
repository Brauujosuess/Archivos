import React from "react";
import { ConstructorForm } from "../src/Componentes/ConstructorForm";
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const FormTres = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dataState = location.state;
  console.log("el idPlano es:", dataState);
  console.log(dataState)


  const handleFinish = (values) => {
    if (dataState.dataRecord && dataState.dataRecord.id) {
        values.id = dataState.dataRecord.id;
        handlePut(values);
    } else {
        console.log("values", values);
        const { idPlano, idPeriodo } = dataState;

        values.idPlano = idPlano;
        values.idPeriodo = idPeriodo;
        console.log(values);

        handleOpenFinish(values);
    }
};


  const handleOpenFinish = async (values) => {
    console.log("los valoresson: ", values);
    const url = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/guardar/documentos";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M'

      },
      body: JSON.stringify(values)
    });
    const dataResponse = await response.json();
    console.log(dataResponse);
    if (!dataResponse.error) {
      console.log("los datos se agregaron correctamente");
      navigate('/tabletres', { state: { idPeriodo: dataState.idPeriodo, idPlano: dataState.idPlano } });
    } else {
      console.log("error", dataResponse.error);
    }
  };

  const handlePut = async (data) => {
    data.fechaCarga = dayjs(data.fechaCarga).toISOString();

    data.idPlano = dataState.idPlano;

    console.log("Datos a actualizar son: ", data);
    const url = "https://pis-api-archivospmdp-qa.azurewebsites.net/api/v1/ArchivosPMDP/actualizar/documento";
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M'
        },
        body: JSON.stringify(data)
      });

      const dataResponse = await response.json();
      console.log("La respuesta es: ", dataResponse);

      if (!dataResponse.error) {
        console.log("Los datos se actualizaron correctamente");
        navigate('/tabletres', { state: { idPeriodo: dataState.idPeriodo, idPlano: dataState.idPlano } });
      } else {
        console.log("error", dataResponse.error);
      }
    } catch (error) {
      console.error("Error en la solicitud PUT:", error);
    }
  };


  const jsonForm = {
    title: "",
    layout: "vertical",
    onFinish: handleFinish,
    id: "formNota",
    initialValues: {
      ...dataState.dataRecord,
      fechaCarga: dataState.dataRecord ? dayjs(dataState.dataRecord.fechaCarga) : null
    },
    elements: [
      {
        type: "text",
        row: 1,
        col: 0,
        propsForm: {
          label: "Nombre del Documento",
          name: "nombreDocumento",
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
          label: "pdf",
          name: "pdf",
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
        row: 3,
        col: 0,
        propsForm: {
          label: "Autocad",
          name: "autocad",
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
        row: 4,
        col: 0,
        propsForm: {
          label: "Cesionario",
          name: "cesionario",
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
        type: "dateTime",
        row: 5,
        col: 0,
        propsForm: {
          label: "Fecha de Carga",
          name: "fechaCarga",
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



  return (
    <ConstructorForm jsonForm={jsonForm} />

  );
}
export default FormTres;