
export default class SpotifyController {

    public query( query:string, type: string, pageNum: number = 0 ) {      
        let limit = 10;
        return fetch( `/query?q=${query}&type=${type}&limit=${limit}&offset=${pageNum * limit}` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }

    public getArtist( artist_id:string ) { 
        if( !artist_id ) {
            return Promise.resolve();   
        }
        return fetch( `/artists?artist_id=${artist_id}` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }     
    
    public getAlbum( album_id:string ) {    
        if( !album_id ) {
            return Promise.resolve();   
        }
        return fetch( `/albums?album_id=${album_id}` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }
    
    public getAlbums( artist_id:string ) {    
        if( !artist_id ) {
            return Promise.resolve();   
        }
        return fetch( `/albums?artist_id=${artist_id}&limit=50` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }
        
    public getTracks( album_id:string ) {    
        if( !album_id ) {
            return Promise.resolve();   
        }
        return fetch( `/tracks?album_id=${album_id}&limit=50` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }

    public getTrack( track_id:string ) {    
        if( !track_id ) {
            return Promise.resolve();   
        }
        return fetch( `/tracks?track_id=${track_id}` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {                      
                return response;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }
}

