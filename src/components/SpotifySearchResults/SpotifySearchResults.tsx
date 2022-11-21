import * as React from "react";
import SpotifySearchResultSection from "../SpotifySearchResultSection/SpotifySearchResultSection";
import { SpotifySearchResultSectionProps } from "../SpotifySearchResultSection/SpotifySearchResultSection";
import getClassName from "../../utils/GetClassName";


require("./SpotifySearchResults.css");

interface SpotifySearchResultsProps {
  className?: string;
  children?: React.ReactNode;
  query: string; //the query from the user input
  sections?: Array<SpotifySearchResultSectionProps>; //set of results from the API
}

interface SpotifySearchResultsState {
    sections?: Array<SpotifySearchResultSectionProps>; //current result set
}

/**
 * Renders Artists, Albums, and Tracks as SearchResultSection components.
 **/
export default class SpotifySearchResults extends React.Component<SpotifySearchResultsProps, SpotifySearchResultsState> {
    mainClass : string = "search-results";

    constructor( props: SpotifySearchResultsProps ) {
        super(props); 
        this.state = {
            sections: this.props.sections
        };
    
    }

    componentDidUpdate( prevProps : SpotifySearchResultsProps ) {
        if (prevProps.sections !== this.props.sections ) {
            this.setState( { sections: this.props.sections } );
        }
    }

    render() {       
        if( this.state.sections && this.props.query.length > 0 ) {             
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>                    
                    <div>
                        {this.state.sections.map( ( section: SpotifySearchResultSectionProps ) => {            
                            return (
                                <>
                                <h3>{section.name} - "{this.props.query}"</h3>
                                <SpotifySearchResultSection name={section.name} type={section.type} query={this.props.query} results={section.results} mapFunction={section.mapFunction} onClick={section.onClick} className={`search-result-section--${section.name.toLowerCase()}`} />
                                </>
                            );
                        })}  
                    </div>
                </div>
            );     
        } else {
            return <></>
        }
    }
}
