document.addEventListener('DOMContentLoaded', () => {
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