let App = document.getElementById("app");
const footer = document.querySelector("footer");
let opa = true;
let namelist = []
let MyInter
const AppFill = () => {
    App = document.getElementById("app");
    App.style.gridTemplateColumns = `repeat(${Math.floor(
        window.innerWidth / 350
    )}, 300px)`;
};
const AppDelete = () => {
    App.remove();
    const section = document.createElement("section");
    section.classList.add("prevs");
    section.id = "app";
    document.body.querySelector("main").appendChild(section);
    AppFill();
};

const footerLoad = (pages) => {
    const nav = document.createElement("nav");
    for (let i = 0; i < pages; i++) {
        const btn = document.createElement("button");
        const x = i + 1;
        btn.id = `btn${x}`;
        btn.innerText = x;
        nav.appendChild(btn);
        btn.addEventListener("click", () => {
            fetchData(x);
        });
    }
    footer.appendChild(nav);
};
let n
AppFill();
window.addEventListener("resize", AppFill);
const fetchData = async (page) => {
    try {
        const res = await fetch("/src/apis/videos.json");
        const data = await res.json();
        n = data.videos.count;
        const video_list = data.videos;
        if (page == 0) {
            prevLoader(video_list.page_one);
            footerLoad(data.pages);
        }
        if (page == 1) {
            AppDelete();
            prevLoader(video_list.page_one);
        }
        if (page == 2) {
            AppDelete();
            prevLoader(video_list.page_two);
        }
    } catch (error) {
        console.log(error);
    }
};



const prevPlay = (e) => {
    const obj = e.path[0];
    obj.querySelector("video").play();
};
const prevStop = (e) => {
    const obj = e.path[0];
    obj.querySelector("video").pause();
    obj.querySelector("video").currentTime = 0;
};
const vidOpen = (url, title, id) => {
    const video_tempalte = document.getElementById("film-template").content;
    const clone = video_tempalte.cloneNode(true);
    const Fragment = document.createDocumentFragment();

    const overlay = clone.querySelector("div.overlay");

    Fragment.appendChild(clone);
    document.body.querySelector("main").appendChild(Fragment);

    function close() {
        overlay.remove();
    }

    const video = overlay.querySelector("video");

    video.id = id;

    const h2 = overlay.querySelector("h2.title");
    video.src = url;
    h2.innerHTML = title;

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
            changebtn();
        } else {
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
        video["volume"] = this.value;
        if (video.volume == 0) {
            volume_btn.classList.add("fa-volume-mute");
            volume_btn.classList.remove("fa-volume-up");
        } else if (video.volume != 0 && !video.muted) {
            volume_btn.classList.remove("fa-volume-mute");
            volume_btn.classList.add("fa-volume-up");
        }
    }

    function mute_toggle() {
        if (!video.muted) {
            video.muted = true;
            volume_btn.classList.add("fa-volume-mute");
            volume_btn.classList.remove("fa-volume-up");
        } else {
            volume_btn.classList.remove("fa-volume-mute");
            volume_btn.classList.add("fa-volume-up");
            video.muted = false;
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
            close();
            window.removeEventListener("keydown", TEMP);
            clearInterval(MyInter)
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
    play_toggle()
};
let _id = 90
let owo = true
const checkV = (id) => {
    if(id != n) {
        if(owo) {
            _id = id;
            owo = false;
        }
        const title = namelist[_id]
        const video = document.getElementById(_id)
        
        
        if(video.paused && (video.currentTime == video.duration)) {
            _id++;
            const overlay = document.querySelector('.overlay')
            overlay.remove();
            const url = `http://www.database.dev.cc/suisei/films/${_id}.mp4`
            vidOpen(url, title, (_id))
        }
    }


}
const prevLoader = (info) => {
    info.forEach(({ id, name, actress, prev, url }) => {
        const prev_tempalte = document.getElementById("prev-template").content;
        const clone = prev_tempalte.cloneNode(true);
        const Fragment = document.createDocumentFragment();

        const Prev = clone.querySelector("div.video-prev");
        const video = clone.querySelector("video");
        const Title = clone.querySelector("p");

        video.src = prev;
        Title.innerHTML = actress;
        Fragment.appendChild(clone);
        App.appendChild(Fragment);

        Prev.addEventListener("mouseover", prevPlay);
        Prev.addEventListener("mouseout", prevStop);
        Prev.addEventListener("click", () => {
            vidOpen(url, name, id)
            MyInter = setInterval(() => checkV(id, video), 1000)
        });
        namelist[id-1] = name
    });
};

fetchData(0);

const secret = document.getElementById("secret");

const playAll = () => {
    const vids = document.querySelectorAll("video");
    vids.forEach((vid) => {
        if (vid.paused) {
            vid.volume = 0.2;
            vid.play();
            vid.muted = false;
        } else {
            vid.muted = true;
            vid.pause();
            vid.currentTime = 0;
        }
    });
};
secret.addEventListener("click", playAll);