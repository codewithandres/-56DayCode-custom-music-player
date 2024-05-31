import { allMusic } from "./list_reproductor.js";

const wrapper = document.querySelector('.wrapper'),
    musicImg = wrapper.querySelector('.img-area img'),
    musicName = wrapper.querySelector('.song-details .name'),
    musicArtist = wrapper.querySelector('.song-details .artist'),
    mainAudio = wrapper.querySelector('#main-audio'),
    playPauseBtn = wrapper.querySelector('.play-pause'),
    prevBtn = wrapper.querySelector('#prev'),
    nextBtn = wrapper.querySelector('#next'),
    progresBar = wrapper.querySelector('.progress-bar'),
    progresArea = wrapper.querySelector('.progress-area');

let indexMusic = 2;

window.addEventListener('DOMContentLoaded', () => loadMuisic(indexMusic));

const loadMuisic = indexNumb => {
    const { name, artist, img, src } = allMusic[indexNumb - 1];

    musicName.textContent = name;
    musicArtist.textContent = artist;
    musicImg.src = `images/${img}.jpg`;
    mainAudio.src = `songs/${src}.mp3`;
};

const playerMusic = () => {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').textContent = 'pause';
    mainAudio.play();
};

const pausedMusic = () => {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').textContent = 'play_arrow';
    mainAudio.pause();
};

playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused');

    isMusicPaused ? pausedMusic() : playerMusic();
});

const nexMusic = () => {
    indexMusic++;

    indexMusic > allMusic.length
        ? indexMusic = 1
        : indexMusic = indexMusic;

    loadMuisic(indexMusic);
    playerMusic();
};

nextBtn.addEventListener('click', () => nexMusic());

const prevMusic = () => {
    indexMusic--;

    indexMusic < 1
        ? indexMusic = allMusic.length
        : indexMusic = indexMusic;

    loadMuisic(indexMusic);
    playerMusic();
};

prevBtn.addEventListener('click', () => prevMusic());

mainAudio.addEventListener('timeupdate', event => {

    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    let progresWidth = (currentTime / duration) * 100;
    progresBar.style.width = `${progresWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current-time');
    let musciDuration = wrapper.querySelector('.max-duration');

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

progresArea.addEventListener('click', event => {
    let progressWidthValue = progresArea.clientWidth;
    let clikedOffSetX = event.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clikedOffSetX / progressWidthValue) * songDuration;
    playerMusic();
});

const repeaSongBtn = wrapper.querySelector('#repeat-plist');

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
            break;
    };
});