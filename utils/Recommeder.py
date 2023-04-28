# from flask import Flask, jsonify, request
# import pandas as pd
# from sklearn.tree import DecisionTreeClassifier
# import json
# app = Flask(_name_)
# # Load the dataset
# data = pd.read_csv('nutrition_data.csv')
# # Split the data into input and output variables
# X = data.drop(['food', 'group', 'calories'], axis=1)
# y = data['group']
# # Create the decision tree classifier
# clf = DecisionTreeClassifier()

# # Train the classifier on the full dataset
# clf.fit(X, y)
# # Define the endpoint for the nutrition recommendation system
# @app.route('/recommend', methods=['POST'])
# def recommend():
#     # Parse the JSON payload from the request
#     nutrient_info = request.json
    
#     # Make a prediction for the nutrient info
#     nutrient_list = [nutrient_info['protein'], nutrient_info['fat'], nutrient_info['carbohydrates'], nutrient_info['fiber'], 
#                      nutrient_info['sugar'], nutrient_info['calcium'], nutrient_info['iron'], nutrient_info['sodium'], nutrient_info['vitamin_c']]
#     prediction = clf.predict([nutrient_list])
#     # Return the predicted food group as a JSON response
#     response = {'predicted_group': prediction[0]}
#     return jsonify(response)
# if _name_ == '_main_':
#     app.run(debug=True)