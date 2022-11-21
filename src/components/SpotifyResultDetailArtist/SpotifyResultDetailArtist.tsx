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
  artist: AppData<SpotifyArtist>; //artist data to display details for
  showDetail: Function; //call this with one of the detail panes to show the pane.
}

interface SpotifyResultDetailArtistState {
    albums?: Array<AppData<SpotifyAlbum>> //we load these albums based on the artist from this.props
    artist: AppData<SpotifyArtist>; //store the artist in state in case another artist is loaded in this.props, then we will know we need to query albums again.
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
                    <div className="spotify_result-detail--breadcrumb">
                        <span>{this.props.artist.name}</span> - ( Artist )
                    </div>
                    <div>
                        <h2>{this.props.artist.name}</h2>
                        <img className="spotify_result-detail--image" src={this.props.artist.image} />                     
                    </div>
                    <div>
                        <h2>Albums</h2> 
                        <div className={getClassName(`${this.mainClass}--content`)} >                       
                            <div className="spotify_result--flex-container">
                                {this.state.albums.map( ( result: AppData<SpotifyAlbum>, index: number ) => {                 
                                    return (<SpotifySearchResult key={index} item={result} onClick={this.clickAlbum.bind(this)} />);
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

    /**
     * Given an artist, load their albums from the api, then sort by release date.
     **/
    loadAlbums() {
        getAlbums( this.props.artist.id ).then( ( res: SpotifyItems<SpotifyAlbum> ) => {     
            
            let albums = mapAlbums(res.items);
            
            //sort albums by release date
            albums = albums.sort((a, b) => {
                return parseInt(b.meta.release_date.split("-")[0]) - parseInt(a.meta.release_date.split("-")[0]);
            });
            
            this.setState( { albums: albums, artist: this.props.artist } );
        });
    }

    /**
     * When a user clicks an album, call this.props.showDetail with a new Album detail pane.  
     **/
    clickAlbum( album: AppData<SpotifyAlbum> ) {
        var detail = <SpotifyResultDetailAlbum album={album} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }
}
