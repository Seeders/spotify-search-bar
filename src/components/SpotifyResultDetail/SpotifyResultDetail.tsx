import * as React from "react";
import getClassName from "../../utils/GetClassName";

require("./SpotifyResultDetail.css");


interface SpotifyResultDetailProps {
  className?: string;
  children?: React.ReactNode;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

interface SpotifyResultDetailState {}

export default class SpotifyResultDetail extends React.Component<SpotifyResultDetailProps, SpotifyResultDetailState> {

    mainClass : string = "result-detail";

    render() {
        window.scrollTo({ top: 0 });
        return (
            <div className={getClassName(this.mainClass, this.props.className)}>                
                <button onClick={this.props.onClose}>&lt;</button>
                {this.props.children}
            </div>
        );
    }


}
