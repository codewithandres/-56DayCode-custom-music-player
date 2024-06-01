// Importamos la lista de música desde el archivo list_reproductor.js
import { allMusic } from "./list_reproductor.js";

// Seleccionamos los elementos del DOM que vamos a utilizar
const wrapper = document.querySelector('.wrapper'),
    musicImg = wrapper.querySelector('.img-area img'),
    musicName = wrapper.querySelector('.song-details .name'),
    musicArtist = wrapper.querySelector('.song-details .artist'),
    mainAudio = wrapper.querySelector('#main-audio'),
    playPauseBtn = wrapper.querySelector('.play-pause'),
    prevBtn = wrapper.querySelector('#prev'),
    nextBtn = wrapper.querySelector('#next'),
    progresBar = wrapper.querySelector('.progress-bar'),
    progresArea = wrapper.querySelector('.progress-area'),
    showMoreBtn = wrapper.querySelector('#more-music'),
    hideMusicList = wrapper.querySelector('#close'),
    muscList = wrapper.querySelector('.music-list');

// Definimos el índice de la canción que se va a cargar al inicio
let indexMusic = 2;

// Cuando el documento esté listo, cargamos la música y mostramos la canción que se está reproduciendo
window.addEventListener('DOMContentLoaded', () => {
    loadMuisic(indexMusic);
    playinNow();
});

// Función para cargar la música en el reproductor
const loadMuisic = indexNumb => {
    const { name, artist, img, src } = allMusic[indexNumb - 1];

    musicName.textContent = name;
    musicArtist.textContent = artist;
    musicImg.src = `images/${img}.jpg`;
    mainAudio.src = `songs/${src}.mp3`;
};

// Función para reproducir la música
const playerMusic = () => {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').textContent = 'pause';
    mainAudio.play();
    playinNow();
};

// Función para pausar la música
const pausedMusic = () => {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').textContent = 'play_arrow';
    mainAudio.pause();
    playinNow();
};

// Evento para el botón de play/pausa
playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused');

    isMusicPaused ? pausedMusic() : playerMusic();
    playinNow();
});

// Función para pasar a la siguiente canción
const nexMusic = () => {
    indexMusic++;

    indexMusic > allMusic.length
        ? indexMusic = 1
        : indexMusic = indexMusic;

    loadMuisic(indexMusic);
    playerMusic();
};

// Evento para el botón de siguiente canción
nextBtn.addEventListener('click', () => nexMusic());

// Función para pasar a la canción anterior
const prevMusic = () => {
    indexMusic--;

    indexMusic < 1
        ? indexMusic = allMusic.length
        : indexMusic = indexMusic;

    loadMuisic(indexMusic);
    playerMusic();
};

// Evento para el botón de canción anterior
prevBtn.addEventListener('click', () => prevMusic());

// Evento para actualizar la barra de progreso de la canción
mainAudio.addEventListener('timeupdate', event => {

    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    let progresWidth = (currentTime / duration) * 100;
    progresBar.style.width = `${progresWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current-time');
    let musciDuration = wrapper.querySelector('.max-duration');

    // Cuando los datos de la canción se hayan cargado, actualizamos la duración de la canción
    mainAudio.addEventListener('loadeddata', () => {
        let audioDuration = mainAudio.duration;
        let totalMinutos = Math.floor(audioDuration / 60);
        let totalSegundos = Math.floor(audioDuration % 60);

        if (totalSegundos < 10) totalSegundos = `0${totalSegundos}`;

        musciDuration.textContent = `${totalMinutos}:${totalSegundos}`;
    });

    let currentMinutos = Math.floor(currentTime / 60);
    let currentSegundos = Math.floor(currentTime % 60);

    if (currentSegundos < 10) currentSegundos = `0${currentSegundos}`;

    musicCurrentTime.textContent = `${currentMinutos}:${currentSegundos}`;
});

// Evento para cambiar la posición de la canción al hacer clic en la barra de progreso
progresArea.addEventListener('click', event => {
    let progressWidthValue = progresArea.clientWidth;
    let clikedOffSetX = event.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clikedOffSetX / progressWidthValue) * songDuration;
    playerMusic();
});

// Botón para repetir la canción
const repeaSongBtn = wrapper.querySelector('#repeat-plist');

// Evento para cambiar el modo de repetición de la canción
repeaSongBtn.addEventListener('click', () => {
    let getText = repeaSongBtn.textContent;

    switch (getText) {
        case 'repeat':
            repeaSongBtn.textContent = 'repeat_one';
            repeaSongBtn.setAttribute('title', 'song looped');
            break;
        case 'repeat_one':
            repeaSongBtn.textContent = 'shuffle';
            repeaSongBtn.setAttribute('title', 'playback shuffle');
            break;
        case 'shuffle':
            repeaSongBtn.textContent = 'repeat';
            repeaSongBtn.setAttribute('title', 'playList looped')
            break;
    };
});

// Evento para cuando la canción termine
mainAudio.addEventListener('ended', () => {
    let getText = repeaSongBtn.textContent;

    switch (getText) {
        case 'repeat':
            nexMusic();
            break;
        case 'repeat_one':
            mainAudio.currentTime = 0;
            loadMuisic(indexMusic);
            playerMusic();
            break;
        case 'shuffle':
            let ranIndex = Math.floor((Math.random() * allMusic.length) + 1);

            do {
                ranIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (indexMusic == ranIndex);

            indexMusic = ranIndex;
            loadMuisic(indexMusic);
            playerMusic();
            playinNow();
            break;
    };
});

// Evento para mostrar la lista de canciones
showMoreBtn.addEventListener('click', () => muscList.classList.toggle('show'))

// Evento para ocultar la lista de canciones
hideMusicList.addEventListener('click', () => showMoreBtn.click());

// Seleccionamos la lista de canciones
const ulTag = wrapper.querySelector('ul');

// Recorremos todas las canciones y las añadimos a la lista
allMusic.map(songs => {
    let liTag = `
        <li index='${songs.id}'>
            <div class="row">
                <span>${songs.name}</span>
                <p>${songs.artist}</p>
            </div>
            <span id="${songs.src}" class="audio-duration">3:40</span>
            <audio class="${songs.src}" src="songs/${songs.src}.mp3"></audio>
        </li>
    `;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAdioTagDuration = ulTag.querySelector(`#${songs.src}`);
    let liAudioTag = ulTag.querySelector(`.${songs.src}`);

    // Cuando los datos de la canción se hayan cargado, actualizamos la duración de la canción en la lista
    liAudioTag.addEventListener('loadeddata', () => {

        let audioDuration = liAudioTag.duration;
        let totalMinutos = Math.floor(audioDuration / 60);
        let totalSegundos = Math.floor(audioDuration % 60);

        if (totalSegundos < 10) totalSegundos = `0${totalSegundos}`;

        liAdioTagDuration.textContent = `${totalMinutos}:${totalSegundos}`;
        liAdioTagDuration.setAttribute('t-duration', `${totalMinutos}:${totalSegundos}`)
    });
});

// Seleccionamos todas las canciones de la lista
const allListTag = ulTag.querySelectorAll('li');

// Función para mostrar la canción que se está reproduciendo en la lista
const playinNow = () => {
    allListTag.forEach(list => {
        let audioTag = list.querySelector('.audio-duration');

        if (list.classList.contains('playing')) {
            list.classList.remove('playing');
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.textContent = adDuration;
        };
        if (list.getAttribute('index') == indexMusic) {
            list.classList.add('playing')
            audioTag.textContent = 'Playing';
        };
        list.addEventListener('click', () => clicked(list))
    });
};

// Función para cuando se hace clic en una canción de la lista
const clicked = (element) => {

    let lineIndex = element.getAttribute('index');
    indexMusic = lineIndex;
    loadMuisic(indexMusic);
    playerMusic();
    playinNow();
};
