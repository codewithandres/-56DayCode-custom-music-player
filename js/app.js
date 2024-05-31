import { allMusic } from "./list_reproductor.js";

const wrapper = document.querySelector('.wrapper'),
    musicImg = wrapper.querySelector('.img-area img'),
    musicName = wrapper.querySelector('.song-details .name'),
    musicArtist = wrapper.querySelector('.song-details .artist'),
    mainAudio = wrapper.querySelector('#main-audio'),
    playPauseBtn = wrapper.querySelector('.play-pause'),
    prevBtn = wrapper.querySelector('#prev'),
    nextBtn = document.querySelector('#next');

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