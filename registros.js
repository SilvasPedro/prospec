import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { carregarDashboard } from './dashboard.js';

const formRegistro = document.getElementById('form-registro');
const modalRegistro = document.getElementById('modal-registro');
const btnSalvar = formRegistro.querySelector('button[type="submit"]');
let todosRegistrosGlobais = [];

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
        const idRegistro = document.getElementById('reg-id').value; // Checa se estamos editando algo

        if (idRegistro) {
            // Fluxo de Edição
            const docRef = doc(db, "registros", idRegistro);
            delete registroData.dataRegistro; // Evita sobrescrever a timestamp de criação original
            await updateDoc(docRef, registroData);
            alert("Registro atualizado com sucesso!");
        } else {
            // Fluxo de Criação
            await addDoc(registrosCol, registroData);
            alert("Registro salvo com sucesso!");
        }

        // Limpa o formulário, reseta o ID oculto e fecha o modal
        formRegistro.reset();
        document.getElementById('reg-id').value = "";
        modalRegistro.classList.remove('active');

        // Atualiza a Dashboard e a lista de registros se o modal estiver aberto em background
        carregarDashboard();
        if (window.carregarListaRegistros) window.carregarListaRegistros();

    } catch (error) {
        console.error("Erro ao salvar o registro: ", error);
        alert("Erro ao salvar os dados. Tente novamente.");
    } finally {
        btnSalvar.textContent = textoOriginal;
        btnSalvar.disabled = false;
    }
});

// ADICIONE TUDO ISSO NO FINAL DO ARQUIVO registros.js
window.carregarListaRegistros = async () => {
    const ulRegistros = document.getElementById('ul-registros');
    ulRegistros.innerHTML = '<li>Carregando registros...</li>';
    
    try {
        const querySnapshot = await getDocs(registrosCol);
        todosRegistrosGlobais = []; // Limpa o array para não duplicar
        
        querySnapshot.forEach(doc => {
            todosRegistrosGlobais.push({ id: doc.id, ...doc.data() });
        });
        
        // Ordena do mais recente para o mais antigo
        todosRegistrosGlobais.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        // Chama a função que desenha a tela passando todos os dados
        window.renderizarListaRegistros(todosRegistrosGlobais);
        
        // Limpa o campo de busca sempre que o modal for reaberto
        const inputBusca = document.getElementById('input-busca-registros');
        if(inputBusca) inputBusca.value = "";

    } catch (error) {
        console.error("Erro ao carregar lista: ", error);
        ulRegistros.innerHTML = '<li>Erro ao carregar os dados.</li>';
    }
};

// 2. FUNÇÃO QUE DESENHA OS CARDS NA TELA (Separada para podermos filtrar facilmente)
window.renderizarListaRegistros = (lista) => {
    const ulRegistros = document.getElementById('ul-registros');
    ulRegistros.innerHTML = '';
    
    if (lista.length === 0) {
        ulRegistros.innerHTML = '<li style="justify-content: center; color: var(--text-muted);">Nenhum registro encontrado.</li>';
        return;
    }

    lista.forEach((registro) => {
        const li = document.createElement('li');
        const dataFormatada = registro.data.split('-').reverse().join('/'); // Ex: 2026-03-20 vira 20/03/2026
        
        li.innerHTML = `
            <div class="registro-info">
                <div class="registro-header">
                    <strong>${registro.colaboradorNome}</strong> 
                    <span class="registro-data"><i class="far fa-calendar-alt"></i> ${dataFormatada}</span>
                </div>
                <div class="registro-stats">
                    <span class="stat-badge" title="Clientes">Cli: <strong>${registro.clientes}</strong></span>
                    <span class="stat-badge" title="Conversas">Conv: <strong>${registro.conversas}</strong></span>
                    <span class="stat-badge" title="Propostas">Prop: <strong>${registro.propostas}</strong></span>
                    <span class="stat-badge" title="Negociações">Neg: <strong>${registro.negociacoes}</strong></span>
                    <span class="stat-badge" title="Vendas">Ven: <strong>${registro.vendas}</strong></span>
                </div>
            </div>
            <div class="acoes">
                <button class="btn-edit" title="Editar" onclick="window.editarRegistro('${registro.id}', '${registro.colaboradorId}', '${registro.data}', ${registro.clientes}, ${registro.conversas}, ${registro.propostas}, ${registro.negociacoes}, ${registro.vendas})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" title="Excluir" onclick="window.deletarRegistro('${registro.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        ulRegistros.appendChild(li);
    });
};

// 3. LÓGICA DA BARRA DE PESQUISA (Adicione no final do arquivo registros.js)
const inputBusca = document.getElementById('input-busca-registros');
if (inputBusca) {
    // O evento 'input' dispara a cada letra que o usuário digita
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        
        // Filtra o array global buscando ocorrências no nome ou na data
        const filtrados = todosRegistrosGlobais.filter(registro => {
            const dataFormatada = registro.data.split('-').reverse().join('/'); // Para permitir buscar por "10/03"
            
            const matchNome = registro.colaboradorNome.toLowerCase().includes(termo);
            const matchData = registro.data.includes(termo) || dataFormatada.includes(termo);
            
            return matchNome || matchData;
        });
        
        // Redesenha a lista apenas com os resultados filtrados
        window.renderizarListaRegistros(filtrados);
    });
}

window.deletarRegistro = async (id) => {
    if (confirm("Tem certeza que deseja excluir este lançamento permanentemente?")) {
        try {
            await deleteDoc(doc(db, "registros", id));
            window.carregarListaRegistros(); // Recarrega a lista do modal
            carregarDashboard(); // Recarrega os gráficos na tela principal
        } catch (error) {
            console.error("Erro ao deletar: ", error);
            alert("Erro ao excluir o registro.");
        }
    }
};

window.editarRegistro = (id, colabId, data, clientes, conversas, propostas, negociacoes, vendas) => {
    // Fecha o modal de lista e abre o modal de inserção/edição
    document.getElementById('modal-lista-registros').classList.remove('active');
    document.getElementById('modal-registro').classList.add('active');

    // Preenche os inputs utilizando os IDs que já existem no seu HTML
    document.getElementById('reg-id').value = id;
    document.getElementById('reg-colaborador').value = colabId;
    document.getElementById('reg-data').value = data;
    document.getElementById('reg-clientes').value = clientes;
    document.getElementById('reg-conversas').value = conversas;
    document.getElementById('reg-propostas').value = propostas;
    document.getElementById('reg-negociacoes').value = negociacoes;
    document.getElementById('reg-vendas').value = vendas;
};