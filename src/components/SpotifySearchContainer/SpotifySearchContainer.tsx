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
    query: string;
    results?: SpotifyAlbumsArtistsTracks;
    detail?: JSX.Element;
}
export default class SpotifySearchContainer extends React.Component<SpotifySearchContainerProps, SpotifySearchContainerState> {

    mainClass : string = "search-container";
    state: SpotifySearchContainerState;

    constructor( props: SpotifySearchContainerProps ) {
      super(props); 
  
      this.state = {
        query: "",
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
                <div className="spotify_search-container-search-results-container">
                    <SpotifySearchResults query={this.state.query} results={this.state.results} showDetail={this.renderDetail.bind(this)} /> 
                </div>
                <div className="spotify_search-container-detail-container">
                    {this.state.detail}
                </div>                      
            </div>
        );
    }


    submitQuery( _query: string ) {
        query( _query, "track,artist,album" ).then( (res:SpotifyAlbumsArtistsTracks) => {
            this.loadedResults( _query, res );
        });
    }

    loadedResults( query: string, results: SpotifyAlbumsArtistsTracks ) {
        if( results != null ) {
            this.setState( { query: query, results: results } );
        } else {
            this.setState( { query: query, results: undefined } );
        }
    }
    
    renderDetail( content: JSX.Element ) {
        let detail = <SpotifyResultDetail onClose={this.closeDetail.bind(this)}>{content}</SpotifyResultDetail>
        this.setState( { detail: detail  } );
    }
    closeDetail() {
        this.setState( { detail: undefined } );
    }
}
