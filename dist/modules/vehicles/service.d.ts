import { Vehicle } from '../../types';
interface CreateVehicleData {
    vehicle_name: string;
    type: string;
    registration_number: string;
    daily_rent_price: number;
    availability_status: string;
}
export declare const createVehicle: (data: CreateVehicleData) => Promise<any>;
export declare const getAllVehicles: () => Promise<any[]>;
export declare const getVehicleById: (vehicleId: number) => Promise<any>;
export declare const updateVehicle: (vehicleId: number, data: Partial<Vehicle>) => Promise<any>;
export declare const deleteVehicle: (vehicleId: number) => Promise<void>;
export {};
//# sourceMappingURL=service.d.ts.map