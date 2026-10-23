import { useEffect, useState } from 'react';
import { supabase } from './config/supabase';

print("Componente del Dashboard de Compromisos Cargado");

void function App() {
  const [compromisos, setCompromisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Función para traer los datos desde el servidor de Supabase
  const obtenerCompromisos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('compromisos')
        .select('*')
        .order('fecha_vencimiento', { ascending: true });

      if (error) throw error;
      setCompromisos(data);
    } catch (error) {
      console.error('Error al obtener compromisos:', error.message);
    } finally {
      setCargando(false);
    }
  };

  // 2. Ejecutar la consulta automáticamente al abrir la página
  useEffect(() => {
    obtenerCompromisos();
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>📊 Panel de Control: Compromisos Administrativos, Fiscales y Operativos</h1>
      <p>Control de alertas sincronizado con el sistema de notificaciones de la empresa.</p>

      {cargando ? (
        <p>Cargando información del servidor...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Título / Obligación</th>
              <th>Tipo</th>
              <th>Fecha de Vencimiento</th>
              <th>Monto</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {compromisos.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.titulo}</strong><br/><small>{item.descripcion}</small></td>
                <td style={{ textTransform: 'capitalize' }}>{item.tipo}</td>
                <td>{item.fecha_vencimiento}</td>
                <td>{item.monto ? `$${item.monto}` : 'N/A'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 'bold',
                    backgroundColor: 
                      item.estatus === 'vencido' ? '#dc3545' : // Rojo para alertas urgentes de Python
                      item.estatus === 'pendiente' ? '#ffc107' : // Amarillo para pendientes
                      '#28a745' // Verde para pagados
                  }}>
                    {item.estatus.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
