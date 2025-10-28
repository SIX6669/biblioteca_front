import { useState } from 'react';
import axios from 'axios';
import comprobanteService from '../../services/comprobanteService';

function RegistrarSocioForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socioRegistrado, setSocioRegistrado] = useState(null);

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
      const response = await axios.post('http://localhost:5000/api/socios', formData);
      console.log('=== DEBUG: Respuesta del servidor ===');
      console.log('Response completo:', response);
      console.log('Response.data:', response.data);
      console.log('Nombre:', response.data.nombre);
      console.log('DNI:', response.data.dni);
      console.log('====================================');
      
      const socioConFecha = {
        ...response.data,
        fecha_registro: response.data.fecha_registro || new Date().toISOString()
      };
      
      console.log('Socio con fecha:', socioConFecha);
      setSocioRegistrado(socioConFecha);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el socio');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarComprobante = () => {
    if (socioRegistrado) {
      try {
        comprobanteService.generarComprobanteSocio(socioRegistrado);
        alert('Comprobante generado exitosamente');
      } catch (error) {
        console.error('Error al generar comprobante:', error);
        alert('Error al generar el comprobante: ' + error.message);
      }
    }
  };

  const handleFinalizar = () => {
    if (socioRegistrado) {
      onSuccess(socioRegistrado);
    }
  };

  if (socioRegistrado) {
    return (
      <div className="success-screen">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h3 className="success-title">¡Socio Registrado Exitosamente!</h3>
        
        <div className="socio-info-box">
          <p><strong>Número de Socio:</strong> #{socioRegistrado.id}</p>
          {socioRegistrado.email && <p><strong>Email:</strong> {socioRegistrado.email}</p>}
        </div>

        <div className="comprobante-actions">
          <p className="info-text">
            📄 Puede generar un comprobante en PDF con los datos del socio
          </p>
          
          <button
            type="button"
            className="btn btn-comprobante"
            onClick={handleGenerarComprobante}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Descargar Comprobante PDF
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={handleFinalizar}>
            Finalizar
          </button>
        </div>

        <style>{`
          .success-screen {
            text-align: center;
            padding: 1rem 0;
          }
          .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.5s ease;
          }
          .success-icon svg {
            width: 48px;
            height: 48px;
            color: white;
            stroke-width: 3;
          }
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .success-title {
            color: #059669;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }
          .socio-info-box {
            background: #f0fdf4;
            border: 2px solid #86efac;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            text-align: left;
          }
          .socio-info-box p {
            margin: 0.5rem 0;
            font-size: 1rem;
            color: #166534;
          }
          .socio-info-box strong {
            font-weight: 600;
          }
          .comprobante-actions {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .info-text {
            margin: 0 0 1rem 0;
            color: #92400e;
            font-size: 0.95rem;
            font-weight: 500;
          }
          .btn-comprobante {
            width: 100%;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-center: center;
            gap: 0.75rem;
            transition: all 0.3s ease;
          }
          .btn-comprobante svg {
            width: 20px;
            height: 20px;
          }
          .btn-comprobante:hover {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(30, 58, 138, 0.3);
          }
          .modal-actions {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

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
          <label htmlFor="dni" className="form-label required">DNI</label>
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
          <label htmlFor="email" className="form-label">Email</label>
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
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </div>
    </form>
  );
}

export default RegistrarSocioForm;






