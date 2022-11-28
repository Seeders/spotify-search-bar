import * as React from "react";
import getClassName from "../../utils/GetClassName";
import handleChangeIntent from "../../utils/ChangeIntent";
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
    lastSubmit : string = "";

    render() {    
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <input type="text" autoFocus className={getClassName(`${this.mainClass}_text-input`)} placeholder="What do you want to listen to?" onChange={(event) => this.handleChange(event)} />                        
            </div>
        );
    }

    /**
     * handle user input in search box.
     **/
     handleChange( event: React.ChangeEvent<HTMLInputElement>){   
        localStorage.setItem( 'spotify_last-query', event.target.value );  
        handleChangeIntent( () => {     
            let query = localStorage.getItem( 'spotify_last-query' );           
            this.props.submitCallback( query );
        }, 100 );
    }


}
