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
        if( this.state.results ) {
            artists = mapResultArtistItems( this.state.results );
            albums = mapResultAlbumItems( this.state.results );
            tracks = mapResultTrackItems( this.state.results );        
        }
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                {this.getDetail()}
                <SpotifySearchResultSection name="Artists" type="artist" query={this.props.query} results={artists} mapFunction={mapResultArtistItems} onClick={this.selectArtist.bind(this)} className="search-result-section--artists" />
                <SpotifySearchResultSection name="Albums" type="album" query={this.props.query} results={albums} mapFunction={mapResultAlbumItems} onClick={this.selectAlbum.bind(this)} className="search-result-section--albums" />
                <SpotifySearchResultSection name="Tracks" type="track" query={this.props.query} results={tracks} mapFunction={mapResultTrackItems} onClick={this.selectTrack.bind(this)} className="search-result-section--tracks" />
            </div>
        );
    }

    getDetail() {
        if( this.state.detail ) {
            return <SpotifyResultDetail onClose={this.closeDetail.bind(this)}>{this.state.detail}</SpotifyResultDetail>;
        } else {
            return <></>;
        }
    }

    closeDetail() {
        this.setState( { detail: undefined } );
    }

    selectArtist( result: AppData<SpotifyArtist> ) {
        var detail = <SpotifyResultDetailArtist artist={result} />;
        this.setState( { detail: detail } );
    }

    selectAlbum( result: AppData<SpotifyAlbum> ) {
        getAlbum( result.id ? result.id : "" ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} />;
            this.setState( { detail: detail } );
        });
    }

    selectTrack( result: AppData<SpotifyTrack> ) {
        getTrack( result.id ).then( (res:SpotifyTrack) => {           
            var detail = <SpotifyResultDetailTrack track={mapTrack(res)} />;
            this.setState( { detail: detail } );
        });
    }

}
