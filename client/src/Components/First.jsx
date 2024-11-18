import React, { useState } from 'react';

function First({ onSubmit, onBack }) {
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

  const [selectedTeams, setSelectedTeams] = useState({
    batting: '',
    bowling: '',
  });
  const [venue, setVenue] = useState('');
  const [inningsData, setInningsData] = useState({
    over: '',
    score: '',
    wickets: '',
  });
  const [predictedScore, setPredictedScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleReset = () => {
    setSelectedTeams({ batting: '', bowling: '' });
    setVenue('');
    setInningsData({ over: '', score: '', wickets: '' });
    setPredictedScore(null);
    setErrorMessage('');
  };

  const handleTeamChange = (inningType, team) => {
    setSelectedTeams((prevState) => ({
      ...prevState,
      [inningType]: team,
      ...(inningType === 'batting' && prevState.bowling === team
        ? { bowling: '' }
        : {}),
    }));
  };

  const handleVenueChange = (venue) => {
    setVenue(venue);
  };

  const handleInningsDataChange = (e) => {
    const { name, value } = e.target;
    setInningsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInningsSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    setErrorMessage('');
    
    try {
      const formData = {
        batting_team: selectedTeams.batting,
        bowling_team: selectedTeams.bowling,
        venue: stadiumTeamMap[venue] || -1,
        over: inningsData.over,
        score: inningsData.score,
        wickets: inningsData.wickets,
      };

      console.log('Form Data:', formData); 

      const response = await fetch('http://localhost:5000/predict/firstScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      } else if (data.predicted_first_innings_score !== undefined) {
        setPredictedScore(data.predicted_first_innings_score);
      } else {
        throw new Error('Prediction failed: Predicted score not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='Main'>First Innings Score Prediction</h2>

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
        </div>

        <div>
          <label>Bowling Team:</label>
          <select
            value={selectedTeams.bowling}
            onChange={(e) => handleTeamChange('bowling', e.target.value)}
          >
            <option value="">Select Bowling Team</option>
            {teams
              .filter((team) => team !== selectedTeams.batting)
              .map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
          </select>
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
        </div>

        <div>
          <label>Score Till Now:</label>
          <input
            type="number"
            name="score"
            min="0"
            value={inningsData.score}
            onChange={handleInningsDataChange}
          />
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
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict 1st Innings Score'}
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {predictedScore !== null && (
        <div>
          <h3>Predicted 1st Innings Score is in range of : {predictedScore} to {predictedScore+7} </h3>
        </div>
      )}
    </div>
  );
}

export default First;
