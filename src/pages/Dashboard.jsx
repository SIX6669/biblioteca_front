import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Modal from '../components/common/Modal';
import RegistrarSocioForm from '../components/forms/RegistrarSocioForm';
import RealizarPrestamoForm from '../components/forms/RealizarPrestamoForm';
import GestionarDevolucionForm from '../components/forms/GestionarDevolucionForm';
import ListarLibrosModal from '../components/lists/ListarLibrosModal';
import ListarSociosModal from '../components/lists/ListarSociosModal';
import ListarMultasModal from '../components/lists/ListarMultasModal';
import PrestamosActivosModal from '../components/lists/PrestamosActivosModal';
import PrestamosVencidosModal from '../components/lists/PrestamosVencidosModal';
import GestionarEjemplaresModal from '../components/lists/GestionarEjemplaresModal';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Estados para los modales principales
  const [modalRegistrarSocio, setModalRegistrarSocio] = useState(false);
  const [modalRealizarPrestamo, setModalRealizarPrestamo] = useState(false);
  const [modalGestionarDevolucion, setModalGestionarDevolucion] = useState(false);
  
  // Estados para los modales secundarios
  const [modalListarLibros, setModalListarLibros] = useState(false);
  const [modalListarSocios, setModalListarSocios] = useState(false);
  const [modalListarMultas, setModalListarMultas] = useState(false);
  const [modalPrestamosActivos, setModalPrestamosActivos] = useState(false);
  const [modalPrestamosVencidos, setModalPrestamosVencidos] = useState(false);
  const [modalGestionarEjemplares, setModalGestionarEjemplares] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleSuccessRegistrarSocio = (data) => {
    setModalRegistrarSocio(false);
    setSuccessMessage(`Socio registrado exitosamente. Número de socio: ${data.id}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessRealizarPrestamo = (data) => {
    setModalRealizarPrestamo(false);
    setSuccessMessage('Préstamo registrado exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessGestionarDevolucion = (data) => {
    setModalGestionarDevolucion(false);
    setSuccessMessage(data.message || 'Devolución procesada exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessEjemplar = (data) => {
    setSuccessMessage(data.message || 'Estado actualizado exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Funciones principales
  const mainFunctions = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      title: 'Registrar Socio',
      description: 'Alta de nuevos socios',
      color: '#3b82f6',
      action: () => setModalRegistrarSocio(true)
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      title: 'Realizar Préstamo',
      description: 'Registrar préstamos',
      color: '#8b5cf6',
      action: () => setModalRealizarPrestamo(true)
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      title: 'Gestionar Devoluciones',
      description: 'Procesar devoluciones',
      color: '#10b981',
      action: () => setModalGestionarDevolucion(true)
    }
  ];

  // Funciones secundarias
  const secondaryFunctions = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      title: 'Libros',
      badge: 'Catálogo',
      action: () => setModalListarLibros(true)
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: 'Socios',
      badge: 'Listado',
      action: () => setModalListarSocios(true)
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: 'Multas',
      badge: 'Activas',
      action: () => setModalListarMultas(true)
    },
    {
      id: 4,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      title: 'Préstamos Activos',
      badge: 'En curso',
      action: () => setModalPrestamosActivos(true)
    },
    {
      id: 5,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: 'Ejemplares',
      badge: 'Gestión',
      action: () => setModalGestionarEjemplares(true)
    },
    {
      id: 6,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      title: 'Préstamos Vencidos',
      badge: 'Urgente',
      action: () => setModalPrestamosVencidos(true)
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h2>BiblioGest</h2>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="user-info">
            <p className="user-name">{user?.nombre || 'Usuario'}</p>
            <p className="user-role">Bibliotecario</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Inicio</span>
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-content">
            <div>
              <h1 className="page-title">Panel de Control</h1>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="dashboard-content">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="alert-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Tarjetas Principales */}
          <section className="operations-section">
            <h2 className="section-title">Opciones</h2>
            <div className="main-grid">
              {mainFunctions.map((func) => (
                <div
                  key={func.id}
                  className="operation-card"
                  onClick={func.action}
                  style={{'--card-color': func.color}}
                >
                  <div className="operation-icon" style={{background: func.color}}>
                    {func.icon}
                  </div>
                  <div className="operation-content">
                    <h3>{func.title}</h3>
                    <p>{func.description}</p>
                  </div>
                  <div className="operation-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accesos Rápidos */}
          <section className="quick-access-section">
            <h2 className="section-title">Registros</h2>
            <div className="quick-grid">
              {secondaryFunctions.map((func) => (
                <div
                  key={func.id}
                  className="quick-card"
                  onClick={func.action}
                >
                  <div className="quick-header">
                    <div className="quick-icon">
                      {func.icon}
                    </div>
                    <span className="quick-badge">{func.badge}</span>
                  </div>
                  <h4>{func.title}</h4>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2025 Desarrollado por Simón Perez</p>
        </footer>
      </main>

      {/* Modales Principales */}
      <Modal
        isOpen={modalRegistrarSocio}
        onClose={() => setModalRegistrarSocio(false)}
        title="Registrar Nuevo Socio"
        size="medium"
      >
        <RegistrarSocioForm
          onSuccess={handleSuccessRegistrarSocio}
          onCancel={() => setModalRegistrarSocio(false)}
        />
      </Modal>

      <Modal
        isOpen={modalRealizarPrestamo}
        onClose={() => setModalRealizarPrestamo(false)}
        title="Realizar Préstamo"
        size="medium"
      >
        <RealizarPrestamoForm
          onSuccess={handleSuccessRealizarPrestamo}
          onCancel={() => setModalRealizarPrestamo(false)}
        />
      </Modal>

      <Modal
        isOpen={modalGestionarDevolucion}
        onClose={() => setModalGestionarDevolucion(false)}
        title="Gestionar Devolución"
        size="large"
      >
        <GestionarDevolucionForm
          onSuccess={handleSuccessGestionarDevolucion}
          onCancel={() => setModalGestionarDevolucion(false)}
        />
      </Modal>

      {/* Modales Secundarios */}
      <Modal
        isOpen={modalListarLibros}
        onClose={() => setModalListarLibros(false)}
        title="Catálogo de Libros"
        size="large"
      >
        <ListarLibrosModal onClose={() => setModalListarLibros(false)} />
      </Modal>

      <Modal
        isOpen={modalListarSocios}
        onClose={() => setModalListarSocios(false)}
        title="Listado de Socios"
        size="large"
      >
        <ListarSociosModal onClose={() => setModalListarSocios(false)} />
      </Modal>

      <Modal
        isOpen={modalListarMultas}
        onClose={() => setModalListarMultas(false)}
        title="Listado de Multas"
        size="large"
      >
        <ListarMultasModal onClose={() => setModalListarMultas(false)} />
      </Modal>

      <Modal
        isOpen={modalPrestamosActivos}
        onClose={() => setModalPrestamosActivos(false)}
        title="Préstamos Activos"
        size="large"
      >
        <PrestamosActivosModal onClose={() => setModalPrestamosActivos(false)} />
      </Modal>

      <Modal
        isOpen={modalPrestamosVencidos}
        onClose={() => setModalPrestamosVencidos(false)}
        title="Préstamos Vencidos"
        size="large"
      >
        <PrestamosVencidosModal onClose={() => setModalPrestamosVencidos(false)} />
      </Modal>

      <Modal
        isOpen={modalGestionarEjemplares}
        onClose={() => setModalGestionarEjemplares(false)}
        title="Gestionar Ejemplares"
        size="large"
      >
        <GestionarEjemplaresModal 
          onClose={() => setModalGestionarEjemplares(false)}
          onSuccess={handleSuccessEjemplar}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;