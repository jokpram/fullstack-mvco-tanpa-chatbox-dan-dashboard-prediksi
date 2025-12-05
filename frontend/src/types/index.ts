//index.ts
export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'mine_planner' | 'shipping_planner';
  type: 'mine' | 'shipping';
  no_telp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  order_code: string;
  origin: string;
  destination: string;
  cargo_type: string;
  cargo_weight_tons: number;
  transport_mode: string;
  distance_km?: number;
  planned_departure?: string;
  status: 'Created' | 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
  estimated_cost_usd?: number;
  minePlannerId: string;
  minePlanner?: User;
  schedules?: Schedule[];
  
  // New logistics attributes
  origin_location?: string;
  destination_location?: string;
  travel_time_hr?: number;
  actual_travel_time_hr?: number;
  fuel_used_liters?: number;
  fuel_cost_usd?: number;
  delivery_status?: string;
  delay_cause?: string;
  co2_emission_kg?: number;
  
  // New production attributes
  production_tons?: number;
  fuel_consumed_liters?: number;
  downtime_minutes?: number;
  equipment_efficiency_percent?: number;
  fuel_efficiency_tons_per_liter?: number;
  incident_report?: string;
  maintenance_required?: boolean;
  production_cost_usd?: number;
  revenue_usd?: number;
  
  // Meta data
  logistics_meta?: any;
  production_meta?: any;
  
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  orderId: string;
  shippingPlannerId: string;
  vehicle_id?: string;
  vessel_name?: string;
  departure_time?: string;
  arrival_time?: string;
  road_condition_status?: string;
  weather_condition?: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Delayed' | 'Cancelled';
  notes?: string;
  cost_usd?: number;
  order?: Order;
  shippingPlanner?: User;
  
  // New weather attributes
  temperature_c?: number;
  humidity_percent?: number;
  rainfall_mm?: number;
  wind_speed_mps?: number;
  wind_direction_deg?: number;
  visibility_km?: number;
  pressure_hpa?: number;
  sea_state_level?: string;
  wave_height_m?: number;
  tide_level_m?: number;
  storm_warning?: boolean;
  
  // New road attributes
  surface_type?: string;
  surface_condition?: string;
  pothole_density?: number;
  slope_angle_degrees?: number;
  traffic_density?: string;
  flood_level_m?: number;
  access_status?: string;
  dust_level_ppm?: number;
  ground_vibration_mm_s?: number;
  road_temperature_c?: number;
  soil_moisture_percent?: number;
  maintenance_activity?: boolean;
  accident_count?: number;
  
  // New equipment attributes
  machine_type?: string;
  engine_temperature_c?: number;
  oil_pressure_bar?: number;
  fuel_level_percent?: number;
  engine_rpm?: number;
  vibration_level_g?: number;
  hydraulic_pressure_bar?: number;
  working_hours?: number;
  maintenance_status?: string;
  fault_code?: string;
  operational_mode?: string;
  ambient_temperature_c?: number;
  gear_position?: string;
  fuel_consumption_l_h?: number;
  torque_nm?: number;
  engine_load_percent?: number;
  
  // New vessel attributes
  delay_minutes?: number;
  cargo_type_vessel?: string;
  load_weight_tons?: number;
  port_condition?: string;
  weather_impact_score?: number;
  sea_condition_code?: string;
  crew_availability_percent?: number;
  vessel_status?: string;
  fuel_consumption_tons?: number;
  distance_traveled_km?: number;
  average_speed_knots?: number;
  departure_hour?: number;
  departure_weekday?: string;
  departure_month?: string;
  planned_duration_hours?: number;
  
  // Meta data
  weather_meta?: any;
  road_meta?: any;
  equipment_meta?: any;
  vessel_meta?: any;
  
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  revoked: boolean;
  replacedByTokenId?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
  token?: string;
  sessions?: Session[];
  orders?: Order[];
  order?: Order;
  schedules?: Schedule[];
  schedule?: Schedule;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'mine_planner' | 'shipping_planner';
}

export interface RegisterCredentials {
  nama: string;
  email: string;
  password: string;
  no_telp?: string;
}

export interface OrderFormData {
  origin: string;
  destination: string;
  cargo_type: string;
  cargo_weight_tons: number;
  transport_mode: string;
  distance_km?: number;
  planned_departure?: string;
  
  // New logistics attributes
  origin_location?: string;
  destination_location?: string;
  travel_time_hr?: number;
  actual_travel_time_hr?: number;
  fuel_used_liters?: number;
  fuel_cost_usd?: number;
  delivery_status?: string;
  delay_cause?: string;
  co2_emission_kg?: number;
  
  // New production attributes
  production_tons?: number;
  fuel_consumed_liters?: number;
  downtime_minutes?: number;
  equipment_efficiency_percent?: number;
  fuel_efficiency_tons_per_liter?: number;
  incident_report?: string;
  maintenance_required?: boolean;
  production_cost_usd?: number;
  revenue_usd?: number;
  
  // Meta data
  logistics_meta?: any;
  production_meta?: any;
}

export interface ScheduleFormData {
  orderId: string;
  vehicle_id?: string;
  vessel_name?: string;
  departure_time?: string;
  arrival_time?: string;
  road_condition_status?: string;
  weather_condition?: string;
  cost_usd?: number;
  notes?: string;
  
  // Weather attributes
  temperature_c?: number;
  humidity_percent?: number;
  rainfall_mm?: number;
  wind_speed_mps?: number;
  wind_direction_deg?: number;
  visibility_km?: number;
  pressure_hpa?: number;
  sea_state_level?: string;
  wave_height_m?: number;
  tide_level_m?: number;
  storm_warning?: boolean;
  
  // Road attributes
  surface_type?: string;
  surface_condition?: string;
  pothole_density?: number;
  slope_angle_degrees?: number;
  traffic_density?: string;
  flood_level_m?: number;
  access_status?: string;
  dust_level_ppm?: number;
  ground_vibration_mm_s?: number;
  road_temperature_c?: number;
  soil_moisture_percent?: number;
  maintenance_activity?: boolean;
  accident_count?: number;
  
  // Equipment attributes
  machine_type?: string;
  engine_temperature_c?: number;
  oil_pressure_bar?: number;
  fuel_level_percent?: number;
  engine_rpm?: number;
  vibration_level_g?: number;
  hydraulic_pressure_bar?: number;
  working_hours?: number;
  maintenance_status?: string;
  fault_code?: string;
  operational_mode?: string;
  ambient_temperature_c?: number;
  gear_position?: string;
  fuel_consumption_l_h?: number;
  torque_nm?: number;
  engine_load_percent?: number;
  
  // Vessel attributes
  delay_minutes?: number;
  cargo_type_vessel?: string;
  load_weight_tons?: number;
  port_condition?: string;
  weather_impact_score?: number;
  sea_condition_code?: string;
  crew_availability_percent?: number;
  vessel_status?: string;
  fuel_consumption_tons?: number;
  distance_traveled_km?: number;
  average_speed_knots?: number;
  departure_hour?: number;
  departure_weekday?: string;
  departure_month?: string;
  planned_duration_hours?: number;
  
  // Meta data
  weather_meta?: any;
  road_meta?: any;
  equipment_meta?: any;
  vessel_meta?: any;
}

export interface UpdateScheduleData {
  status?: Schedule['status'];
  notes?: string;
  road_condition_status?: string;
  weather_condition?: string;
  
  // Weather attributes
  temperature_c?: number;
  humidity_percent?: number;
  rainfall_mm?: number;
  wind_speed_mps?: number;
  wind_direction_deg?: number;
  visibility_km?: number;
  pressure_hpa?: number;
  sea_state_level?: string;
  wave_height_m?: number;
  tide_level_m?: number;
  storm_warning?: boolean;
  
  // Road attributes
  surface_type?: string;
  surface_condition?: string;
  pothole_density?: number;
  slope_angle_degrees?: number;
  traffic_density?: string;
  flood_level_m?: number;
  access_status?: string;
  dust_level_ppm?: number;
  ground_vibration_mm_s?: number;
  road_temperature_c?: number;
  soil_moisture_percent?: number;
  maintenance_activity?: boolean;
  accident_count?: number;
  
  // Equipment attributes
  machine_type?: string;
  engine_temperature_c?: number;
  oil_pressure_bar?: number;
  fuel_level_percent?: number;
  engine_rpm?: number;
  vibration_level_g?: number;
  hydraulic_pressure_bar?: number;
  working_hours?: number;
  maintenance_status?: string;
  fault_code?: string;
  operational_mode?: string;
  ambient_temperature_c?: number;
  gear_position?: string;
  fuel_consumption_l_h?: number;
  torque_nm?: number;
  engine_load_percent?: number;
  
  // Vessel attributes
  delay_minutes?: number;
  cargo_type_vessel?: string;
  load_weight_tons?: number;
  port_condition?: string;
  weather_impact_score?: number;
  sea_condition_code?: string;
  crew_availability_percent?: number;
  vessel_status?: string;
  fuel_consumption_tons?: number;
  distance_traveled_km?: number;
  average_speed_knots?: number;
  departure_hour?: number;
  departure_weekday?: string;
  departure_month?: string;
  planned_duration_hours?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessions: Session[];
}