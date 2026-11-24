
// ======================================================
// FORMULÁRIO DE CADASTRO INTELIGENTE
// HTML5, CSS3 e TypeScript
// ======================================================


// 1. SELECIONANDO OS ELEMENTOS DO HTML

const form = document.querySelector<HTMLFormElement>(
    '#form-cadastro'
)!;

const nome = document.querySelector<HTMLInputElement>(
    '#nome'
)!;

const email = document.querySelector<HTMLInputElement>(
    '#email'
)!;

const cep = document.querySelector<HTMLInputElement>(
    '#cep'
)!;

const senha = document.querySelector<HTMLInputElement>(
    '#senha'
)!;

const confirmaSenha = document.querySelector<HTMLInputElement>(
    '#confirma-senha'
)!;

const forcaSenha = document.querySelector<HTMLSpanElement>(
    '#forca-senha'
)!;

const mensagemSucesso = document.querySelector<HTMLParagraphElement>(
    '#mensagem-sucesso'
)!;


// 2. ORGANIZANDO OS CAMPOS

const campos: HTMLInputElement[] = [
    nome,
    email,
    cep,
    senha,
    confirmaSenha
];


// 3. SELECIONANDO AS MENSAGENS DE ERRO

function obterSpanErro(input: HTMLInputElement): HTMLSpanElement {

    const span = document.querySelector<HTMLSpanElement>(
        `#erro-${input.id}`
    );

    if (span === null) {
        throw new Error(
            `Mensagem de erro não encontrada para ${input.id}`
        );
    }

    return span;
}


// 4. EXPRESSÕES REGULARES (REGEX)

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const regexCep = /^\d{5}-?\d{3}$/;


// 5. VALIDANDO O NOME

function validarNome(input: HTMLInputElement): string {

    if (input.validity.valueMissing) {
        return 'O nome é obrigatório.';
    }

    if (input.validity.tooShort) {
        return 'O nome deve ter pelo menos 3 caracteres.';
    }

    return '';
}


// 6. VALIDANDO O E-MAIL

function validarEmail(valor: string): string {

    if (valor.trim() === '') {
        return 'O e-mail é obrigatório.';
    }

    if (!regexEmail.test(valor)) {
        return 'Digite um e-mail válido.';
    }

    return '';
}


// 7. VALIDANDO O CEP

function validarCep(valor: string): string {

    if (valor.trim() === '') {
        return 'O CEP é obrigatório.';
    }

    if (!regexCep.test(valor)) {
        return 'Digite um CEP válido (ex: 00000-000).';
    }

    return '';
}


// 8. VALIDANDO A SENHA

function validarSenha(valor: string): string {

    if (valor === '') {
        return 'A senha é obrigatória.';
    }

    if (valor.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }

    if (!/\d/.test(valor)) {
        return 'A senha deve conter pelo menos um número.';
    }

    return '';
}


// 9. VALIDANDO A CONFIRMAÇÃO DA SENHA

function validarConfirmacao(valor: string): string {

    if (valor === '') {
        return 'Confirme sua senha.';
    }

    if (valor !== senha.value) {
        return 'As senhas não coincidem.';
    }

    return '';
}


// 10. FUNÇÃO PARA VALIDAR CADA CAMPO

function validarCampo(input: HTMLInputElement): string {

    switch (input.id) {

        case 'nome':
            return validarNome(input);

        case 'email':
            return validarEmail(input.value);

        case 'cep':
            return validarCep(input.value);

        case 'senha':
            return validarSenha(input.value);

        case 'confirma-senha':
            return validarConfirmacao(input.value);

        default:
            return '';
    }
}


// 11. EXIBINDO AS MENSAGENS DE ERRO

function exibirErro(
    input: HTMLInputElement,
    span: HTMLSpanElement,
    mensagem: string
): void {

    const temErro = mensagem !== '';

    span.textContent = mensagem;

    input.classList.toggle('borda-erro', temErro);

    input.setAttribute('aria-invalid', String(temErro));
}


// 12. EVENTO BLUR: VALIDAR AO SAIR DO CAMPO

campos.forEach((input) => {

    input.addEventListener('blur', () => {

        const mensagem = validarCampo(input);

        const span = obterSpanErro(input);

        exibirErro(input, span, mensagem);

    });

});


// 13. BÔNUS: MÁSCARA AUTOMÁTICA DO CEP

function aplicarMascaraCep(): void {

    let numeros = cep.value.replace(/\D/g, '');

    numeros = numeros.slice(0, 8);

    if (numeros.length > 5) {

        cep.value =
            numeros.slice(0, 5) +
            '-' +
            numeros.slice(5);

    } else {

        cep.value = numeros;

    }
}


// 14. BÔNUS: INDICADOR DE FORÇA DA SENHA

function atualizarForcaSenha(): void {

    const valor = senha.value;

    let nivel = 'fraca';

    let mensagem = 'Força da senha: Fraca';

    if (valor.length >= 8 && /\d/.test(valor)) {

        nivel = 'media';

        mensagem = 'Força da senha: Média';

    }

    if (
        valor.length >= 12 &&
        /\d/.test(valor) &&
        /[A-Z]/.test(valor) &&
        /[a-z]/.test(valor) &&
        /[^A-Za-z0-9]/.test(valor)
    ) {

        nivel = 'forte';

        mensagem = 'Força da senha: Forte';

    }

    forcaSenha.textContent = mensagem;

    forcaSenha.className = `forca-senha ${nivel}`;
}


// 15. EVENTO INPUT: VALIDAR ENQUANTO DIGITA

campos.forEach((input) => {

    input.addEventListener('input', () => {

        // Aplica a máscara automática no CEP
        if (input.id === 'cep') {
            aplicarMascaraCep();
        }

        // Atualiza a força da senha
        if (input.id === 'senha') {
            atualizarForcaSenha();
        }

        // Só revalida se o campo já estiver marcado como inválido
        if (input.getAttribute('aria-invalid') === 'true') {

            const mensagem = validarCampo(input);

            const span = obterSpanErro(input);

            exibirErro(input, span, mensagem);

        }

        // Revalida a confirmação se ela já apresentar erro
        if (
            input.id === 'senha' &&
            confirmaSenha.getAttribute('aria-invalid') === 'true'
        ) {

            const mensagem = validarCampo(confirmaSenha);

            const span = obterSpanErro(confirmaSenha);

            exibirErro(
                confirmaSenha,
                span,
                mensagem
            );

        }

        // Remove o aviso de sucesso se o formulário for editado
        mensagemSucesso.textContent = '';

        mensagemSucesso.classList.remove('sucesso');

    });

});


// 16. EVENTO SUBMIT: ENVIAR O FORMULÁRIO

form.addEventListener('submit', (evento: SubmitEvent) => {

    // Impede o envio tradicional do formulário
    evento.preventDefault();

    const camposInvalidos: HTMLInputElement[] = [];

    // Valida todos os campos
    campos.forEach((input) => {

        const mensagem = validarCampo(input);

        const span = obterSpanErro(input);

        exibirErro(input, span, mensagem);

        if (mensagem !== '') {
            camposInvalidos.push(input);
        }

    });

    // Se houver erro, direciona para o primeiro campo inválido
    if (camposInvalidos.length > 0) {

        camposInvalidos[0].focus();

        mensagemSucesso.textContent = '';

        mensagemSucesso.classList.remove('sucesso');

        return;

    }

    // Exibe a mensagem de sucesso
    mensagemSucesso.textContent =
        'Cadastro realizado com sucesso!';

    mensagemSucesso.classList.add('sucesso');

    // Limpa os campos
    form.reset();

    // Remove as mensagens e bordas de erro
    campos.forEach((input) => {

        const span = obterSpanErro(input);

        exibirErro(input, span, '');

    });

    // Reinicia o indicador da senha
    forcaSenha.textContent =
        'Força da senha: não informada';

    forcaSenha.className = 'forca-senha';

});
