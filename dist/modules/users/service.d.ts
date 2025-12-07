import { User } from '../../types';
export declare const getAllUsers: () => Promise<any[]>;
export declare const updateUser: (userId: number, data: Partial<User>, requesterId: number, requesterRole: string) => Promise<any>;
export declare const deleteUser: (userId: number) => Promise<void>;
//# sourceMappingURL=service.d.ts.map