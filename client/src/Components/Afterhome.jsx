import React, { useState } from 'react';
import WinnerBefore from './Winnerbefore';
import WinnerAfter from './Winnerafter';
import First from './First';
import Second from './Second';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentView, setCurrentView] = useState('');

  const handleBackToMain = () => setCurrentView('');

  return (
    <div>
      <h1 className='Main'>IPL Prediction</h1>   

      {currentView === '' && (
        <div>
          <center>
          <button onClick={() => setCurrentView('winnerPredictions')}>
            Winner Predictions
          </button>
          <button onClick={() => setCurrentView('scorePredictions')}>
            Score Predictions
          </button>
          </center>
        </div>
      )}

      {currentView === 'winnerPredictions' && (       
        <div>
          <button onClick={() => setCurrentView('winnerBefore')}>Winner Before Match</button>
          <button onClick={() => setCurrentView('winnerAfter')}>Winner After Inning</button>
          <button onClick={handleBackToMain} >Back</button>
        </div>
      )}

      {currentView === 'scorePredictions' && (
        <div>
          <button onClick={() => setCurrentView('firstInnings')}>First Innings Score Prediction</button>
          <button onClick={() => setCurrentView('secondInnings')}>Second Innings Score Prediction</button>
          <button onClick={handleBackToMain}>Back</button>
        </div>
      )}

      {currentView === 'winnerBefore' && (
        <WinnerBefore 
          onSubmit={(data) => console.log(data)}
          onBack={() => setCurrentView('winnerPredictions')}
        />
      )}
      
      {currentView === 'winnerAfter' && (
        <WinnerAfter 
          onSubmit={(data) => console.log(data)} 
          onBack={() => setCurrentView('winnerPredictions')} 
        />
      )}

      {currentView === 'firstInnings' && (
        <First 
          onSubmit={(data) => console.log(data)} 
          onBack={() => setCurrentView('scorePredictions')}
        />
      )}
      
      {currentView === 'secondInnings' && (
        <Second 
          onSubmit={(data) => console.log(data)} 
          onBack={() => setCurrentView('scorePredictions')} 
        />
      )}
    </div>
  );
}

export default App;
