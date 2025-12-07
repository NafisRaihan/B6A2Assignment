interface SignupData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
}
interface SigninData {
    email: string;
    password: string;
}
export declare const signup: (data: SignupData) => Promise<any>;
export declare const signin: (data: SigninData) => Promise<{
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        role: "admin" | "customer";
    };
}>;
export {};
//# sourceMappingURL=service.d.ts.map