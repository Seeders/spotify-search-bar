import * as React from "react";
import SpotifySearchResultSection from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { SpotifyAPIResult, SpotifyAPIArtist, SpotifyAPIAlbum, SpotifyAPITrack } from "../../controllers/SpotifyController";
import { SpotifyResult } from "../SpotifySearchResult/SpotifySearchResult";

require("./SpotifySearchResults.css");



interface SpotifySearchResultsProps {
  className?: string;
  children?: React.ReactNode;
  results: SpotifyAPIResult;
}
interface SpotifySearchResultsState {
}
export default class SpotifySearchResults extends React.Component<SpotifySearchResultsProps, SpotifySearchResultsState> {

    constructor( props: SpotifySearchResultsProps ) {
        super(props); 
    
        this.state = {
            results: undefined
        };
    
    }

    getClassName() {
        return "spotify-search-results " + this.props.className;
    }

    render() {

        let artists, albums, tracks: Array<SpotifyResult> = [];
        if( this.props.results ) {
            if( this.props.results.artists.items ) {
                artists = this.props.results.artists.items.map( (item:SpotifyAPIArtist) => {
                    return {
                        id: item.id,
                        name: item.name,
                        image: item.images.length ? item.images[0].url : ""
                    }
                });
            }
            if( this.props.results.albums.items ) {
                albums = this.props.results.albums.items.map( (item:SpotifyAPIAlbum) => {
                    return {
                        id: item.id,
                        name: item.name,
                        image: item.images.length ? item.images[0].url : ""
                    }
                });
            }
            if( this.props.results.tracks.items ) {
                tracks = this.props.results.tracks.items.map( (item:SpotifyAPITrack) => {
                    return {
                        id: item.id,
                        name: item.name,
                        image: item.album.images.length ? item.album.images[0].url : ""
                    }
                });
            }
        }
        return (
            <div className={this.getClassName()}>
                <SpotifySearchResultSection name="Artists" results={artists} />
                <SpotifySearchResultSection name="Albums" results={albums} />
                <SpotifySearchResultSection name="Tracks" results={tracks} />
            </div>
        );
    }

}
