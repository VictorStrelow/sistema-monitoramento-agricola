from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

modelo_irr = joblib.load('modelo_irrigacao.pkl')
modelo_pra = joblib.load('modelo_pragas.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    dados = request.get_json()
    
    entrada = pd.DataFrame([[dados['temperatura'], dados['umidade']]], 
                           columns=['temperature', 'humidity'])
    
    pred_irrigar = int(modelo_irr.predict(entrada)[0])
    pred_praga = int(modelo_pra.predict(entrada)[0])
    
    return jsonify({
        "irrigar": pred_irrigar,
        "risco_praga": pred_praga
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)