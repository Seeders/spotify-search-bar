import * as React from "react";
import changeIntent from "../../utils/ChangeIntent";
import SpotifyController from "../../controllers/SpotifyController";
require("./SpotifySearchBar.css");
interface SpotifySearchBarProps {
  className?: string;
  children?: React.ReactNode;
}
interface SpotifySearchBarState {
}
export default class SpotifySearchBar extends React.Component<SpotifySearchBarProps, SpotifySearchBarState> {

    changeIntentDelay:number = 400;

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
        changeIntent( event.target.value, this.doChange, this.changeIntentDelay );        
    }

    doChange( value: string ) {
        let controller = new SpotifyController();
        controller.query( value ).then( (res) => {
            console.log( 'response: ', res );
        });
    }
}
