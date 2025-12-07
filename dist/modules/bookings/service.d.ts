interface CreateBookingData {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
}
export declare const createBooking: (data: CreateBookingData) => Promise<any>;
export declare const getAllBookings: (userId: number, userRole: string) => Promise<{
    id: any;
    customer_id: any;
    vehicle_id: any;
    rent_start_date: any;
    rent_end_date: any;
    total_price: number;
    status: any;
    created_at: any;
    updated_at: any;
    customer: {
        name: any;
        email: any;
    };
    vehicle: {
        vehicle_name: any;
        registration_number: any;
    };
}[] | {
    id: any;
    vehicle_id: any;
    rent_start_date: any;
    rent_end_date: any;
    total_price: number;
    status: any;
    created_at: any;
    updated_at: any;
    vehicle: {
        vehicle_name: any;
        registration_number: any;
        type: any;
    };
}[]>;
export declare const updateBooking: (bookingId: number, data: {
    status: string;
}, userId: number, userRole: string) => Promise<any>;
export {};
//# sourceMappingURL=service.d.ts.map