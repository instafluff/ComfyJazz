# ComfyJazz

![GitHub repo size](https://img.shields.io/github/repo-size/zephsinx/ComfyJazz)
![GitHub contributors](https://img.shields.io/github/contributors/zephsinx/ComfyJazz)
![Twitch channel](https://img.shields.io/twitch/status/zephsinx?style=social)

ComfyJazz is a tool to play easy-listening, comfy, computer-generated Jazz music, with built-in Twitch and YouTube chat
integration. Notes are played along randomly and for each chat message on your channel.

## Table of Contents

- [Credits](#credits)
- [Prerequisites](#prerequisites)
- [Installing ComfyJazz](#installing-comfyjazz)
- [Using ComfyJazz](#using-comfyjazz)
    - [Twitch](#twitch)
    - [YouTube](#youtube)

## Credits

All credits to the original project go to [@Instafluff](https://github.com/instafluff) and all participants in the
original project. Instafluff can also be found on Twitch at [ttv/Instafluff](https://twitch.tv/instafluff)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Download and install [Node.js](https://nodejs.org/en/download/) matching for your operating system.
    - The LTS (Long-term Support) version is recommended for most users.

## Installing ComfyJazz

1. Navigate to the ComfyJazz folder.
2. Run `npm install` to install required dependencies.

## Using ComfyJazz

### Twitch

1. Run the application from the command line.
    1. `node index.js`
2. You should see a message like `Listening on 8901`
    1. Where 8901 is the port that ComfyJazz is listening on.
3. Add a Browser Source to your broadcasting software (e.g. [OBS](https://obsproject.com/kb/browser-source)).
4. In the URL field, enter `http://localhost:8901?channel=yourchannel`
    1. Replace `yourchannel` with your Twitch username.
5. Enjoy!

Example:

```url
http://localhost:8901?channel=zephsinx
```

Notes:

1. Keep the command prompt window open, as closing it will stop ComfyJazz.
    1. If you would like ComfyJazz to run as a Windows service and not have to keep a command prompt
       open, [NSSM](https://nssm.cc/download) can be used for this purpose.
2. To stop the application, press `CTRL+C` in the command prompt window, or simply close the command prompt.

### YouTube

ComfyJazz also supports YouTube live chat. However, the Live ID of the YouTube stream must be provided on server start.
As the YouTube event listener run on the server-side, notes are triggered via websocket requests to the client-side.

> Note: The server must be started _after_ the YouTube stream has begun to have a valid stream Live ID. Future
> improvements will attempt to remove this requirement.

1. Run the application from the command line and provide your YouTube Live ID.
    1. `node index.js -y YOUR_LIVE_ID`
2. You should see the following messages:
    1. `Attempting connection to YouTube chat with Live ID: YOUR_LIVE_ID`
    2. `Listening on 8901`
        1. Where 8901 is the port that ComfyJazz is listening on.
3. Add a Browser Source to your broadcasting software (e.g. [OBS](https://obsproject.com/kb/browser-source)).
4. In the URL field, enter `http://localhost:8901?youtube=true`
    1. `yourchannel` is not needed but doesn't hurt anything if kept.
5. Enjoy!
