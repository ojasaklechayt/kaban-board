import React, { useEffect, useState } from 'react';
import TicketCard from '../TicketCard';
import { fetchTickets } from '../../services/api';
import { Ticket, User } from '../../utils/types';
import downIcon from '../../assets/down.svg';
import backlogIcon from '../../assets/Backlog.svg';
import todoIcon from '../../assets/To-do.svg';
import inProgressIcon from '../../assets/in-progress.svg';
import doneIcon from '../../assets/Done.svg';
import cancelledIcon from '../../assets/Cancelled.svg';
import noPriorityIcon from '../../assets/No-priority.svg';
import lowPriorityIcon from '../../assets/Img - Low Priority.svg';
import mediumPriorityIcon from '../../assets/Img - Medium Priority.svg';
import highPriorityIcon from '../../assets/Img - High Priority.svg';
import urgentPriorityIcon from '../../assets/SVG - Urgent Priority colour.svg';
import menu from '../../assets/Display.svg';
import threedots from '../../assets/3 dot menu.svg';
import plus from '../../assets/add.svg';
import './Board.css';

type GroupedTickets = {
    [key: string]: Ticket[];
};

const Board: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<string>(() => localStorage.getItem('sortBy') || 'priority');
    const [groupBy, setGroupBy] = useState<string>(() => localStorage.getItem('groupBy') || 'status');
    const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState<boolean>(false);

    // Define all possible statuses
    const allStatuses = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];

    // Priority mapping
    const priorityNames: { [key: string]: string } = {
        'Priority 0': 'No Priority',
        'Priority 1': 'Low',
        'Priority 2': 'Medium',
        'Priority 3': 'High',
        'Priority 4': 'Urgent',
    };

    // Helper function to get status icon
    const getStatusIcon = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'backlog':
                return backlogIcon;
            case 'todo':
                return todoIcon;
            case 'in progress':
                return inProgressIcon;
            case 'done':
                return doneIcon;
            case 'cancelled':
                return cancelledIcon;
            default:
                return todoIcon;
        }
    };

    // Helper function to get priority icon
    const getPriorityIcon = (priority: string): string => {
        const level = parseInt(priority.split(' ')[1]);
        switch (level) {
            case 0:
                return noPriorityIcon;
            case 1:
                return lowPriorityIcon;
            case 2:
                return mediumPriorityIcon;
            case 3:
                return highPriorityIcon;
            case 4:
                return urgentPriorityIcon;
            default:
                return noPriorityIcon;
        }
    };

    useEffect(() => {
        const getTickets = async () => {
            try {
                const data = await fetchTickets();
                setTickets(data.tickets);
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getTickets();
    }, []);

    const getUserById = (userId: string): string => {
        const user = users.find((user) => user.id === userId);
        return user ? user.name : 'Unknown User';
    };

    const getUserAvailability = (userId: string): boolean => {
        const user = users.find((user) => user.id === userId);
        return user ? user.available : false;
    };

    const getUserInitialAndColor = (userId: string): { initial: string; color: string } => {
        const user = users.find((user) => user.id === userId);
        if (user) {
            const initial = user.name.charAt(0).toUpperCase();
            const color = fixedColorMapping(user.id); // Use fixed color mapping
            return { initial, color };
        }
        return { initial: '?', color: 'gray' }; // Fallback
    };

    // Mapping for fixed colors based on user ID
    const fixedColorMapping = (id: string): string => {
        const colors: { [key: string]: string } = {
            '1': '#FF5733',
            '2': '#33FF57',
            '3': '#3357FF',
            '4': '#FF33A6',
            // Add more user IDs and colors as needed
        };
        return colors[id] || '#A9A9A9'; // Default color if user ID not found
    };

    // Define a priority order
    const priorityOrder = [0, 4, 3, 2, 1]; // No Priority, Urgent, High, Medium, Low

    const groupedTickets = tickets.reduce<GroupedTickets>((groups, ticket) => {
        let key = '';

        if (groupBy === 'status') {
            key = ticket.status;
        } else if (groupBy === 'user') {
            key = ticket.userId;
        } else if (groupBy === 'priority') {
            key = `Priority ${ticket.priority}`;
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(ticket);
        return groups;
    }, {});

    const sortTickets = (tickets: Ticket[]) => {
        return tickets.sort((a, b) => {
            if (sortBy === 'priority') {
                return b.priority - a.priority;
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    };

    // Sort groups based on priority order or ensure all statuses are present
    const getFinalGroupedTickets = () => {
        if (groupBy === 'status') {
            // Create an object with all statuses, even empty ones
            return allStatuses.reduce<GroupedTickets>((allGroups, status) => {
                allGroups[status] = sortTickets(groupedTickets[status] || []);
                return allGroups;
            }, {});
        } else {
            // For other grouping types, use the original sorting logic
            return Object.keys(groupedTickets).sort((a, b) => {
                const aPriority = parseInt(a.split(' ')[1]);
                const bPriority = parseInt(b.split(' ')[1]);
                return priorityOrder.indexOf(aPriority) - priorityOrder.indexOf(bPriority);
            }).reduce<GroupedTickets>((sortedGroups, groupKey) => {
                sortedGroups[groupKey] = sortTickets(groupedTickets[groupKey]);
                return sortedGroups;
            }, {});
        }
    };

    useEffect(() => {
        // Save groupBy and sortBy to localStorage whenever they change
        localStorage.setItem('groupBy', groupBy);
        localStorage.setItem('sortBy', sortBy);
    }, [groupBy, sortBy]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!tickets || !Array.isArray(tickets)) {
        return <div>No tickets available</div>;
    }

    const finalGroupedTickets = getFinalGroupedTickets();

    return (
        <div className="kanban-board">
            <div className='menu'>
                <div className="display-menu">
                    <button
                        className="display-button"
                        onClick={() => setIsDisplayMenuOpen(!isDisplayMenuOpen)}
                    >
                        <img src={menu} alt="Menu" className="icon" />
                        <span>Display</span>
                        <img src={downIcon} alt="Down Arrow" className="icon" />
                    </button>

                    {isDisplayMenuOpen && (
                        <div className="menu-popup">
                            <div className="menu-section">
                                <label>Grouping</label>
                                <select
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    value={groupBy}
                                >
                                    <option value="status">Status</option>
                                    <option value="user">User</option>
                                    <option value="priority">Priority</option>
                                </select>
                            </div>

                            <div className="menu-section">
                                <label>Ordering</label>
                                <select
                                    onChange={(e) => setSortBy(e.target.value)}
                                    value={sortBy}
                                >
                                    <option value="priority">Priority</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="board-columns">
                {Object.entries(finalGroupedTickets).map(([groupKey, groupTickets]) => (
                    <div key={groupKey} className="column">
                        <h2 className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {groupBy === 'user' ? (
                                    <>
                                        {(() => {
                                            const { initial, color } = getUserInitialAndColor(groupKey);
                                            return (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        backgroundColor: color,
                                                        color: 'white',
                                                        fontSize: '15px',
                                                        marginRight: '12px',
                                                    }}
                                                >
                                                    {initial}
                                                </div>
                                            );
                                        })()}
                                        <span className='ticket-col-name'>
                                            {getUserById(groupKey)}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={groupBy === 'status'
                                                ? getStatusIcon(groupKey)
                                                : groupBy === 'priority'
                                                    ? getPriorityIcon(groupKey)
                                                    : todoIcon}
                                            alt=""
                                            className="header-icon"
                                            style={{ marginRight: '12px' }}
                                        />
                                        <span className='ticket-col-name'>
                                            {groupBy === 'status'
                                                ? groupKey
                                                : groupBy === 'priority'
                                                    ? priorityNames[groupKey] || groupKey
                                                    : groupKey}
                                        </span>
                                    </>
                                )}
                                <span className="ticket-count" style={{ marginLeft: '8px' }}>
                                    {groupTickets.length}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={plus} alt="Add" className="icon" style={{ marginLeft: '12px', cursor: 'pointer' }} />
                                <img src={threedots} alt="More options" className="icon" style={{ marginLeft: '8px', cursor: 'pointer' }} />
                            </div>
                        </h2>
                        {groupTickets.map(ticket => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                userName={getUserById(ticket.userId)}
                                available={getUserAvailability(ticket.userId)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;
