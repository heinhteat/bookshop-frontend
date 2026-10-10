export type Role = 'customer' | 'owner' | 'inventory_manager';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}
