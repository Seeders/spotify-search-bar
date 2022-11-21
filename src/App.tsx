import React from 'react';
import SpotifySearchContainer from './components/SpotifySearchContainer/SpotifySearchContainer';
import { getAccessToken } from './api/SpotifyAPI';
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
  
  getAccessToken();

  document.addEventListener('keydown', ( event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      let element = (document.activeElement as HTMLElement);
      if( element.nodeName.toLowerCase() == "a" ) element.click();
    }  
  });

  return (
    <div className="App">      
      <SpotifySearchContainer />
    </div>
  );
}

export default App;
