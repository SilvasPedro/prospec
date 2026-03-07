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