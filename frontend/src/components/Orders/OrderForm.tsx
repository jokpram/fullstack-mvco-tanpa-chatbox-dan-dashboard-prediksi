//OrderForm.tsx
import React, { useState } from 'react';
import { CARGO_TYPES, TRANSPORT_MODES, COLORS } from '@/utils/constants';
import { OrderFormData } from '@/types';

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<void>;
  isLoading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    origin: '',
    destination: '',
    cargo_type: CARGO_TYPES[0],
    cargo_weight_tons: 0,
    transport_mode: TRANSPORT_MODES[0],
    distance_km: undefined,
    planned_departure: '',
    
    // New logistics attributes
    origin_location: '',
    destination_location: '',
    travel_time_hr: undefined,
    actual_travel_time_hr: undefined,
    fuel_used_liters: undefined,
    fuel_cost_usd: undefined,
    delivery_status: '',
    delay_cause: '',
    co2_emission_kg: undefined,
    
    // New production attributes
    production_tons: undefined,
    fuel_consumed_liters: undefined,
    downtime_minutes: undefined,
    equipment_efficiency_percent: undefined,
    fuel_efficiency_tons_per_liter: undefined,
    incident_report: '',
    maintenance_required: false,
    production_cost_usd: undefined,
    revenue_usd: undefined,
    
    // Meta data
    logistics_meta: undefined,
    production_meta: undefined
  });

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
    await onSubmit(formData);
  };

  return (
    <div className="order-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Origin *</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Mine location"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Port or destination"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Cargo Type *</label>
              <select
                name="cargo_type"
                value={formData.cargo_type}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                {CARGO_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cargo Weight (tons) *</label>
              <input
                type="number"
                name="cargo_weight_tons"
                value={formData.cargo_weight_tons || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.1"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Transport Mode *</label>
              <select
                name="transport_mode"
                value={formData.transport_mode}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                {TRANSPORT_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                name="distance_km"
                value={formData.distance_km || ''}
                onChange={handleChange}
                placeholder="Optional"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Logistics Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Origin Location</label>
              <input
                type="text"
                name="origin_location"
                value={formData.origin_location}
                onChange={handleChange}
                placeholder="Specific origin location"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Destination Location</label>
              <input
                type="text"
                name="destination_location"
                value={formData.destination_location}
                onChange={handleChange}
                placeholder="Specific destination location"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Travel Time (hours)</label>
              <input
                type="number"
                name="travel_time_hr"
                value={formData.travel_time_hr || ''}
                onChange={handleChange}
                placeholder="Estimated travel time"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Fuel Used (liters)</label>
              <input
                type="number"
                name="fuel_used_liters"
                value={formData.fuel_used_liters || ''}
                onChange={handleChange}
                placeholder="Estimated fuel consumption"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>CO2 Emission (kg)</label>
              <input
                type="number"
                name="co2_emission_kg"
                value={formData.co2_emission_kg || ''}
                onChange={handleChange}
                placeholder="Estimated CO2 emission"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Production Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Production (tons)</label>
              <input
                type="number"
                name="production_tons"
                value={formData.production_tons || ''}
                onChange={handleChange}
                placeholder="Production quantity"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Fuel Consumed (liters)</label>
              <input
                type="number"
                name="fuel_consumed_liters"
                value={formData.fuel_consumed_liters || ''}
                onChange={handleChange}
                placeholder="Fuel consumed in production"
                min="0"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Downtime (minutes)</label>
              <input
                type="number"
                name="downtime_minutes"
                value={formData.downtime_minutes || ''}
                onChange={handleChange}
                placeholder="Estimated downtime"
                min="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Equipment Efficiency (%)</label>
              <input
                type="number"
                name="equipment_efficiency_percent"
                value={formData.equipment_efficiency_percent || ''}
                onChange={handleChange}
                placeholder="0-100"
                min="0"
                max="100"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Production Cost (USD)</label>
              <input
                type="number"
                name="production_cost_usd"
                value={formData.production_cost_usd || ''}
                onChange={handleChange}
                placeholder="Estimated production cost"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Timing</h3>
          <div className="form-group">
            <label>Planned Departure</label>
            <input
              type="datetime-local"
              name="planned_departure"
              value={formData.planned_departure}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .order-form {
          background: ${COLORS.background};
          border-radius: 12px;
          padding: 24px;
          border: 1px solid ${COLORS.border};
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
          gap: 20px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: ${COLORS.text};
          font-weight: 500;
          font-size: 14px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
          background: ${COLORS.background};
          color: ${COLORS.text};
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(106, 63, 181, 0.1);
        }
        
        .form-group input:disabled,
        .form-group select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
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
      `}</style>
    </div>
  );
};

export default OrderForm;