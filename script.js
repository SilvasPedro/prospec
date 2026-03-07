document.addEventListener('DOMContentLoaded', () => {
    // Lógica para alternar a classe "active" nos meses
    const monthButtons = document.querySelectorAll('.month-btn');

    monthButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove a classe de todos
            monthButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona no clicado
            e.target.classList.add('active');

            // TODO: Criar arquivo/função separada para buscar dados do backend
            // loadDashboardData(e.target.innerText);
        });
    });

    // Lógica para alternar os filtros de tempo (Diário, Semanal, Mensal)
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // TODO: Criar arquivo/função separada para recalcular/filtrar os KPIs
            // updateTimeFilter(e.target.innerText);
        });
    });

    // Ação do botão registrar
    const registerBtn = document.querySelector('.btn-primary');
    registerBtn.addEventListener('click', () => {
        // TODO: Abrir modal ou redirecionar para formulário
        console.log("Abrir formulário de registro");
    });
});

// --- Lógica do Tema Claro/Escuro ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

// Verifica se já existe um tema salvo no navegador, senão usa o dark
const savedTheme = localStorage.getItem('hubdesk-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Aplica o novo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    // Salva a preferência
    localStorage.setItem('hubdesk-theme', newTheme);
    // Atualiza o ícone
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Elementos dos Modais
    const modalRegistro = document.getElementById('modal-registro');
    const modalColaboradores = document.getElementById('modal-colaboradores');
    
    // Botões de Abertura
    const btnNovoRegistro = document.getElementById('btn-novo-registro');
    const btnGerenciarEquipe = document.getElementById('btn-gerenciar-equipe');
    
    // Botões de Fechamento (o "X")
    const closeRegistro = document.getElementById('close-registro');
    const closeColaboradores = document.getElementById('close-colaboradores');

    // --- Lógica Modal Novo Registro ---
    btnNovoRegistro.addEventListener('click', () => {
        modalRegistro.classList.add('active');
        // Já preenche a data de hoje automaticamente
        document.getElementById('reg-data').valueAsDate = new Date();
    });

    closeRegistro.addEventListener('click', () => {
        modalRegistro.classList.remove('active');
    });

    // --- Lógica Modal Gerenciar Equipe ---
    btnGerenciarEquipe.addEventListener('click', () => {
        modalColaboradores.classList.add('active');
    });

    closeColaboradores.addEventListener('click', () => {
        modalColaboradores.classList.remove('active');
    });

    // Fechar modais ao clicar fora da caixa do modal (no fundo escuro)
    window.addEventListener('click', (e) => {
        if (e.target === modalRegistro) {
            modalRegistro.classList.remove('active');
        }
        if (e.target === modalColaboradores) {
            modalColaboradores.classList.remove('active');
        }
    });