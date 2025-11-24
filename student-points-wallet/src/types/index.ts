export interface User {
    id: string;
    name: string;
    studentId: string;
    role: 'STUDENT' | 'ADMIN';
    email: string;
    phone: string;
    points: number;
    password: string; // For authentication
}

export interface Reward {
    id: string;
    title: string;
    cost: number;
    quantity: number;
    description: string;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    reason: string;
    date: string; // ISO date string
    type: 'EARN' | 'REDEEM'; // Track if points were earned or spent
}

export interface PointRequest {
    id: string;
    userId: string;
    userName: string; // For display purposes
    amount: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestDate: string;
    reviewDate?: string;
    reviewedBy?: string; // Admin ID who reviewed
}