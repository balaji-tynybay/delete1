import json
import sys
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta

try:
    # Accessing command-line arguments
    arguments = sys.argv[1:]

    data = json.loads(arguments[0])

    # Convert 'date' column to datetime type and extract 'y' values
    ds = [datetime.strptime(item['date'], '%Y-%m-%d %H:%M:%S') for item in data['data']]
    y = [item['consumption'] for item in data['data']]

    # Create a Prophet model
    model = Prophet()
    df = pd.DataFrame({'ds': ds, 'y': y})

    # Fit the model to the data
    model.fit(df)

    period = int(arguments[2])
    freq = arguments[1]

    # Create a future dataframe with the desired periods and frequency
    future = model.make_future_dataframe(periods=period, freq=freq)

    # Make predictions for the future data
    forecast = model.predict(future)

    # Filter out the forecasted values for future dates
    future_forecast = forecast[forecast['ds'] > df['ds'].iloc[-1]][['ds', 'yhat']]

    # Convert the forecast to a JSON response
    response = future_forecast.to_dict(orient='records')
    for item in response:
        item['ds'] = item['ds'].isoformat()

    # Print the JSON response
    rep = json.dumps(response)
    
except Exception as e:
    # Handle any exceptions that occurred
    rep = str(e)

print(rep)