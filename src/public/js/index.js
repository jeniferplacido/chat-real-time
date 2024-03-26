// Conexão com o servidor WebSocket
const socket = io();
console.log('Conexão estabelecida com sucesso!');

// Função para enviar uma mensagem ao servidor quando o usuário pressiona Enter
function sendMessage() {
    const chatBox = document.getElementById('chatbox');
    const message = chatBox.value.trim();

    if (message.length > 0) {
        socket.emit('message', { user: user, message: message });
        chatBox.value = '';
    }
}

// Evento para identificar o usuário
Swal.fire({
    title: 'Identificar',
    input: 'text',
    text: 'Digite o nome de usuário para se identificar no chat',
    inputValidator: (value) => {
        return !value && 'Por favor, digite o nome de usuário para continuar!';
    },
    allowOutsideClick: false
}).then((result) => {
    if (result.isConfirmed) {
        user = result.value;

        // Adicionar evento keyup ao input de chatBox
        const chatBox = document.getElementById('chatbox');
        chatBox.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter') {
                sendMessage();
            }
        });

        // Receber logs de mensagens do servidor
        socket.on('messageLogs', (data) => {
            const logs = document.getElementById('messageLogs');
            let messages = '';
            data.forEach((message) => {
                messages += `${message.user} diz: ${message.message} <br/>`;
            });
            logs.innerHTML = messages;
        });
// Emitir evento de autenticação após o usuário ser autenticado
socket.emit('authenticate', user);

        // Receber notificação de novo usuário conectado do servidor
        socket.on('userConnected', (username) => {
            if (user !== username) {
                Swal.fire({
                    title: 'Novo Usuário Conectado',
                    text: `${username} acabou de se conectar.`,
                    icon: 'info',
                    toast: true,
                    position: 'top-right'
                });
            }
        });
    }
});
