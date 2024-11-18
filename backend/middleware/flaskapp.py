from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import os
import tensorflow as tf
import xgboost as xgb
import joblib  # To load the scaler
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

df = pd.read_csv('inputs_for_win_before.csv')
df_first = pd.read_csv("First_score.csv")
df_second = pd.read_csv("Second_dset.csv")

def load_model(model_name, model_type='xgb'):
    try:
        if model_type == 'xgb':
            model = xgb.XGBClassifier()
            if os.path.isfile(model_name):
                model.load_model(model_name)
                return model
            else:
                print(f"Model file '{model_name}' does not exist.")
        elif model_type == 'keras':
            if os.path.isfile(model_name):
                model = tf.keras.models.load_model(model_name)
                return model
            else:
                print(f"Model file '{model_name}' does not exist.")
        else:
            raise ValueError("Unknown model type")
    except Exception as e:
        print(f"Error loading model '{model_name}': {e}")
        return None

ipl_winner_before_model = load_model('Win_before.json', model_type='xgb')
ipl_winner_after_model = load_model('Win_after.h5', model_type='keras')
ipl_score_first = load_model("First_score.h5", model_type="keras")
ipl_score_second = load_model("Sec_innings.h5", model_type="keras")

scaler = None
scaler_y_first_inn = None

def load_scaler(scaler_filename):
    if os.path.isfile(scaler_filename):
        return joblib.load(scaler_filename)
    else:
        print(f"Scaler file '{scaler_filename}' does not exist.")
        return None

scaler = load_scaler('scaler_first.pkl')
scaler_y_first_inn = load_scaler('scaler_y(first_inn).pkl')
scaler_first_inn = load_scaler('scaler_x(first_inn).pkl')
scaler_x_sec = load_scaler('scaler_x(sec).pkl')
scaler_y_sec = load_scaler('scaler_y(sec).pkl')

def encode_team(team_name):
    team_mapping = {
        "Chennai Super Kings": 1, "Delhi Capitals": 2, "Kolkata Knight Riders": 3,
        "Mumbai Indians": 4, "Punjab Kings": 5, "Rajasthan Royals": 6,
        "Royal Challengers Bangalore": 7, "Sunrisers Hyderabad": 8,
        "Lucknow Super Giants": 9, "Gujarat Titans": 0
    }
    return team_mapping.get(team_name, -1)

def decode_team(index):
    index_to_team = {
        1: "Chennai Super Kings", 2: "Delhi Capitals", 3: "Kolkata Knight Riders",
        4: "Mumbai Indians", 5: "Punjab Kings", 6: "Rajasthan Royals",
        7: "Royal Challengers Bangalore", 8: "Sunrisers Hyderabad",
        9: "Lucknow Super Giants", 0: "Gujarat Titans"
    }
    return index_to_team.get(index, "Unknown Team")

def encode_venue(venue_name):
    venue_mapping = {
        "Wankhede Stadium": 4, "MA Chidambaram Stadium": 1, "M. Chinnaswamy Stadium": 7,
        "Arun Jaitley Stadium": 2, "Eden Gardens": 3, "Rajiv Gandhi International Cricket Stadium": 8,
        "Sawai Mansingh Stadium": 6, "Punjab Cricket Association IS Bindra Stadium": 5,
        "Narendra Modi Stadium": 0,
        "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium": 9,
        "Others": -1
    }
    return venue_mapping.get(venue_name, -1)

def get_averages(venue_index):
    row = df[df['venue'] == venue_index]
    if not row.empty:
        first_average = row.iloc[0]['first_average']
        second_average = row.iloc[0]['second_average']
        return first_average, second_average
    return None, None

def preprocess_data_before(form_data):
    team1 = encode_team(form_data['team1'])
    team2 = encode_team(form_data['team2'])
    venue = encode_venue(form_data['venue'])
    toss_winner = encode_team(form_data['tossWinner'])
    toss_decision = 1 if form_data['tossDecision'].lower() == 'bat' else 0
    first_avg, second_avg = get_averages(venue)
    return np.array([team1, team2, venue, toss_winner, toss_decision, first_avg, second_avg]).reshape(1, -1)

def preprocess_data_after(form_data):
    batting_team = encode_team(form_data['batting_team'])
    bowling_team = encode_team(form_data['bowling_team'])
    venue = encode_venue(form_data['venue'])
    over, ball = divmod(float(form_data['over']), 1)
    over, ball = int(over), int(ball * 10)
    current_score = form_data['current_score']
    wickets = form_data['wickets']
    first_innings_score = float(form_data['first_innings_score'])
    
    features = np.array([[batting_team, bowling_team, over, ball, current_score, wickets, venue, first_innings_score]])

    if scaler:
        features_scaled = scaler.transform(features)
    else:
        features_scaled = features 
        
    return features_scaled.reshape(1, 1, 8)

def preprocess_first_score(form_data):
    # Encoding teams and venue
    battingteam = encode_team(form_data['batting_team'])
    bowlingteam = encode_team(form_data['bowling_team'])
    venue = encode_venue(form_data['venue'])

    over = form_data["over"]
    scoreTillNow = form_data["score"]
    wicketsFallen = form_data["wickets"]

    venue_data = df_first[df_first["venue"] == venue]
    if venue_data.empty:
        return None

    t1w = venue_data["team1_wins"].iloc[0]
    t2w = venue_data["team2_wins"].iloc[0]
    a1 = venue_data["a1"].iloc[0]
    a2 = venue_data["a2"].iloc[0]
    humid = venue_data["humid"].iloc[0]
    bs = venue_data["boundary_size"].iloc[0]

    inputs_first = pd.DataFrame([[battingteam, bowlingteam, venue, t1w, t2w, a1, humid, bs, a2, over, scoreTillNow, wicketsFallen]], 
                                columns=["batting_team", "bowling_team", "venue", "team1_wins", "team2_wins", "a1", 
                                         "humid", "boundary_size", "a2", "over_ball", "cumulative_runs", "cummulative_wickets"])

    if scaler_first_inn:
        inputs_first_scaled = scaler_first_inn.transform(inputs_first)
    else:
        print("Scaler not found, using raw data.")
        inputs_first_scaled = inputs_first

    return inputs_first_scaled

def preprocess_sec_innings(form_data):
    batting = form_data["battingTeam"]
    bowling = form_data["bowlingTeam"]
    venue = form_data["venue"]
    first = form_data["firstInningsScore"]
    over = form_data["over"]
    currentScore = form_data["currentScore"]
    wickets = form_data["wicketsFallen"]
    venue_data = df_second[df_second["venue"] == venue]
    if venue_data.empty:
        return None
    t1w = venue_data["team1_wins"].iloc[0]
    t2w = venue_data["team2_wins"].iloc[0]
    a1 = venue_data["a1"].iloc[0]
    a2 = venue_data["a2"].iloc[0]
    humid = venue_data["humid"].iloc[0]
    bs = venue_data["boundary_size"].iloc[0]
    inputs_sec = np.array([[batting,bowling,venue,t1w, t2w, a1, humid, bs, a2,over,currentScore,wickets,first]])
    inputs_sec = scaler_x_sec.transform(inputs_sec)
    return inputs_sec


@app.route('/predict/winnerBefore', methods=['POST'])
def predict_winner_before():
    try:
        form_data = request.get_json()
        features = preprocess_data_before(form_data)
        prediction = ipl_winner_before_model.predict(features)
        predicted_team = decode_team(int(prediction[0]))
        return jsonify({"predicted_team": predicted_team})
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

@app.route('/predict/winnerAfter', methods=['POST'])
def predict_winner_after():
    try:
        form_data = request.get_json()
        features = preprocess_data_after(form_data)
        prediction = ipl_winner_after_model.predict(features)
        predicted_team_index = int(np.argmax(prediction, axis=1)[0])
        predicted_team = decode_team(predicted_team_index)
        return jsonify({"predicted_team": predicted_team})
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

@app.route('/predict/firstScore', methods=['POST'])
def predict_first_score():
    try:
        form_data = request.get_json()
        features = preprocess_first_score(form_data)
        if features is None:
            return jsonify({"error": "No data found for the specified venue."}), 400

        prediction = ipl_score_first.predict(features)
        prediction_inverse = scaler_y_first_inn.inverse_transform(prediction.reshape(-1, 1))
        
        predicted_score = int(prediction_inverse[0][0])
        
        return jsonify({"predicted_first_innings_score": predicted_score})
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500


@app.route('/predict/secondScore',methods = ['POST'])
def predict_sec_score():
    try:
        form_data = request.get_json()
        features = preprocess_sec_innings(form_data)
        if features is None:
            return jsonify({"error": "No data found for the specified venue."}), 400
        prediction_sec_score = ipl_score_second.predict(features)
        prediction_sec_score = scaler_y_sec.inverse_transform(prediction_sec_score.reshape(-1,1))
        predicted_score = int(prediction_sec_score[0][0])
        return jsonify({"predicted_second_innings_score": predicted_score})
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
