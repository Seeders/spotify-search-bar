import * as React from "react";
import getClassName from "../../utils/GetClassName";

require("./SpotifySearchResult.css");

export interface SpotifyResult {
    id: string,
    image: string,
    name: string
}

interface SpotifySearchResultProps {
  className?: string;
  children?: React.ReactNode;
  result: SpotifyResult;
}

interface SpotifySearchResultState {}

export default class SpotifySearchResult extends React.Component<SpotifySearchResultProps, SpotifySearchResultState> {

    mainClass : string = "search-result";

    render() {
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <h6>{this.props.result.name}</h6>
                <img src={this.props.result.image} />             
            </div>
        );
    }

}
