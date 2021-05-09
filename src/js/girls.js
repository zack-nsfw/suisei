const App = [document.getElementById("vid"), document.getElementById("pic")];
const n = [56, 47];
let opa = true;
let MyInter;
const audio = document.createElement("audio");
audio.src = `http://www.database.dev.cc/suisei/girls/sound.opus`;
audio.loop = true;
document.body.appendChild(audio);

const prevPlay = (e) => {
    const obj = e.path[0];
    obj.querySelector("video").play();
};
const prevStop = (e) => {
    const obj = e.path[0];
    obj.querySelector("video").pause();
    obj.querySelector("video").currentTime = 0;
};
const prevOpen = (id) => {
    const video_tempalte = document.getElementById("film-template").content;
    const clone = video_tempalte.cloneNode(true);
    const Fragment = document.createDocumentFragment();

    const overlay = clone.querySelector("div.overlay");

    Fragment.appendChild(clone);
    document.body.querySelector("main").appendChild(Fragment);

    function close() {
        overlay.remove();
    }
    const url = `http://www.database.dev.cc/suisei/girls/videos/${id}.mp4`;

    const video = overlay.querySelector("video");

    if (id == 5) video.classList.remove("girl");

    video.id = `v${id}`;
    video.src = url;

    const player = document.getElementById("player");
    const play_btn = document.getElementById("play_btn");
    const extend_btn = document.getElementById("extend_btn");
    const volume_btn = document.getElementById("volume_btn");
    const progress = document.getElementById("pb");
    const progress_bar = document.getElementById("pbf");
    const ranges = player.querySelector(".player__slider");

    let isFullS = false;
    player.onfullscreenchange = function () {
        if (isFullS) {
            isFullS = false;
            extend_btn.classList.add("fa-expand");
            extend_btn.classList.remove("fa-compress");
        } else {
            isFullS = true;
            extend_btn.classList.add("fa-compress");
            extend_btn.classList.remove("fa-expand");
        }
    };

    function changebtn() {
        if (!video.paused) {
            play_btn.classList.remove("fa-play");
            play_btn.classList.add("fa-pause");
        } else {
            play_btn.classList.add("fa-play");
            play_btn.classList.remove("fa-pause");
        }
    }

    function play_toggle() {
        if (video.paused) {
            video.play();
            audio.play()
            changebtn();
        } else {
            audio.pause()
            video.pause();
            changebtn();
        }
    }

    function extend_toggle() {
        if (!isFullS) {
            player.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function handleRangeUpd() {
        audio["volume"] = this.value;
        if (audio.volume == 0) {
            volume_btn.classList.add("fa-volume-mute");
            volume_btn.classList.remove("fa-volume-up");
        } else if (audio.volume != 0 && !audio.muted) {
            volume_btn.classList.remove("fa-volume-mute");
            volume_btn.classList.add("fa-volume-up");
        }
    }

    function mute_toggle() {
        if (!audio.muted) {
            audio.muted = true;
            volume_btn.classList.add("fa-volume-mute");
            volume_btn.classList.remove("fa-volume-up");
        } else {
            volume_btn.classList.remove("fa-volume-mute");
            volume_btn.classList.add("fa-volume-up");
            audio.muted = false;
        }
    }

    function handleProgress() {
        const percentage = (video.currentTime / video.duration) * 100;
        progress_bar.style.width = `${percentage}%`;
    }
    function scrub(e) {
        const time = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = time;
    }

    extend_btn.addEventListener("click", extend_toggle);
    play_btn.addEventListener("click", play_toggle);
    video.addEventListener("play", changebtn);
    video.addEventListener("pause", changebtn);
    volume_btn.addEventListener("click", mute_toggle);

    progress.addEventListener("click", scrub);

    video.addEventListener("timeupdate", handleProgress);

    ranges.addEventListener("change", handleRangeUpd);
    window.addEventListener("keydown", function TEMP({ key }) {
        if (key == "Escape") {
            audio.currentTime = 0;
            audio.pause()
            close();
            window.removeEventListener("keydown", TEMP);
            clearInterval(MyInter);
        }
        if (key.toUpperCase() == "M") mute_toggle();
        if (key.toUpperCase() == "F") extend_toggle();
        if (key == " ") play_toggle();

        if (key == ",") {
            if (opa) {
                player.querySelector("div.video-overlay").style.opacity = 0;
                player.querySelector("div.video-overlay").style.cursor = "none";
                opa = false;
            } else {
                player.querySelector("div.video-overlay").style.opacity = 1;
                player.querySelector("div.video-overlay").style.cursor =
                    "default";
                opa = true;
            }
        }
    });
    play_toggle();
};
const LoadGirlPrevs = () => {
    let _id = 90;
    let owo = true;
    const checkV = (id) => {
        if (id != n[0]) {
            if (owo) {
                _id = id;
                owo = false;
            }
            const video = document.getElementById(`v${_id}`);

            if (video.paused && video.currentTime == video.duration) {
                _id++;
                const overlay = document.querySelector(".overlay");
                overlay.remove();
                prevOpen(_id);
            }
        }
    };
    for (let i = 1; i <= n[0]; i++) {
        const girl_prev = document.getElementById("girl-prev").content;
        const clone = girl_prev.cloneNode(true);
        const Fragment = document.createDocumentFragment();

        const div = clone.querySelector("div");
        div.id = i;

        const vid = clone.querySelector("video");
        vid.src = `http://www.database.dev.cc/suisei/girls/videos/${i}.mp4`;

        Fragment.appendChild(clone);
        App[0].appendChild(Fragment);

        div.addEventListener("mouseover", prevPlay);
        div.addEventListener("mouseout", prevStop);
        div.addEventListener("click", () => {
            prevOpen(i);
            MyInter = setInterval(() => checkV(i), 1000);
        });
    }
};
const picOpen = (id) => {
    function close() {
        div.remove();
    }

    const img = document.createElement("img");
    img.src = `http://www.database.dev.cc/suisei/girls/pictures/${id}.jpg`;

    const div = document.createElement("div");
    div.classList.add("overlay");
    const Fragment = document.createDocumentFragment();

    div.appendChild(img);
    Fragment.appendChild(div);
    document.body.querySelector("main").appendChild(Fragment);

    let _id = id;

    window.addEventListener("keydown", function TEMP({ key }) {
        if (key == "Escape") {
            close();
            window.removeEventListener("keydown", TEMP);
        }
        if (key == "ArrowRight") {
            if (_id < n[1]) {
                _id++;
                img.src = `http://www.database.dev.cc/suisei/girls/pictures/${_id}.jpg`;
            }
        }
        if (key == "ArrowLeft") {
            if (_id > 1) {
                _id--;
                img.src = `http://www.database.dev.cc/suisei/girls/pictures/${_id}.jpg`;
            }
        }
    });
};
const LoadGirlPics = () => {
    for (let i = 0; i < n[1]; i++) {
        const girl_prev = document.getElementById("girl-prev_").content;
        const clone = girl_prev.cloneNode(true);
        const Fragment = document.createDocumentFragment();

        const div = clone.querySelector("div");
        div.id = i;

        const img = clone.querySelector("img");
        img.src = `http://www.database.dev.cc/suisei/girls/pictures/${i}.jpg`;

        Fragment.appendChild(clone);
        App[1].appendChild(Fragment);

        div.addEventListener("click", () => picOpen(i));
    }
};
LoadGirlPrevs();
LoadGirlPics();


const secret = document.getElementById("secret");
const playAll = () => {
    const vids = document.querySelectorAll("video");
    vids.forEach((vid) => {
        if (vid.paused) {
            audio.volume = 0.2;
            audio.play();
            vid.play();
        } else {
            vid.pause();
            audio.pause();
            audio.currentTime = 0;
            vid.currentTime = 0;
        }
    });
};
secret.addEventListener("click", playAll);
