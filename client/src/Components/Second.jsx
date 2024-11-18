import React, { useState } from 'react';

const transform = {
  'Chennai Super Kings': 1,
  'Delhi Capitals': 2,
  'Kolkata Knight Riders': 3,
  'Mumbai Indians': 4,
  'Punjab Kings': 5,
  'Rajasthan Royals': 6,
  'Royal Challengers Bangalore': 7,
  'Sunrisers Hyderabad': 8,
  'Lucknow Super Giants': 9,
  'Gujarat Titans': 0,
};

const stadiumTeamMap = {
  'Wankhede Stadium': 4,
  'MA Chidambaram Stadium': 1,
  'M. Chinnaswamy Stadium': 7,
  'Arun Jaitley Stadium': 2,
  'Eden Gardens': 3,
  'Rajiv Gandhi International Cricket Stadium': 8,
  'Sawai Mansingh Stadium': 6,
  'Punjab Cricket Association IS Bindra Stadium': 5,
  'Narendra Modi Stadium': 0,
  'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium': 9,
  'Others': -1,
};

const teams = [
  'Mumbai Indians',
  'Chennai Super Kings',
  'Royal Challengers Bangalore',
  'Delhi Capitals',
  'Kolkata Knight Riders',
  'Sunrisers Hyderabad',
  'Rajasthan Royals',
  'Punjab Kings',
  'Gujarat Titans',
  'Lucknow Super Giants',
];

const stadiums = [
  'Wankhede Stadium',
  'MA Chidambaram Stadium',
  'M. Chinnaswamy Stadium',
  'Arun Jaitley Stadium',
  'Eden Gardens',
  'Rajiv Gandhi International Cricket Stadium',
  'Sawai Mansingh Stadium',
  'Punjab Cricket Association IS Bindra Stadium',
  'Narendra Modi Stadium',
  'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium',
  'Others',
];

function Second({ onSubmit, onBack }) {
  const [selectedTeams, setSelectedTeams] = useState({ batting: '', bowling: '' });
  const [venue, setVenue] = useState('');
  const [inningsData, setInningsData] = useState({
    firstInningsScore: '',
    over: '',
    currentScore: '',
    wickets: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleTeamChange = (inningType, team) => {
    setSelectedTeams((prevState) => ({ ...prevState, [inningType]: team }));
  };

  const handleVenueChange = (venue) => setVenue(venue);

  const handleInningsDataChange = (e) => {
    const { name, value } = e.target;
    setInningsData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedTeams.batting) errors.batting = 'Batting team is required';
    if (!selectedTeams.bowling) errors.bowling = 'Bowling team is required';
    if (!venue) errors.venue = 'Venue is required';
    if (!inningsData.firstInningsScore) errors.firstInningsScore = 'First innings score is required';
    if (!inningsData.over) errors.over = 'Over is required';
    if (!inningsData.currentScore) errors.currentScore = 'Current score is required';
    if (!inningsData.wickets) errors.wickets = 'Wickets fallen is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInningsSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const predictionData = {
      battingTeam: transform[selectedTeams.batting] || '',
      bowlingTeam: transform[selectedTeams.bowling] || '',
      venue: stadiumTeamMap[venue] || '',
      firstInningsScore: parseInt(inningsData.firstInningsScore, 10),
      over: inningsData.over,
      currentScore: inningsData.currentScore,
      wicketsFallen: inningsData.wickets,
    };
  
    console.log("Submitting prediction data:", predictionData);
  
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/predict/secondScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });
  
      const responseData = await response.json();
      console.log("Response from backend:", responseData);
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to predict second innings score');
      }
  
      setPrediction(responseData.predicted_second_innings_score); 
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error sending data to Flask: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    setSelectedTeams({ batting: '', bowling: '' });
    setVenue('');
    setInningsData({ firstInningsScore: '', over: '', currentScore: '', wickets: '' });
    setPrediction(null);
    setErrorMessage('');
    setFormErrors({});
  };

  return (
    <div>
      <h2 className='Main'>Second Innings Score Prediction</h2>

      <form onSubmit={handleInningsSubmit}>
        <div>
          <label>Batting Team:</label>
          <select
            value={selectedTeams.batting}
            onChange={(e) => handleTeamChange('batting', e.target.value)}
          >
            <option value="">Select Batting Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          {formErrors.batting && <span style={{ color: 'red' }}>{formErrors.batting}</span>}
        </div>

        <div>
          <label>Bowling Team:</label>
          <select
            value={selectedTeams.bowling}
            onChange={(e) => handleTeamChange('bowling', e.target.value)}
            disabled={!selectedTeams.batting}
          >
            <option value="">Select Bowling Team</option>
            {teams.filter((team) => team !== selectedTeams.batting).map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          {formErrors.bowling && <span style={{ color: 'red' }}>{formErrors.bowling}</span>}
        </div>

        <div>
          <label>Venue:</label>
          <select value={venue} onChange={(e) => handleVenueChange(e.target.value)}>
            <option value="">Select Venue</option>
            {stadiums.map((stadium) => (
              <option key={stadium} value={stadium}>
                {stadium}
              </option>
            ))}
          </select>
          {formErrors.venue && <span style={{ color: 'red' }}>{formErrors.venue}</span>}
        </div>

        <div>
          <label>First Innings Score:</label>
          <input
            type="number"
            name="firstInningsScore"
            min="0"
            value={inningsData.firstInningsScore}
            onChange={handleInningsDataChange}
          />
          {formErrors.firstInningsScore && <span style={{ color: 'red' }}>{formErrors.firstInningsScore}</span>}
        </div>

        <div>
          <label>Over:</label>
          <input
            type="number"
            name="over"
            min="0"
            step="0.1"
            max="20"
            value={inningsData.over}
            onChange={handleInningsDataChange}
          />
          {formErrors.over && <span style={{ color: 'red' }}>{formErrors.over}</span>}
        </div>

        <div>
          <label>Current Score:</label>
          <input
            type="number"
            name="currentScore"
            min="0"
            value={inningsData.currentScore}
            onChange={handleInningsDataChange}
          />
          {formErrors.currentScore && <span style={{ color: 'red' }}>{formErrors.currentScore}</span>}
        </div>

        <div>
          <label>Wickets Fallen:</label>
          <input
            type="number"
            name="wickets"
            min="0"
            value={inningsData.wickets}
            onChange={handleInningsDataChange}
          />
          {formErrors.wickets && <span style={{ color: 'red' }}>{formErrors.wickets}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Predict Second Innings Score'}
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {prediction !== null && prediction !== undefined && (
        <div>
          <h3>Predicted Second Innings Score: {prediction}</h3>
        </div>
      )}
    </div>
  );
}

export default Second;
