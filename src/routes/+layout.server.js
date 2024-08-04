import eventsource from 'eventsource';

export const ssr = false;
global.EventSource = eventsource;
