import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); //24 hours
export default cache;
