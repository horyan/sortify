import 'dotenv/config';
import * as http from 'http';
const host = process.env.HOST;
const port = process.env.PORT;
const URL = process.env.URL;
const apiKey = process.env.API_KEY;

// create HTTP server
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Sortify");
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

/* TODO: redirect user to Spotify authn and store tokens */

// MAIN
let currentOffset = 2713-100;//test
let songUris = [];
const [userId, songUrisByTime] = await Promise.all([globalUpdateUserId(), globalUpdateSongUrisByTime()]);
const playlistId = await globalUpdatePlaylistId();

for(let key in songUrisByTime) { //prepare addSongsToPlaylist() POST body */
  songUris.push(songUrisByTime[key]);
}
addSongsToPlaylist();

// GETTERS
async function getUserProfile() {
  const url = `${URL}/me`;
  const response = await fetch(url , {
    headers: {"Authorization": `Bearer ${apiKey}`},
    method: "GET"
  })

  const json = await response.json();
  return json.id;
};

async function getLikedSongs() {
  let songs = {}
  let json = await getData();

  while (currentOffset < json.total) {
    for (let i = 0, song; i < json.items.length; i++) {
      song = json.items[i].track.uri;
      songs[json.items[i].added_at] = song;
    }

    currentOffset+=json.items.length;
    json = await getData();
  }

  return songs;
};

/* REFACTOR getData()+getLikedSongs(): if !null, url = json.next */
async function getData() {
  const url = `${URL}/me/tracks?limit=50&offset=${currentOffset}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      method: "GET"
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  }
  catch (error) {
    console.error(error);
  }
};

// UPDATERS
async function globalUpdateUserId() {
  return await getUserProfile();
};

async function globalUpdatePlaylistId() {
  return await createPlaylist();
};

async function globalUpdateSongUrisByTime() {
  return await getLikedSongs();
};

// SETTERS
async function createPlaylist() {
  const url = `${URL}/users/${userId}/playlists`;
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({ "name": `Last 100 Liked Songs`, "description": "created via API", "public": false})
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.id;
  }
  catch (error) {
    console.error(error);
  }
};

/* TODO: ability to add > 100 songs, maybe loop i=i+100 and increment position */
async function addSongsToPlaylist() {
  const url = `${URL}/playlists/${playlistId}/tracks`;
  await getLikedSongs();
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({ "uris": songUris, "position": 0})
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  }
  catch (error) {
    console.error(error);
  }
};

/* Instructions
  1. npm start
  2. update API_TOKEN variable in .env

  Next Steps
  1. add addSongsToPlaylist() loop to add >100 songs
  2. Parse [added_at] keys in songUrisByTime
    i. Use Case 1: filter songs based on [added_at] year 
      a. add filtered songs to playlist
      b. update playlist name
  3. Add login UI, auto refresh access token
  4. Fix await hell
  5. Add more filter options*/