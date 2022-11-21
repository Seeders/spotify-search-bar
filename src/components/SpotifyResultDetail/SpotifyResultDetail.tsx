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
        window.scrollTo({ top: 0 });
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>                
                <div className={getClassName(`${this.mainClass}-query`)}><a tabIndex={0} onClick={this.props.onClose}>"{this.props.query}"</a> - <span className="spotify_text-parenthesis">(Searched)</span></div>
                <div className={getClassName(`${this.mainClass}-content`)}>{this.props.children}</div>
            </div>
        );
    }


}
