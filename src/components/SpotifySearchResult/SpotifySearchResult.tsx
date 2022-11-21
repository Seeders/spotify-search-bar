import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";

require("./SpotifySearchResult.css");


interface SpotifySearchResultProps {
  className?: string;
  children?: React.ReactNode;
  result: AppData<any>;
  onClick: Function;
}

interface SpotifySearchResultState {}

export default class SpotifySearchResult extends React.Component<SpotifySearchResultProps, SpotifySearchResultState> {

    mainClass : string = "search-result";

    render() {
        return (
            <div onClick={this.onClick.bind(this)} className={getClassName(this.mainClass, this.props.className)}>
                <div>
                    <a>{this.props.result.name}</a>
                </div>
                <img src={this.props.result.image} />             
            </div>
        );
    }

    onClick() {
        this.props.onClick( this.props.result );
    }

}
