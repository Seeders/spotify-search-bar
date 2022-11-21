import * as React from "react";
import SpotifySearchBar from "../SpotifySearchBar/SpotifySearchBar";
import SpotifySearchResults from "../SpotifySearchResults/SpotifySearchResults";
import { SpotifyAlbumsArtistsTracks } from "../../models/SpotifyModels";
import SpotifyResultDetail from "../SpotifyResultDetail/SpotifyResultDetail";
import { query } from "../../api/SpotifyAPI";
import getClassName from "../../utils/GetClassName";

require("./SpotifySearchContainer.css");
interface SpotifySearchContainerProps {
  className?: string;
  children?: React.ReactNode;
}
interface SpotifySearchContainerState {
    query: string; //most recent query from user input
    results?: SpotifyAlbumsArtistsTracks; //search results based on user input
    detail?: JSX.Element; //if the user has drilled in to something, this will be the detail pane for it
}
export default class SpotifySearchContainer extends React.Component<SpotifySearchContainerProps, SpotifySearchContainerState> {

    mainClass : string = "search-container";
    state: SpotifySearchContainerState;

    constructor( props: SpotifySearchContainerProps ) {
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
                    <SpotifySearchResults query={this.state.query} results={this.state.results} showDetail={this.renderDetail.bind(this)} /> 
                </div>                     
            </div>
        );
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
