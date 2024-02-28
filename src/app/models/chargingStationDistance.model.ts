export interface chargingStation{
    dealerName:string
    stationName:string
    stationtype:string
    location:string
    costPerUnit:number
}

export interface chargingStationDistance{
    chargingStation:chargingStation
    distance:number
}