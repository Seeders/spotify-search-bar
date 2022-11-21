import * as React from "react";
import SpotifySearchBar from "../SpotifySearchBar/SpotifySearchBar";
import SpotifySearchResults from "../SpotifySearchResults/SpotifySearchResults";
import { AppData } from "../../App";
import { mapAlbums, mapArtists, mapTracks, mapAlbum, mapTrack, mapResultArtistItems, mapResultAlbumItems, mapResultTrackItems, SpotifyAlbumsArtistsTracks, SpotifyTrack, SpotifyAlbum, SpotifyArtist } from "../../models/SpotifyModels";
import SpotifyResultDetail from "../SpotifyResultDetail/SpotifyResultDetail";
import { SpotifySearchResultSectionProps } from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { query, getAlbum, getTrack } from "../../api/SpotifyAPI";
import getClassName from "../../utils/GetClassName";
import SpotifyResultDetailArtist from "../SpotifyResultDetailArtist/SpotifyResultDetailArtist";
import SpotifyResultDetailAlbum from "../SpotifyResultDetailAlbum/SpotifyResultDetailAlbum";
import SpotifyResultDetailTrack from "../SpotifyResultDetailTrack/SpotifyResultDetailTrack";

require("./SpotifyAppContainer.css");

interface SpotifyAppContainerProps {
  className?: string;
  children?: React.ReactNode;
}

interface SpotifyAppContainerState {
    query: string; //most recent query from user input
    results?: SpotifyAlbumsArtistsTracks; //search results based on user input
    detail?: JSX.Element; //if the user has drilled in to something, this will be the detail pane for it
}
/**
 * Main UI container that lays out the search bar, search results, and detail panes.
 * It makes the api request when the search bar triggers a query and passes us the search string from the user, then tells SpotifySearchResults to render the results.
 * It also passes the query from the search bar to the results and detail pane.
 **/
export default class SpotifyAppContainer extends React.Component<SpotifyAppContainerProps, SpotifyAppContainerState> {

    mainClass : string = "search-container";
    state: SpotifyAppContainerState;

    constructor( props: SpotifyAppContainerProps ) {
        super(props); 
        let query = localStorage.getItem( 'spotify_last-query' );
        this.state = {
            query: query ? query : "",
            results: undefined,
            detail: undefined
        };  
    }

    render() {
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div className="spotify_search-container-search-bar-container">
                    <SpotifySearchBar submitCallback={this.submitQuery.bind(this)} />    
                </div>
                <div className="spotify_search-container-detail-container">
                    {this.state.detail}
                </div> 
                <div className="spotify_search-container-search-results-container">
                    <SpotifySearchResults query={this.state.query} sections={this.getSections()} /> 
                </div>                     
            </div>
        );
    }

    getSections() : Array<SpotifySearchResultSectionProps> {
        if( this.state.results ) {
            return [{
                name: 'Artists',
                type: 'artist',
                query: this.state.query,
                mapFunction: mapArtists,
                results: mapResultArtistItems(this.state.results),
                onClick: this.selectArtist.bind(this)
            },
            {
                name: 'Albums',
                type: 'album',
                query: this.state.query,
                mapFunction: mapAlbums,
                results: mapResultAlbumItems(this.state.results),
                onClick: this.selectAlbum.bind(this)
            },
            {
                name: 'Tracks',
                type: 'track',
                query: this.state.query,
                mapFunction: mapTracks,
                results: mapResultTrackItems(this.state.results),
                onClick: this.selectTrack.bind(this)
            }];
        } else {
            return [];
        }
    }

    
    /**
     * handler for when a user clicks on an artist.
     */
     selectArtist( result: AppData<SpotifyArtist> ) {
        var detail = <SpotifyResultDetailArtist artist={result} showDetail={this.renderDetail.bind(this)} />;
        this.renderDetail( detail );
    }
    /**
     * handler for when a user clicks on an album.
     */
    selectAlbum( result: AppData<SpotifyAlbum> ) {
        getAlbum( result.id ? result.id : "" ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} showDetail={this.renderDetail.bind(this)} />;
            this.renderDetail( detail );
        });
    }
    /**
     * handler for when a user clicks on a track.
     */
    selectTrack( result: AppData<SpotifyTrack> ) {
        getTrack( result.id ).then( (res:SpotifyTrack) => {           
            var detail = <SpotifyResultDetailTrack track={mapTrack(res)} showDetail={this.renderDetail.bind(this)} />;
            this.renderDetail( detail );
        });
    }


    /**
     * handler for user input, calls the API with our query.
     **/
    submitQuery( _query: string ) {
        this.closeDetail();
        localStorage.setItem( 'spotify_last-query', _query );
        if( _query.length > 0 ) {
            query( _query, "track,artist,album" ).then( (res:SpotifyAlbumsArtistsTracks) => {
                this.loadedResults( _query, res );
            }).catch((error:string) => {
                console.warn( error );
            });
        } else {
            this.loadedResults( _query, null );
        }
    }

    /**
     * callback function from queryinig the API with user input.
     **/
    loadedResults( query: string, results: SpotifyAlbumsArtistsTracks|null ) {
        if( results != null ) {
            this.setState( { query: query, results: results } );
        } else {
            this.setState( { query: query, results: undefined } );
        }
    }
    
    /**
     * callback function for SearchResults to use to render a new detail pane.
     **/
    renderDetail( content: JSX.Element ) {
        let detail = <SpotifyResultDetail onClose={this.closeDetail.bind(this)} query={this.state.query}>{content}</SpotifyResultDetail>
        this.setState( { detail: detail  } );
    }

    /**
     * Remove current detail pane.
     **/
    closeDetail() {
        this.setState( { detail: undefined } );
    }
}
