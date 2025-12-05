//ScheduleForm.tsx
import React, { useState, useEffect } from 'react';
import { ScheduleFormData, Order } from '@/types';
import { orderService } from '@/services/order.service';
import { WEATHER_CONDITIONS, ROAD_CONDITIONS, COLORS } from '@/utils/constants';

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  isLoading?: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    orderId: '',
    vehicle_id: '',
    vessel_name: '',
    departure_time: '',
    arrival_time: '',
    road_condition_status: '',
    weather_condition: '',
    cost_usd: undefined,
    notes: '',
    
    // New weather attributes
    temperature_c: undefined,
    humidity_percent: undefined,
    rainfall_mm: undefined,
    wind_speed_mps: undefined,
    wind_direction_deg: undefined,
    visibility_km: undefined,
    pressure_hpa: undefined,
    sea_state_level: '',
    wave_height_m: undefined,
    tide_level_m: undefined,
    storm_warning: false,
    
    // New road attributes
    surface_type: '',
    surface_condition: '',
    pothole_density: undefined,
    slope_angle_degrees: undefined,
    traffic_density: '',
    flood_level_m: undefined,
    access_status: '',
    dust_level_ppm: undefined,
    ground_vibration_mm_s: undefined,
    road_temperature_c: undefined,
    soil_moisture_percent: undefined,
    maintenance_activity: false,
    accident_count: 0,
    
    // New equipment attributes
    machine_type: '',
    engine_temperature_c: undefined,
    oil_pressure_bar: undefined,
    fuel_level_percent: undefined,
    engine_rpm: undefined,
    vibration_level_g: undefined,
    hydraulic_pressure_bar: undefined,
    working_hours: undefined,
    maintenance_status: '',
    fault_code: '',
    operational_mode: '',
    ambient_temperature_c: undefined,
    gear_position: '',
    fuel_consumption_l_h: undefined,
    torque_nm: undefined,
    engine_load_percent: undefined,
    
    // New vessel attributes
    delay_minutes: 0,
    cargo_type_vessel: '',
    load_weight_tons: undefined,
    port_condition: '',
    weather_impact_score: undefined,
    sea_condition_code: '',
    crew_availability_percent: undefined,
    vessel_status: '',
    fuel_consumption_tons: undefined,
    distance_traveled_km: undefined,
    average_speed_knots: undefined,
    departure_hour: undefined,
    departure_weekday: '',
    departure_month: '',
    planned_duration_hours: undefined,
    
    // Meta data
    weather_meta: undefined,
    road_meta: undefined,
    equipment_meta: undefined,
    vessel_meta: undefined
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await orderService.getAllOrders();
      setOrders(response.orders || []);
    } catch (err: any) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (formData.orderId) {
      const order = orders.find(o => o.id === formData.orderId);
      setSelectedOrder(order || null);
    } else {
      setSelectedOrder(null);
    }
  }, [formData.orderId, orders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value ? parseFloat(value) : undefined;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.orderId) {
      setError('Please select an order');
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        orderId: '',
        vehicle_id: '',
        vessel_name: '',
        departure_time: '',
        arrival_time: '',
        road_condition_status: '',
        weather_condition: '',
        cost_usd: undefined,
        notes: '',
        temperature_c: undefined,
        humidity_percent: undefined,
        rainfall_mm: undefined,
        wind_speed_mps: undefined,
        wind_direction_deg: undefined,
        visibility_km: undefined,
        pressure_hpa: undefined,
        sea_state_level: '',
        wave_height_m: undefined,
        tide_level_m: undefined,
        storm_warning: false,
        surface_type: '',
        surface_condition: '',
        pothole_density: undefined,
        slope_angle_degrees: undefined,
        traffic_density: '',
        flood_level_m: undefined,
        access_status: '',
        dust_level_ppm: undefined,
        ground_vibration_mm_s: undefined,
        road_temperature_c: undefined,
        soil_moisture_percent: undefined,
        maintenance_activity: false,
        accident_count: 0,
        machine_type: '',
        engine_temperature_c: undefined,
        oil_pressure_bar: undefined,
        fuel_level_percent: undefined,
        engine_rpm: undefined,
        vibration_level_g: undefined,
        hydraulic_pressure_bar: undefined,
        working_hours: undefined,
        maintenance_status: '',
        fault_code: '',
        operational_mode: '',
        ambient_temperature_c: undefined,
        gear_position: '',
        fuel_consumption_l_h: undefined,
        torque_nm: undefined,
        engine_load_percent: undefined,
        delay_minutes: 0,
        cargo_type_vessel: '',
        load_weight_tons: undefined,
        port_condition: '',
        weather_impact_score: undefined,
        sea_condition_code: '',
        crew_availability_percent: undefined,
        vessel_status: '',
        fuel_consumption_tons: undefined,
        distance_traveled_km: undefined,
        average_speed_knots: undefined,
        departure_hour: undefined,
        departure_weekday: '',
        departure_month: '',
        planned_duration_hours: undefined,
        weather_meta: undefined,
        road_meta: undefined,
        equipment_meta: undefined,
        vessel_meta: undefined
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div className="schedule-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Order Selection</h3>
          <div className="form-group">
            <label htmlFor="orderId">Select Order *</label>
            <select
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              required
              disabled={isLoading || loadingOrders}
            >
              <option value="">Select an order</option>
              {orders
                .filter(order => order.status === 'Created' || order.status === 'Scheduled')
                .map(order => (
                  <option key={order.id} value={order.id}>
                    {order.order_code} - {order.origin} → {order.destination} ({order.cargo_type})
                  </option>
                ))}
            </select>
            {loadingOrders && <div className="loading-text">Loading orders...</div>}
          </div>

          {selectedOrder && (
            <div className="order-preview">
              <div className="preview-header">
                <strong>Selected Order:</strong> {selectedOrder.order_code}
              </div>
              <div className="preview-details">
                <div><strong>Cargo:</strong> {selectedOrder.cargo_type} ({selectedOrder.cargo_weight_tons} tons)</div>
                <div><strong>Transport:</strong> {selectedOrder.transport_mode}</div>
                <div><strong>Route:</strong> {selectedOrder.origin} → {selectedOrder.destination}</div>
                {selectedOrder.distance_km && <div><strong>Distance:</strong> {selectedOrder.distance_km} km</div>}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="vehicle_id">Vehicle ID</label>
              <input
                type="text"
                id="vehicle_id"
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                placeholder="Enter vehicle ID"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vessel_name">Vessel Name</label>
              <input
                type="text"
                id="vessel_name"
                name="vessel_name"
                value={formData.vessel_name}
                onChange={handleChange}
                placeholder="Enter vessel name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cost_usd">Estimated Cost (USD)</label>
              <input
                type="number"
                id="cost_usd"
                name="cost_usd"
                value={formData.cost_usd || ''}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Timing</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="departure_time">Departure Time</label>
              <input
                type="datetime-local"
                id="departure_time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="arrival_time">Arrival Time</label>
              <input
                type="datetime-local"
                id="arrival_time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Weather Conditions</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="weather_condition">Weather Condition</label>
              <select
                id="weather_condition"
                name="weather_condition"
                value={formData.weather_condition}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select weather</option>
                {WEATHER_CONDITIONS.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="temperature_c">Temperature (°C)</label>
              <input
                type="number"
                id="temperature_c"
                name="temperature_c"
                value={formData.temperature_c || ''}
                onChange={handleChange}
                placeholder="25"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="humidity_percent">Humidity (%)</label>
              <input
                type="number"
                id="humidity_percent"
                name="humidity_percent"
                value={formData.humidity_percent || ''}
                onChange={handleChange}
                placeholder="70"
                min="0"
                max="100"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wind_speed_mps">Wind Speed (m/s)</label>
              <input
                type="number"
                id="wind_speed_mps"
                name="wind_speed_mps"
                value={formData.wind_speed_mps || ''}
                onChange={handleChange}
                placeholder="5"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rainfall_mm">Rainfall (mm)</label>
              <input
                type="number"
                id="rainfall_mm"
                name="rainfall_mm"
                value={formData.rainfall_mm || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="visibility_km">Visibility (km)</label>
              <input
                type="number"
                id="visibility_km"
                name="visibility_km"
                value={formData.visibility_km || ''}
                onChange={handleChange}
                placeholder="10"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Road Conditions</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="road_condition_status">Road Condition</label>
              <select
                id="road_condition_status"
                name="road_condition_status"
                value={formData.road_condition_status}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select road condition</option>
                {ROAD_CONDITIONS.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="surface_type">Surface Type</label>
              <input
                type="text"
                id="surface_type"
                name="surface_type"
                value={formData.surface_type}
                onChange={handleChange}
                placeholder="Asphalt, Concrete, etc."
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="traffic_density">Traffic Density</label>
              <select
                id="traffic_density"
                name="traffic_density"
                value={formData.traffic_density}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select traffic density</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="accident_count">Accident Count</label>
              <input
                type="number"
                id="accident_count"
                name="accident_count"
                value={formData.accident_count}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Equipment Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="machine_type">Machine Type</label>
              <input
                type="text"
                id="machine_type"
                name="machine_type"
                value={formData.machine_type}
                onChange={handleChange}
                placeholder="Excavator, Truck, etc."
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="engine_temperature_c">Engine Temp (°C)</label>
              <input
                type="number"
                id="engine_temperature_c"
                name="engine_temperature_c"
                value={formData.engine_temperature_c || ''}
                onChange={handleChange}
                placeholder="90"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel_level_percent">Fuel Level (%)</label>
              <input
                type="number"
                id="fuel_level_percent"
                name="fuel_level_percent"
                value={formData.fuel_level_percent || ''}
                onChange={handleChange}
                placeholder="80"
                min="0"
                max="100"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maintenance_status">Maintenance Status</label>
              <select
                id="maintenance_status"
                name="maintenance_status"
                value={formData.maintenance_status}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select status</option>
                <option value="Good">Good</option>
                <option value="Needs Maintenance">Needs Maintenance</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes..."
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="form-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating Schedule...' : 'Create Schedule'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .schedule-form {
          background: ${COLORS.background};
          border-radius: 8px;
        }
        
        .form-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid ${COLORS.border};
        }
        
        .form-section:last-child {
          border-bottom: none;
        }
        
        .form-section h3 {
          margin: 0 0 16px 0;
          color: ${COLORS.text};
          font-size: 16px;
          font-weight: 600;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          color: ${COLORS.text};
          font-size: 13px;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
          background: ${COLORS.background};
          color: ${COLORS.text};
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 2px rgba(106, 63, 181, 0.1);
        }
        
        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .loading-text {
          font-size: 12px;
          color: ${COLORS.textLight};
          margin-top: 4px;
        }
        
        .order-preview {
          background: ${COLORS.backgroundSecondary};
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
          padding: 12px;
          margin-top: 12px;
        }
        
        .preview-header {
          font-size: 14px;
          margin-bottom: 8px;
          color: ${COLORS.text};
        }
        
        .preview-details {
          font-size: 13px;
          color: ${COLORS.textLight};
        }
        
        .preview-details div {
          margin-bottom: 4px;
        }
        
        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: ${COLORS.error};
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .submit-btn {
          padding: 10px 24px;
          background: ${COLORS.primary};
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: ${COLORS.primaryDark};
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ScheduleForm;