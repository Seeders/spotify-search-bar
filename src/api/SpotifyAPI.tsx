
function getEndpoint( path:string, query?:string ) {
    var api_url = 'https://api.spotify.com/v1/';
    return query ? `${api_url}${path}?${query}` : `${api_url}${path}`; 
}

function doAPIRequest(url:string) {
    let token = getAccessToken();
    return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then( ( response ) => {
            if( response.ok ) {
                return response.json();
            } else {
                localStorage.removeItem( "spotify_access_token");
                getAccessToken();   
            }
         } ).then( response => {                      
            return response;
        });      
}
 

export function query( query:string, type: string, pageNum: number = 0 ) {      
    let limit = 10;
    
    return doAPIRequest( getEndpoint('search', `q=${query}&type=${type}&limit=${limit}&offset=${pageNum * limit}`) );
}

export function getArtist( artist_id:string ) { 
    if( !artist_id ) {
        return Promise.resolve();   
    }     
    return doAPIRequest( getEndpoint(`artists/${artist_id}`) );
}     

export function getAlbum( album_id:string ) {    
    if( !album_id ) {
        return Promise.resolve();   
    }    
    return doAPIRequest( getEndpoint(`albums/${album_id}`)  );
}

export function getAlbums( artist_id:string ) {    
    if( !artist_id ) {
        return Promise.resolve();   
    }    
    return doAPIRequest( getEndpoint(`artists/${artist_id}/albums`, `limit=50`)  );
}
    
export function getTracks( album_id:string ) {    
    if( !album_id ) {
        return Promise.resolve();   
    }     
    return doAPIRequest( getEndpoint(`albums/${album_id}/tracks`, `limit=50`) );      
}

export function getTrack( track_id:string ) {    
    if( !track_id ) {
        return Promise.resolve();   
    }    
    return doAPIRequest( getEndpoint(`tracks/${track_id}`) );
}

let generateRandomString = function (length:number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export function getAccessToken() {
    
    let access_token = localStorage.getItem( 'spotify_access_token' );
    if( access_token ) {
        return access_token;
    }

    if( window.location.hash.length && window.location.hash.indexOf( 'access_token' ) ) { 
        let windowHash = window.location.hash.substring(1, window.location.hash.length - 1).split( '&' );
        for( let i = 0; i < windowHash.length; i++ ){
            if( windowHash[i].indexOf( 'access_token' ) >= 0 ) {
                access_token = windowHash[i].replace( 'access_token=', '' );
                localStorage.setItem('spotify_access_token', access_token);
                return access_token;
            }
        }
    }
    

    var client_id = 'c125d728642049e6ac238098f7560681';
    var redirect_uri = 'http://localhost:3000/';

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
