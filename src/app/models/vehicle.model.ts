export interface Vehicle{
    vehicleModel:VehicleModel[];
    userVehicle:UserVehicle[];

}

export interface VehicleModel {
    id: string;
    vehicleType: string;
    vehicleModel: string;
    batteryCapacity: string;
    chargingTime: number;
    chargeDrainPerKm: number;
}

export interface UserVehicle {
    id: string;
    userName: string;
    vehicleName: string;
    vehiclemodel: string;
    chargeAvailable: number;
    location: string;
}