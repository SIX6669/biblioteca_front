import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../../services/authService';

function RealizarPrestamoForm({ onSuccess, onCancel }) {
  const [socios, setSocios] = useState([]);
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id_socio: '',
    id_ejemplar: '',
    fecha_devolucion_estimada: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Cargar socios y ejemplares disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sociosRes, ejemplaresRes] = await Promise.all([
          axios.get('http://localhost:5000/api/socios'),
          axios.get('http://localhost:5000/api/ejemplares/disponibles')
        ]);
        setSocios(sociosRes.data);
        setEjemplaresDisponibles(ejemplaresRes.data);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Calcular fecha de devolución sugerida (15 días desde hoy)
  useEffect(() => {
    const today = new Date();
    const suggestedDate = new Date(today.setDate(today.getDate() + 15));
    const formattedDate = suggestedDate.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, fecha_devolucion_estimada: formattedDate }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const bibliotecario = authService.getCurrentUser();
      const prestamoData = {
        ...formData,
        id_bibliotecario: bibliotecario.id
      };

      const response = await axios.post('http://localhost:5000/api/prestamos', prestamoData);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</div>;
  }

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="id_socio" className="form-label required">
          Socio
        </label>
        <select
          id="id_socio"
          name="id_socio"
          className="form-select"
          value={formData.id_socio}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Seleccionar socio...</option>
          {socios.map(socio => (
            <option key={socio.id} value={socio.id}>
              {socio.nombre} (DNI: {socio.dni}) - Socio #{socio.id}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="id_ejemplar" className="form-label required">
          Libro (Ejemplar)
        </label>
        <select
          id="id_ejemplar"
          name="id_ejemplar"
          className="form-select"
          value={formData.id_ejemplar}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Seleccionar libro...</option>
          {ejemplaresDisponibles.map(ejemplar => (
            <option key={ejemplar.id} value={ejemplar.id}>
              {ejemplar.titulo} - {ejemplar.autor} (Ejemplar #{ejemplar.id})
            </option>
          ))}
        </select>
        {ejemplaresDisponibles.length === 0 && (
          <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            No hay ejemplares disponibles en este momento
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="fecha_devolucion_estimada" className="form-label required">
          Fecha de Devolución Estimada
        </label>
        <input
          type="date"
          id="fecha_devolucion_estimada"
          name="fecha_devolucion_estimada"
          className="form-input"
          value={formData.fecha_devolucion_estimada}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
          disabled={loading}
        />
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Se sugiere 15 días desde hoy
        </small>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || ejemplaresDisponibles.length === 0}
        >
          {loading ? 'Registrando...' : 'Registrar Préstamo'}
        </button>
      </div>
    </form>
  );
}

export default RealizarPrestamoForm;