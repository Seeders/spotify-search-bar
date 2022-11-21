import * as React from "react";
import getClassName from "../../utils/GetClassName";

require("./SpotifyResultDetail.css");


interface SpotifyResultDetailProps {
  className?: string;
  children?: React.ReactNode;
  onClose: React.MouseEventHandler<HTMLAnchorElement>;
  query: string;
}

interface SpotifyResultDetailState {}

export default class SpotifyResultDetail extends React.Component<SpotifyResultDetailProps, SpotifyResultDetailState> {

    mainClass : string = "result-detail";

    render() {
        //always show the detail when we update the detail.  
        //this assumes the detail will always be visible from the top scroll position
        //i used this in place of a modal because i dont mind scrolling vertically beyond the detail to see more search results.
        //then if a user clicks a result, it just scrolls to the top and shows it in the detail pane.        
        window.scrollTo({ top: 0 });
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>                
                <div className={getClassName(`${this.mainClass}-query`)}><a tabIndex={0} onClick={this.props.onClose}>"{this.props.query}"</a> - <span className="spotify_text-parenthesis">(Searched)</span></div>
                <div className={getClassName(`${this.mainClass}-content`)}>{this.props.children}</div>
            </div>
        );
    }


}
