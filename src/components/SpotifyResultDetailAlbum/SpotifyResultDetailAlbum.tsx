import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyItems, SpotifyAlbum, SpotifyArtist, mapTracks, SpotifyTrack, mapArtist } from "../../models/SpotifyModels";
import SpotifyResultDetailTrack from "../SpotifyResultDetailTrack/SpotifyResultDetailTrack";
import SpotifyResultDetailArtist from "../SpotifyResultDetailArtist/SpotifyResultDetailArtist";
import { getArtist, getTracks } from "../../api/SpotifyAPI";
import { formatDuration } from "../../utils/Time";

require("./SpotifyResultDetailAlbum.css");

interface SpotifyResultDetailAlbumProps {
  className?: string;
  children?: React.ReactNode;
  album: AppData<SpotifyAlbum>;
  showDetail: Function;
}

interface SpotifyResultDetailAlbumState {
    tracks?: Array<AppData<SpotifyTrack>>;
    album: AppData<SpotifyAlbum>;
}

export default class SpotifyResultDetailAlbum extends React.Component<SpotifyResultDetailAlbumProps, SpotifyResultDetailAlbumState> {

    mainClass : string = "search-result-detail-album";
    state: SpotifyResultDetailAlbumState;
    constructor( props: SpotifyResultDetailAlbumProps ) {
        super(props); 
    
        this.state = {
            tracks: undefined,
            album: this.props.album
        };
    
      }
  
    render() {

        if( this.props.album == this.state.album && this.state.tracks ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div className="search-result-detail-breadcrumb">
                        <a onClick={this.clickedArtist.bind(this)}>{this.props.album.meta.artists[0].name}</a><br /> 
                    </div>
                    <div>
                        <h2>{this.props.album.name}</h2>
                        <img className="spotify_result-detail--image" src={this.props.album.image} /> 
                        <div>
                            <h3>Album Released</h3>
                            {this.props.album.meta.release_date}
                        </div>
                        <div>
                            <h3>Artist</h3>
                            <a onClick={this.clickedArtist.bind(this)}>{this.props.album.meta.artists[0].name}</a>
                        </div>
                    </div>
                    <div>
                        <h2>Tracks</h2> 
                        <div className="search-result-detail-album--content" onScroll={this.handleScroll} onWheel={this.handleScroll} >                       
                            <div className="search-result--flex-container">
                                <ol>
                                {this.state.tracks.map( ( track: AppData<SpotifyTrack>, index: number ) => {    
                                    let formattedDuration = formatDuration(track.meta.duration_ms),
                                        display = `${track.name} - ( ${formattedDuration} )`;   
                                    return (
                                        <li key={track.id}><a onClick={this.clickedTrack.bind(this)} data-index={index}>{display}</a></li>
                                    );
                                })} 
                                </ol> 
                            </div>         
                        </div> 
                    </div>
                </div>
            );
        } else {
            this.loadData();
        }
    }

    loadData() {
        getTracks( this.props.album.id ).then( ( res: SpotifyItems<SpotifyTrack> ) => {       
            this.setState( { tracks: mapTracks(res.items, this.props.album), album: this.props.album } );
        });
    }

    clickedArtist(event: React.UIEvent) {
        let id = this.props.album.meta.artists[0].id;
        getArtist( id ).then( (artist:SpotifyArtist) => {                           
            var detail = <SpotifyResultDetailArtist artist={mapArtist(artist)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

    clickAlbum( album: AppData<SpotifyAlbum> ) {
        var detail = <SpotifyResultDetailAlbum album={album} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }

    clickedTrack( event: React.UIEvent) {
        let index = parseInt(event.currentTarget.getAttribute( 'data-index' ) as string);
        if( this.state.tracks && this.state.tracks.length > index ) {
            let track = this.state.tracks[index];
            if( track ) {
                track.meta.album = this.props.album.meta;
                var detail = <SpotifyResultDetailTrack track={track} showDetail={this.props.showDetail} />;
                this.props.showDetail( detail );
            }
        }
    }

    handleScroll(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        return false;
    }
}
