export interface User {
    userId:string,
    emailId:string,
    fullName:string,
    mobileNumber:number,
    passwordHash:string,
    username:string,
    userRole:string,
    permissions:[string]
}