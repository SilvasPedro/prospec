import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { carregarDashboard } from './dashboard.js';

const formRegistro = document.getElementById('form-registro');
const modalRegistro = document.getElementById('modal-registro');
const btnSalvar = formRegistro.querySelector('button[type="submit"]');

// Referência para a coleção de registros no banco de dados
const registrosCol = collection(db, "registros");

formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Muda o texto do botão para dar feedback visual
    const textoOriginal = btnSalvar.textContent;
    btnSalvar.textContent = "Salvando...";
    btnSalvar.disabled = true;

    // Captura e converte os valores do formulário
    const registroData = {
        colaboradorId: document.getElementById('reg-colaborador').value,
        colaboradorNome: document.getElementById('reg-colaborador').options[document.getElementById('reg-colaborador').selectedIndex].text,
        data: document.getElementById('reg-data').value,
        clientes: Number(document.getElementById('reg-clientes').value) || 0,
        conversas: Number(document.getElementById('reg-conversas').value) || 0,
        propostas: Number(document.getElementById('reg-propostas').value) || 0,
        negociacoes: Number(document.getElementById('reg-negociacoes').value) || 0,
        vendas: Number(document.getElementById('reg-vendas').value) || 0,
        dataRegistro: new Date().toISOString() // Salva o momento exato em que foi criado
    };

    try {
        // Envia para o Firebase
        await addDoc(registrosCol, registroData);
        
        // Limpa o formulário e fecha o modal
        formRegistro.reset();
        modalRegistro.classList.remove('active');
        
        // Alerta de sucesso (opcional, você pode trocar por um Toast depois)
        alert("Registro salvo com sucesso!");
        
        // Limpa o formulário e fecha o modal
        formRegistro.reset();
        modalRegistro.classList.remove('active');
        
        alert("Registro salvo com sucesso!");
        
        // Atualiza a tela instantaneamente
        carregarDashboard();
        
    } catch (error) {
        console.error("Erro ao salvar o registro: ", error);
        alert("Erro ao salvar os dados. Tente novamente.");
    } finally {
        // Restaura o botão
        btnSalvar.textContent = textoOriginal;
        btnSalvar.disabled = false;
    }
});