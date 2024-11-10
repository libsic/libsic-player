const folderInput = document.getElementById('d3275aea-defd-4dfd-af6b-4cf4434453a0');
const playButton = document.getElementById('o816e568-f8e8-49f0-9adf-47b0e38f2808');
const pauseButton = document.getElementById('o776e568-f8e8-49f0-9adf-47b0e38f2808');
const audioPlayer = document.getElementById('hgf120f3-047d-44d4-a1df-8bdb6f99298d');
const playlist = document.getElementById('cc3d4209-3deb-4ad4-b451-95cf291146aa');
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');
const volumeIcon = document.querySelector('.volume-icon');
let songs = [];
let currentSongIndex = 0;

// Controle de volume
volumeControl.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;

    if (volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
});

// Controle de reprodução/pausa
playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        if (!audioPlayer.src && songs.length > 0) {
            playSong();
        } else {
            audioPlayer.play();
            updatePlayPauseButtons(false);
        }
    }
});

pauseButton.addEventListener('click', () => {
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        updatePlayPauseButtons(true);
    }
});

folderInput.addEventListener('change', (e) => {
    playlist.innerHTML = '';
    songs = [];

    const files = Array.from(e.target.files).filter(file => file.type === 'audio/mpeg');

    files.forEach((file, index) => {
        songs.push(URL.createObjectURL(file));

        const li = document.createElement('li');
        li.textContent = file.name;
        li.onclick = () => {
            currentSongIndex = index;
            playSong();
        };
        playlist.appendChild(li);
    });

    playButton.disabled = songs.length === 0;
    pauseButton.disabled = songs.length === 0;
});

audioPlayer.addEventListener('ended', () => {
    currentSongIndex++;
    if (currentSongIndex < songs.length) {
        playSong();
    } else {
        currentSongIndex = 0;
        updatePlayPauseButtons(true);
        playButton.disabled = false;
        pauseButton.disabled = true;
    }
});

function playSong() {
    Array.from(playlist.children).forEach(li => li.classList.remove('playing'));
    playlist.children[currentSongIndex].classList.add('playing');

    audioPlayer.src = songs[currentSongIndex];
    audioPlayer.volume = volumeControl.value / 100;
    audioPlayer.play();
    updatePlayPauseButtons(false);
}

function updatePlayPauseButtons(isPaused) {
    playButton.disabled = !isPaused;
    pauseButton.disabled = isPaused;
}