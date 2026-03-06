import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Carregar o dataset
df = pd.read_csv('Smart_Farming_Crop_Yield_2024.csv')

# 2. Pré-processamento (Transformar textos em números)
# Precisamos converter Região, Tipo de Cultura, etc.
le_region = LabelEncoder()
df['region_n'] = le_region.fit_transform(df['region'])

le_crop = LabelEncoder()
df['crop_n'] = le_crop.fit_transform(df['crop_type'])

# O nosso alvo (Target) é o status da doença
le_disease = LabelEncoder()
df['target_disease'] = le_disease.fit_transform(df['crop_disease_status'])

# 3. Seleção de Variáveis (Complexidade Realista)
# Vamos usar quase tudo para o modelo ser bem inteligente
features = [
    'soil_moisture_%', 'soil_pH', 'temperature_C', 'rainfall_mm', 
    'humidity_%', 'sunlight_hours', 'pesticide_usage_ml', 'NDVI_index',
    'region_n', 'crop_n'
]

X = df[features]
y = df['target_disease']

# 4. Treino
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Usando Random Forest conforme sua sugestão
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 5. Salvar Modelo e Encoders (Essencial para o Streamlit)
joblib.dump(model, 'rf_model_disease.pkl')
joblib.dump(le_region, 'le_region.pkl')
joblib.dump(le_crop, 'le_crop.pkl')
joblib.dump(le_disease, 'le_disease.pkl')

print("Treino concluído! Modelo e transformadores salvos.")