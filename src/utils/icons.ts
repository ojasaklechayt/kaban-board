// src/utils/icons.ts
import backlogIcon from '../assets/Backlog.svg';
import todoIcon from '../assets/To-do.svg';
import inProgressIcon from '../assets/in-progress.svg';
import doneIcon from '../assets/Done.svg';
import cancelledIcon from '../assets/Cancelled.svg';
import noPriorityIcon from '../assets/No-priority.svg';
import lowPriorityIcon from '../assets/Img - Low Priority.svg';
import mediumPriorityIcon from '../assets/Img - Medium Priority.svg';
import highPriorityIcon from '../assets/Img - High Priority.svg';
import urgentPriorityIcon from '../assets/SVG - Urgent Priority colour.svg';

export const getStatusIcon = (status: string): string => {
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

export const getPriorityIcon = (priority: string): string => {
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
