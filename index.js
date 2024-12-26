import 'dotenv/config';
import * as http from 'http';
const host = process.env.HOST;
const port = process.env.PORT;
const URL = process.env.URL;
const apiKey = process.env.API_KEY;
const userId = process.env.USER_ID; // check if APIs support dynamic reference

// create HTTP server
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Sortify");
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

/*
  TODO2: redirect user to Spotify authn and store tokens
*/

let songUrisByTime = {};
async function getSongUrisByTime() {
  songUrisByTime = await getData();
  return songUrisByTime
};

let songUris = [];

/*
  TODO1: get ALL Liked Songs (limit 50, so chain using dynamic offset query parameter)
    (try) while item exists, store limit=50 and pass offset+returnedItemCount into getData()
  1. identify behavior when 0 remaining items to return)
  2. verify while condition
  3. test continuous getData() logic
*/
let currentOffset = 0;

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

async function createPlaylist() {
  const url = `${URL}/users/${userId}/playlists`;
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({ "name": "Demo: Summer 2015 😇", "description": "created via API", "public": false})
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    addSongsToPlaylist(json.id); // investigate separate async/await getter operation
  }
  catch (error) {
    console.error(error);
  }
}

//prepare POST body details to add songs
await getSongUrisByTime(); // update global variable songUrisByTime AFTER getData() completes
for(let key in songUrisByTime) {
  let val = songUrisByTime[key];
  songUris.push(val);
}

async function addSongsToPlaylist(playlistId) {
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

getData();
createPlaylist(); // calls addSongsToPlaylist(playlistId) within


//Latest Build Instructions
  // 1. in root folder, create .env file and populate sensitive variables
  // 2. in terminal, run: npm start
  // 3. refresh access token via postman every ~23 minutes and update API_TOKEN in .env

//Next Steps:
  // 1. getData() until we have all liked songs
  // 2. parse added_at and test filter logic
  // 3. add filtered songs
  // 3. update playlist name