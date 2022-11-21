import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "../../models/SpotifyModels";

require("./SpotifySearchResult.css");


interface SpotifySearchResultProps {
  className?: string;
  children?: React.ReactNode;
  item: AppData<SpotifyAlbum|SpotifyArtist|SpotifyTrack>;
  onClick: Function;
}

interface SpotifySearchResultState {}

/**
 * Generic display class to display AppData fields.
 * used to render SpotifyAlbum, SpotifyArtist, and SpotifyTrack data
 */
export default class SpotifySearchResult extends React.Component<SpotifySearchResultProps, SpotifySearchResultState> {

    mainClass : string = "search-result";

    render() {
        return (
            <div onClick={this.onClick.bind(this)} className={getClassName(this.mainClass, this.props.className)}>
                <div>
                    <a tabIndex={0}>{this.props.item.name}</a>
                </div>
                <img src={this.props.item.image} />             
            </div>
        );
    }

    onClick() {
        this.props.onClick( this.props.item );
    }

}
