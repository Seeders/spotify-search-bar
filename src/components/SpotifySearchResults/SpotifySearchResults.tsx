import * as React from "react";
import SpotifySearchResultSection from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { AppData } from "../../App";
import { SpotifyAlbumsArtistsTracks, SpotifyTrack, SpotifyAlbum, SpotifyArtist, mapAlbum, mapTrack, mapResultArtistItems, mapResultAlbumItems, mapResultTrackItems } from "../../models/SpotifyModels";
import getClassName from "../../utils/GetClassName";
import { getAlbum, getTrack } from "../../api/SpotifyAPI";
import SpotifyResultDetailArtist from "../SpotifyResultDetailArtist/SpotifyResultDetailArtist";
import SpotifyResultDetailAlbum from "../SpotifyResultDetailAlbum/SpotifyResultDetailAlbum";
import SpotifyResultDetailTrack from "../SpotifyResultDetailTrack/SpotifyResultDetailTrack";

require("./SpotifySearchResults.css");



interface SpotifySearchResultsProps {
  className?: string;
  children?: React.ReactNode;
  query: string; //the query from the user input
  results?: SpotifyAlbumsArtistsTracks; //set of results from the API
  showDetail: Function; //callback function to render a detail pane.
}

interface SpotifySearchResultsState {
    results?: SpotifyAlbumsArtistsTracks; //current result set
}

/**
 * Renders Artists, Albums, and Tracks as SearchResultSection components.
 **/
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

        let artists, albums, tracks: Array<AppData<SpotifyTrack>> = [];
        if( this.state.results && this.props.query.length > 0 ) {
            artists = mapResultArtistItems( this.state.results );
            albums = mapResultAlbumItems( this.state.results );
            tracks = mapResultTrackItems( this.state.results );               
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>                    
                    <div>
                        <h3>Artists - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Artists" type="artist" query={this.props.query} results={artists} mapFunction={mapResultArtistItems} onClick={this.selectArtist.bind(this)} className="search-result-section--artists" />
                        <h3>Albums - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Albums" type="album" query={this.props.query} results={albums} mapFunction={mapResultAlbumItems} onClick={this.selectAlbum.bind(this)} className="search-result-section--albums" />
                        <h3>Tracks - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Tracks" type="track" query={this.props.query} results={tracks} mapFunction={mapResultTrackItems} onClick={this.selectTrack.bind(this)} className="search-result-section--tracks" />
                    </div>
                </div>
            );     
        } else {
            return <></>
        }
    }

    /**
     * handler for when a user clicks on an artist.
     */
    selectArtist( result: AppData<SpotifyArtist> ) {
        var detail = <SpotifyResultDetailArtist artist={result} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }
    /**
     * handler for when a user clicks on an album.
     */
    selectAlbum( result: AppData<SpotifyAlbum> ) {
        getAlbum( result.id ? result.id : "" ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }
    /**
     * handler for when a user clicks on a track.
     */
    selectTrack( result: AppData<SpotifyTrack> ) {
        getTrack( result.id ).then( (res:SpotifyTrack) => {           
            var detail = <SpotifyResultDetailTrack track={mapTrack(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

}
