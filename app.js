require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', async (req, res) => {
    res.render('home');
});

app.get('/artist-search', async (req, res) => {
    // Query param
    let artistName = req.query.theArtistName;
    let result = await spotifyApi.searchArtists(artistName);
    console.log('The received data from the API: result :) ');
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artists = result.body.artists.items;

    res.render('artist-search-results', {
        artists
    });
});

app.get('/albums/:artistId', async (req, res) => {
    const artistId = req.params.artistId;
    let result = await spotifyApi.getArtistAlbums(artistId);
    let albums = result.body.items;
    res.render('albums', {
        albums
    });
});

app.get('/tracks/:albumId', async (req, res) => {
    const albumId = req.params.albumId;
    let result = await spotifyApi.getAlbumTracks(albumId);
    console.log(result.body);
    let tracks = result.body.items;
    res.render('tracks', {
        tracks
    });
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));