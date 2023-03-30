// Seleciona os elementos do HTML com os IDs especificados
const player = document.querySelector("#player");
const musicName = document.querySelector("#musicName");
const playPauseButton = document.querySelector("#playPauseButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

// Importa um arquivo JavaScript externo contendo um array de objetos com informações das músicas
import songs from "./songs.js";

// Define as strings que serão usadas para trocar o ícone do botão de play/pause
const textButtonPlay = "<i class='bx bx-caret-right'></i>";
const textButtonPause = "<i class='bx bx-pause'></i>";

// Define a variável index para controlar a música atual sendo tocada
let index = 0;

// Define as funções que serão executadas ao clicar nos botões
prevButton.onclick = () => prevNextMusic("prev"); // Botão "anterior"
nextButton.onclick = () => prevNextMusic(); // Botão "próximo"

playPauseButton.onclick = () => playPause(); // Botão "play/pause"

// Define a função playPause para tocar ou pausar a música e trocar o ícone do botão correspondente
const playPause = () => {
    // Se a música estiver pausada
    if (player.paused) {
        // Toca a música
        player.play();
        // Troca o ícone do botão para "pause"
        playPauseButton.innerHTML = textButtonPause;
    } else {
        // Pausa a música
        player.pause();
        // Troca o ícone do botão para "play"
        playPauseButton.innerHTML = textButtonPlay;
    }
};

// Define a função updateTime para atualizar o tempo decorrido e o tempo total da música
player.ontimeupdate = () => updateTime();

const updateTime = () => {
    const currentMinutes = Math.floor(player.currentTime / 60); // Calcula os minutos decorridos
    const currentSeconds = Math.floor(player.currentTime % 60); // Calcula os segundos decorridos
    currentTime.textContent = currentMinutes + ":" + formatZero(currentSeconds); // Atualiza o elemento HTML correspondente

    const durationFormatted = isNaN(player.duration) ? 0 : player.duration; // Se o tempo total da música não estiver disponível, define como zero
    const durationMinutes = Math.floor(durationFormatted / 60); // Calcula os minutos totais da música
    const durationSeconds = Math.floor(durationFormatted % 60);
    duration.textContent = durationMinutes + ":" + formatZero(durationSeconds);

    const progressWidth = durationFormatted
        ? (player.currentTime / durationFormatted) * 100
        : 0;  // Calcula a porcentagem do tempo decorrido em relação ao tempo total da música

    progress.style.width = progressWidth + "%"; // Atualiza a barra de progresso correspondente
};

// Define a função formatZero para adicionar um zero à esquerda em números menores que 10
const formatZero = (n) => (n < 10 ? "0" + n : n);

// Define a função a ser executada quando o evento de clique é acionado no elemento progressBar
progressBar.onclick = (e) => {
    // Obtém a posição do clique do mouse em relação à barra de progresso
    const newTime = (e.offsetX / progressBar.offsetWidth) * player.duration;
    // Atualiza o tempo atual da música para a nova posição do clique do mouse
    player.currentTime = newTime;
};

// Define a função que será usada para passar para a música anterior ou próxima
const prevNextMusic = (type = "next") => {
    // Verifica se é necessário voltar para a primeira música ou se é uma inicialização
    if ((type == "next" && index + 1 === songs.length) || type === "init") {
        index = 0;
        // Verifica se é necessário voltar para a última música
    } else if (type == "prev" && index === 0) {
        index = songs.length;
        // Avança ou volta para a música anterior ou próxima
    } else {
        index = type === "prev" && index ? index - 1 : index + 1;
    }

    // Define a fonte da tag audio como a música correspondente
    player.src = songs[index].src;
    // Atualiza o nome da música atual
    musicName.innerHTML = songs[index].name;
    // Inicia a reprodução da música automaticamente, a menos que seja uma inicialização
    if (type !== "init") playPause();

    // Atualiza as informações do tempo e da barra de progresso
    updateTime();
};

// Inicializa a primeira música
prevNextMusic("init");
