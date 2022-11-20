import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyItems, SpotifyAlbum, mapTracks, SpotifyTrack } from "../../models/SpotifyModels";
import SpotifyController from "../../controllers/SpotifyController";
import { formatDuration } from "../../utils/Time";

require("./SpotifyResultDetailAlbum.css");

interface SpotifyResultDetailAlbumProps {
  className?: string;
  children?: React.ReactNode;
  album: AppData<SpotifyAlbum>;
}

interface SpotifyResultDetailAlbumState {
    tracks?: Array<AppData<SpotifyTrack>>
}

export default class SpotifyResultDetailAlbum extends React.Component<SpotifyResultDetailAlbumProps, SpotifyResultDetailAlbumState> {

    mainClass : string = "search-result-detail-album";
    state: SpotifyResultDetailAlbumState;
    constructor( props: SpotifyResultDetailAlbumProps ) {
        super(props); 
    
        this.state = {
            tracks: undefined
        };
    
      }
  
    render() {

        if( this.state.tracks ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div>
                        <h2>{this.props.album.name}</h2>
                        <img className="spotify_result-detail--image" src={this.props.album.image} /> 
                        <div>
                            <h3>Album Released</h3>
                            {this.props.album.meta.release_date}
                        </div>
                    </div>
                    <div>
                        <h2>Tracks</h2> 
                        <div className="search-result-detail-album--content" onScroll={this.handleScroll} onWheel={this.handleScroll} >                       
                            <div className="search-result--flex-container">
                                <ol>
                                {this.state.tracks.map( ( result: AppData<SpotifyTrack> ) => {    
                                    let formattedDuration = formatDuration(result.meta.duration_ms),
                                        display = `${result.name} - ( ${formattedDuration} )`;   
                                    return (
                                        <li>{display}</li>
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
        let controller = new SpotifyController();
        controller.getTracks( this.props.album.id ).then( ( res: SpotifyItems<SpotifyTrack> ) => {       
            this.setState( { tracks: mapTracks(res.items, this.props.album) } );
        });
    }

    clickAlbum() {
        return false;
    }

    handleScroll(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        return false;
    }
}
