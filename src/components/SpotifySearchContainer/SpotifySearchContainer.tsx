import * as React from "react";
import SpotifySearchBar from "../SpotifySearchBar/SpotifySearchBar";
import SpotifySearchResults from "../SpotifySearchResults/SpotifySearchResults";
import { SpotifyAPIResult } from "../../controllers/SpotifyController";

require("./SpotifySearchContainer.css");
interface SpotifySearchContainerProps {
  className?: string;
  children?: React.ReactNode;
}
interface SpotifySearchContainerState {
    results?: SpotifyAPIResult;
}
export default class SpotifySearchContainer extends React.Component<SpotifySearchContainerProps, SpotifySearchContainerState> {

    state: SpotifySearchContainerState;

    constructor( props: SpotifySearchContainerProps ) {
      super(props); 
  
      this.state = {
        results: undefined
      };
  
    }
  
    getClassName() {
        return "spotify-search-container " + this.props.className;
    }

    render() {
        if( this.state.results ) {
            return (
                <div className={this.getClassName()}>
                    <SpotifySearchBar resultsCallback={this.loadedResults.bind(this)} />       
                    <br />
                    <div>
                        <SpotifySearchResults results={this.state.results} />    
                    </div>
                </div>
            );
        } else {
            return (
                <div className={this.getClassName()}>
                    <SpotifySearchBar resultsCallback={this.loadedResults.bind(this)} />  
                </div>
            );
        }
    }

    loadedResults( results: SpotifyAPIResult ) {
        if( results != null ) {
            this.setState( { results: results } );
        } else {
            this.setState( { results: undefined } );
        }
    }
}
