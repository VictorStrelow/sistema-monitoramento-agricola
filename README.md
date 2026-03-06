# 🌿 Sistema de Monitoramento e Inteligência Agrícola (IoT & AI)

> Projeto desenvolvido para a Unidade Curricular de **Internet of Things (IoT)**.  
> A solução integra hardware simulado, orquestração de dados via Node-RED, persistência em banco local e uma inteligência artificial preditiva.

---

## 👥 Equipe

| # | Nome |
|---|------|
| 1 | Luiz |
| 2 | Gustavo Kotrik |
| 3 | Victor Strelow |
| 4 | Vinicius Anacleto |

---

## 🏗️ Arquitetura do Sistema e Fluxo de Dados

```
[ESP32 / Wokwi] ──MQTT (TLS/SSL)──► [HiveMQ Cloud] ──► [Node-RED] ──► [MySQL Local] ──► [Spring Boot API]
```

O ecossistema é composto por módulos independentes que garantem a coleta, o armazenamento estável e a análise dos dados:

| Etapa | Módulo | Descrição |
|-------|--------|-----------|
| 1 | **Coleta** (Wokwi) | ESP32 monitora Temperatura (Ar e Solo), Umidade, Pressão, Luminosidade, Presença e Distância. Dados enviados via **MQTT Seguro (TLS/SSL)**. |
| 2 | **Broker** (HiveMQ Cloud) | Broker privado para recepção segura das mensagens JSON vindas do hardware. |
| 3 | **Ingestão** (Node-RED) | Middleware crítico: consome as mensagens, trata nulos/NaN (substituindo por `0`) e gera a query SQL de inserção. |
| 4 | **Persistência** (MySQL Local) | Banco local para garantir gravação sem depender de serviços externos — resolve problemas de latência e queda de conexão. |
| 5 | **Serviço** (Spring Boot) | API Java que gerencia e expõe os dados históricos para o monitoramento. |

---

## 📁 Organização de Branches (Git)

```
main
├── back             → API REST (Java 21 / Spring Boot)
├── front            → Dashboard (HTML/CSS/JS + Chart.js)
└── machine-learning → Scripts Python + Interface Streamlit
```

- **`back`** — API REST em Java 21 / Spring Boot. Gerencia o fluxo entre o MySQL local e os endpoints.
- **`front`** — Dashboard em HTML/CSS/JS. Utiliza Chart.js para renderizar gráficos de linha baseados nas leituras reais.
- **`machine-learning`** — Scripts Python e interface Streamlit. Contém o modelo preditivo e o dataset de treinamento.

---

## 💾 Estrutura do Banco de Dados (Local)

A tabela foi criada para suportar todas as métricas capturadas pelos sensores:

```sql
CREATE TABLE leitura_estufa (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    temperatura  DECIMAL(5, 2),
    umidade      DECIMAL(5, 2),
    pressao      DECIMAL(10, 2),
    presenca     INT,       -- 0 (Ausente) ou 1 (Detectada)
    distancia    INT,       -- Nível/Distância em cm
    luminosidade INT,       -- Valor em LUX
    temp_solo    INT,       -- Temperatura NTC
    data_hora    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧠 Inteligência Artificial Preditiva

Localizado na branch `machine-learning`, este módulo utiliza um modelo **Random Forest Classifier (200 árvores)** para analisar a saúde da plantação.

- **Diagnóstico** — Identifica riscos de doenças: `None`, `Mild` ou `Severe`.
- **Impacto** — Calcula penalidades dinâmicas na colheita baseadas no status sanitário e NDVI.

---

## 🚀 Como Executar

### 1. IoT
Inicie o simulador **Wokwi**.

### 2. Fluxo de Dados
Execute o **Node-RED** para ouvir o HiveMQ e gravar no MySQL local.

### 3. Backend (branch `back`)
```bash
./mvnw spring-boot:run
```

### 4. Monitoramento (branch `front`)
Abra o arquivo `index.html` no navegador.

### 5. Análise de IA (branch `machine-learning`)
```bash
pip install -r requirements.txt
streamlit run dashboard_ia.py
```

---

> 📚 **Projeto Acadêmico** — UC de Internet of Things — 2024
