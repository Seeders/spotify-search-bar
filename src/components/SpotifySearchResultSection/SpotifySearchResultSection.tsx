import * as React from "react";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";
import { query } from "../../api/SpotifyAPI";
import { SpotifyAlbumsArtistsTracks } from "../../models/SpotifyModels";
import { AppData } from "../../App";
import getClassName from "../../utils/GetClassName";
require("./SpotifySearchResultSection.css");

export interface SpotifySearchResultSectionProps {
  className?: string;
  children?: React.ReactNode;
  name: string; // Artist/Album/Track
  type: string; // Artist/Album/Track
  query: string; // searched input text from the user
  results?: Array<AppData<any>>; //current set of results to render
  mapFunction: Function; //what mapping function to use with new results from pagination
  onClick: Function; //callback function for clicking a particular item in the list
}

interface SpotifySearchResultSectionState {
    currentPage: number;
    results?: Array<AppData<any>>;
}

/**
 * Renders 10 results from the Spotify API as SpotifySearchResult components.
 * Contains pagination to retrieve the next/previous 10 items 
 **/
export default class SpotifySearchResultSection extends React.Component<SpotifySearchResultSectionProps, SpotifySearchResultSectionState> {
    mainClass : string = "search-result-section";

    constructor( props: SpotifySearchResultSectionProps ) {
        super(props); 
    
        this.state = {
            currentPage: 0,            
            results: this.props.results
        };    
    }

    /**
     * Reset state and current page when new results are set.
     */
    componentDidUpdate( prevProps : SpotifySearchResultSectionProps ) {
        if (prevProps.results !== this.props.results ) {
            this.setState( { currentPage: 0, results: this.props.results } );
        }
    }

    render() {
        let content = (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div className={getClassName(`${this.mainClass}-empty`)}>No {this.props.type}s found.</div>
            </div>
        );
        if( this.state.results && this.state.results.length > 0 ) {
            content = (
                    <div className="spotify_result--flex-container">
                        {this.state.results.map( ( result: AppData<any> ) => {            
                            return (<SpotifySearchResult key={result.id} item={result} onClick={this.props.onClick} />);
                        })}  
                    </div>
            );
        }
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div>
                    <button disabled={this.state.currentPage == 0} onClick={() => this.previousPage} className={getClassName(`${this.mainClass}--previous`)}>&lt;</button>  
                </div>
                <div>        
                   {content}
                </div>      
                <div>
                    <button onClick={() => this.nextPage} className={getClassName(`${this.mainClass}--next`)}>&gt;</button>     
                </div>
            </div>
        );
    }

    /**
     * Pagination - query for the previous page of results
     **/
    previousPage() {
        if( this.state.currentPage > 0 ) {
            this.submitQuery( this.state.currentPage - 1 );
        }
    }

    /**
     * Pagination - query for the next page of results
     **/
    nextPage() {
        this.submitQuery( this.state.currentPage + 1 );
    } 

    /**
     * Pagination - query for the a particular page of results
     **/
    submitQuery( pageNum: number ) {
        query( this.props.query, this.props.type, pageNum ).then( (res:SpotifyAlbumsArtistsTracks) => {
            this.loadedResults( pageNum, res );
        });
    }

    /**
     * Pagination - result handler
     **/
    loadedResults( pageNum: number, results: SpotifyAlbumsArtistsTracks ) {
        if( results != null ) {   
            this.setState( { currentPage: pageNum, results: this.props.mapFunction(results) } );
        } else {
            this.setState( { currentPage: pageNum, results: undefined } );
        }
    }
}
