export interface User {
    userId:string,
    emailId:string,
    fullName:string,
    mobileNumber:number,
    passwordHash:string,
    userName:string,
    userRole:string,
    permissions:[string]
}