import React, { useState } from 'react';
import Home from './Home/Home';
import Sales from './Sales/Sales';
import NewProductForm from './NewProductForm/NewProductForm';
import './App.css';
import AddComboForm from './AddComboForm/AddComboForm';
import Dashboard from './Dashboard/Dashboard';


function App() {
  // Estado para almacenar la página actual seleccionada
  const [currentPage, setCurrentPage] = useState('home');

  // Función para cambiar la página actual cuando se selecciona un enlace del menú
  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

  // Renderiza el componente correspondiente según la página actual
  let currentContent;
  if (currentPage === 'home') {
    currentContent = <Home />;
  } else if (currentPage === 'sales') {
    currentContent = <Sales />;
  } else if(currentPage === 'newProduct'){
    currentContent = <NewProductForm />
  } else if(currentPage === 'addCombo'){
    currentContent = <AddComboForm />
  } else if(currentPage === 'dashboard'){
    currentContent = <Dashboard />
  }
  // Agrega más condiciones según sea necesario

  return (
    <div className="App">
      <header className="App-header">
        
        {/* Menú de navegación */}
        <nav className="menu">
          <ul>
            <li><a href="#" onClick={() => handleMenuClick('home')}>Inicio</a></li>
            <li><a href="#ventas" onClick={() => handleMenuClick('sales')}>Ventas</a></li>
            <li><a href='#dashboard' onClick={() => handleMenuClick('dashboard')}>Dashboard</a></li>
            <li><a href='#newProduct' onClick={() => handleMenuClick('newProduct')}>Productos</a></li>
            <li><a href='#addCombo' onClick={() => handleMenuClick('addCombo')}>Combos</a></li>
          </ul>
        </nav>
      </header>
      {/* Contenido de la aplicación */}
      {currentContent}
    </div>
  );
}

export default App;
