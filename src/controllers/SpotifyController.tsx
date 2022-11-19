
export interface SpotifyAPIImage {
    height: number;
    width: number;
    url: string;
}

export interface SpotifyAPIItem {
    id: string;
    type: string;
    name: string;
    href: string;
    uri: string;
}

export interface SpotifyAPIArtist extends SpotifyAPIItem {
    followers: {
        total: number
    };
    images: Array<SpotifyAPIImage>;
    genres: Array<string>;
    popularity: number;    
}

export interface SpotifyAPIAlbum extends SpotifyAPIItem {
    artists: Array<SpotifyAPIItem>
    release_date: string;
    total_tracks: number;
    images: Array<SpotifyAPIImage>;
    album_type: string;
}

export interface SpotifyAPITrack extends SpotifyAPIItem {
    album: SpotifyAPIAlbum;
    artists: Array<SpotifyAPIItem>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    is_local: boolean;
    popularity: number;
    track_number: number;
    preview_url?: string;
    external_ids: {
        isrc: string;
    }
}

export interface SpotifyAPIResultItem<T> {    
    href: string;
    items: Array<T>;
    limit: number;
    next?: string;
    previous?: string;
    offset: number;
    total: number;
}

export interface SpotifyAPIResult {
    albums: SpotifyAPIResultItem<SpotifyAPIAlbum>,
    artists: SpotifyAPIResultItem<SpotifyAPIArtist>,
    tracks: SpotifyAPIResultItem<SpotifyAPITrack>
}

export default class SpotifyController {

    public query( query:string ) {      
        return fetch( `/query?q=${query}` )
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