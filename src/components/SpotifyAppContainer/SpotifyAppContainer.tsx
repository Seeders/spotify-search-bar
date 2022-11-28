import * as React from "react";
import SpotifySearchBar from "../SpotifySearchBar/SpotifySearchBar";
import SpotifySearchResults from "../SpotifySearchResults/SpotifySearchResults";
import { AppData } from "../../App";
import { mapAlbums, mapArtist, mapTracks, mapAlbum, mapTrack, mapResultArtistItems, mapResultAlbumItems, mapResultTrackItems, SpotifyAlbumsArtistsTracks, SpotifyTrack, SpotifyAlbum, SpotifyArtist, SpotifyItem } from "../../models/SpotifyModels";
import SpotifyResultDetail from "../SpotifyResultDetail/SpotifyResultDetail";
import { SpotifySearchResultSectionProps } from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { query, getAlbum, getTrack, getArtist } from "../../api/SpotifyAPI";
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
    artistDetail?: AppData<SpotifyArtist>; //if the user has drilled in to something, this will be the detail pane for it
    albumDetail?: AppData<SpotifyAlbum>;
    trackDetail?: AppData<SpotifyTrack>;
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
            artistDetail: undefined,
            albumDetail: undefined,
            trackDetail: undefined
        };  
    }

    render() {
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div className="spotify_search-container-search-bar-container">
                    <SpotifySearchBar submitCallback={this.submitQuery.bind(this)} />    
                </div>
                <div className="spotify_search-container-detail-container">
                    {this.renderDetail()}
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
                mapFunction: mapResultArtistItems,
                results: mapResultArtistItems(this.state.results),
                onClick: this.selectArtist.bind(this)
            },
            {
                name: 'Albums',
                type: 'album',
                query: this.state.query,
                mapFunction: mapResultAlbumItems,
                results: mapResultAlbumItems(this.state.results),
                onClick: this.selectAlbum.bind(this)
            },
            {
                name: 'Tracks',
                type: 'track',
                query: this.state.query,
                mapFunction: mapResultTrackItems,
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
     selectArtist( result: SpotifyItem ) {   
        getArtist( result.id ? result.id : "").then ( (res:SpotifyArtist) => {
            this.setState( { artistDetail: mapArtist( res ), albumDetail: undefined, trackDetail: undefined } ); 
        });
    }
    /**
     * handler for when a user clicks on an album.
     */
    selectAlbum( result: SpotifyItem ) {
        getAlbum( result.id ? result.id : "" ).then( (res:SpotifyAlbum) => {     
            this.setState( { albumDetail: mapAlbum(res), artistDetail: undefined, trackDetail: undefined } ); 
        });
    }
    /**
     * handler for when a user clicks on a track.
     */
    selectTrack( result: SpotifyItem ) {
        getTrack( result.id ).then( (res:SpotifyTrack) => {           
            this.setState( { trackDetail: mapTrack(res), albumDetail: undefined, artistDetail: undefined } );
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
    renderDetail(): JSX.Element {
        let content: JSX.Element;
        if( this.state.trackDetail ) {
            content = <SpotifyResultDetailTrack track={this.state.trackDetail} showAlbumDetail={this.selectAlbum.bind(this)} showArtistDetail={this.selectArtist.bind(this)} />;
        } else if( this.state.albumDetail ) {
            content = <SpotifyResultDetailAlbum album={this.state.albumDetail} showTrackDetail={this.selectTrack.bind(this)} showAlbumDetail={this.selectAlbum.bind(this)} showArtistDetail={this.selectArtist.bind(this)} />;
        } else if( this.state.artistDetail ) {
            content = <SpotifyResultDetailArtist artist={this.state.artistDetail} showAlbumDetail={this.selectAlbum.bind(this)} />;
        } else {
            return <></>;
        }
        return <SpotifyResultDetail onClose={this.closeDetail.bind(this)} query={this.state.query}>{content}</SpotifyResultDetail>
    }

    /**
     * Remove current detail pane.
     **/
    closeDetail() {
        this.setState( { 
            trackDetail: undefined,
            albumDetail: undefined,
            artistDetail: undefined 
        } );
    }
}
