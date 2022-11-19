import * as React from "react";
import getClassName from "../../utils/GetClassName";

require("./SpotifySearchResult.css");

export interface SpotifyResult {
    id: string,
    image: string,
    name: string,
    type: string
}

interface SpotifySearchResultProps {
  className?: string;
  children?: React.ReactNode;
  result: SpotifyResult;
  onClick: Function;
}

interface SpotifySearchResultState {}

export default class SpotifySearchResult extends React.Component<SpotifySearchResultProps, SpotifySearchResultState> {

    mainClass : string = "search-result";

    render() {
        return (
            <div onClick={this.onClick.bind(this)} className={getClassName(this.mainClass, this.props.className)}>
                <div>
                    <span>{this.props.result.name}</span>
                </div>
                <img src={this.props.result.image} />             
            </div>
        );
    }

    onClick() {
        this.props.onClick( this.props.result );
    }

}
