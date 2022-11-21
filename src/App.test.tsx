import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the search input', () => {
  render(<App />);
  let input = screen.getByPlaceholderText( 'What do you want to listen to?' );  
  expect(input).toBeInTheDocument();    
});
