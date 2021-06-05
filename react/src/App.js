import React from 'react';
import { Main } from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import '@fontsource/roboto';
import './App.css';

function App() {
    return(
      <ToastProvider>
        <BrowserRouter>
          <div className="App">
            <Main />
          </div>
        </BrowserRouter>
      </ToastProvider>
    );

}

export default App;
