import * as React from "react";
import SpotifySearchResultSection from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { AppData } from "../../App";
import { SpotifyAlbumsArtistsTracks, SpotifyTrack, SpotifyAlbum, SpotifyArtist, mapAlbum, mapTrack, mapResultArtistItems, mapResultAlbumItems, mapResultTrackItems } from "../../models/SpotifyModels";
import getClassName from "../../utils/GetClassName";
import { getAlbum, getTrack } from "../../api/SpotifyAPI";
import SpotifyResultDetail from "../SpotifyResultDetail/SpotifyResultDetail";
import SpotifyResultDetailArtist from "../SpotifyResultDetailArtist/SpotifyResultDetailArtist";
import SpotifyResultDetailAlbum from "../SpotifyResultDetailAlbum/SpotifyResultDetailAlbum";
import SpotifyResultDetailTrack from "../SpotifyResultDetailTrack/SpotifyResultDetailTrack";

require("./SpotifySearchResults.css");



interface SpotifySearchResultsProps {
  className?: string;
  children?: React.ReactNode;
  query: string;
  results?: SpotifyAlbumsArtistsTracks;
  showDetail: Function;
}

interface SpotifySearchResultsState {
    results?: SpotifyAlbumsArtistsTracks;
    detail?: JSX.Element
}

export default class SpotifySearchResults extends React.Component<SpotifySearchResultsProps, SpotifySearchResultsState> {
    mainClass : string = "search-results";

    constructor( props: SpotifySearchResultsProps ) {
        super(props); 
        this.state = {
            results: this.props.results,
            detail: undefined
        };
    
    }

    componentDidUpdate( prevProps : SpotifySearchResultsProps ) {
        if (prevProps.results !== this.props.results ) {
            this.setState( { results: this.props.results } );
        }
    }


    render() {       

        let artists, albums, tracks: Array<AppData<SpotifyTrack>> = [];
        if( this.state.results && this.props.query.length > 0 ) {
            artists = mapResultArtistItems( this.state.results );
            albums = mapResultAlbumItems( this.state.results );
            tracks = mapResultTrackItems( this.state.results );               
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>                    
                    <div>
                        <h3>Artists - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Artists" type="artist" query={this.props.query} results={artists} mapFunction={mapResultArtistItems} onClick={this.selectArtist.bind(this)} className="search-result-section--artists" />
                        <h3>Albums - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Albums" type="album" query={this.props.query} results={albums} mapFunction={mapResultAlbumItems} onClick={this.selectAlbum.bind(this)} className="search-result-section--albums" />
                        <h3>Tracks - "{this.props.query}"</h3>
                        <SpotifySearchResultSection name="Tracks" type="track" query={this.props.query} results={tracks} mapFunction={mapResultTrackItems} onClick={this.selectTrack.bind(this)} className="search-result-section--tracks" />
                    </div>
                </div>
            );     
        } else {
            return <></>
        }
    }

    selectArtist( result: AppData<SpotifyArtist> ) {
        var detail = <SpotifyResultDetailArtist artist={result} showDetail={this.props.showDetail} />;
        this.props.showDetail( detail );
    }

    selectAlbum( result: AppData<SpotifyAlbum> ) {
        console.log( 'selectAlbum' );
        getAlbum( result.id ? result.id : "" ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

    selectTrack( result: AppData<SpotifyTrack> ) {
        getTrack( result.id ).then( (res:SpotifyTrack) => {           
            var detail = <SpotifyResultDetailTrack track={mapTrack(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

}
