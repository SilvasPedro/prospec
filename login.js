import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Tema (Igual ao do Dashboard) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('hubdesk-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('hubdesk-theme', newTheme);
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

    // --- Lógica REAL de Autenticação ---
    const loginForm = document.getElementById('login-form');
    const btnSubmit = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email').value;
        const senhaInput = document.getElementById('senha').value;

        // Efeito visual de carregamento
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Autenticando...';
        btnSubmit.disabled = true;

        try {
            // Tenta fazer o login no banco de dados do Firebase
            const userCredential = await signInWithEmailAndPassword(auth, emailInput, senhaInput);
            const user = userCredential.user;

            // Se der certo, salva o nome do usuário e redireciona
            const nomeUsuario = user.displayName || emailInput.split('@')[0];
            localStorage.setItem('usuarioLogado', nomeUsuario);

            window.location.href = 'index.html';

        } catch (error) {
            console.error("Erro no login: ", error);

            // Retorna o botão ao estado original
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.disabled = false;

            // Avisa o usuário sobre o erro (você pode customizar a mensagem dependendo do código de erro)
            alert("Falha no login. Verifique se o e-mail e a senha estão corretos.");
        }
    });
});