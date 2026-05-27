export class Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    jwtToken?: SVGStringList;
}

export enum Role {
    Admin = 'Admin',
    User = 'User'
}