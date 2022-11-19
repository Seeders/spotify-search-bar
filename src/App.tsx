import React from 'react';
import SpotifySearchContainer from './components/SpotifySearchContainer/SpotifySearchContainer';
import './App.css';
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
