import { Ticket, User } from '../utils/types';

export const fetchTickets = async (): Promise<{ tickets: Ticket[], users: User[] }> => {
    const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
    if (!response.ok) {
        throw new Error('Failed to fetch tickets');
    }
    return response.json();
};
