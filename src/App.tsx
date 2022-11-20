import React from 'react';
import SpotifySearchContainer from './components/SpotifySearchContainer/SpotifySearchContainer';
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
  return (
    <div className="App">      
      <SpotifySearchContainer />
    </div>
  );
}

export default App;
