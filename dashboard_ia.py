import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import numpy as np
import joblib

# --- CONFIGURAÇÃO DA PÁGINA ---
st.set_page_config(page_title="IA - Monitoramento Agrícola", layout="wide")

# --- CARREGAMENTO DO MODELO E ENCODERS ---
# O código tenta carregar o modelo. Se não encontrar, ele avisa no dashboard.
try:
    modelo = joblib.load('rf_model_disease.pkl')
    le_region = joblib.load('le_region.pkl')
    le_crop = joblib.load('le_crop.pkl')
    le_disease = joblib.load('le_disease.pkl')
    ml_ativo = True
except:
    ml_ativo = False

# --- DICIONÁRIOS DE TRADUÇÃO ---
traducao_cultura = {
    "Trigo": "Wheat",
    "Soja": "Soybean",
    "Milho": "Maize",
    "Algodão": "Cotton"
}

traducao_regiao = {
    "Norte da Índia": "North India",
    "Sul dos EUA": "South USA",
    "EUA Central": "Central USA",
    "Sul da Índia": "South India"
}

# --- CSS (EXATAMENTE IGUAL AO SEU) ---
st.markdown(f"""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;600;700&display=swap');
        header[data-testid="stHeader"] {{ display: none !important; }}
        .stApp {{ background: #0b110d; color: #e2f0e5; font-family: 'DM Sans', sans-serif; }}
        .block-container {{ padding-top: 2rem !important; }}
        .stSlider p, .stSelectbox label, .stMarkdown p {{
            color: #e2f0e5 !important;
            font-family: 'Space Mono', monospace !important;
            font-size: 0.85rem !important;
        }}
        .custom-card {{
            background: #111a13;
            border: 1px solid #1f3024;
            border-radius: 16px;
            padding: 22px;
            box-shadow: 0 4px 24px #00000066;
            margin-bottom: 16px;
            position: relative;
        }}
        .card-label {{
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #5a7a60;
            font-family: 'Space Mono', monospace;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .card-value {{
            font-size: 2.2rem;
            font-weight: 700;
            font-family: 'Space Mono', monospace;
            line-height: 1.1;
        }}
        .card-sub {{ font-size: 0.7rem; color: #5a7a60; margin-top: 8px; }}
    </style>
""", unsafe_allow_html=True)

# --- HEADER CUSTOMIZADO ---
st.markdown(f"""
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; background: #111a13; border: 1px solid #1f3024; border-radius: 16px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px;">🌿</div>
            <div>
                <div style="font-family: 'Space Mono', monospace; font-size: 1.15rem; font-weight: 700; color: #e2f0e5;">Módulo Inteligência Artificial</div>
                <div style="font-size: 0.78rem; color: #5a7a60;">{'Modelo Random Forest Real' if ml_ativo else 'Modo Simulação Visual'}</div>
            </div>
        </div>
        <div style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #4ade80; border: 1px solid #1f5032; padding: 5px 15px; border-radius: 20px;">● IA ONLINE</div>
    </div>
""", unsafe_allow_html=True)

# --- SEÇÃO DE INPUTS ---
with st.container():
    st.markdown("<div class='card-label'><span style='color:#4ade80'>●</span> Painel de Controle de Variáveis</div>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    
    with c1:
        regiao_sel = st.selectbox("Região do Plantio", list(traducao_regiao.keys()))
        cultura_sel = st.selectbox("Cultura Agrícola", list(traducao_cultura.keys()))
    
    with c2:
        ndvi = st.slider("Índice de Saúde (NDVI)", 0.0, 1.0, 0.70)
        temp = st.slider("Temperatura (°C)", 10, 50, 25)
    
    with c3:
        umidade_solo = st.slider("Umidade do Solo (%)", 0, 100, 40)
        chuva = st.slider("Precipitação (mm)", 0, 500, 150)

# --- LÓGICA DE MACHINE LEARNING ---
if ml_ativo:
    # 1. Traduzir e codificar inputs para o formato do modelo
    reg_ing = traducao_regiao[regiao_sel]
    cult_ing = traducao_cultura[cultura_sel]
    reg_cod = le_region.transform([reg_ing])[0]
    cult_cod = le_crop.transform([cult_ing])[0]

    # 2. Criar array de entrada (com valores fixos para as colunas que não estão nos sliders)
    # Ordem: [soil_moisture_%, soil_pH, temperature_C, rainfall_mm, humidity_%, sunlight_hours, pesticide_usage_ml, NDVI_index, region_n, crop_n]
    input_ia = pd.DataFrame([[
        umidade_solo, 6.5, temp, chuva, 60.0, 8.0, 15.0, ndvi, reg_cod, cult_cod
    ]], columns=['soil_moisture_%', 'soil_pH', 'temperature_C', 'rainfall_mm', 'humidity_%', 'sunlight_hours', 'pesticide_usage_ml', 'NDVI_index', 'region_n', 'crop_n'])

    # 3. Predição
    pred_status = modelo.predict(input_ia)[0]
    status_doenca = le_disease.inverse_transform([pred_status])[0] # Ex: 'Severe', 'Mild', 'None'
    probabilidade = np.max(modelo.predict_proba(input_ia)) * 100
    
    # 4. Cálculo dinâmico de produtividade baseado na predição da IA
    penalidade = 0.5 if status_doenca == "Severe" else (0.8 if status_doenca == "Mild" else 1.0)
    previsao_colheita = (ndvi * 100) * penalidade

    if np.isnan(probabilidade):
        probabilidade = 0.0
    
    if np.isnan(previsao_colheita):
        previsao_colheita = 0.0
        
else:
    # Fallback se o modelo não estiver carregado
    status_doenca = "Sem Modelo"
    probabilidade = 0.0
    previsao_colheita = ndvi * 100

# Lógica de Irrigação (Mantida a sua regra de negócio)
precisa_irrigar = "SIM" if (umidade_solo < 30 and chuva < 80) else "NÃO"
cor_irriga = "#f87171" if precisa_irrigar == "SIM" else "#4ade80"

# --- GRID DE RESULTADOS ---
res1, res2, res3 = st.columns(3)

with res1:
    cor_diag = "#c084fc" if status_doenca == "None" else "#f87171"
    st.markdown(f"""
        <div class="custom-card">
            <div class="card-label">Diagnóstico da IA (Doença)</div>
            <div class="card-value" style="color:{cor_diag};">{status_doenca}</div>
            <div class="card-sub">Confiança do Modelo: {probabilidade:.1f}%</div>
        </div>
    """, unsafe_allow_html=True)

with res2:
    st.markdown(f"""
        <div class="custom-card">
            <div class="card-label">Estimativa de Colheita</div>
            <div class="card-value" style="color:#fbbf24;">{previsao_colheita:.1f}%</div>
            <div class="card-sub">Baseado no NDVI e Status Sanitário</div>
        </div>
    """, unsafe_allow_html=True)

with res3:
    st.markdown(f"""
        <div class="custom-card">
            <div class="card-label">Ativar Irrigação?</div>
            <div class="card-value" style="color:{cor_irriga};">{precisa_irrigar}</div>
            <div class="card-sub">Umidade: {umidade_solo}% | Chuva: {chuva}mm</div>
        </div>
    """, unsafe_allow_html=True)

# --- GRÁFICO (MODIFICADO APENAS O QUE VOCÊ PEDIU) ---
st.markdown("<div class='custom-card'><div class='card-label'>📉 Curva de Desenvolvimento Estimada</div>", unsafe_allow_html=True)
fig = go.Figure(go.Scatter(
    x=[0, 30, 60, 90, 120], 
    y=[5, 25, previsao_colheita*0.6, previsao_colheita*0.85, previsao_colheita],
    mode='lines+markers', line=dict(color='#4ade80', width=4, shape='spline'),
    fill='tozeroy', fillcolor='rgba(74, 222, 128, 0.1)'
))
fig.update_layout(
    paper_bgcolor='rgba(0,0,0,0)', 
    plot_bgcolor='rgba(0,0,0,0)', 
    margin=dict(l=40, r=20, t=20, b=40), 
    height=280,
    xaxis=dict(
        title=dict(text="Dias de Cultivo", font=dict(color='#88a090', size=11)),
        gridcolor='#1f3024', color='#5a7a60'
    ), 
    yaxis=dict(
        title=dict(text="Percentual de Maturação (%)", font=dict(color='#88a090', size=11)),
        gridcolor='#1f3024', color='#5a7a60', range=[0, 105]
    )
)
st.plotly_chart(fig, use_container_width=True)
st.markdown("</div>", unsafe_allow_html=True)

# RODAPÉ (COM A COR #88a090 PARA FICAR VISÍVEL)
st.markdown(f"<div style='text-align:center; color:#88a090; font-family:Space Mono; font-size:10px;'>ALGORITMO: RANDOM FOREST | REGIÃO: {regiao_sel.upper()} | STATUS: {'REAL' if ml_ativo else 'SIMULADO'}</div>", unsafe_allow_html=True)