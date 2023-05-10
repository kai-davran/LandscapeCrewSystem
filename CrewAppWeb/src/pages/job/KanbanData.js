import { v4 as uuidv4 } from "uuid";

export const columnsFromBack = {
    'Monday': {
        title: 'Monday',
        items: [],
    },
    'Tuesday': {
        title: 'Tuesday',
        items: [],
    },
    'Wednesday': {
        title: 'Wednesday',
        items: [],
    },
    'Thursday': {
        title: 'Thursday',
        items: [],
    },
    'Friday': {
        title: 'Friday',
        items: [],
    },
    'Saturday': {
        title: 'Saturday',
        items: [],
    },
    'Sunday': {
        title: 'Sunday',
        items: [],
    },
};


export const unscheduled = {
    [uuidv4()]: {
        title: 'Unscheduled Jobs',
        items: []
    }
};