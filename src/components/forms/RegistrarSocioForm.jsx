import { useState } from 'react';
import axios from 'axios';

function RegistrarSocioForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/socios', formData);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el socio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="nombre" className="form-label required">
          Nombre Completo
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="form-input"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          required
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dni" className="form-label required">
            DNI
          </label>
          <input
            type="number"
            id="dni"
            name="dni"
            className="form-input"
            value={formData.dni}
            onChange={handleChange}
            placeholder="Ej: 35123456"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@email.com"
            disabled={loading}
          />
        </div>
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
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </div>
    </form>
  );
}

export default RegistrarSocioForm;