import { Server } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import app from './app.js';

const PORT = 8080;
const server = new Server(app);
server.listen(PORT);

export default httpServerHandler({ port: PORT });
