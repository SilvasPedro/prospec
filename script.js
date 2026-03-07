document.addEventListener('DOMContentLoaded', () => {

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    // Se não houver ninguém logado, redireciona para a tela de login (Simulação de proteção de rota)
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return; // Para a execução do resto do script
    }

    // Exibe o nome do usuário formatado (Primeira letra maiúscula)
    const nomeDisplay = document.getElementById('nome-usuario-display');
    if (nomeDisplay) {
        const nomeFormatado = usuarioLogado.charAt(0).toUpperCase() + usuarioLogado.slice(1);
        nomeDisplay.textContent = nomeFormatado;
    }

    // Ação do Botão de Sair
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
    
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
        
        // Aplica o novo tema e salva no navegador
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('hubdesk-theme', newTheme);
        updateIcon(newTheme);
        
        // Recarrega a página silenciosamente para que os gráficos do Chart.js
        // sejam redesenhados com a cor de texto correta (clara ou escura)
        window.location.reload();
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

    // --- Elementos dos Modais ---
    const modalRegistro = document.getElementById('modal-registro');
    const modalColaboradores = document.getElementById('modal-colaboradores');
    
    const btnNovoRegistro = document.getElementById('btn-novo-registro');
    const btnGerenciarEquipe = document.getElementById('btn-gerenciar-equipe');
    
    const closeRegistro = document.getElementById('close-registro');
    const closeColaboradores = document.getElementById('close-colaboradores');

    // Lógica Modal Novo Registro
    btnNovoRegistro.addEventListener('click', () => {
        modalRegistro.classList.add('active');
        document.getElementById('reg-data').valueAsDate = new Date();
    });

    closeRegistro.addEventListener('click', () => {
        modalRegistro.classList.remove('active');
    });

    // Lógica Modal Gerenciar Equipe
    btnGerenciarEquipe.addEventListener('click', () => {
        modalColaboradores.classList.add('active');
    });

    closeColaboradores.addEventListener('click', () => {
        modalColaboradores.classList.remove('active');
    });

    // Fechar modais ao clicar fora da caixa do modal
    window.addEventListener('click', (e) => {
        if (e.target === modalRegistro) {
            modalRegistro.classList.remove('active');
        }
        if (e.target === modalColaboradores) {
            modalColaboradores.classList.remove('active');
        }
    });
});