import { SpotifyAlbum, SpotifyArtist, SpotifyTrack, SpotifyItems, SpotifyAlbumsArtistsTracks } from "../models/SpotifyModels";

const ACCESS_TOKEN_KEY = "spotify_access_token";

/**
 * Build a url using the spotify api endpoint
 * @param path path for request
 * @param query query string params to include
 **/
function getEndpoint( path:string, query?:string ) : string {
    var api_url = 'https://api.spotify.com/v1/';
    return query ? `${api_url}${path}?${query}` : `${api_url}${path}`; 
}

/**
 * Make an API request to the given url.  Will automatically include required token in request.
 **/
function doAPIRequest(url:string) : Promise<any> {
    let token = getAccessToken();

    let rateLimited = localStorage.getItem( 'spotify_rate-limited' ),
        rateLimitedTime = localStorage.getItem( 'spotify_rate-limited-time' );

    if( rateLimited && rateLimitedTime ) {
        console.warn( 'Rate limited!', rateLimited, rateLimitedTime );
        let dateTime = new Date().getTime();
        let limitTime = parseInt(rateLimitedTime) + parseInt(rateLimited) * 1000;
        if( dateTime < limitTime ) {
            return Promise.reject();
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
            }).then( ( response ) => {
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
            } ).then( response => {                      
                return response;
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
export function query( query:string, type: string, pageNum: number = 0 ) : Promise<SpotifyAlbumsArtistsTracks> {  
    if( query.length == 0 ) {
        return Promise.reject();   
    }
    let limit = 10;    
    return doAPIRequest( getEndpoint('search', `q=${query}&type=${type}&limit=${limit}&offset=${pageNum * limit}`) );
}

/**
 * Get artist from Spotify using id 
 * @param artist_id spotify id for artist to retrieve
 **/
export function getArtist( artist_id:string ) : Promise<SpotifyArtist> { 
    if( !artist_id ) {
        return Promise.reject();   
    }     
    return doAPIRequest( getEndpoint(`artists/${artist_id}`) );
}     

/**
 * Get album from Spotify using id 
 * @param album_id spotify id for album to retrieve
 **/
export function getAlbum( album_id:string ) : Promise<SpotifyAlbum> {    
    if( !album_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`albums/${album_id}`)  );
}

/**
 * Get all albums of an artist from Spotify using the artist_id
 * @param artist_id spotify id for artist to retrieve albums for
 **/
export function getAlbums( artist_id:string ) : Promise<SpotifyItems<SpotifyAlbum>> {    
    if( !artist_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`artists/${artist_id}/albums`, `limit=50`)  );
}
 
/**
 * Get all tracks of an album from Spotify using the album_id
 * @param album_id spotify id for album to retrieve tracks for
 **/
export function getTracks( album_id:string ) : Promise<SpotifyItems<SpotifyTrack>> {    
    if( !album_id ) {
        return Promise.reject();   
    }     
    return doAPIRequest( getEndpoint(`albums/${album_id}/tracks`, `limit=50`) );      
}

/**
 * Get track from Spotify using id 
 * @param track_id spotify id for track to retrieve
 **/
export function getTrack( track_id:string ) : Promise<SpotifyTrack> {    
    if( !track_id ) {
        return Promise.reject();   
    }    
    return doAPIRequest( getEndpoint(`tracks/${track_id}`) );
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
    var redirect_uri = 'http://localhost:3000/';
    let access_token = localStorage.getItem( ACCESS_TOKEN_KEY );
    if( access_token ) {
        return access_token;
    }

    if( window.location.hash.length && window.location.hash.indexOf( 'access_token' ) ) { 
        let windowHash = window.location.hash.substring(1, window.location.hash.length - 1).split( '&' );
        for( let i = 0; i < windowHash.length; i++ ){
            if( windowHash[i].indexOf( 'access_token' ) >= 0 ) {
                access_token = windowHash[i].replace( 'access_token=', '' );
                localStorage.setItem( ACCESS_TOKEN_KEY, access_token);
                window.location.hash = "";
                return access_token;
            }
        }
    }
    

    var client_id = 'c125d728642049e6ac238098f7560681';

    var state = generateRandomString(16);

    localStorage.setItem('spotify_state', state);

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);
    window.location.href = url;
    return null;
}
