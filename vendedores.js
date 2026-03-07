import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const formColaborador = document.getElementById('form-colaborador');
const listaUl = document.getElementById('ul-colaboradores');
const selectRegistro = document.getElementById('reg-colaborador');
const selectFiltroDashboard = document.querySelector('.collaborator-select'); // Aquele select do topo do painel

// Referência para a coleção no Firestore
const vendedoresCol = collection(db, "vendedores");

// 1. Carregar e Listar Colaboradores
export async function carregarColaboradores() {
    listaUl.innerHTML = '<li>Carregando...</li>';
    
    try {
        const querySnapshot = await getDocs(vendedoresCol);
        listaUl.innerHTML = '';
        selectRegistro.innerHTML = '<option value="">Selecione o colaborador</option>';
        selectFiltroDashboard.innerHTML = '<option value="todos">Todos Colaboradores</option>';

        querySnapshot.forEach((doc) => {
            const vendedor = doc.data();
            const id = doc.id;

            // Cria o item da lista
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${vendedor.nome}</strong> - <span>${vendedor.cargo}</span>
                </div>
                <div class="acoes">
                    <button class="btn-edit" onclick="window.editarVendedor('${id}', '${vendedor.nome}', '${vendedor.cargo}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="window.deletarVendedor('${id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            listaUl.appendChild(li);

            // Popula o Select do Novo Registro
            const option = document.createElement('option');
            option.value = id;
            option.textContent = vendedor.nome;
            selectRegistro.appendChild(option.cloneNode(true));
            selectFiltroDashboard.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar colaboradores: ", error);
        listaUl.innerHTML = '<li>Erro ao carregar lista.</li>';
    }
}

// 2. Adicionar ou Atualizar Colaborador
formColaborador.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('colaborador-id').value;
    const nome = document.getElementById('colaborador-nome').value;
    const cargo = document.getElementById('colaborador-cargo').value;
    const btnSalvar = document.getElementById('btn-salvar-colaborador');

    btnSalvar.textContent = "Salvando...";

    try {
        if (id) {
            // Atualizar
            const docRef = doc(db, "vendedores", id);
            await updateDoc(docRef, { nome, cargo });
        } else {
            // Criar Novo
            await addDoc(vendedoresCol, { nome, cargo });
        }
        
        formColaborador.reset();
        document.getElementById('colaborador-id').value = '';
        btnSalvar.textContent = "Adicionar";
        carregarColaboradores(); // Recarrega a lista
    } catch (error) {
        console.error("Erro ao salvar: ", error);
        alert("Erro ao salvar colaborador.");
        btnSalvar.textContent = id ? "Atualizar" : "Adicionar";
    }
});

// 3. Deletar Colaborador (Exposto no window para o onclick funcionar com modules)
window.deletarVendedor = async (id) => {
    if (confirm("Tem certeza que deseja excluir este colaborador?")) {
        try {
            await deleteDoc(doc(db, "vendedores", id));
            carregarColaboradores();
        } catch (error) {
            console.error("Erro ao deletar: ", error);
        }
    }
};

// 4. Preencher formulário para Edição
window.editarVendedor = (id, nome, cargo) => {
    document.getElementById('colaborador-id').value = id;
    document.getElementById('colaborador-nome').value = nome;
    document.getElementById('colaborador-cargo').value = cargo;
    document.getElementById('btn-salvar-colaborador').textContent = "Atualizar";
};

// Carrega os dados assim que o script é lido
carregarColaboradores();