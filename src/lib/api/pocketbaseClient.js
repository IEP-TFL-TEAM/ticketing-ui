import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_PB_URL;
const pb = new PocketBase(pbUrl);

export default pb;
