import React, { useState } from 'react';
import './WinnerBefore.css';

const iplTeams = [
  "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
  "Kolkata Knight Riders", "Delhi Capitals", "Punjab Kings",
  "Rajasthan Royals", "Sunrisers Hyderabad", "Lucknow Super Giants",
  "Gujarat Titans"
];

const venues = [
  "Wankhede Stadium", "Eden Gardens", "M. Chinnaswamy Stadium",
  "Arun Jaitley Stadium", "Narendra Modi Stadium", "MA Chidambaram Stadium",
  "Punjab Cricket Association Stadium", "Sawai Mansingh Stadium",
  "Rajiv Gandhi International Stadium", "DY Patil Stadium", "Other"
];

function WinnerBefore({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    venue: '',
    tossWinner: '',
    tossDecision: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'team1') {
      setFormData((prevData) => ({
        ...prevData,
        team2: '',
        tossWinner: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);
    setLoading(true);

    try {
        const response = await fetch('http://127.0.0.1:5000/predict/winnerBefore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),     
        });

        if (response.ok) {
            const predictionData = await response.json();
            if (predictionData.predicted_team) {
                setPrediction(predictionData.predicted_team);
            } else {
                setError('Prediction data is not available.');
            }
        } else {
            const errorText = await response.text();
            console.error('Response Error:', errorText);
            throw new Error('Failed to fetch prediction from backend');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      team1: '',
      team2: '',
      venue: '',
      tossWinner: '',
      tossDecision: '',
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div>
      <h2 className='Main'>Winner Prediction Before Match</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Team 1:
          <select name="team1" value={formData.team1} onChange={handleChange}>
            <option value="">Select Team 1</option>
            {iplTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <label>
          Team 2:
          <select name="team2" value={formData.team2} onChange={handleChange} disabled={!formData.team1}>
            <option value="">Select Team 2</option>
            {iplTeams
              .filter((team) => team !== formData.team1)
              .map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
          </select>
        </label>

        <label>
          Venue:
          <select name="venue" value={formData.venue} onChange={handleChange}>
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </label>

        <label>
          Toss Winner:
          <select name="tossWinner" value={formData.tossWinner} onChange={handleChange} disabled={!formData.team1 || !formData.team2}>
            <option value="">Select Toss Winner</option>
            {formData.team1 && <option value={formData.team1}>{formData.team1}</option>}
            {formData.team2 && <option value={formData.team2}>{formData.team2}</option>}
          </select>
        </label>

        <label>
          Toss Decision:
          <select name="tossDecision" value={formData.tossDecision} onChange={handleChange}>
            <option value="">Select Toss Decision</option>
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </select>
        </label>

        <div>
          <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Submit'}</button>
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={onBack}>Back</button>
        </div>
      </form>

      {prediction && (
        <div>
          <h3>Prediction Result:</h3>
          <p>{`Predicted Winner: ${prediction}`}</p>
        </div>
      )}

      {error && (
        <div>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default WinnerBefore;
