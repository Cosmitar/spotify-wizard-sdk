import Artist from './entities/Artist';
import Album from './entities/Album';
import Browse from './entities/Browse';
import {Profile, Me} from './entities/Profile';
import Session from './services/Session';

function OAUTH(scopes = '') {
    Session.config({
        clientId: '1dd4ae27b3fc480ebf627679e5bb0e17',
        secretId: '31e8696e70574648b55b6fcc7c5b1135',
        redirect_uri: 'http://localhost:3000/',
        scopes: scopes
    });
    let token = window.location.hash.split('&')[0].split('=')[1];
    if (token) {
        Session.token = token;
    } else {
        Session.login().then(url => {
            window.location.href = url;
        });
    }
}
/*
// ------------------------------------------------
// GET AN ALBUM
// @see https://developer.spotify.com/web-api/get-album/
Album.find('0sNOF9WDwhWunNAHPD3Baj')
.then(album => console.log(album));

// ------------------------------------------------
// GET SEVERAL ALBUMS
// @see https://developer.spotify.com/web-api/get-several-albums/
Album.findMany(['0sNOF9WDwhWunNAHPD3Baj','41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4'])
.then(albumsCollection => console.log(albumsCollection));

// ------------------------------------------------
// GET AN ALBUM'S TRACKS
// @see https://developer.spotify.com/web-api/get-albums-tracks/
Album.find('0sNOF9WDwhWunNAHPD3Baj')
.then(album => console.log(album.tracks));

// ------------------------------------------------
// GET AN ARTIST
// @see https://developer.spotify.com/web-api/get-artist/
Artist.find('0OdUWJ0sBjDrqHygGUXeCF')
.then(artist => console.log(artist));

// ------------------------------------------------
// GET SEVERAL ARTISTS
// @see https://developer.spotify.com/web-api/get-several-artists/
Artist.findMany(['0OdUWJ0sBjDrqHygGUXeCF','0oSGxfWSnnOXhD2fKuz2Gy','3dBVyJ7JuOMt4GE9607Qin'])
.then(atistsCollection => console.log(atistsCollection));

// ------------------------------------------------
// GET AN ARTIST'S ALBUMS
// @see https://developer.spotify.com/web-api/get-artists-albums/
Artist.find('0OdUWJ0sBjDrqHygGUXeCF')
.then(artist => {
    artist.getAlbums().then(page => {
        console.log(page.elements);
    });
});

// ------------------------------------------------
// GET AN ARTIST'S TOP TRACKS
// @see https://developer.spotify.com/web-api/get-artists-top-tracks/
Artist.find('0OdUWJ0sBjDrqHygGUXeCF')
.then(artist => {
    artist.getTopTracks('US').then(tracks => console.log(tracks));
});

// ------------------------------------------------
// GET AN ARTIST'S RELATED ARTISTS
// @see https://developer.spotify.com/web-api/get-related-artists/
Artist.find('0OdUWJ0sBjDrqHygGUXeCF')
.then(artist => {
    artist.getRelatedArtists().then(tracks => console.log(tracks));
});

// ------------------------------------------------
// GET A LIST OF FEATURED PLAYLISTS
// @see https://developer.spotify.com/web-api/get-list-featured-playlists/
OAUTH();
Browse.getFeaturedPlaylists()
.then(page => {
    console.log(page);
});

// ------------------------------------------------
// GET A LIST OF NEW RELEASES
// @see https://developer.spotify.com/web-api/get-list-new-releases/
OAUTH();
Browse.getNewAlbumReleases()
.then(page => {
    console.log(page);
});

// ------------------------------------------------
// GET A LIST OF CATEGORIES
// @see https://developer.spotify.com/web-api/get-list-categories/
OAUTH();
Browse.getCategories()
.then(page => {
    console.log(page);
});

// ------------------------------------------------
// GET A CATEGORY’S PLAYLISTS
// @see https://developer.spotify.com/web-api/get-categorys-playlists/
OAUTH();
Browse.getCategories()
.then(page => {
    let category = page.firstElement();
    Browse.getCategoryPlaylists(category.id)
    .then(page => {
        console.log(page);
    });
});

// ------------------------------------------------
// GET CURRENT USER'S PROFILE
// @see https://developer.spotify.com/web-api/get-current-users-profile/
OAUTH();
Profile.findMe()
.then(me => {
    console.log(`I am: ${me.display_name}`);
});

// ------------------------------------------------
// GET FOLLOWED ARTISTS
// @see https://developer.spotify.com/web-api/get-followed-artists/
OAUTH('user-follow-read');
Me.following()
.then(page => {
    console.log(page);
});

// ------------------------------------------------
// FOLLOW ARTISTS OR USERS
// @see https://developer.spotify.com/web-api/follow-artists-users/
OAUTH('user-follow-modify');
Artist.find('74ASZWbe4lXaubB36ztrGX')
.then(artist => {
    console.log(artist);
    Me.follow(artist)
    .then(response => {
        console.log('success');
    });
});

// ------------------------------------------------
// UNFOLLOW ARTISTS OR USERS
// @see https://developer.spotify.com/web-api/unfollow-artists-users/
OAUTH('user-follow-modify');
Artist.find('74ASZWbe4lXaubB36ztrGX')
.then(artist => {
    console.log(artist);
    Me.unfollow(artist)
    .then(response => {
        console.log(response);
    });
});

// ------------------------------------------------
// CHECK IF CURRENT USER FOLLOWS ARTISTS OR USERS
// @see https://developer.spotify.com/web-api/check-current-user-follows/
OAUTH('user-follow-read');
Artist.find('74ASZWbe4lXaubB36ztrGX')
.then(artist => {
    console.log(artist);
    Me.isFollowing(artist)
    .then(response => {
        console.log(response);
    });
});


Artist.where('aerosmith', {limit:2})
.then(page => {
    console.log(page.elements);
    page.nextPage().then(page => {
        console.log(page.elements);
    });
});

*/