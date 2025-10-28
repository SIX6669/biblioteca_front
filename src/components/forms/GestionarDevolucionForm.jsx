import { useState, useEffect } from 'react';
import axios from 'axios';

function GestionarDevolucionForm({ onSuccess, onCancel }) {
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    id_prestamo: '',
    fecha_devolucion_real: new Date().toISOString().split('T')[0],
    estado_libro: 'bueno',
    multa_monto: '',
    multa_motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Cargar préstamos activos
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/prestamos/activos');
        setPrestamosActivos(response.data);
      } catch (err) {
        setError('Error al cargar los préstamos activos', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPrestamos();
  }, []);

  const handlePrestamoChange = (e) => {
    const id = e.target.value;
    setFormData(prev => ({ ...prev, id_prestamo: id }));
    
    const prestamo = prestamosActivos.find(p => p.id === parseInt(id));
    setPrestamoSeleccionado(prestamo);
    
    if (error) setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Registrar devolución
      await axios.put(
        `http://localhost:5000/api/prestamos/${formData.id_prestamo}/devolucion`,
        { fecha_devolucion_real: formData.fecha_devolucion_real }
      );

      // 2. Si el libro está dañado, registrar multa
      if (formData.estado_libro === 'dañado' && formData.multa_monto) {
        await axios.post('http://localhost:5000/api/multas', {
          id_socio: prestamoSeleccionado.id_socio,
          id_prestamo: formData.id_prestamo,
          monto: parseFloat(formData.multa_monto),
          motivo: formData.multa_motivo || 'Libro dañado'
        });
      }

      onSuccess({ message: 'Devolución registrada exitosamente' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la devolución');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando préstamos...</div>;
  }

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="id_prestamo" className="form-label required">
          Préstamo a Devolver
        </label>
        <select
          id="id_prestamo"
          name="id_prestamo"
          className="form-select"
          value={formData.id_prestamo}
          onChange={handlePrestamoChange}
          required
          disabled={loading}
        >
          <option value="">Seleccionar préstamo...</option>
          {prestamosActivos.map(prestamo => (
            <option key={prestamo.id} value={prestamo.id}>
              {prestamo.titulo} - {prestamo.nombre_socio} (Préstamo #{prestamo.id})
              {prestamo.dias_retraso > 0 && ` - VENCIDO (${prestamo.dias_retraso} días)`}
            </option>
          ))}
        </select>
        {prestamosActivos.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            No hay préstamos activos en este momento
          </p>
        )}
      </div>

      {prestamoSeleccionado && (
        <div style={{ 
          padding: '1rem', 
          background: 'var(--color-bg-light)', 
          borderRadius: 'var(--border-radius)',
          marginBottom: '0.5rem'
        }}>
          <p><strong>Libro:</strong> {prestamoSeleccionado.titulo}</p>
          <p><strong>Autor:</strong> {prestamoSeleccionado.autor}</p>
          <p><strong>Socio:</strong> {prestamoSeleccionado.nombre_socio}</p>
          <p><strong>Fecha de Préstamo:</strong> {new Date(prestamoSeleccionado.fecha_prestamo).toLocaleDateString()}</p>
          <p><strong>Fecha Estimada:</strong> {new Date(prestamoSeleccionado.fecha_devolucion_estimada).toLocaleDateString()}</p>
          {prestamoSeleccionado.dias_retraso > 0 && (
            <p style={{ color: 'var(--color-error)' }}>
              <strong>⚠️ Días de retraso:</strong> {prestamoSeleccionado.dias_retraso}
            </p>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fecha_devolucion_real" className="form-label required">
          Fecha de Devolución
        </label>
        <input
          type="date"
          id="fecha_devolucion_real"
          name="fecha_devolucion_real"
          className="form-input"
          value={formData.fecha_devolucion_real}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="estado_libro" className="form-label required">
          Estado del Libro
        </label>
        <select
          id="estado_libro"
          name="estado_libro"
          className="form-select"
          value={formData.estado_libro}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="bueno">Buen estado</option>
          <option value="dañado">Dañado (Requiere multa)</option>
        </select>
      </div>

      {formData.estado_libro === 'dañado' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="multa_monto" className="form-label required">
                Monto de la Multa ($)
              </label>
              <input
                type="number"
                id="multa_monto"
                name="multa_monto"
                className="form-input"
                value={formData.multa_monto}
                onChange={handleChange}
                placeholder="Ej: 500"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="multa_motivo" className="form-label">
                Motivo
              </label>
              <input
                type="text"
                id="multa_motivo"
                name="multa_motivo"
                className="form-input"
                value={formData.multa_motivo}
                onChange={handleChange}
                placeholder="Ej: Páginas rotas"
                disabled={loading}
              />
            </div>
          </div>
        </>
      )}

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
          disabled={loading || prestamosActivos.length === 0}
        >
          {loading ? 'Procesando...' : 'Registrar Devolución'}
        </button>
      </div>
    </form>
  );
}

export default GestionarDevolucionForm;