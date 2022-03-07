import { Injectable } from '@angular/core';
/**
 * Session Service
 *
 * The service contains logined User Information. 
 * Functions in this service used to get user Information on any component
 * Just Import use it
 */
@Injectable()
export class UserSession {
    UserClaim: any;
    constructor() { this.UserClaim = JSON.parse(localStorage.getItem('userClaims')); }

    SetUserSession(): void {
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
    }

    nullUserSession(): void {
        this.UserClaim = null;
    }

    getUserName(): string {
        return this.UserClaim.userName as string;
    }

    getUserId(): string {
        return this.UserClaim.userId as string;
    }

    getUserRoleId(): number {
        return this.UserClaim.userRoleId as number;
    }

    getUserSubjectId(): number {
        return this.UserClaim.subjectId as number;
    }
    
    getUserGradeLevelId(): number {
        return this.UserClaim.gradeLevelId as number;
    }

    getUserSubjectName(): string {
        return this.UserClaim.subjectName as string;
    }
    
    getUserGradeLevelName(): string {
        return this.UserClaim.gradeLevelName as string;
    }
}