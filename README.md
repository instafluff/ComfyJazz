# ComfyJazz

![GitHub repo size](https://img.shields.io/github/repo-size/zephsinx/ComfyJazz)
![GitHub contributors](https://img.shields.io/github/contributors/zephsinx/ComfyJazz)
![Twitch channel](https://img.shields.io/twitch/status/zephsinx?style=social)

ComfyJazz is a tool to play easy-listening, comfy, computer-generated Jazz music, with built-in Twitch chat integration. Notes are played along randomly and for each chat message on your channel.

### Table of Contents
- [Credits](#credits)
- [Prerequisites](#prerequisites)
- [Installing ComfyJazz](#installing-comfyjazz)
- [Using ComfyJazz (simple)](#using-comfyjazz-simple)
- [Using ComfyJazz (self-hosted)](#using-comfyjazz-self-hosted)

## Credits

All credits to the original project go to [@Instafluff](https://github.com/instafluff) and all participants in the original project. Instafluff can also be found on Twitch at [ttv/Instafluff](https://twitch.tv/instafluff)

## Prerequisites

> NOTE: If you do not plan to run ComfyJazz locally and simply want to use a hosted version, skip to the [Using ComfyJazz (simple)](#using-comfyjazz-simple) section of the README.

Before you begin, ensure you have met the following requirements:
* Download and install [Node.js](https://nodejs.org/en/download/) matching for your operating system.
  * The LTS (Long-term Support) version is recommended for most users.
* Download and extract the [latest ComfyJazz code](https://github.com/zephsinx/ComfyJazz/archive/refs/heads/main.zip).

## Installing ComfyJazz

ComfyJazz requires no installation beyond that listed in the [Prerequisites](#prerequisites) section.

## Using ComfyJazz (simple)

The simplest way to set up ComfyJazz is to use the version hosted by Instafluff. This allows you to use ComfyJazz in your stream with no additional setup beyond configuring a Browser Source for your stream.

### Steps
1. Add a new Browser Source to your broadcasting software (e.g. [OBS](https://obsproject.com/kb/browser-source)).
2. In the URL field, enter `https://www.instafluff.tv/ComfyJazz?channel=yourchannel`.
3. Replace `yourchannel` with your Twitch username.
4. Enjoy!

Example:
```
https://www.instafluff.tv/ComfyJazz?channel=zephsinx
```

## Using ComfyJazz (self-hosted)

Another setup option is to host the application yourself. This provides multiple benefits such as:
* Customizability, letting you add your own instruments other changes.
* Better reliability and security due to not depending on someone else's hosted application.
* Continued use of ComfyJazz in the case that `instafluff.tv/ComfyJazz` is not accessible.

### Steps (Windows)
1. Open a Windows command prompt by going to the start menu and typing `cmd`, and opening the `Command Prompt` application.
2. Navigate to the root folder of the downloaded ComfyJazz code. (where the `index.js` is found)
   1. `Method 1`: Take the folder path and type `cd <folder path>` in the command prompt
      1. e.g. `cd C:\Projects\Software\ComfyJazz`
   2. `Method 2`: Type `cmd` into the folder URL bar and hit Enter.
3. Type `node index.js` and hit Enter.
4. You should see a message displayed like the following:
   1. `WebWebWeb is running on 8901` where `8901` is the port the ComfyJazz is running on.
5. Add a new Browser Source to your broadcasting software (e.g. [OBS](https://obsproject.com/kb/browser-source)).
6. In the URL field, enter `http://localhost:<port>?channel=yourchannel`.
7. Replace `<port>` with the port output when ComfyJazz was run, and `yourchannel` with your Twitch username.
8. Enjoy!

Example:
```
http://localhost:8901?channel=zephsinx
```

Notes:
1. Keep the command prompt window open, as closing it will stop ComfyJazz.
   1. If you would like ComfyJazz to run as a Windows service and not have to keep a command prompt open, [NSSM](https://nssm.cc/download) can be used for this purpose.
2. To stop the application, press `CTRL+C` in the command prompt window, or simply close the command prompt.

## Contributing to ComfyJazz
To contribute to ComfyJazz, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin ComfyJazz/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
