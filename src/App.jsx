import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VistaTableDos from '../views/VistaTableDos';
import VistaTabla from '../views/VistaTabla';
import Form from './Componentes/Form';
import FormvistaDos from '../views/FormVistaDos';
import Tabletres from '../views/TableVistaTres';
import FormTres from '../views/FormVistaTres';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/table' element={<VistaTabla />} />
        <Route path='/form' element={<Form/>} />
        <Route path='/VistaTableDos' element={< VistaTableDos/>} />
        <Route path='/FormVistaDos' element={<FormvistaDos/>} />
        <Route path='/tabletres' element={<Tabletres/>} />
        <Route path='/formtres' element={<FormTres/>} />
      </Routes>
    </Router>
  );
}

export default App;