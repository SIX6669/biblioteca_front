import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';
import '../../styles/ListarMultasModal.css';

function ListarMultasModal({ onClose }) {
  const [multas, setMultas] = useState([]);
  const [filteredMultas, setFilteredMultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMulta, setSelectedMulta] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchMultas();
  }, []);

  const fetchMultas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/multas');
      setMultas(response.data);
      setFilteredMultas(response.data);
    } catch (err) {
      setError('Error al cargar las multas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    let filtered = [...multas];

    if (filterValues.nombre_socio) {
      filtered = filtered.filter(multa =>
        multa.nombre_socio.toLowerCase().includes(filterValues.nombre_socio.toLowerCase())
      );
    }

    if (filterValues.estado && filterValues.estado !== 'todas') {
      filtered = filtered.filter(multa => multa.estado === filterValues.estado);
    }

    setFilteredMultas(filtered);
  };

  const handleRegistrarPago = (multa) => {
    setSelectedMulta(multa);
    setShowConfirmModal(true);
  };

  const confirmPago = async () => {
    setProcessingPayment(true);
    try {
      const fechaPago = new Date().toISOString().split('T')[0];
      
      await axios.put(`http://localhost:5000/api/multas/${selectedMulta.id}/pago`, {
        fecha_pago: fechaPago
      });

      // Actualizar el estado local
      const updatedMultas = multas.map(multa =>
        multa.id === selectedMulta.id
          ? { ...multa, estado: 'pagada', fecha_pago: fechaPago }
          : multa
      );
      
      setMultas(updatedMultas);
      
      // Aplicar filtros actuales a las multas actualizadas
      handleFilter(filteredMultas.reduce((acc, m) => {
        const filter = filters.find(f => f.field in acc);
        return acc;
      }, {}));
      
      setShowConfirmModal(false);
      setSelectedMulta(null);
      
      alert('Pago registrado exitosamente');
    } catch (err) {
      setError('Error al registrar el pago: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Socio', field: 'nombre_socio', width: 'auto' },
    { header: 'DNI', field: 'dni', width: '120px' },
    { 
      header: 'Monto', 
      field: 'monto', 
      width: '100px', 
      render: (row) => `$${parseFloat(row.monto).toFixed(2)}` 
    },
    { header: 'Motivo', field: 'motivo', width: 'auto' },
    { 
      header: 'Fecha', 
      field: 'fecha_multa',
      width: '120px',
      render: (row) => new Date(row.fecha_multa).toLocaleDateString('es-AR')
    },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '120px',
      render: (row) => (
        <span className={`status-badge status-${row.estado}`}>
          {row.estado === 'pagada' ? '✓ Pagada' : '⏳ Pendiente'}
        </span>
      )
    },
    {
      header: 'Acción',
      field: 'action',
      width: '130px',
      render: (row) => row.estado === 'pendiente' ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRegistrarPago(row);
          }}
          className="btn-pagar"
        >
          💳 Pagar
        </button>
      ) : (
        <span className="no-action">—</span>
      )
    }
  ];

  const filters = [
    { 
      field: 'nombre_socio', 
      label: 'Nombre del Socio', 
      placeholder: 'Buscar por nombre...',
      type: 'text'
    },
    {
      field: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'todas', label: 'Todas' },
        { value: 'pendiente', label: 'Pendientes' },
        { value: 'pagada', label: 'Pagadas' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-icon">⏳</div>
        <p>Cargando multas...</p>
      </div>
    );
  }

  const multasPendientes = filteredMultas.filter(m => m.estado === 'pendiente').length;
  const totalPendiente = filteredMultas
    .filter(m => m.estado === 'pendiente')
    .reduce((sum, m) => sum + parseFloat(m.monto), 0);

  return (
    <div className="modal-list-content">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="multas-summary">
        <div className="summary-card">
          <div className="summary-label">Total multas</div>
          <div className="summary-value">{filteredMultas.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Pendientes</div>
          <div className="summary-value warning">{multasPendientes}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total a cobrar</div>
          <div className="summary-value danger">${totalPendiente.toFixed(2)}</div>
        </div>
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <div className="table-wrapper">
        <Table
          columns={columns}
          data={filteredMultas}
          emptyMessage="No se encontraron multas"
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && selectedMulta && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-modal-title">💳 Confirmar Pago de Multa</h3>
            
            <div className="confirm-modal-details">
              <p><strong>Socio:</strong> {selectedMulta.nombre_socio}</p>
              <p><strong>DNI:</strong> {selectedMulta.dni}</p>
              <p><strong>Motivo:</strong> {selectedMulta.motivo}</p>
              <p className="confirm-modal-amount">
                <strong>Monto:</strong> ${parseFloat(selectedMulta.monto).toFixed(2)}
              </p>
            </div>

            <p className="confirm-modal-question">
              ¿Confirma que desea marcar esta multa como pagada?
            </p>

            <div className="confirm-modal-actions">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedMulta(null);
                }}
                disabled={processingPayment}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPago}
                disabled={processingPayment}
                className="btn btn-success"
              >
                {processingPayment ? '⏳ Procesando...' : '✓ Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarMultasModal;