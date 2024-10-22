import React, { useEffect, useState } from 'react';
import './TicketCard.css';
import { Ticket } from '../../utils/types';

// Import SVG assets
import highPriority from '../../assets/Img - High Priority.svg';
import mediumPriority from '../../assets/Img - Medium Priority.svg';
import lowPriority from '../../assets/Img - Low Priority.svg';
import noPriority from '../../assets/No-priority.svg';
import urgentPriority from '../../assets/SVG - Urgent Priority colour.svg';
import todoIcon from '../../assets/To-do.svg';
import inProgressIcon from '../../assets/in-progress.svg';
import doneIcon from '../../assets/Done.svg';
import cancelledIcon from '../../assets/Cancelled.svg';
import backlogIcon from '../../assets/Backlog.svg';

interface TicketCardProps {
    ticket: Ticket;
    userName: string;
    available: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, userName, available }) => {
    const [avatarColor, setAvatarColor] = useState<string>('#000000');

    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.length > 1
            ? names[0][0] + names[1][0]
            : names[0][0];
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        setAvatarColor(getRandomColor());
    }, []);

    const getPriorityIcon = (priority: number) => {
        switch (priority) {
            case 4:
                return urgentPriority;
            case 3:
                return highPriority;
            case 2:
                return mediumPriority;
            case 1:
                return lowPriority;
            default:
                return noPriority;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return todoIcon;
            case 'in progress':
                return inProgressIcon;
            case 'done':
                return doneIcon;
            case 'cancelled':
                return cancelledIcon;
            case 'backlog':
                return backlogIcon;
            default:
                return todoIcon;
        }
    };

    const avatarStyle = {
        backgroundColor: avatarColor,
    };

    return (
        <div className="ticket-card">
            <div className="ticket-header">
                <div className="ticket-id">{ticket.id}</div>
                <div className="user-avatar" style={avatarStyle}>
                    {getInitials(userName)}
                    <div
                        className="availability-dot"
                        style={{
                            backgroundColor: available ? '#f8dd0c' : 'gray'
                        }}
                    />
                </div>
            </div>
            <div className='title-status'>
                <img
                    src={getStatusIcon(ticket.status)}
                    alt={ticket.status}
                    className="status-icon"
                />
                <h3 className="ticket-title">{ticket.title}</h3>
            </div>
            <div className="ticket-footer">
                <div className="ticket-priority">
                    <img
                        src={getPriorityIcon(ticket.priority)}
                        alt={`Priority ${ticket.priority}`}
                        className="priority-icon"
                    />
                </div>
                <div className="ticket-status">
                    <span className="feature-tag">
                        <div className="notification-icon"></div>
                        <span>Feature Request</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;