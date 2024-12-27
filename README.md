# Sortify
## _Lightweight Tool for Spotify Playlist Management_

Sortify is a Node.js application that runs entirely in the browser.

>I use Spotify a lot and my playlists are a mess. With nearly 3,000 uncategorized tracks in my Liked Songs playlist, I built this application to better utilize the sunken effort.

Note: Sortify uses Bearer Token Authorization and will require a [Spotify Developer account](https://developer.spotify.com/) to provide the necessary token.

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

Install the dependencies and devDependencies.

```sh
cd path/to/sortify
npm install
```

In the root directory, create an .env file and configure sensitive variables.

```sh
HOST = "localhost"
PORT = "8000"
URL = "https://api.spotify.com/v1"
API_KEY = "<BEARER TOKEN GOES HERE>"
```

Start the server.
```sh
npm start
```

## License
MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [dotenv]: <https://www.npmjs.com/package/dotenv>