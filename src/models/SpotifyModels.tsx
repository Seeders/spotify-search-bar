import { AppData } from "../App";

/**
 * API Response shape for spotify image
 */
export interface SpotifyImage {
    height: number;
    width: number;
    url: string;
}

/**
 * common fields in spotify api items
 */
export interface SpotifyItem {
    id: string;
    type: string;
    name: string;
    href: string;
    uri: string;
}
/**
 * API Response shape for spotify artist
 */
export interface SpotifyArtist extends SpotifyItem {
    followers: {
        total: number
    };
    images: Array<SpotifyImage>;
    genres: Array<string>;
    popularity: number;    
}

/**
 * API Response shape for spotify album
 */
export interface SpotifyAlbum extends SpotifyItem {
    artists: Array<SpotifyItem>
    release_date: string;
    total_tracks: number;
    images: Array<SpotifyImage>;
    album_type: string;
}

/**
 * API Response shape for spotify track
 */
export interface SpotifyTrack extends SpotifyItem {
    album: SpotifyAlbum;
    artists: Array<SpotifyItem>;
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

/**
 * API Response shape for collection of items
 */
export interface SpotifyItems<T> {    
    href: string;
    items: Array<T>;
    limit: number;
    next?: string;
    previous?: string;
    offset: number;
    total: number;
}

/**
 * API Response shape for /query endpoint
 */
export interface SpotifyAlbumsArtistsTracks {
    albums: SpotifyItems<SpotifyAlbum>,
    artists: SpotifyItems<SpotifyArtist>,
    tracks: SpotifyItems<SpotifyTrack>
}


/**
 * Make array of App consumable AppData Artists from Query Result SpotifyAlbumsArtistsTracks
 */
export function mapResultArtistItems(results : SpotifyAlbumsArtistsTracks) : Array<AppData<SpotifyArtist>> {
    return mapArtists( results.artists && results.artists.items ? results.artists.items : [])
}

/**
 * Make array of App consumable AppData Albums from Query Result SpotifyAlbumsArtistsTracks
 */
export function mapResultAlbumItems(results : SpotifyAlbumsArtistsTracks) : Array<AppData<SpotifyAlbum>> {
    return mapAlbums( results.albums && results.albums.items ? results.albums.items : [])
}

/**
 * Make array of App consumable AppData Tracks from Query Result SpotifyAlbumsArtistsTracks
 */
export function mapResultTrackItems(results : SpotifyAlbumsArtistsTracks) : Array<AppData<SpotifyTrack>> {
    return mapTracks( results.tracks && results.tracks.items ? results.tracks.items : [])
}

/**
 * Make array of App consumable AppData from SpotifyArtist Array
 */
export function mapArtists( items: Array<SpotifyArtist> ) : Array<AppData<SpotifyArtist>> {
    return items.map( (item:SpotifyArtist) => {
        return mapArtist( item );
    });  
}

/**
 * Make App consumable AppData from SpotifyArtist
 */
export function mapArtist(item:SpotifyArtist) {
    return {
        id: item.id,
        parent_id: "",
        name: item.name,
        image: item.images.length ? item.images[0].url : "",
        type: "artist",
        meta: item
    }
}
/**
 * Make array of App consumable AppData from SpotifyAlbums Array
 */
export function mapAlbums( items: Array<SpotifyAlbum> ) : Array<AppData<SpotifyAlbum>> {
    return items.map( (item:SpotifyAlbum) => {
        return mapAlbum( item );
    });
}

/**
 * Make App consumable AppData from SpotifyAlbum
 */
export function mapAlbum( item:SpotifyAlbum ) {
    return {
        id: item.id,
        parent_id: item.artists.length ? item.artists[0].id : "",
        name: `(${item.release_date.split('-')[0]}) - ${item.name}`,
        image: item.images.length ? item.images[0].url : "",
        type: "album",
        meta: item
    }
}
/**
 * Make array of App consumable AppData from SpotifyTrack Array
 */
export function mapTracks( items: Array<SpotifyTrack>, album?: AppData<SpotifyAlbum> ) : Array<AppData<SpotifyTrack>> {
    return items.map( (item:SpotifyTrack) => {
        return mapTrack( item, album );
    });
}

/**
 * Make App consumable AppData from SpotifyTrack
 */
export function mapTrack(item:SpotifyTrack, album?: AppData<SpotifyAlbum>) {
    return {
        id: item.id,
        parent_id: item.album ? item.album.id : ( album ? album.id : ""),
        name: item.name,
        image: item.album && item.album.images && item.album.images.length ? item.album.images[0].url : ( album ? album.image : "" ) ,
        type: "track",
        meta: item
    }
}