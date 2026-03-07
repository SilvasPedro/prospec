import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const registrosCol = collection(db, "registros");
let chartVisao, chartFunil;

// --- ESTADOS DOS FILTROS ---
const dataSistema = new Date(); // Pega a data atual do computador
let filtroMes = dataSistema.getMonth(); // 0 (Jan) a 11 (Dez)
let filtroPeriodo = 'Diário'; // 'Diário', 'Semanal', 'Mensal'
let filtroColaborador = 'todos';

// --- INICIALIZAÇÃO DA UI DOS FILTROS ---
function inicializarFiltros() {
    // Configura os botões de meses
    const monthBtns = document.querySelectorAll('.month-btn');
    monthBtns.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === filtroMes) btn.classList.add('active'); // Marca o mês atual na tela

        btn.addEventListener('click', (e) => {
            monthBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroMes = index;
            // Se clicar em um mês específico, faz sentido mudar o período para "Mensal"
            mudarPeriodoUI('Mensal');
            carregarDashboard();
        });
    });

    // Configura os botões de Período (Diário, Semanal, Mensal)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            mudarPeriodoUI(e.target.innerText.trim());
            carregarDashboard();
        });
    });

    // Configura o Select de Colaboradores
    const selectColab = document.querySelector('.collaborator-select');
    selectColab.addEventListener('change', (e) => {
        filtroColaborador = e.target.value;
        carregarDashboard();
    });

    mudarPeriodoUI('Diário'); // Inicia focado nos resultados do dia
}

function mudarPeriodoUI(periodo) {
    filtroPeriodo = periodo;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.trim() === periodo) {
            btn.classList.add('active');
        }
    });
}

// --- LÓGICA DE VALIDAÇÃO DE DATA ---
function verificaFiltroData(dataString) {
    if (!dataString) return false;
    
    // dataString vem no formato "YYYY-MM-DD" do input type="date"
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const dataRegistro = new Date(ano, mes - 1, dia);
    
    if (filtroPeriodo === 'Mensal') {
        // Verifica se o registro pertence ao mês selecionado na barra de meses e ao ano atual
        return dataRegistro.getMonth() === filtroMes && dataRegistro.getFullYear() === dataSistema.getFullYear();
    } 
    else if (filtroPeriodo === 'Diário') {
        // Verifica se é EXATAMENTE a mesma data de hoje
        return dataRegistro.getDate() === dataSistema.getDate() && 
               dataRegistro.getMonth() === dataSistema.getMonth() && 
               dataRegistro.getFullYear() === dataSistema.getFullYear();
    }
    else if (filtroPeriodo === 'Semanal') {
        // Verifica se está na semana atual (Domingo a Sábado)
        const inicioSemana = new Date(dataSistema);
        inicioSemana.setDate(dataSistema.getDate() - dataSistema.getDay()); // Volta pro Domingo
        inicioSemana.setHours(0,0,0,0);
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6); // Vai pro Sábado
        fimSemana.setHours(23,59,59,999);
        
        return dataRegistro >= inicioSemana && dataRegistro <= fimSemana;
    }
    
    return true;
}

// --- CARREGAMENTO E CÁLCULO DE DADOS ---
export async function carregarDashboard() {
    try {
        const querySnapshot = await getDocs(registrosCol);
        
        let totais = { clientes: 0, conversas: 0, propostas: 0, negociacoes: 0, vendas: 0 };
        let colaboradoresUnicos = new Set();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // 1. Aplica o filtro de Colaborador
            if (filtroColaborador !== 'todos' && data.colaboradorId !== filtroColaborador) {
                return; // Ignora este registro e vai pro próximo
            }
            
            // 2. Aplica o filtro de Data (Mês/Semana/Dia)
            if (!verificaFiltroData(data.data)) {
                return; // Ignora se não for da data selecionada
            }

            // Se passou pelos filtros, soma aos totais
            totais.clientes += data.clientes || 0;
            totais.conversas += data.conversas || 0;
            totais.propostas += data.propostas || 0;
            totais.negociacoes += data.negociacoes || 0;
            totais.vendas += data.vendas || 0;
            colaboradoresUnicos.add(data.colaboradorId);
        });

        // Se filtramos por um colaborador específico, a divisão de "média" será por 1.
        // Se for "todos", divide pela quantidade de colaboradores que trabalharam no período.
        const qtdColaboradores = colaboradoresUnicos.size > 0 ? colaboradoresUnicos.size : 1;

        // --- ATUALIZAÇÃO DA TELA ---
        const totalBoxes = document.querySelectorAll('.totals-grid .total-box h4');
        if(totalBoxes.length >= 5) {
            totalBoxes[0].textContent = totais.clientes;
            totalBoxes[1].textContent = totais.conversas;
            totalBoxes[2].textContent = totais.propostas;
            totalBoxes[3].textContent = totais.negociacoes;
            totalBoxes[4].textContent = totais.vendas;
            
            const conversaoTotal = totais.negociacoes > 0 ? ((totais.vendas / totais.negociacoes) * 100).toFixed(1) : 0;
            totalBoxes[5].textContent = `${conversaoTotal}%`;
        }

        const kpiCards = document.querySelectorAll('.kpi-card h2');
        if(kpiCards.length >= 6) {
            kpiCards[0].textContent = (totais.clientes / qtdColaboradores).toFixed(1);
            kpiCards[1].textContent = (totais.conversas / qtdColaboradores).toFixed(1);
            kpiCards[2].textContent = (totais.propostas / qtdColaboradores).toFixed(1);
            kpiCards[3].textContent = (totais.negociacoes / qtdColaboradores).toFixed(1);
            kpiCards[4].textContent = (totais.vendas / qtdColaboradores).toFixed(1);
            
            const conversaoKpi = totais.negociacoes > 0 ? ((totais.vendas / totais.negociacoes) * 100).toFixed(1) : 0;
            kpiCards[5].textContent = `${conversaoKpi}%`;
        }

        const funilBoxes = document.querySelectorAll('.conversion-grid .total-box h4');
        if(funilBoxes.length >= 4) {
            funilBoxes[0].textContent = totais.clientes > 0 ? `${((totais.conversas / totais.clientes) * 100).toFixed(1)}%` : '0%';
            funilBoxes[1].textContent = totais.conversas > 0 ? `${((totais.propostas / totais.conversas) * 100).toFixed(1)}%` : '0%';
            funilBoxes[2].textContent = totais.propostas > 0 ? `${((totais.negociacoes / totais.propostas) * 100).toFixed(1)}%` : '0%';
            funilBoxes[3].textContent = totais.clientes > 0 ? `${((totais.negociacoes / totais.clientes) * 100).toFixed(1)}%` : '0%';
        }

        renderizarGraficos(totais);

    } catch (error) {
        console.error("Erro ao carregar dados do dashboard: ", error);
    }
}

// --- RENDERIZAÇÃO DOS GRÁFICOS ---
function renderizarGraficos(totais) {
    const colorRed = '#d32f2f';
    const colorYellow = '#ffb74d';
    const colorGreen = '#4db6ac';
    const colorDarkRed = '#b71c1c';
    const textColor = document.documentElement.getAttribute('data-theme') === 'light' ? '#212529' : '#8b8d96';

    const ctxVisao = document.getElementById('chartVisaoGeral').getContext('2d');
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
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor, precision: 0 } },
                x: { ticks: { color: textColor } }
            }
        }
    });

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
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, ticks: { color: textColor, precision: 0 } },
                y: { ticks: { color: textColor } }
            }
        }
    });
}

// Executa a inicialização ao carregar o arquivo
inicializarFiltros();