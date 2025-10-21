import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';

function ListarLibrosModal({ onClose }) {
  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/libros');
      setLibros(response.data);
      setFilteredLibros(response.data);
    } catch (err) {
      setError('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    let filtered = [...libros];

    if (filterValues.titulo) {
      filtered = filtered.filter(libro =>
        libro.titulo.toLowerCase().includes(filterValues.titulo.toLowerCase())
      );
    }

    if (filterValues.isbn) {
      filtered = filtered.filter(libro =>
        libro.isbn.includes(filterValues.isbn)
      );
    }

    setFilteredLibros(filtered);
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Título', field: 'titulo', width: 'auto' },
    { header: 'Autor', field: 'autor', width: 'auto' },
    { header: 'ISBN', field: 'isbn', width: '140px' },
    { 
      header: 'Año', 
      field: 'anio_publicacion',
      width: '80px',
      render: (row) => row.anio_publicacion || 'N/A'
    }
  ];

  const filters = [
    { field: 'titulo', label: 'Título', placeholder: 'Buscar por título...' },
    { field: 'isbn', label: 'ISBN', placeholder: 'Buscar por ISBN...' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando libros...</div>;
  }

  return (
    <div className="modal-list-content">
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
        Total: {filteredLibros.length} libros
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <Table
        columns={columns}
        data={filteredLibros}
        emptyMessage="No se encontraron libros"
      />

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ListarLibrosModal;