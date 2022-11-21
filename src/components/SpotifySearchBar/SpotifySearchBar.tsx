import * as React from "react";
import changeIntent from "../../utils/ChangeIntent";
import getClassName from "../../utils/GetClassName";
require("./SpotifySearchBar.css");
interface SpotifySearchBarProps {
  className?: string;
  children?: React.ReactNode;
  submitCallback: Function;
}
interface SpotifySearchBarState {
}
export default class SpotifySearchBar extends React.Component<SpotifySearchBarProps, SpotifySearchBarState> {
    mainClass : string = "search-bar";
    changeIntentDelay:number = 100;

    render() {
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>
                <input type="text" autoFocus className={getClassName(`${this.mainClass}_text-input`)} placeholder="What do you want to listen to?" onChange={this.handleChange.bind(this)} />            
            </div>
        );
    }

    handleChange( event: React.ChangeEvent<HTMLInputElement>) {        
        changeIntent( event.target.value, this.doChange.bind(this), this.changeIntentDelay );        
    }

    doChange( value: string ) {
       this.props.submitCallback( value ); 
    }
}
