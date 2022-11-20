import * as React from "react";
import SpotifySearchResult from "../SpotifySearchResult/SpotifySearchResult";
import SpotifyController from "../../controllers/SpotifyController";
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
        if( this.state.results ) {
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div>
                        <button onClick={this.previousPage.bind(this)} className={getClassName(`${this.mainClass}--previous`)}>&lt;</button>  
                    </div>
                    <div>
                        <h6>{this.props.name}</h6>            
                        <div className="search-result--flex-container">
                            {this.state.results.map( ( result: AppData<any> ) => {            
                                return (<SpotifySearchResult key={result.id} result={result} onClick={this.props.onClick} />);
                            })}  
                        </div>
                    </div>      
                    <div>
                        <button onClick={this.nextPage.bind(this)} className={getClassName(`${this.mainClass}--next`)}>&gt;</button>     
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

    loadedResults( pageNum: number, results: SpotifyAlbumsArtistsTracks ) {
        if( results != null ) {   
            this.setState( { currentPage: pageNum, results: this.props.mapFunction(results) } );
        } else {
            this.setState( { currentPage: pageNum, results: undefined } );
        }
    }
}
