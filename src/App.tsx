import React from 'react';
import SpotifySearchBar from './components/SpotifySearchBar/SpotifySearchBar';
import './App.css';
interface AppProps {
  className?: string;
  children?: React.ReactNode;
}
function App( props: AppProps ) {
  return (
    <div className="App">      
      <SpotifySearchBar />
    </div>
  );
}

export default App;
