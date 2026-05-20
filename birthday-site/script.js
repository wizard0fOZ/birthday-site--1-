/* =========================================================
   Shared helpers - floating petals, background music, lightbox, transitions
   ========================================================= */

const BG_MUSIC_SRC = "assets/Golden hour by JVKE.mp3";
const BG_MUSIC_VOLUME = 0.08;
const MUSIC_PREF_KEY = "birthday-music-enabled";
const MUSIC_TIME_KEY = "birthday-music-time";
const MUSIC_ENGAGED_KEY = "birthday-music-engaged";

/* Floating sunflower petals + music notes background */
function spawnFloaters(symbols = ["🌻", "🌼", "✿"], count = 18){
  const layer = document.createElement("div");
  layer.className = "floaters";
  document.body.appendChild(layer);
  for(let i = 0; i < count; i++){
    const f = document.createElement("span");
    f.className = "floater";
    f.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    f.style.left = Math.random() * 100 + "vw";
    f.style.fontSize = 14 + Math.random() * 22 + "px";
    const dur = 14 + Math.random() * 16;
    f.style.animationDuration = dur + "s";
    f.style.animationDelay = -Math.random() * dur + "s";
    layer.appendChild(f);
  }
}

function attachBackgroundMusic(){
  const audio = document.createElement("audio");
  const toggle = document.createElement("button");
  let enabled = localStorage.getItem(MUSIC_PREF_KEY) !== "off";

  audio.src = encodeURI(BG_MUSIC_SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = BG_MUSIC_VOLUME;
  audio.className = "bg-audio";
  audio.setAttribute("aria-hidden", "true");

  toggle.type = "button";
  toggle.className = "music-toggle";
  toggle.setAttribute("aria-label", "Toggle background music");
  toggle.title = "Toggle background music";

  function syncToggle(){
    toggle.dataset.state = enabled ? "on" : "off";
    toggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    toggle.textContent = enabled ? "Music On" : "Music Off";
  }

  function savePosition(){
    if(Number.isFinite(audio.currentTime) && audio.currentTime > 0){
      sessionStorage.setItem(MUSIC_TIME_KEY, String(audio.currentTime));
    }
  }

  function restorePosition(){
    const saved = Number(sessionStorage.getItem(MUSIC_TIME_KEY));
    if(Number.isFinite(saved) && saved >= 0){
      audio.currentTime = saved;
    }
  }

  function tryPlay(){
    if(!enabled) return Promise.resolve();
    return audio.play()
      .then(()=>{
        sessionStorage.setItem(MUSIC_ENGAGED_KEY, "true");
      })
      .catch(()=>{});
  }

  function pauseAudio(){
    savePosition();
    audio.pause();
  }

  function enableOnInteraction(){
    const startPlayback = ()=>{
      tryPlay();
    };

    document.addEventListener("pointerdown", startPlayback, { once: true });
    document.addEventListener("keydown", startPlayback, { once: true });
  }

  toggle.addEventListener("click", ()=>{
    enabled = !enabled;
    localStorage.setItem(MUSIC_PREF_KEY, enabled ? "on" : "off");
    if(enabled){
      tryPlay();
      enableOnInteraction();
    } else {
      pauseAudio();
    }
    syncToggle();
  });

  audio.addEventListener("loadedmetadata", restorePosition, { once: true });
  window.addEventListener("pagehide", savePosition);

  document.body.appendChild(audio);
  document.body.appendChild(toggle);

  syncToggle();

  if(enabled){
    if(sessionStorage.getItem(MUSIC_ENGAGED_KEY) === "true"){
      tryPlay();
    }
    enableOnInteraction();
  }
}

/* Soft page-leave transition for any link with data-transition */
function attachPageTransitions(){
  document.querySelectorAll("a[data-transition]").forEach((a)=>{
    a.addEventListener("click", (e)=>{
      const href = a.getAttribute("href");
      if(!href || href.startsWith("#") || a.target === "_blank") return;
      e.preventDefault();
      document.body.style.transition = "opacity .45s ease, transform .45s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "translateY(-8px)";
      setTimeout(()=>{ window.location.href = href; }, 420);
    });
  });
}

/* Scroll-reveal for polaroids (alternating sides handled in HTML) */
function attachScrollReveal(selector = ".reveal"){
  const els = document.querySelectorAll(selector);
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((en)=>{
      if(en.isIntersecting){
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });
  els.forEach((el)=> io.observe(el));
}

/* Lightbox */
function attachLightbox(){
  const lb = document.getElementById("lightbox");
  if(!lb) return;

  const lbFrame = lb.querySelector(".lb-frame");
  const lbCap = lb.querySelector(".lb-cap");

  function closeLightbox(){
    const video = lbFrame.querySelector("video");
    if(video){
      video.pause();
      video.currentTime = 0;
    }
    lb.classList.remove("open");
  }

  document.querySelectorAll(".polaroid").forEach((p)=>{
    p.addEventListener("click", ()=>{
      const src = p.dataset.src;
      const media = p.dataset.media || "image";
      const cap = p.dataset.caption || "";

      if(src){
        lbFrame.style.background = "none";
        if(media === "video"){
          lbFrame.innerHTML = `<video src="${src}" controls autoplay playsinline><source src="${src}" type="video/mp4"></video>`;
        } else {
          lbFrame.innerHTML = `<img src="${src}" alt="${cap}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`;
        }
      } else {
        lbFrame.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem;color:#fff8e1;">🌻</div>`;
      }

      lbCap.textContent = cap;
      lb.classList.add("open");
    });
  });

  lb.addEventListener("click", (e)=>{
    if(e.target === lb || e.target.classList.contains("lb-close")) closeLightbox();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeLightbox();
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  attachBackgroundMusic();
  attachPageTransitions();
  attachScrollReveal();
  attachLightbox();
});
