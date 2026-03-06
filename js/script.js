const API = 'http://localhost:8080/api/estufa';
const REFRESH_MS = 5000; // Reduzi para 5s para facilitar os teus testes de bancada

Chart.defaults.color = '#3d5c43';
Chart.defaults.font.family = 'Space Mono';

const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, // Melhora a nitidez em telas retina
    plugins: {
        legend: { display: true, position: 'top', labels: { color: '#5a7a60', font: { size: 10 } } }
    },
    scales: {
        x: { 
            display: true,
            grid: { color: '#1a2b1e', drawOnChartArea: true },
            ticks: { color: '#3d5c43', font: { size: 9 } }
        },
        y: { 
            display: true,
            beginAtZero: true,
            grid: { color: '#1a2b1e' },
            ticks: { color: '#3d5c43', font: { size: 9 } }
        }
    }
};

let chartTemp, chartUmi;

// Função para forçar o redimensionamento dos gráficos
function resizeCharts() {
    if (chartTemp) chartTemp.resize();
    if (chartUmi) chartUmi.resize();
}

document.addEventListener('DOMContentLoaded', () => {
    // --- GRÁFICO 1: TEMPERATURA ---
    const ctxTemp = document.getElementById('chartTemperatura');
    if (ctxTemp) {
        chartTemp = new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Temp. Ar (°C)',
                        data: [],
                        borderColor: '#f87171',
                        backgroundColor: '#f8717118',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2
                    },
                    {
                        label: 'Temp. Solo (°C)',
                        data: [],
                        borderColor: '#4ade80',
                        backgroundColor: '#4ade8012',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2
                    }
                ]
            },
            options: chartOpts
        });
    }

    // --- GRÁFICO 2: UMIDADE & LUMINOSIDADE ---
    const ctxUmi = document.getElementById('chartUmidade');
    if (ctxUmi) {
        chartUmi = new Chart(ctxUmi, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Umidade (%)',
                        data: [],
                        borderColor: '#2dd4bf',
                        backgroundColor: '#2dd4bf18',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Luminosidade (lux)',
                        data: [],
                        borderColor: '#fbbf24',
                        backgroundColor: '#fbbf2412',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2,
                        yAxisID: 'y2' // Eixo secundário
                    }
                ]
            },
            options: {
                ...chartOpts,
                scales: {
                    x: chartOpts.scales.x,
                    y: { ...chartOpts.scales.y, title: { display: false } },
                    y2: {
                        position: 'right',
                        display: true,
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#fbbf24', font: { size: 9 } }
                    }
                }
            }
        });
    }

    // Iniciar busca de dados
    fetchData();
});

// --- FUNÇÕES DE FORMATAÇÃO ---
function fmt(valor, decimais = 1) {
    const n = parseFloat(valor);
    return isNaN(n) ? '—' : n.toFixed(decimais);
}

function fmtTime(dt) {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function setBar(id, porcentagem) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, porcentagem)) + '%';
}

// --- ATUALIZAÇÃO DO FRONT-END ---
function updateAtual(dados) {
    if (!dados) return;

    // Atualiza Valores nos Cards
    document.getElementById('temperatura').textContent = fmt(dados.temperatura);
    document.getElementById('umidade').textContent = fmt(dados.umidade);
    document.getElementById('pressao').textContent = fmt(dados.pressao, 0);
    document.getElementById('luminosidade').textContent = fmt(dados.luminosidade, 0);
    document.getElementById('temp_solo').textContent = fmt(dados.temp_solo, 0);
    document.getElementById('distancia').textContent = fmt(dados.distancia, 0);

    // Atualiza Barras de Progresso
    setBar('bar-temperatura', (parseFloat(dados.temperatura) / 50) * 100);
    setBar('bar-umidade', parseFloat(dados.umidade));
    setBar('bar-pressao', ((parseFloat(dados.pressao) - 950) / 100) * 100);
    setBar('bar-luminosidade', (parseFloat(dados.luminosidade) / 1023) * 100);
    setBar('bar-temp-solo', (parseFloat(dados.temp_solo) / 50) * 100);
    setBar('bar-distancia', (parseFloat(dados.distancia) / 400) * 100);

    // Status do PIR
    const badge = document.getElementById('presenca-badge');
    const icon = document.getElementById('presenca-icon');
    const texto = document.getElementById('presenca-text');

    if (dados.presenca === 1) {
        badge.className = 'presenca-badge detected';
        icon.textContent = '⚠';
        texto.textContent = 'Presença detectada!';
    } else {
        badge.className = 'presenca-badge clear';
        icon.textContent = '✓';
        texto.textContent = 'Nenhuma detecção';
    }

    // Rodapé de atualização
    if (dados.dataHora) {
        const dt = new Date(dados.dataHora);
        document.getElementById('last-update').textContent = 'Sincronizado: ' + dt.toLocaleTimeString('pt-BR');
    }

    document.getElementById('status-pulse').style.background = 'var(--green)';
    document.getElementById('status-text').textContent = 'Online';
    document.getElementById('error-banner').style.display = 'none';
}

function updateHistorico(lista) {
    if (!lista || !Array.isArray(lista) || lista.length === 0) {
        console.warn("Lista de histórico vazia ou inválida.");
        return;
    }

    // 1. Preparar dados para os Gráficos (Ordem Cronológica: Antigo -> Novo)
    const cronologico = [...lista].reverse();
    const labels = cronologico.map(d => fmtTime(d.dataHora));

    // Gráfico de Temperatura
    if (chartTemp) {
        chartTemp.data.labels = labels;
        chartTemp.data.datasets[0].data = cronologico.map(d => Number(d.temperatura));
        chartTemp.data.datasets[1].data = cronologico.map(d => Number(d.temp_solo));
        chartTemp.update(); 
    }

    // Gráfico de Umidade e Luz
    if (chartUmi) {
        chartUmi.data.labels = labels;
        chartUmi.data.datasets[0].data = cronologico.map(d => Number(d.umidade));
        chartUmi.data.datasets[1].data = cronologico.map(d => Number(d.luminosidade));
        chartUmi.update();
    }

    // 2. Atualizar Tabela (Apenas os 5 mais recentes)
    const tbody = document.getElementById('table-body');
    const ultimos5 = lista.slice(0, 5); 
    document.getElementById('table-count').textContent = lista.length + ' registros no total';

    tbody.innerHTML = ultimos5.map(d => {
        const dt = d.dataHora ? new Date(d.dataHora).toLocaleString('pt-BR') : '—';
        const presenca = (Number(d.presenca) === 1) ? 
            '<span style="color:var(--red);font-weight:700;">SIM</span>' : 
            '<span style="color:var(--green);">NÃO</span>';

        return `<tr>
            <td>${dt}</td>
            <td style="color:var(--red)">${fmt(d.temperatura)} °C</td>
            <td style="color:var(--teal)">${fmt(d.umidade)} %</td>
            <td style="color:var(--blue)">${fmt(d.pressao, 0)} hPa</td>
            <td style="color:var(--amber)">${fmt(d.luminosidade, 0)}</td>
            <td style="color:var(--green)">${fmt(d.temp_solo, 0)} °C</td>
            <td style="color:var(--purple)">${fmt(d.distancia, 0)} cm</td>
            <td>${presenca}</td>
        </tr>`;
    }).join('');
}

async function fetchData() {
    try {
        const [resAtual, resHistorico] = await Promise.all([
            fetch(API + '/atual'),
            fetch(API + '/historico')
        ]);

        if (!resAtual.ok || !resHistorico.ok) throw new Error("Erro na API");

        const dadoAtual = await resAtual.json();
        const dadoHistorico = await resHistorico.json();

        updateAtual(dadoAtual);
        updateHistorico(dadoHistorico);

    } catch (erro) {
        console.error('[ERRO API]:', erro);
        document.getElementById('status-pulse').style.background = 'var(--red)';
        document.getElementById('status-text').textContent = 'Offline';
        document.getElementById('error-banner').style.display = 'block';
    }
}

// Atualização automática
setInterval(fetchData, REFRESH_MS);
window.addEventListener('resize', resizeCharts);