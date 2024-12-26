# Sortify
## _Lightweight Tool for Spotify Playlist Management_

Sortify is a Node.js application that runs entirely on the browser.

>I use Spotify a lot and my playlists are a mess. With nearly 3,000 uncategorized tracks in my Liked Songs playlist, I built this application to better utilize this sunken effort.

Note: Sortify uses Bearer Token Authorization and will require a Spotify Developer account to provide the necessary token.

__The latest version only supports creating a new playlist and populating it with the current user's 50 last liked songs.__

## Features
- View the last 50 tracks in Liked Songs
- Create a new playlist
- Add songs to a playlist

## Tech
Sortify uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [dotenv] -  secure sensitive data

## Installation
Sortify requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
cd path/to/sortify
npm i
npm start
```

In the root directory, create an .env file and configure sensitive variables

```sh
API_KEY = "<BEARER TOKEN GOES HERE>"
URL = "https://api.spotify.com/v1"
USER_ID = "<USER_ID GOES HERE>"
HOST = "localhost"
PORT = "8000"
```

## License
MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [dotenv]: <https://www.npmjs.com/package/dotenv>