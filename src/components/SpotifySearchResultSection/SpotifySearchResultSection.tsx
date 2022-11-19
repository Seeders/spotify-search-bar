import * as React from "react";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";
import { SpotifyResult } from "../SpotifySearchResult/SpotifySearchResult";
require("./SpotifySearchResultSection.css");

interface SpotifySearchResultSectionProps {
  className?: string;
  children?: React.ReactNode;
  name: string;
  results?: Array<SpotifyResult>;
}

interface SpotifySearchResultSectionState {}

export default class SpotifySearchResultSection extends React.Component<SpotifySearchResultSectionProps, SpotifySearchResultSectionState> {

    getClassName() {
        return "spotify-search-result-section " + this.props.className;
    }

    render() {
        if( this.props.results ) {
            return (
                <div className={this.getClassName()}>
                    <h6>{this.props.name}</h6>                
                    {this.props.results.map( ( result: SpotifyResult ) => {            
                        return (<SpotifySearchResult key={result.id} result={result} />);
                    })}  
                </div>
            );
        } else {
            return (
                <div className={this.getClassName()}>
                   
                </div>
            );
        }
    }

}
