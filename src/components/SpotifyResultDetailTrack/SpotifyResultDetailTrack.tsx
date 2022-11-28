import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyAlbum, SpotifyTrack, SpotifyArtist, mapAlbum, mapArtist } from "../../models/SpotifyModels";
import { getAlbum, getArtist } from "../../api/SpotifyAPI";
import { formatDuration } from "../../utils/Time";

require("./SpotifyResultDetailTrack.css");

interface SpotifyResultDetailTrackProps {
  className?: string;
  children?: React.ReactNode;
  track: AppData<SpotifyTrack>; //track data to display details for
  showAlbumDetail: Function; //call this with one of the detail panes to show the pane.
  showArtistDetail: Function; //call this with one of the detail panes to show the pane.
}

interface SpotifyResultDetailTrackState {
    album?: AppData<SpotifyAlbum>;
}

/**
 * Detail Pane to show Track information.
 **/
export default class SpotifyResultDetailTrack extends React.Component<SpotifyResultDetailTrackProps, SpotifyResultDetailTrackState> {

    mainClass : string = "search-result-detail-track";
    state: SpotifyResultDetailTrackState;
    constructor( props: SpotifyResultDetailTrackProps ) {
        super(props); 
    
        this.state = {
            album: undefined
        };
    }

    render() {

        let formattedDuration = formatDuration( this.props.track.meta.duration_ms );
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div className="spotify_result-detail--breadcrumb">
                    <a tabIndex={0} onClick={() => this.props.showArtistDetail( this.props.track.meta.artists[0] )}>{this.props.track.meta.artists[0].name}</a> - <span className="spotify_text-parenthesis">(Artist)</span><br /> 
                    &emsp; <a tabIndex={0} onClick={() => this.props.showAlbumDetail( this.props.track.meta.album )}>{this.props.track.meta.album.name}</a> - <span className="spotify_text-parenthesis">(Album)</span><br /> 
                    &emsp;&emsp;&gt; <span>{this.props.track.name}</span> - <span className="spotify_text-parenthesis">(Track #{this.props.track.meta.track_number})</span>
                </div>
                <div className={getClassName(`${this.mainClass}--content`)} >         
                    <h2>{this.props.track.name}</h2>                                
                    <p>Duration: {formattedDuration}</p>
                    <p>Track Number: {this.props.track.meta.track_number}</p>  
                    <p><a className={getClassName('result-detail--play-button')} href={this.props.track.meta.uri}>Play Now</a></p>                        
                </div>  
                <div>
                    <div>
                        <h3 onClick={() => this.props.showAlbumDetail( this.props.track.meta.album )}>{this.props.track.meta.album.name}</h3>
                        <img className={getClassName('result-detail--image')} src={this.props.track.meta.album.images[0].url} onClick={() => this.props.showAlbumDetail( this.props.track.meta.album )} /> 
                    </div>
                    <div>
                        <h3>Album Released</h3>
                        {this.props.track.meta.album.release_date}
                    </div>
                </div>                      
            </div>
        );    

    }

}
