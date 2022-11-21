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
  album: AppData<SpotifyAlbum>; //album data to display details for
  showDetail: Function; //call this with one of the detail panes to show the pane.
}

interface SpotifyResultDetailAlbumState {
    tracks?: Array<AppData<SpotifyTrack>>; //we load these tracks based on the album from this.props
    album: AppData<SpotifyAlbum>; //store the album in state in case another album is loaded in this.props, then we will know we need to query tracks again.
}

/**
 * Detail Pane to show Album information.
 **/
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
                    <div className="spotify_result-detail--breadcrumb">
                        <a tabIndex={0} onClick={this.clickedArtist.bind(this)}>{this.props.album.meta.artists[0].name}</a> - ( Artist )<br />
                        &emsp;&gt; <span>{this.props.album.name}</span> - ( Album )
                    </div>
                    <div>
                        <h2>{this.props.album.name}</h2>
                        <img className="spotify_result-detail--image" src={this.props.album.image} /> 
                        <div>
                            <h3>Album Released</h3>
                            {this.props.album.meta.release_date}
                        </div>
                        <p><a href={this.props.album.meta.uri}>Play Now</a></p>     
                    </div>
                    <div>
                        <h2>Tracks</h2> 
                        <div className={getClassName(`${this.mainClass}--content`)}>                       
                            <div className="spotify_result--flex-container">
                                {this.state.tracks.map( ( track: AppData<SpotifyTrack>, index: number ) => {    
                                    let formattedDuration = formatDuration(track.meta.duration_ms),
                                        display = `${track.name} - ( ${formattedDuration} )`;   
                                    return (
                                        <div key={index}>{(index < 9 ? '0' + (index + 1) : index + 1)}. <a tabIndex={0} onClick={this.clickedTrack.bind(this)} data-index={index}>{display}</a></div>
                                    );
                                })} 
                            </div>         
                        </div> 
                    </div>
                </div>
            );
        } else {
            this.loadData();
        }
    }

    /**
     * load tracks belonging to this album.
     **/
    loadData() {
        getTracks( this.props.album.id ).then( ( res: SpotifyItems<SpotifyTrack> ) => {       
            this.setState( { tracks: mapTracks(res.items, this.props.album), album: this.props.album } );
        });
    }

    /**
     * When a user clicks an artist, call this.props.showDetail with a new Artist detail pane.
     * We first need to look up the artist data using the artist id from track meta.  
     **/
    clickedArtist(event: React.UIEvent) {
        let id = this.props.album.meta.artists[0].id;
        getArtist( id ).then( (artist:SpotifyArtist) => {                           
            var detail = <SpotifyResultDetailArtist artist={mapArtist(artist)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

    /**
     * When a user clicks an album, call this.props.showDetail with a new Album detail pane.  
     **/
    clickAlbum( album: AppData<SpotifyAlbum> ) {
        var detail = <SpotifyResultDetailAlbum album={album} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }

    /**
     * When a user clicks an track, call this.props.showDetail with a new Track detail pane.  
     **/
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
}
