import * as React from "react";
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

    getClassName() {
        return "spotify-search-result " + this.props.className;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                <h6>{this.props.result.name}</h6>
                <img src={this.props.result.image} />             
            </div>
        );
    }

}
