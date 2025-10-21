import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';

function PrestamosActivosModal({ onClose }) {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/prestamos/activos');
      setPrestamos(response.data);
      setFilteredPrestamos(response.data);
    } catch (err) {
      setError('Error al cargar los préstamos activos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    let filtered = [...prestamos];

    if (filterValues.titulo) {
      filtered = filtered.filter(prestamo =>
        prestamo.titulo.toLowerCase().includes(filterValues.titulo.toLowerCase())
      );
    }

    if (filterValues.nombre_socio) {
      filtered = filtered.filter(prestamo =>
        prestamo.nombre_socio.toLowerCase().includes(filterValues.nombre_socio.toLowerCase())
      );
    }

    setFilteredPrestamos(filtered);
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Libro', field: 'titulo', width: 'auto' },
    { header: 'Socio', field: 'nombre_socio', width: 'auto' },
    { 
      header: 'Fecha Préstamo', 
      field: 'fecha_prestamo',
      width: '130px',
      render: (row) => new Date(row.fecha_prestamo).toLocaleDateString()
    },
    { 
      header: 'Fecha Devolución', 
      field: 'fecha_devolucion_estimada',
      width: '150px',
      render: (row) => new Date(row.fecha_devolucion_estimada).toLocaleDateString()
    },
    { 
      header: 'Días Retraso', 
      field: 'dias_retraso',
      width: '120px',
      render: (row) => (
        <span style={{ color: row.dias_retraso > 0 ? 'var(--color-error)' : 'inherit' }}>
          {row.dias_retraso > 0 ? `+${row.dias_retraso}` : row.dias_retraso}
        </span>
      )
    }
  ];

  const filters = [
    { field: 'titulo', label: 'Título del Libro', placeholder: 'Buscar por título...' },
    { field: 'nombre_socio', label: 'Nombre del Socio', placeholder: 'Buscar por socio...' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando préstamos...</div>;
  }

  return (
    <div className="modal-list-content">
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
        Total: {filteredPrestamos.length} préstamos activos
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <Table
        columns={columns}
        data={filteredPrestamos}
        emptyMessage="No hay préstamos activos"
      />

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PrestamosActivosModal;