"use strict";

const args = process.argv.slice(2);
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8901;

configureYoutubeListener(args);

app.use('/web', express.static(path.join(__dirname, '/web')));
app.use((req, res) => res.sendFile('/index.html', {root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

function configureYoutubeListener(args) {
    const {Server} = require('ws');
    const wss = new Server({port: process.env.WEBSOCKET_PORT || 443});
    let youtubeArgIndex = args.indexOf('-y')

    if (youtubeArgIndex > -1) {
        configureWebSocketServer(wss);
        let liveId = args[youtubeArgIndex + 1];
        if (!liveId)
            return;

        console.log(`Attempting connection to YouTube chat with Live ID: ${liveId}`);
        const {LiveChat} = require("youtube-chat")
        const liveChat = new LiveChat({liveId: liveId})

        liveChat.on("chat", (chatItem) => {
            wss.clients.forEach((client) => {
                client.send('Play');
            });
        });
        liveChat.start();
    }
}

function configureWebSocketServer(wss) {
    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('close', () => console.log('Client has disconnected'));
    });
}