import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const registrosCol = collection(db, "registros");
let chartVisao, chartFunil;

export async function carregarDashboard() {
    try {
        const querySnapshot = await getDocs(registrosCol);
        
        let totais = { clientes: 0, conversas: 0, propostas: 0, negociacoes: 0, vendas: 0 };
        let colaboradoresUnicos = new Set();

        // Soma todos os dados
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totais.clientes += data.clientes || 0;
            totais.conversas += data.conversas || 0;
            totais.propostas += data.propostas || 0;
            totais.negociacoes += data.negociacoes || 0;
            totais.vendas += data.vendas || 0;
            colaboradoresUnicos.add(data.colaboradorId);
        });

        const qtdColaboradores = colaboradoresUnicos.size > 0 ? colaboradoresUnicos.size : 1;

        // Atualiza os Totais na tela (os cards de baixo)
        const totalBoxes = document.querySelectorAll('.totals-grid .total-box h4');
        if(totalBoxes.length >= 5) {
            totalBoxes[0].textContent = totais.clientes;
            totalBoxes[1].textContent = totais.conversas;
            totalBoxes[2].textContent = totais.propostas;
            totalBoxes[3].textContent = totais.negociacoes;
            totalBoxes[4].textContent = totais.vendas;
            
            // Conversão Total (Negociações -> Vendas)
            const conversaoTotal = totais.negociacoes > 0 ? ((totais.vendas / totais.negociacoes) * 100).toFixed(1) : 0;
            totalBoxes[5].textContent = `${conversaoTotal}%`;
        }

        // Atualiza os KPIs (os cards de cima com a média por colaborador)
        const kpiCards = document.querySelectorAll('.kpi-card h2');
        if(kpiCards.length >= 6) {
            kpiCards[0].textContent = (totais.clientes / qtdColaboradores).toFixed(1);
            kpiCards[1].textContent = (totais.conversas / qtdColaboradores).toFixed(1);
            kpiCards[2].textContent = (totais.propostas / qtdColaboradores).toFixed(1);
            kpiCards[3].textContent = (totais.negociacoes / qtdColaboradores).toFixed(1);
            kpiCards[4].textContent = (totais.vendas / qtdColaboradores).toFixed(1);
            
            // Taxa Conv. KPI
            const conversaoKpi = totais.negociacoes > 0 ? ((totais.vendas / totais.negociacoes) * 100).toFixed(1) : 0;
            kpiCards[5].textContent = `${conversaoKpi}%`;
        }

        // Atualiza as Taxas de Conversão do Funil
        const funilBoxes = document.querySelectorAll('.conversion-grid .total-box h4');
        if(funilBoxes.length >= 4) {
            funilBoxes[0].textContent = totais.clientes > 0 ? `${((totais.conversas / totais.clientes) * 100).toFixed(1)}%` : '0%';
            funilBoxes[1].textContent = totais.conversas > 0 ? `${((totais.propostas / totais.conversas) * 100).toFixed(1)}%` : '0%';
            funilBoxes[2].textContent = totais.propostas > 0 ? `${((totais.negociacoes / totais.propostas) * 100).toFixed(1)}%` : '0%';
            funilBoxes[3].textContent = totais.clientes > 0 ? `${((totais.negociacoes / totais.clientes) * 100).toFixed(1)}%` : '0%';
        }

        // Renderiza os Gráficos
        renderizarGraficos(totais);

    } catch (error) {
        console.error("Erro ao carregar dados do dashboard: ", error);
    }
}

function renderizarGraficos(totais) {
    // Cores baseadas no seu CSS
    const colorRed = '#d32f2f';
    const colorYellow = '#ffb74d';
    const colorGreen = '#4db6ac';
    const colorDarkRed = '#b71c1c';
    const textColor = document.documentElement.getAttribute('data-theme') === 'light' ? '#212529' : '#8b8d96';

    // 1. Gráfico de Visão Geral (Barras Verticais)
    const ctxVisao = document.getElementById('chartVisaoGeral').getContext('2d');
    
    // Destrói o gráfico anterior se existir (para quando atualizar os dados)
    if (chartVisao) chartVisao.destroy();
    
    chartVisao = new Chart(ctxVisao, {
        type: 'bar',
        data: {
            labels: ['Clientes', 'Conversas', 'Propostas', 'Negociações'],
            datasets: [{
                label: 'Volume',
                data: [totais.clientes, totais.conversas, totais.propostas, totais.negociacoes],
                backgroundColor: [colorRed, colorYellow, colorGreen, colorDarkRed],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }, // Esconde a legenda padrão pois já tem a sua em HTML
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor } },
                x: { ticks: { color: textColor } }
            }
        }
    });

    // 2. Gráfico de Funil (Barras Horizontais)
    const ctxFunil = document.getElementById('chartFunil').getContext('2d');
    
    if (chartFunil) chartFunil.destroy();

    chartFunil = new Chart(ctxFunil, {
        type: 'bar',
        data: {
            labels: ['Clientes', 'Conversas', 'Propostas', 'Negociações', 'Vendas'],
            datasets: [{
                label: 'Funil',
                data: [totais.clientes, totais.conversas, totais.propostas, totais.negociacoes, totais.vendas],
                backgroundColor: colorRed,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Isso transforma a barra em horizontal (efeito funil)
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, ticks: { color: textColor } },
                y: { ticks: { color: textColor } }
            }
        }
    });
}

// Carrega os dados assim que o script é lido
carregarDashboard();