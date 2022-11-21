import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyItems, SpotifyAlbum, SpotifyArtist, mapAlbums } from "../../models/SpotifyModels";
import SpotifyResultDetailAlbum from "../SpotifyResultDetailAlbum/SpotifyResultDetailAlbum";
import { getAlbums } from "../../api/SpotifyAPI";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";

require("./SpotifyResultDetailArtist.css");

interface SpotifyResultDetailArtistProps {
  className?: string;
  children?: React.ReactNode;
  artist: AppData<SpotifyArtist>;
  showDetail: Function;
}

interface SpotifyResultDetailArtistState {
    albums?: Array<AppData<SpotifyAlbum>>
    artist: AppData<SpotifyArtist>;
}

export default class SpotifyResultDetailArtist extends React.Component<SpotifyResultDetailArtistProps, SpotifyResultDetailArtistState> {

    mainClass : string = "search-result-detail-artist";
    state: SpotifyResultDetailArtistState;
    constructor( props: SpotifyResultDetailArtistProps ) {
        super(props); 
    
        this.state = {
            albums: undefined,
            artist: this.props.artist
        };
    
    }

    render() {
        if( this.state.artist == this.props.artist && this.state.albums ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div className="search-result-detail-breadcrumb">
                        <span>{this.props.artist.name}</span> - ( Artist )
                    </div>
                    <div>
                        <h2>{this.props.artist.name}</h2>
                        <img className="spotify_result-detail--image" src={this.props.artist.image} />                     
                    </div>
                    <div>
                        <h2>Albums</h2> 
                        <div className="search-result-detail-artist--content" onScroll={this.handleScroll} onWheel={this.handleScroll} >                       
                            <div className="search-result--flex-container">
                                {this.state.albums.map( ( result: AppData<SpotifyAlbum> ) => {                 
                                    return (<SpotifySearchResult key={result.id} result={result} onClick={this.clickAlbum.bind(this)} />);
                                })}  
                            </div>         
                        </div>                       
                    </div>
                </div>
            );
        } else {
            this.loadAlbums();
        }
    }

    loadAlbums() {
        getAlbums( this.props.artist.id ).then( ( res: SpotifyItems<SpotifyAlbum> ) => {     
            let albums = mapAlbums(res.items);
            albums = albums.sort((a, b) => {
                return parseInt(b.meta.release_date.split("-")[0]) - parseInt(a.meta.release_date.split("-")[0]);
            });
            this.setState( { albums: albums, artist: this.props.artist } );
        });
    }

    clickAlbum( album: AppData<SpotifyAlbum> ) {
        var detail = <SpotifyResultDetailAlbum album={album} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }
    handleScroll(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        return false;
    }
}
