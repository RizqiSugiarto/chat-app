import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'node:http'
import { instrument } from '@socket.io/admin-ui'
import { CLIENT_URL } from '../constants.js'

const app = express()
const server = createServer(app)

const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || origin.startsWith(CLIENT_URL)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  };
  
  const io = new Server(server, {
    cors: corsOptions,
  });

instrument(io, {
    auth: false,
    mode: 'development',
})
export { app, server, io }
