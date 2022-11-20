import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import { SpotifyItems, SpotifyAlbum, SpotifyArtist, mapAlbums } from "../../models/SpotifyModels";
import SpotifyController from "../../controllers/SpotifyController";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";

require("./SpotifyResultDetailArtist.css");

interface SpotifyResultDetailArtistProps {
  className?: string;
  children?: React.ReactNode;
  artist: AppData<SpotifyArtist>;
}

interface SpotifyResultDetailArtistState {
    albums?: Array<AppData<SpotifyAlbum>>
}

export default class SpotifyResultDetailArtist extends React.Component<SpotifyResultDetailArtistProps, SpotifyResultDetailArtistState> {

    mainClass : string = "search-result-detail-artist";
    state: SpotifyResultDetailArtistState;
    constructor( props: SpotifyResultDetailArtistProps ) {
        super(props); 
    
        this.state = {
            albums: undefined
        };
    
    }
  
    render() {

        if( this.state.albums ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
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
        let controller = new SpotifyController();

        controller.getAlbums( this.props.artist.id ).then( ( res: SpotifyItems<SpotifyAlbum> ) => {            
            this.setState( { albums: mapAlbums(res.items) } );
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
