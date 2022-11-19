import * as React from "react";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";
import { SpotifyResult } from "../SpotifySearchResult/SpotifySearchResult";
import SpotifyController from "../../controllers/SpotifyController";
import { SpotifyAPIResult } from "../../controllers/SpotifyController";
import getClassName from "../../utils/GetClassName";
require("./SpotifySearchResultSection.css");

interface SpotifySearchResultSectionProps {
  className?: string;
  children?: React.ReactNode;
  name: string;
  type: string;
  query: string;
  results?: Array<SpotifyResult>;
  mapFunction: Function;
}

interface SpotifySearchResultSectionState {
    currentPage: number;
    results?: Array<SpotifyResult>;
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
        if( this.state.results ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <h6>{this.props.name}</h6>     
                    <a href='javascript:void(0)' onClick={this.previousPage.bind(this)} className={getClassName(`${this.mainClass}--previous`)}>Previous</a>         
                    <a href='javascript:void(0)' onClick={this.nextPage.bind(this)} className={getClassName(`${this.mainClass}--next`)}>Next</a>   
                    <div className="search-result-section--flex-container">
                        {this.state.results.map( ( result: SpotifyResult ) => {            
                            return (<SpotifySearchResult key={result.id} result={result} />);
                        })}  
                    </div>        
                </div>
            );
        } else {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                   
                </div>
            );
        }
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
        let controller = new SpotifyController();
        controller.query( this.props.query, this.props.type, pageNum ).then( (res) => {
            this.loadedResults( pageNum, res );
        });
    }

    loadedResults( pageNum: number, results: SpotifyAPIResult ) {
        if( results != null ) {   
            this.setState( { currentPage: pageNum, results: this.props.mapFunction(results) } );
        } else {
            this.setState( { currentPage: pageNum, results: undefined } );
        }
    }
}
