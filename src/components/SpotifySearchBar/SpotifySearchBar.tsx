import * as React from "react";
import changeIntent from "../../utils/ChangeIntent";
import SpotifyController from "../../controllers/SpotifyController";
require("./SpotifySearchBar.css");
interface SpotifySearchBarProps {
  className?: string;
  children?: React.ReactNode;
  resultsCallback: Function;
}
interface SpotifySearchBarState {
}
export default class SpotifySearchBar extends React.Component<SpotifySearchBarProps, SpotifySearchBarState> {

    changeIntentDelay:number = 100;

    getClassName() {
        return "spotify-search-bar " + this.props.className;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                <input id="spotify-search-bar_text-input" type="text" className="spotify-search-bar_text-input" placeholder="What do you want to listen to?" onChange={this.handleChange.bind(this)} />            
            </div>
        );
    }

    handleChange( event: React.ChangeEvent<HTMLInputElement>) {        
        changeIntent( event.target.value, this.doChange.bind(this), this.changeIntentDelay );        
    }

    doChange( value: string ) {
        if( value.length > 0 ) {
            let controller = new SpotifyController();
            controller.query( value ).then( (res) => {
                this.props.resultsCallback( res );
            });
        } else {
            this.props.resultsCallback( null );
        }
    }
}
