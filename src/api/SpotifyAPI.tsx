import { SpotifyAlbum, SpotifyArtist, SpotifyTrack, SpotifyItems, SpotifyAlbumsArtistsTracks } from "../models/SpotifyModels";

const ACCESS_TOKEN_KEY = "spotify_access_token";
const REDIRECT_URI = 'http://localhost:3000/';
const API_URL = 'https://api.spotify.com/v1/';
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = 'c125d728642049e6ac238098f7560681';
/**
 * Build a url using the spotify api endpoint
 * @param path path for request
 * @param query query string params to include
 **/
function getEndpoint( path:string, query?:string ) : string {
    return `${API_URL}${path}?${query}&requestCount=${++requestCount}`; 
}

var requestCount = 0;

var lastReceived = 0;
/**
 * Make an API request to the given url.  Will automatically include required token in request.
 **/
function doAPIRequest(url:string) : Promise<any> {
    let token = getAccessToken();

    let rateLimited = localStorage.getItem( 'spotify_rate-limited' ),
        rateLimitedTime = localStorage.getItem( 'spotify_rate-limited-time' );

    if( rateLimited && rateLimitedTime ) {
        let dateTime = new Date().getTime();
        let limitTime = parseInt(rateLimitedTime) + parseInt(rateLimited) * 1000;
        if( dateTime < limitTime ) {
            return Promise.reject('Rate limited!');
        }
        localStorage.removeItem( 'spotify_rate-limited' );
        localStorage.removeItem( 'spotify_rate-limited-time' );
    }

    if( token ) {
        return fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then( ( response: Response ) => {
                //keep track of request count and compare to response.  throw away old responses by returning null.
                let requestCountObj = response.url.split('&requestCount=');
                if( requestCountObj && requestCountObj.length > 1 ) {
                    let responseId = parseInt(requestCountObj[1]);
                    if( responseId < lastReceived ) {
                        return null;
                    } else {
                        lastReceived = responseId;
                    }
                }
                if( response.ok ) {
                    return response.json();
                } else if( response.status == 429 ) {
                    let retryAfterSeconds:number = parseInt(response.headers.get('Retry-After') as string);
                    localStorage.setItem( 'spotify_rate-limited', retryAfterSeconds.toString() );
                    localStorage.setItem( 'spotify_rate-limited-time', Date.now.toString() );
                } else {
                    localStorage.removeItem(ACCESS_TOKEN_KEY);
                    getAccessToken();   
                }
            } ).then( data => {                      
                return data;
            });      
    }
    return Promise.reject();
}
 
/**
 * Search spotify with user input
 * @param query user input to search
 * @param type comma delimited string containing artist, album, or track 
 * @param pageNum what page of results to retrieve
 **/
export function query( query:string, type: string, pageNum: number = 0 ) : Promise<null|SpotifyAlbumsArtistsTracks> {  
    if( query.length == 0 ) {
        return Promise.reject();   
    }
    let limit = 10;    
    return doAPIRequest( getEndpoint('search', `q=${query}&type=${type}&limit=${limit}&offset=${pageNum * limit}`) ) as Promise<null|SpotifyAlbumsArtistsTracks>;
}

/**
 * Get artist from Spotify using id 
 * @param artist_id spotify id for artist to retrieve
 **/
export function getArtist( artist_id:string ) : Promise<null|SpotifyArtist> { 
    if( !artist_id ) {
        return Promise.reject();   
    }     
    return doAPIRequest( getEndpoint(`artists/${artist_id}`) ) as Promise<null|SpotifyArtist>;
}     

/**
 * Get album from Spotify using id 
 * @param album_id spotify id for album to retrieve
 **/
export function getAlbum( album_id:string ) : Promise<null|SpotifyAlbum> {    
    if( !album_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`albums/${album_id}`)  ) as Promise<null|SpotifyAlbum>;
}

/**
 * Get all albums of an artist from Spotify using the artist_id
 * @param artist_id spotify id for artist to retrieve albums for
 **/
export function getAlbums( artist_id:string ) : Promise<null|SpotifyItems<SpotifyAlbum>> {    
    if( !artist_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`artists/${artist_id}/albums`, `limit=50`)  ) as Promise<null|SpotifyItems<SpotifyAlbum>>;
}
 
/**
 * Get all tracks of an album from Spotify using the album_id
 * @param album_id spotify id for album to retrieve tracks for
 **/
export function getTracks( album_id:string ) : Promise<null|SpotifyItems<SpotifyTrack>> {    
    if( !album_id ) {
        return Promise.reject();   
    }     
    return doAPIRequest( getEndpoint(`albums/${album_id}/tracks`, `limit=50`) ) as Promise<null|SpotifyItems<SpotifyTrack>>;      
}

/**
 * Get track from Spotify using id 
 * @param track_id spotify id for track to retrieve
 **/
export function getTrack( track_id:string ) : Promise<null|SpotifyTrack> {    
    if( !track_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`tracks/${track_id}`) ) as Promise<null|SpotifyTrack>;
}

//random string utility function
let generateRandomString = function (length:number) : string {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

/**
 * this function is responsible for getting and setting the access token for the app to use. 
 * 
 * it first checks local storage for a token, and if found immediately returns
 * 
 * if not found in local storage it checks the url hash.  this will be the case when returning from the spotify redirect uri with a new access token.
 * 
 * if not found in the hash, we need to request a new token by redirecting the browser to the spotify auth url.  this will then redirect to our redirect uri.
 * 
**/
export function getAccessToken(): string | null {    
    let access_token = localStorage.getItem( ACCESS_TOKEN_KEY );
    if( access_token ) {
        return access_token;
    }

    if( window.location.hash.length ) { 
        access_token = readHash( 'access_token' );
        if( access_token ) {            
            localStorage.setItem( ACCESS_TOKEN_KEY, access_token);
            window.location.hash = "";
            return access_token;
        } else if( window.location.hash.length && window.location.hash.indexOf( 'error' ) >= 0 ) { 
            console.error( readHash( 'error' ) );
        }
        console.error( 'Failed to authenticate' );
        return null;
    }  
    

    var client_id = CLIENT_ID;

    var state = generateRandomString(16);

    localStorage.setItem('spotify_state', state);

    var url = AUTHORIZE_URL;
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
    url += '&state=' + encodeURIComponent(state);
    window.location.href = url;
    return null;
}

/**
 *  Read value from the window.location.hash string
 **/
function readHash(key:string) : string | null {
    let windowHash = window.location.hash.substring(1, window.location.hash.length).split( '&' );
    for( let i = 0; i < windowHash.length; i++ ){
        let keyVal = windowHash[i].split( '=' );
        if( keyVal[0] == key && keyVal.length > 1 ) {
            return keyVal[1];          
        }
    }
    return null;
}