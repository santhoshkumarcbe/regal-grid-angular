export interface chargingStation{
    id:string
    dealerName:string
    stationName:string
    stationtype:string
    location:string
    costPerMinute:number
}

export interface chargingStationDistance{
    chargingStation:chargingStation
    distance:number
}