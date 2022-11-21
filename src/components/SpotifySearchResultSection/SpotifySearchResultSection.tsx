import * as React from "react";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";
import { query } from "../../api/SpotifyAPI";
import { SpotifyAlbumsArtistsTracks } from "../../models/SpotifyModels";
import { AppData } from "../../App";
import getClassName from "../../utils/GetClassName";
require("./SpotifySearchResultSection.css");

interface SpotifySearchResultSectionProps {
  className?: string;
  children?: React.ReactNode;
  name: string;
  type: string;
  query: string;
  results?: Array<AppData<any>>;
  mapFunction: Function;
  onClick: Function;
}

interface SpotifySearchResultSectionState {
    currentPage: number;
    results?: Array<AppData<any>>;
}

export default class SpotifySearchResultSection extends React.Component<SpotifySearchResultSectionProps, SpotifySearchResultSectionState> {
    mainClass : string = "search-result-section";

    constructor( props: SpotifySearchResultSectionProps ) {
        super(props); 
    
        this.state = {
            currentPage: 0,            
            results: this.props.results
        };    
    }

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
                    <div className="search-result--flex-container">
                        {this.state.results.map( ( result: AppData<any> ) => {            
                            return (<SpotifySearchResult key={result.id} result={result} onClick={this.props.onClick} />);
                        })}  
                    </div>
            );
        }
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <div>
                    <button onClick={this.previousPage.bind(this)} className={getClassName(`${this.mainClass}--previous`)}>&lt;</button>  
                </div>
                <div>        
                   {content}
                </div>      
                <div>
                    <button onClick={this.nextPage.bind(this)} className={getClassName(`${this.mainClass}--next`)}>&gt;</button>     
                </div>
            </div>
        );
    }

    previousPage() {
        if( this.state.currentPage > 0 ) {
            this.submitQuery( this.state.currentPage - 1 );
        }
    }

    nextPage() {
        this.submitQuery( this.state.currentPage + 1 );
    } 
    
    submitQuery( pageNum: number ) {
        query( this.props.query, this.props.type, pageNum ).then( (res:SpotifyAlbumsArtistsTracks) => {
            this.loadedResults( pageNum, res );
        });
    }

    loadedResults( pageNum: number, results: SpotifyAlbumsArtistsTracks ) {
        if( results != null ) {   
            this.setState( { currentPage: pageNum, results: this.props.mapFunction(results) } );
        } else {
            this.setState( { currentPage: pageNum, results: undefined } );
        }
    }
}
