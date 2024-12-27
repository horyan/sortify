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
let currentOffset = 0;
let songUris = [];

const userId = await globalUpdateUserId();
const songUrisByTime = await globalUpdateSongUrisByTime(); //calls getLikedSongs()
const playlistId = await globalUpdatePlaylistId(); //calls createPlaylist()

/* prepare songUris array for addSongsToPlaylist() POST body */
for(let key in songUrisByTime) {
    let val = songUrisByTime[key];
    songUris.push(val);
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
}

/*
  TODO: getLikedSongs() should loop until 0 remaining liked songs
    1. verify while condition (if 'response.next' != null)
      a. update currentOffset += returnedItemCount
      b. update "added_at":"uris" dict
      c. return dict
*/
async function getLikedSongs() {
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

  const json = await response.json();
  let songs = {};
  
  for (let i = 0, song; i < json.items.length; i++) {
    song = json.items[i].track.uri;
    songs[json.items[i].added_at] = song;
  }
  
  return songs
  }
  catch (error) {
    console.error(error);
  }
}

// UPDATERS
async function globalUpdateUserId() {
  return await getUserProfile();
}

async function globalUpdatePlaylistId() {
  return await createPlaylist();
}

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
      body: JSON.stringify({ "name": "Last 50 Liked Songs", "description": "created via API", "public": false})
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
}

async function addSongsToPlaylist() {
  const url = `${URL}/playlists/${playlistId}/tracks`;
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
}

/* Instructions
  1. npm start
  2. update API_TOKEN variable in .env

  Next Steps
  1. get more than 50 liked songs using dynamic offset to loop getLikedSongs()
  2. parse [added_at] keys in songUrisByTime
    a. configure filter logic
    b. add songs to playlist
    c. update playlist name*/