import * as React from "react";
import SpotifySearchResultSection from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { SpotifyAPIResult, SpotifyAPIArtist, SpotifyAPIAlbum, SpotifyAPITrack } from "../../controllers/SpotifyController";
import { SpotifyResult } from "../SpotifySearchResult/SpotifySearchResult";
import getClassName from "../../utils/GetClassName";
import SpotifyController from "../../controllers/SpotifyController";

require("./SpotifySearchResults.css");



interface SpotifySearchResultsProps {
  className?: string;
  children?: React.ReactNode;
  query: string;
  results?: SpotifyAPIResult;
}

interface SpotifySearchResultsState {
    results?: SpotifyAPIResult;
}

export default class SpotifySearchResults extends React.Component<SpotifySearchResultsProps, SpotifySearchResultsState> {
    mainClass : string = "search-results";

    constructor( props: SpotifySearchResultsProps ) {
        super(props); 
        this.state = {
            results: this.props.results
        };
    
    }

    componentDidUpdate( prevProps : SpotifySearchResultsProps ) {
        if (prevProps.results !== this.props.results ) {
            this.setState( { results: this.props.results } );
        }
    }


    render() {       

        let artists, albums, tracks: Array<SpotifyResult> = [];
        if( this.state.results ) {
            artists = this.mapArtists(this.state.results);
            albums = this.mapAlbums(this.state.results);
            tracks = this.mapTracks(this.state.results);        
        }
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <SpotifySearchResultSection name="Artists" type="artist" query={this.props.query} results={artists} mapFunction={this.mapArtists} onClick={this.selectArtist} className="search-result-section--artists" />
                <SpotifySearchResultSection name="Albums" type="album" query={this.props.query} results={albums} mapFunction={this.mapAlbums} onClick={this.selectAlbum} className="search-result-section--albums" />
                <SpotifySearchResultSection name="Tracks" type="track" query={this.props.query} results={tracks} mapFunction={this.mapTracks} onClick={this.selectTrack} className="search-result-section--tracks" />
            </div>
        );
    }

    mapArtists( results: SpotifyAPIResult ) : Array<SpotifyResult> {
        if( results && results.artists && results.artists.items ) {
            return results.artists.items.map( (item:SpotifyAPIArtist) => {
                return {
                    id: item.id,
                    name: item.name,
                    image: item.images.length ? item.images[0].url : "",
                    type: "artist"
                }
            });
        } 

        return [];
    }

    mapAlbums( results: SpotifyAPIResult ) : Array<SpotifyResult> {
        if( results && results.albums && results.albums.items ) {
            return results.albums.items.map( (item:SpotifyAPIAlbum) => {
                return {
                    id: item.id,
                    name: item.name,
                    image: item.images.length ? item.images[0].url : "",
                    type: "album"
                }
            });
        } 

        return [];
    }

    mapTracks( results: SpotifyAPIResult ) : Array<SpotifyResult> {
        if( results && results.tracks && results.tracks.items ) {
            return results.tracks.items.map( (item:SpotifyAPITrack) => {
                return {
                    id: item.id,
                    name: item.name,
                    image: item.album.images.length ? item.album.images[0].url : "",
                    type: "track"
                }
            });
        } 

        return [];
    }

    selectArtist( result: SpotifyResult ) {
        console.log( "selectArtist", result );
    }

    selectAlbum( result: SpotifyResult ) {
        console.log( "selectAlbum", result );

    }

    selectTrack( result: SpotifyResult ) {
        console.log( "selectTrack", result );
    }
}
