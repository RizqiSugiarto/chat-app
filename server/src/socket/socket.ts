import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'node:http'
import { instrument } from '@socket.io/admin-ui'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['https://simplechatapps.netlify.app'],
        methods: ['GET', 'POST'],
    },
})

instrument(io, {
    auth: false,
    mode: 'development',
})
export { app, server, io }
