(() => {
  const S = window.OUR_STORY;
  const N = S.memories.length;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const HEART_PATH = "M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.5h2c.7-1.3 2.2-2.5 4.3-2.5 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z";

  /* ---------- Saved progress ---------- */
  const STORE_KEY = "three-years-found";
  const store = {
    load() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch { return []; }
    },
    save(list) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch { /* private mode */ }
    }
  };
  const params = new URLSearchParams(location.search);
  const found = new Set(
    params.has("all") ? S.memories.map((_, i) => i) : store.load().filter(i => i >= 0 && i < N)
  );
  let celebrated = found.size === N;

  /* ---------- Names and text ---------- */
  $$("[data-me]").forEach(el => (el.textContent = S.me));
  $$("[data-her]").forEach(el => (el.textContent = S.her));
  $("[data-total]").textContent = N;

  // Split the title into letters for the opening animation.
  let charIndex = 0;
  $$("[data-split]").forEach(line => {
    const text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    text.split(" ").forEach((word, w) => {
      if (w > 0) line.appendChild(document.createTextNode(" "));
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      for (const ch of word) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        span.style.setProperty("--i", charIndex++);
        wordEl.appendChild(span);
      }
      line.appendChild(wordEl);
    });
  });

  /* ---------- Time together ---------- */
  const start = new Date(S.together).getTime();
  const sinceEl = $("[data-since]");
  const plural = (n, word) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;
  function tick() {
    let diff = Math.max(0, Date.now() - start) / 1000;
    const days = Math.floor(diff / 86400); diff -= days * 86400;
    const hours = Math.floor(diff / 3600); diff -= hours * 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff - minutes * 60);
    sinceEl.textContent = `${plural(days, "day")}, ${plural(hours, "hour")}, ${plural(minutes, "minute")} and ${plural(seconds, "second")}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Placeholder for missing photos ---------- */
  function placeholder(i, label) {
    const hues = [[340, 30], [265, 320], [20, 340], [200, 270], [300, 20], [45, 330]];
    const [a, b] = hues[i % hues.length];
    const safe = String(label).replace(/[<>&"]/g, "");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='hsl(${a},55%,78%)'/><stop offset='1' stop-color='hsl(${b},50%,62%)'/>
      </linearGradient></defs>
      <rect width='400' height='400' fill='url(#g)'/>
      <path transform='translate(152 130) scale(4)' fill='rgba(255,255,255,.55)' d='${HEART_PATH}'/>
      <text x='200' y='300' text-anchor='middle' font-family='sans-serif' font-size='20' fill='rgba(42,36,64,.6)'>${safe}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function setPhoto(img, src, i, label, alt) {
    img.alt = alt;
    img.onerror = () => { img.onerror = null; img.src = placeholder(i, label); };
    img.src = src || placeholder(i, label);
  }

  /* ---------- Night sky canvas ---------- */
  const canvas = $("#sky");
  const ctx = canvas.getContext("2d");
  let skyStars = [];
  let shooting = null;
  let pointer = { x: 0, y: 0 };
  let dpr = 1;

  function sizeSky() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    const count = Math.round((innerWidth * innerHeight) / 2600);
    skyStars = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.2 + 0.25,
      depth: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5
    }));
    if (reduceMotion) drawSky(0);
  }

  function drawSky(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const scroll = scrollY;
    for (const s of skyStars) {
      const px = s.x + pointer.x * s.depth * 14;
      let py = s.y + pointer.y * s.depth * 14 - scroll * s.depth * 0.15;
      py = ((py % innerHeight) + innerHeight) % innerHeight;
      const alpha = reduceMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fff4d6";
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (shooting) {
      const p = (t - shooting.t0) / shooting.dur;
      if (p >= 1) shooting = null;
      else {
        const x = shooting.x + shooting.dx * p;
        const y = shooting.y + shooting.dy * p;
        const grad = ctx.createLinearGradient(x, y, x - shooting.dx * 0.18, y - shooting.dy * 0.18);
        grad.addColorStop(0, "rgba(255,244,214,0.9)");
        grad.addColorStop(1, "rgba(255,244,214,0)");
        ctx.globalAlpha = Math.sin(p * Math.PI);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - shooting.dx * 0.18, y - shooting.dy * 0.18);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function skyLoop(t) {
    if (!shooting && Math.random() < 0.0018) {
      const fromLeft = Math.random() < 0.5;
      shooting = {
        t0: t, dur: 900 + Math.random() * 500,
        x: Math.random() * innerWidth * 0.6 + (fromLeft ? 0 : innerWidth * 0.4),
        y: Math.random() * innerHeight * 0.4,
        dx: (fromLeft ? 1 : -1) * (260 + Math.random() * 200),
        dy: 140 + Math.random() * 120
      };
    }
    drawSky(t);
    requestAnimationFrame(skyLoop);
  }

  function fadeSky() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    canvas.style.opacity = String(Math.max(0, 1 - p * 1.25));
  }

  sizeSky();
  fadeSky();
  addEventListener("resize", sizeSky);
  addEventListener("scroll", () => { fadeSky(); if (reduceMotion) drawSky(0); }, { passive: true });
  if (!reduceMotion) {
    addEventListener("pointermove", e => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    }, { passive: true });
    requestAnimationFrame(skyLoop);
  }

  /* ---------- Constellation ---------- */
  const constellation = $("#constellation");
  const svg = $(".lines", constellation);
  const heartFill = $(".heart-fill", svg);

  // Points spaced evenly along a heart curve, nudged a little so it looks hand-placed.
  function heartPoints(n) {
    const curve = t => ({
      x: 16 * Math.sin(t) ** 3,
      y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    });
    const steps = 1000;
    const dense = [];
    const lengths = [0];
    for (let k = 0; k <= steps; k++) {
      dense.push(curve((k / steps) * Math.PI * 2));
      if (k > 0) {
        const a = dense[k - 1], b = dense[k];
        lengths.push(lengths[k - 1] + Math.hypot(b.x - a.x, b.y - a.y));
      }
    }
    const total = lengths[steps];
    const ys = dense.map(p => p.y);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const seeded = k => (Math.sin(k * 12.9898 + 4.1) * 43758.5453) % 1;
    const out = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const target = (k / n) * total;
      while (lengths[j] < target) j++;
      const p = dense[j];
      out.push({
        x: 50 + (p.x / 16) * 40 + seeded(k) * 1.8,
        y: 10 + ((yMax - p.y) / (yMax - yMin)) * 80 + seeded(k + 7) * 1.8
      });
    }
    return out;
  }

  const points = heartPoints(N);
  heartFill.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));

  const lines = points.map((p, i) => {
    const q = points[(i + 1) % N];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p.x); line.setAttribute("y1", p.y);
    line.setAttribute("x2", q.x); line.setAttribute("y2", q.y);
    line.setAttribute("pathLength", "1");
    svg.appendChild(line);
    return line;
  });

  const stars = points.map((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "star";
    btn.style.left = p.x + "%";
    btn.style.top = p.y + "%";
    btn.style.setProperty("--i", i);
    btn.innerHTML = `<span class="star-core"></span><span class="star-label"></span>`;
    btn.addEventListener("click", () => openMemory(i, btn));
    constellation.appendChild(btn);
    return btn;
  });

  function render() {
    stars.forEach((btn, i) => {
      const isFound = found.has(i);
      btn.classList.toggle("found", isFound);
      $(".star-label", btn).textContent = isFound ? S.memories[i].title : "";
      btn.setAttribute("aria-label", isFound ? `Open memory: ${S.memories[i].title}` : `Hidden memory ${i + 1}`);
    });
    lines.forEach((line, i) => {
      line.classList.toggle("drawn", found.has(i) && found.has((i + 1) % N));
    });
    $("[data-found]").textContent = found.size;
    $("[data-progress-fill]").style.width = (found.size / N) * 100 + "%";
    $("[data-hint]").hidden = found.size === N;
    constellation.classList.toggle("complete", found.size === N);
    renderLock();
  }

  function markFound(i) {
    if (found.has(i)) return;
    found.add(i);
    store.save([...found]);
    const btn = stars[i];
    btn.classList.add("just-found");
    setTimeout(() => btn.classList.remove("just-found"), 1100);
    render();
    if (found.size === N && !celebrated) {
      celebrated = true;
      setTimeout(celebrate, 900);
    } else if (found.size === 1) {
      toast("One down. Keep looking, there are more hiding up there.");
    }
  }

  // Hints
  function hint() {
    const hidden = stars.filter((_, i) => !found.has(i));
    if (!hidden.length) return;
    const btn = hidden[Math.floor(Math.random() * hidden.length)];
    btn.classList.remove("hinting");
    void btn.offsetWidth;
    btn.classList.add("hinting");
    setTimeout(() => btn.classList.remove("hinting"), 3700);
  }
  $("[data-hint]").addEventListener("click", hint);
  if (found.size === 0) setTimeout(() => { if (found.size === 0) hint(); }, reduceMotion ? 1500 : 4200);

  function celebrate() {
    toast("You found every memory. Keep scrolling, there's a letter waiting at the bottom.", 6000);
    if (reduceMotion) return;
    const colors = ["#f4b3c2", "#f6c56a", "#fff4d6", "#e58f8f"];
    for (let k = 0; k < 42; k++) {
      const bit = document.createElement("span");
      bit.className = "heart-bit";
      bit.style.color = colors[k % colors.length];
      bit.innerHTML = `<svg viewBox="0 0 24 24"><path d="${HEART_PATH}"/></svg>`;
      constellation.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 260;
      const size = 0.6 + Math.random() * 1.2;
      bit.animate([
        { transform: `translate(0,0) scale(0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${Math.cos(angle) * dist * 0.7}px, ${Math.sin(angle) * dist * 0.7}px) scale(${size}) rotate(${Math.random() * 90 - 45}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 80}px) scale(${size * 0.8}) rotate(${Math.random() * 180 - 90}deg)`, opacity: 0 }
      ], { duration: 1600 + Math.random() * 900, easing: "cubic-bezier(.2,.8,.3,1)", delay: Math.random() * 200 })
        .finished.then(() => bit.remove());
    }
  }

  /* ---------- Memory dialog ---------- */
  const dialog = $("[data-memory]");
  const card = $("[data-memory-card]");
  const polaroid = $("[data-polaroid]");
  const textBox = $(".memory-text", dialog);
  const prevBtn = $("[data-memory-prev]");
  const nextBtn = $("[data-memory-next]");
  let current = -1;
  let originEl = null;
  let closing = false;

  function fillMemory(i) {
    const m = S.memories[i];
    setPhoto($("[data-memory-img]"), m.photo, i, m.title, m.title);
    $("[data-memory-note]").textContent = m.note || "";
    $("[data-memory-title]").textContent = m.title;
    $("[data-memory-meta]").textContent = [m.when, m.where].filter(Boolean).join(", ");
    $("[data-memory-story]").textContent = m.story || "";
    const viewed = viewable();
    const many = viewed.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  // She can flip between memories she's already opened, plus the one in front of her.
  function viewable() {
    return [...new Set([...found, current])].filter(i => i >= 0).sort((a, b) => a - b);
  }

  function flyFrom(el) {
    const from = el.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = Math.max(0.04, 40 / to.width);
    return `translate(${dx}px, ${dy}px) scale(${s}) rotate(-14deg)`;
  }

  function openMemory(i, el) {
    if (dialog.open) return;
    current = i;
    originEl = el;
    fillMemory(i);
    dialog.classList.remove("closing");
    dialog.showModal();
    $("[data-memory-close]").focus({ preventScroll: true });
    if (reduceMotion) return;
    card.animate(
      [{ transform: flyFrom(el), opacity: 0, offset: 0 }, { opacity: 1, offset: 0.25 }, { transform: "none", opacity: 1 }],
      { duration: 700, easing: "cubic-bezier(.2,.9,.25,1.08)" }
    );
  }

  async function closeMemory() {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.add("closing");
    const target = stars[current] || originEl;
    if (!reduceMotion && target) {
      await card.animate(
        [{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.7 }, { transform: flyFrom(target), opacity: 0 }],
        { duration: 520, easing: "cubic-bezier(.55,0,.75,.3)" }
      ).finished;
    }
    dialog.close();
    closing = false;
    const justSeen = current;
    current = -1;
    markFound(justSeen);
  }

  function step(dir) {
    const list = viewable();
    const at = list.indexOf(current);
    const next = list[(at + dir + list.length) % list.length];
    if (next === current) return;
    markFoundQuietly(current);
    current = next;
    fillMemory(next);
    textBox.style.setProperty("--from", dir > 0 ? "18px" : "-18px");
    textBox.classList.remove("swap"); void textBox.offsetWidth; textBox.classList.add("swap");
    if (!reduceMotion) {
      polaroid.animate(
        [{ transform: `translateX(${dir * -30}px) rotate(${dir * -6}deg)`, opacity: 0 }, { transform: "rotate(-2.5deg)", opacity: 1 }],
        { duration: 500, easing: "cubic-bezier(.2,.9,.25,1.1)" }
      );
    }
  }
  // Flipping away from a memory counts it as found without the full close celebration.
  function markFoundQuietly(i) {
    if (i < 0 || found.has(i)) return;
    found.add(i);
    store.save([...found]);
    render();
  }

  $("[data-memory-close]").addEventListener("click", closeMemory);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  dialog.addEventListener("cancel", e => { e.preventDefault(); closeMemory(); });
  dialog.addEventListener("click", e => { if (e.target === dialog) closeMemory(); });
  dialog.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" && !nextBtn.hidden) step(1);
    if (e.key === "ArrowLeft" && !prevBtn.hidden) step(-1);
  });

  // Polaroid tilts toward the pointer.
  if (!reduceMotion) {
    polaroid.addEventListener("pointermove", e => {
      const r = polaroid.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      polaroid.classList.add("tilting");
      polaroid.style.setProperty("--ry", `${x * 14}deg`);
      polaroid.style.setProperty("--rx", `${y * -14}deg`);
    });
    polaroid.addEventListener("pointerleave", () => {
      polaroid.classList.remove("tilting");
      polaroid.style.setProperty("--ry", "0deg");
      polaroid.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- Timeline ---------- */
  const timeline = $("[data-timeline]");
  S.chapters.forEach((c, i) => {
    const photos = (c.photos || (c.photo ? [c.photo] : [])).slice(0, 3);
    const li = document.createElement("li");
    li.className = "chapter";
    li.innerHTML = `
      <div>
        <p class="chapter-when"></p>
        <h3></h3>
        <p class="chapter-text"></p>
      </div>`;
    $(".chapter-when", li).textContent = c.when;
    $("h3", li).textContent = c.title;
    $(".chapter-text", li).textContent = c.text;
    if (photos.length) li.appendChild(photoStack(photos, i, c.title));
    timeline.appendChild(li);
  });

  // A small fanned pile of polaroids. Tapping it sends the top one to the back.
  function photoStack(photos, chapterIndex, label) {
    const stack = document.createElement(photos.length > 1 ? "button" : "div");
    stack.className = "photo-stack";
    stack.style.setProperty("--tilt", `${chapterIndex % 2 ? -3 : 3}deg`);
    if (photos.length > 1) {
      stack.type = "button";
      stack.setAttribute("aria-label", `${label}: show the next photo`);
    }
    const cards = photos.map((src, k) => {
      const fig = document.createElement("span");
      fig.className = "chapter-photo";
      fig.innerHTML = `<img loading="lazy">`;
      setPhoto($("img", fig), src, chapterIndex + k + 2, label, `${label}, photo ${k + 1}`);
      stack.appendChild(fig);
      return fig;
    });
    let order = cards.map((_, k) => k);
    const place = () => order.forEach((k, depth) => {
      cards[k].style.setProperty("--depth", depth);
      cards[k].style.zIndex = String(10 - depth);
    });
    place();
    if (photos.length > 1) {
      stack.addEventListener("click", () => {
        const top = cards[order[0]];
        top.classList.add("leaving");
        setTimeout(() => {
          top.classList.remove("leaving");
          order.push(order.shift());
          place();
        }, reduceMotion ? 0 : 280);
      });
    }
    return stack;
  }
  const chapters = $$(".chapter", timeline);

  function updateTimeline() {
    const r = timeline.getBoundingClientRect();
    const line = innerHeight * 0.62;
    const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
    timeline.style.setProperty("--progress", p.toFixed(4));
    chapters.forEach(ch => ch.classList.toggle("lit", ch.getBoundingClientRect().top + 10 < line));
  }
  addEventListener("scroll", updateTimeline, { passive: true });
  addEventListener("resize", updateTimeline);
  updateTimeline();

  /* ---------- Card deck ---------- */
  const deck = $("[data-deck]");
  const deckCount = $("[data-deck-count]");
  const cardColors = ["#fbf5ec", "#f9d9df", "#fbe6bf", "#e6dcf5", "#fde3d6"];
  let order = S.littleThings.map((_, i) => i);
  let seen = 1;
  const cardEls = S.littleThings.map((item, i) => {
    const { text, photo, focus } = typeof item === "string" ? { text: item } : item;
    const el = document.createElement("div");
    el.className = "thing-card" + (photo ? " has-photo" : "");
    el.style.setProperty("--card-bg", cardColors[i % cardColors.length]);
    el.innerHTML = `${photo ? `<div class="card-photo-wrap"><img class="card-photo" loading="lazy" draggable="false"></div>` : ""}<div class="card-caption"><span class="card-text"></span><svg class="card-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART_PATH}"/></svg></div>`;
    $(".card-text", el).textContent = text;
    if (photo) setPhoto($(".card-photo", el), photo, i, "", text);
    // Optional framing for tall photos, e.g. "center 20%" keeps faces near the top in view.
    if (photo && focus) $(".card-photo", el).style.objectPosition = focus;
    deck.appendChild(el);
    return el;
  });

  function layoutDeck() {
    order.forEach((idx, depth) => {
      const el = cardEls[idx];
      el.classList.toggle("top", depth === 0);
      el.setAttribute("aria-hidden", depth === 0 ? "false" : "true");
      el.style.zIndex = String(100 - depth);
      const visible = depth < 4;
      const rot = depth === 0 ? -1.5 : [0, 4, -5, 7][depth] || 0;
      el.style.opacity = visible ? "1" : "0";
      el.style.transform = `translateY(${depth * 10}px) scale(${1 - depth * 0.04}) rotate(${rot}deg)`;
    });
    deckCount.textContent = `${seen} of ${order.length}`;
  }

  function tossTop(dirX, fromX = 0, fromY = 0) {
    const el = cardEls[order[0]];
    const flyX = dirX * (innerWidth * 0.7 + 200);
    el.classList.add("dragging");
    const anim = el.animate(
      [
        { transform: `translate(${fromX}px, ${fromY}px) rotate(${fromX * 0.06}deg)` },
        { transform: `translate(${flyX}px, ${fromY + 60}px) rotate(${dirX * 35}deg)`, opacity: 0 }
      ],
      { duration: reduceMotion ? 1 : 450, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" }
    );
    anim.finished.then(() => {
      el.classList.remove("dragging");
      order.push(order.shift());
      seen = seen % order.length + 1;
      // Bring it back in at the bottom of the pile without a visible jump.
      el.style.transition = "none";
      layoutDeck();
      el.style.opacity = "0";
      anim.cancel();
      void el.offsetWidth;
      requestAnimationFrame(() => {
        el.style.transition = "";
        layoutDeck();
      });
    });
  }

  let drag = null;
  deck.addEventListener("pointerdown", e => {
    const el = e.target.closest(".thing-card.top");
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
    drag = { el, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, t: performance.now(), lastX: e.clientX, v: 0 };
  });
  deck.addEventListener("pointermove", e => {
    if (!drag) return;
    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.t);
    drag.t = now;
    drag.lastX = e.clientX;
    drag.dx = e.clientX - drag.x0;
    drag.dy = (e.clientY - drag.y0) * 0.4;
    drag.el.style.transform = `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx * 0.06}deg)`;
  });
  function endDrag() {
    if (!drag) return;
    const { el, dx, dy, v } = drag;
    drag = null;
    if (Math.abs(dx) > 110 || Math.abs(v) > 0.6) {
      tossTop(Math.sign(dx || v), dx, dy);
    } else {
      el.classList.remove("dragging");
      layoutDeck();
    }
  }
  deck.addEventListener("pointerup", endDrag);
  deck.addEventListener("pointercancel", endDrag);
  $("[data-deck-next]").addEventListener("click", () => tossTop(1));
  layoutDeck();

  /* ---------- Letter ---------- */
  const sealBtn = $("[data-open-letter]");
  const lockMsg = $("[data-lock-msg]");
  const envelope = $("[data-envelope]");
  const envelopeWrap = $("[data-envelope-wrap]");
  const letter = $("[data-letter]");

  $("[data-letter-greeting]").textContent = S.letter.greeting;
  $("[data-letter-signoff]").textContent = S.letter.signoff;
  const body = $("[data-letter-body]");
  S.letter.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
  });

  function renderLock() {
    const left = N - found.size;
    const unlocked = left === 0;
    sealBtn.disabled = !unlocked;
    if (!letter.hidden) return;
    lockMsg.textContent = unlocked
      ? "Fine... you can open this now. Tap the seal."
      : `This opens once you've found every star. ${left === 1 ? "Just 1 more to go" : `${left} more to go`}.`;
  }

  sealBtn.addEventListener("click", () => {
    if (sealBtn.disabled) return;
    envelope.classList.add("open");
    lockMsg.textContent = "";
    setTimeout(() => {
      envelopeWrap.classList.add("gone");
      setTimeout(() => {
        envelopeWrap.hidden = true;
        letter.hidden = false;
        letter.classList.add("show");
        letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }, reduceMotion ? 0 : 600);
    }, reduceMotion ? 0 : 1500);
  });

  /* ---------- Reset ---------- */
  $("[data-reset]").addEventListener("click", () => {
    found.clear();
    store.save([]);
    celebrated = false;
    letter.hidden = true;
    letter.classList.remove("show");
    envelopeWrap.hidden = false;
    envelopeWrap.classList.remove("gone");
    envelope.classList.remove("open");
    render();
    scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    toast("The stars are hidden again.");
  });

  /* ---------- Toast ---------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(msg, ms = 3800) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  render();
})();
