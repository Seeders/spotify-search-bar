import * as React from "react";
import changeIntent from "../../utils/ChangeIntent";
import getClassName from "../../utils/GetClassName";
require("./SpotifySearchBar.css");
interface SpotifySearchBarProps {
  className?: string;
  children?: React.ReactNode;
  submitCallback: Function; //function to call on user input
}
interface SpotifySearchBarState {
}
export default class SpotifySearchBar extends React.Component<SpotifySearchBarProps, SpotifySearchBarState> {
    mainClass : string = "search-bar";
    changeIntentDelay:number = 100;

    render() {
        let query = localStorage.getItem( 'spotify_last-query' );

        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <input value={query ? query : ""} type="text" autoFocus className={getClassName(`${this.mainClass}_text-input`)} placeholder="What do you want to listen to?" onFocus={this.handleChange.bind(this)} onChange={this.handleChange.bind(this)} />            
            </div>
        );
    }

    /**
     * handle user input in search box.
     **/
    handleChange( event: React.ChangeEvent<HTMLInputElement>) {   
        if(  event.target.value.length > 0 ) {
            this.props.submitCallback( event.target.value );           
        }
    }
}
