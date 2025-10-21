import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';

function GestionarEjemplaresModal({ onClose, onSuccess }) {
  const [ejemplares, setEjemplares] = useState([]);
  const [filteredEjemplares, setFilteredEjemplares] = useState([]);
  const [selectedEjemplar, setSelectedEjemplar] = useState(null);
  const [newEstado, setNewEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEjemplares();
  }, []);

  const fetchEjemplares = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ejemplares');
      setEjemplares(response.data);
      setFilteredEjemplares(response.data);
    } catch (err) {
      setError('Error al cargar los ejemplares');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    let filtered = [...ejemplares];

    if (filterValues.titulo) {
      filtered = filtered.filter(ejemplar =>
        ejemplar.titulo.toLowerCase().includes(filterValues.titulo.toLowerCase())
      );
    }

    setFilteredEjemplares(filtered);
  };

  const handleSelectEjemplar = (ejemplar) => {
    setSelectedEjemplar(ejemplar);
    setNewEstado(ejemplar.estado);
  };

  const handleUpdateEstado = async () => {
    if (!selectedEjemplar) return;

    setSaving(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/ejemplares/${selectedEjemplar.id}`, {
        estado: newEstado,
        observaciones: selectedEjemplar.observaciones
      });

      // Actualizar lista
      await fetchEjemplares();
      
      setSelectedEjemplar(null);
      onSuccess && onSuccess({ message: 'Estado actualizado exitosamente' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el estado');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Libro', field: 'titulo', width: 'auto' },
    { header: 'Autor', field: 'autor', width: 'auto' },
    { header: 'ISBN', field: 'isbn', width: '140px' },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '150px',
      render: (row) => <span className={`status-badge status-${row.estado}`}>{row.estado.replace('_', ' ')}</span>
    }
  ];

  const filters = [
    { field: 'titulo', label: 'Título del Libro', placeholder: 'Buscar por título...' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando ejemplares...</div>;
  }

  return (
    <div className="modal-list-content">
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
        Total: {filteredEjemplares.length} ejemplares. Haz clic en un ejemplar para modificar su estado.
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <Table
        columns={columns}
        data={filteredEjemplares}
        onRowClick={handleSelectEjemplar}
        emptyMessage="No se encontraron ejemplares"
      />

      {/* Formulario de edición de estado */}
      {selectedEjemplar && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1.5rem', 
          background: 'var(--color-bg-light)', 
          borderRadius: 'var(--border-radius)',
          border: '2px solid var(--color-primary)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)' }}>
            Modificar Estado del Ejemplar
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0.25rem 0' }}><strong>Libro:</strong> {selectedEjemplar.titulo}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Ejemplar ID:</strong> {selectedEjemplar.id}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Estado actual:</strong> {selectedEjemplar.estado.replace('_', ' ')}</p>
          </div>

          <div className="form-group">
            <label htmlFor="nuevo_estado" className="form-label required">
              Nuevo Estado
            </label>
            <select
              id="nuevo_estado"
              className="form-select"
              value={newEstado}
              onChange={(e) => setNewEstado(e.target.value)}
              disabled={saving}
            >
              <option value="disponible">Disponible</option>
              <option value="prestado">Prestado</option>
              <option value="en_reparacion">En reparación</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateEstado}
              disabled={saving || newEstado === selectedEjemplar.estado}
            >
              {saving ? 'Actualizando...' : 'Actualizar Estado'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedEjemplar(null)}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="modal-actions" style={{ marginTop: selectedEjemplar ? '1rem' : '0' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default GestionarEjemplaresModal;