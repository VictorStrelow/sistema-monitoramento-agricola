import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

print("Carregando Crop_recommendation.csv...")
df = pd.read_csv('Crop_recommendation.csv')

df_clean = df[['temperature', 'humidity']].copy()

df_clean['irrigar'] = df_clean['humidity'].apply(lambda x: 1 if x < 45 else 0)
df_clean['risco_praga'] = df_clean.apply(
    lambda row: 1 if row['temperature'] > 26 and row['humidity'] > 75 else 0, axis=1
)

X = df_clean[['temperature', 'humidity']]
y_irr = df_clean['irrigar']
y_pra = df_clean['risco_praga']

X_train_i, X_test_i, y_train_i, y_test_i = train_test_split(X, y_irr, test_size=0.2, random_state=42)
X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X, y_pra, test_size=0.2, random_state=42)

params = {
    'n_estimators': 100,
    'learning_rate': 0.05, 
    'max_depth': 5,
    'eval_metric': 'logloss'
}

print("Treinando modelos...")
model_irr = xgb.XGBClassifier(**params)
model_irr.fit(X_train_i, y_train_i)

model_pra = xgb.XGBClassifier(**params)
model_pra.fit(X_train_p, y_train_p)

print(f"Precisão Irrigação: {accuracy_score(y_test_i, model_irr.predict(X_test_i))*100:.2f}%")
print(f"Precisão Pragas: {accuracy_score(y_test_p, model_pra.predict(X_test_p))*100:.2f}%")

joblib.dump(model_irr, 'modelo_irrigacao.pkl')
joblib.dump(model_pra, 'modelo_pragas.pkl')
print("Arquivos .pkl gerados!")