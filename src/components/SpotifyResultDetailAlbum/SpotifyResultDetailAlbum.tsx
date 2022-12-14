import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyItems, SpotifyAlbum, SpotifyArtist, mapTracks, SpotifyTrack, mapArtist } from "../../models/SpotifyModels";
import { getArtist, getTracks } from "../../api/SpotifyAPI";
import { formatDuration } from "../../utils/Time";

require("./SpotifyResultDetailAlbum.css");

interface SpotifyResultDetailAlbumProps {
  className?: string;
  children?: React.ReactNode;
  album: AppData<SpotifyAlbum>; //album data to display details for
  showTrackDetail: Function; //call this with one of the detail panes to show the pane.
  showArtistDetail: Function; //call this with one of the detail panes to show the pane.
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

    componentDidMount () {
        this.loadData();
    }

    componentDidUpdate(prevProps: Readonly<SpotifyResultDetailAlbumProps>, prevState: Readonly<SpotifyResultDetailAlbumState>, snapshot?: any): void {
        if( this.props.album.id != prevProps.album.id ) {
            this.loadData();        
        }
    }
  
    render() {

        if( this.props.album == this.state.album && this.state.tracks ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div className="spotify_result-detail--breadcrumb">
                        <a tabIndex={0} onClick={() => this.props.showArtistDetail( this.props.album.meta.artists[0] )}>{this.props.album.meta.artists[0].name}</a> - <span className="spotify_text-parenthesis">(Artist)</span><br />
                        &emsp;&gt; <span>{this.props.album.name}</span> - <span className="spotify_text-parenthesis">(Album)</span>
                    </div>
                    <div>
                        <h2>{this.props.album.name}</h2>
                        <img className={getClassName('result-detail--image')} src={this.props.album.image} /> 
                        <div>
                            <h3>Album Released</h3>
                            {this.props.album.meta.release_date}
                        </div>
                        <p><a className={getClassName('result-detail--play-button')} href={this.props.album.meta.uri}>Play Now</a></p>     
                    </div>
                    <div>
                        <h2>Tracks</h2> 
                        <div className={getClassName(`${this.mainClass}--content`)}>                       
                            <div className="spotify_result--flex-container">
                                {this.state.tracks.map( ( track: AppData<SpotifyTrack>, index: number ) => {       
                                    let trackNumber = (index < 9 ? '0' + (index + 1) : index + 1);
                                    return (
                                        <div key={index}>
                                            {trackNumber}.&nbsp;
                                            <a tabIndex={0} onClick={() => this.clickedTrack(index)}>
                                                {track.name}
                                            </a> 
                                            &nbsp;<span className="spotify_text-parenthesis">({formatDuration(track.meta.duration_ms)})</span>
                                        </div>
                                    );
                                })} 
                            </div>         
                        </div> 
                    </div>
                </div>
            );
        } else {      
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>Loading</div>
                );
        }
    }

    /**
     * load tracks belonging to this album.
     **/
    loadData() {
        getTracks( this.props.album.id ).then( ( res: null|SpotifyItems<SpotifyTrack> ) => {       
            if( res != null ) {
                this.setState( { tracks: mapTracks(res.items, this.props.album), album: this.props.album } );
            }
        });
    }

    /**
     * When a user clicks an track, call this.props.showDetail with a new Track detail pane.  
     **/
    clickedTrack( index: number) {
        if( this.state.tracks && this.state.tracks.length > index ) {
            let track = this.state.tracks[index];
            if( track ) {
                this.props.showTrackDetail( track.meta );
            }
        }
    }
}
