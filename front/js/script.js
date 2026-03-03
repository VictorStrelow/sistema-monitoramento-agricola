const API = 'http://localhost:8080/api/estufa';
const REFRESH_MS = 30000;

Chart.defaults.color = '#3d5c43';
Chart.defaults.font.family = 'Space Mono';

const chartOpts = {
    responsive: true,
    plugins: {
        legend: {
            labels: { color: '#5a7a60', boxWidth: 12, padding: 16 }
        },
        
        tooltip: {
            backgroundColor: '#111a13',
            borderColor: '#1f3024',
            borderWidth: 1,
            titleColor: '#e2f0e5',
            bodyColor: '#4ade80',
            cornerRadius: 8,
            padding: 10
        }
    },
    
    scales: {
        x: {
            ticks: { color: '#3d5c43', font: { family: 'Space Mono', size: 9 } },
            grid:  { color: '#1a2b1e' }
        },
        
        y: {
            ticks: { color: '#3d5c43', font: { family: 'Space Mono', size: 9 } },
            grid:  { color: '#1a2b1e' }
        }
    },
    
    animation: { duration: 600 }
};

const chartTemp = new Chart(document.getElementById('chartTemperatura'), {
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

const chartUmi = new Chart(document.getElementById('chartUmidade'), {
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
                fill: true,pointRadius: 2
            },
            {
                label: 'Luminosidade',
                data: [],
                borderColor: '#fbbf24',
                backgroundColor: '#fbbf2412',
                tension: 0.4,
                fill: true,
                pointRadius: 2,
                yAxisID: 'y2'
            }
        ]
    },
    
    options: {
        ...chartOpts,

        scales: {
            ...chartOpts.scales,
            
            y2: {
                position: 'right',
                ticks: { color: '#a16207', font: { family: 'Space Mono', size: 9 } },
                grid:  { drawOnChartArea: false }
            }
        }
    }
});

function fmt(valor, decimais = 1) {
    const n = parseFloat(valor);
    return isNaN(n) ? '—' : n.toFixed(decimais);
}

function setBar(id, porcentagem) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, porcentagem)) + '%';
}

function fmtTime(dt) {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateAtual(dados) {
    document.getElementById('temperatura').textContent  = fmt(dados.temperatura);
    document.getElementById('umidade').textContent      = fmt(dados.umidade);
    document.getElementById('pressao').textContent      = fmt(dados.pressao, 0);
    document.getElementById('luminosidade').textContent = fmt(dados.luminosidade, 0);
    document.getElementById('temp_solo').textContent    = fmt(dados.temp_solo, 0);
    document.getElementById('distancia').textContent    = fmt(dados.distancia, 0);

    setBar('bar-temperatura',   (parseFloat(dados.temperatura) / 50) * 100);
    setBar('bar-umidade',        parseFloat(dados.umidade));
    setBar('bar-pressao',       ((parseFloat(dados.pressao) - 950) / 100) * 100);
    setBar('bar-luminosidade',  (parseFloat(dados.luminosidade) / 1023) * 100);
    setBar('bar-temp-solo',     (parseFloat(dados.temp_solo) / 50) * 100);
    setBar('bar-distancia',     (parseFloat(dados.distancia) / 400) * 100);

    const badge = document.getElementById('presenca-badge');
    const icon  = document.getElementById('presenca-icon');
    const texto = document.getElementById('presenca-text');

    if (dados.presenca === 1) {
        badge.className    = 'presenca-badge detected';
        icon.textContent   = '⚠';
        texto.textContent  = 'Presença detectada!';
    } else {
        badge.className    = 'presenca-badge clear';
        icon.textContent   = '✓';
        texto.textContent  = 'Nenhuma detecção';
    }

    if (dados.dataHora) {
        const dt = new Date(dados.dataHora);
        document.getElementById('last-update').textContent = 'Atualizado: ' + dt.toLocaleTimeString('pt-BR');
        document.getElementById('presenca-footer').textContent = 'PIR sensor — ' + dt.toLocaleTimeString('pt-BR');
    }
    
    document.getElementById('status-pulse').style.background = 'var(--green)';
    document.getElementById('status-text').textContent       = 'Online';
    document.getElementById('error-banner').style.display   = 'none';
}

function updateHistorico(lista) {
    const cronologico = [...lista].reverse();
    const labels = cronologico.map(d => fmtTime(d.dataHora));

    chartTemp.data.labels = labels;
    chartTemp.data.datasets[0].data = cronologico.map(d => parseFloat(d.temperatura) || 0);
    chartTemp.data.datasets[1].data = cronologico.map(d => parseFloat(d.temp_solo) || 0);
    chartTemp.update();
    
    chartUmi.data.labels = labels;
    chartUmi.data.datasets[0].data = cronologico.map(d => parseFloat(d.umidade) || 0);
    chartUmi.data.datasets[1].data = cronologico.map(d => parseFloat(d.luminosidade) || 0);
    chartUmi.update();
    
    const tbody = document.getElementById('table-body');
    
    if (!lista.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:24px;">Sem dados ainda.</td></tr>';
        return;
    }

    document.getElementById('table-count').textContent = lista.length + ' registros';
    
    tbody.innerHTML = lista.map(d => {
        const dt = d.dataHora ? new Date(d.dataHora).toLocaleString('pt-BR') : '—';
        const presencaHtml = (d.presenca === 1) ? '<span style="color:var(--red);font-weight:700;">SIM</span>' : '<span style="color:var(--green);">NÃO</span>';

        return `<tr>
            <td>${dt}</td>
            <td style="color:var(--red)">${fmt(d.temperatura)} °C</td>
            <td style="color:var(--teal)">${fmt(d.umidade)} %</td>
            <td style="color:var(--blue)">${fmt(d.pressao, 0)} hPa</td>
            <td style="color:var(--amber)">${fmt(d.luminosidade, 0)}</td>
            <td style="color:var(--green)">${fmt(d.temp_solo, 0)} °C</td>
            <td style="color:var(--purple)">${fmt(d.distancia, 0)} cm</td>
            <td>${presencaHtml}</td>
        </tr>`;
    }).join('');
}

async function fetchData() {
    try {
        const [resAtual, resHistorico] = await Promise.all([
            fetch(API + '/atual'),
            fetch(API + '/historico')
        ]);
        
        if (!resAtual.ok) throw new Error(`Erro em /atual: HTTP ${resAtual.status}`);
        if (!resHistorico.ok) throw new Error(`Erro em /historico: HTTP ${resHistorico.status}`);
        
        const dadoAtual = await resAtual.json();
        const dadoHistorico = await resHistorico.json();
        
        updateAtual(dadoAtual);
        updateHistorico(dadoHistorico);
    
    } catch (erro) {
        console.error('[Estufa] Falha ao buscar dados:', erro.message);
        
        document.getElementById('status-pulse').style.background = 'var(--red)';
        document.getElementById('status-text').textContent       = 'Offline';
        document.getElementById('error-banner').style.display    = 'block';
    }
}

fetchData();
setInterval(fetchData, REFRESH_MS);