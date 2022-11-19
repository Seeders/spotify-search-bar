import * as React from "react";
import SpotifySearchBar from "../SpotifySearchBar/SpotifySearchBar";
import SpotifySearchResults from "../SpotifySearchResults/SpotifySearchResults";
import { SpotifyAPIResult } from "../../controllers/SpotifyController";
import SpotifyController from "../../controllers/SpotifyController";
import getClassName from "../../utils/GetClassName";

require("./SpotifySearchContainer.css");
interface SpotifySearchContainerProps {
  className?: string;
  children?: React.ReactNode;
}
interface SpotifySearchContainerState {
    query: string;
    results?: SpotifyAPIResult;
}
export default class SpotifySearchContainer extends React.Component<SpotifySearchContainerProps, SpotifySearchContainerState> {

    mainClass : string = "search-container";
    state: SpotifySearchContainerState;

    constructor( props: SpotifySearchContainerProps ) {
      super(props); 
  
      this.state = {
        query: "",
        results: undefined
      };
  
    }

    render() {
        if( this.state.results ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <SpotifySearchBar submitCallback={this.submitQuery.bind(this)} />    
                    <h2>"{this.state.query}" Results</h2> 
                    <SpotifySearchResults query={this.state.query} results={this.state.results} />                        
                </div>
            );
        } else {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <SpotifySearchBar submitCallback={this.submitQuery.bind(this)} />  
                </div>
            );
        }
    }


    submitQuery( query: string ) {
        let controller = new SpotifyController();
        controller.query( query, "track,artist,album" ).then( (res) => {
            this.loadedResults( query, res );
        });
    }

    loadedResults( query: string, results: SpotifyAPIResult ) {
        if( results != null ) {
            this.setState( { query: query, results: results } );
        } else {
            this.setState( { query: query, results: undefined } );
        }
    }
}
