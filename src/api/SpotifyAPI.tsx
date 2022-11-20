


function doRequest ( url: string ) {
    return fetch( url )
        .then( ( response ) => response.json() )
        .then( ( response ) => {                      
            return response;
        },
        (error) => {
            console.error( error );    
        }            
    )
}

export function query( query:string, type: string, pageNum: number = 0 ) {      
    let limit = 10;
    return doRequest( `/query?q=${query}&type=${type}&limit=${limit}&offset=${pageNum * limit}` )
}

export function getArtist( artist_id:string ) { 
    if( !artist_id ) {
        return Promise.resolve();   
    }
    return doRequest( `/artists?artist_id=${artist_id}` )
}     

export function getAlbum( album_id:string ) {    
    if( !album_id ) {
        return Promise.resolve();   
    }
    return doRequest( `/albums?album_id=${album_id}` )
}

export function getAlbums( artist_id:string ) {    
    if( !artist_id ) {
        return Promise.resolve();   
    }
    return doRequest( `/albums?artist_id=${artist_id}&limit=50` )
}
    
export function getTracks( album_id:string ) {    
    if( !album_id ) {
        return Promise.resolve();   
    }
    return doRequest( `/tracks?album_id=${album_id}&limit=50` )      
}

export function getTrack( track_id:string ) {    
    if( !track_id ) {
        return Promise.resolve();   
    }
    return doRequest( `/tracks?track_id=${track_id}` )
}

