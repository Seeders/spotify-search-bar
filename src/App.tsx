import React from 'react';
import SpotifyAppContainer from './components/SpotifyAppContainer/SpotifyAppContainer';
import './App.css';

export interface AppData<T> {
  id: string,
  parent_id: string,
  image: string,
  name: string,
  type: string,
  meta: T
}

interface AppProps {
  className?: string;
  children?: React.ReactNode;
}

function App( props: AppProps ) {

  document.addEventListener('keydown', ( event: KeyboardEvent) => {
    if (event && event.key === 'Enter') {
      event.preventDefault();
      let element = (document.activeElement as HTMLElement);
      if( element.nodeName.toLowerCase() == "a" ) element.click();
    }  
  });

  return (
    <div className="App">      
      <SpotifyAppContainer />
    </div>
  );
}

export default App;
