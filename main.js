/* MoonXstudios — interactions & animations (vanilla JS, no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Split text into animated letters ---------- */
  $$("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.innerHTML = [...text]
      .map((c, i) => `<span class="ch" style="--i:${i}"><i>${c === " " ? "&nbsp;" : c}</i></span>`)
      .join("");
  });
  const thanksFill = $(".thanks__word--fill");
  if (thanksFill) {
    thanksFill.innerHTML = [...thanksFill.textContent]
      .map((c, i) => `<span class="ltr" style="--i:${i}">${c === " " ? "&nbsp;" : c}</span>`)
      .join("");
  }

  /* ---------- Detect which placeholder images actually exist ---------- */
  $$(".media").forEach((m) => {
    const match = (m.getAttribute("style") || "").match(/url\(['"]?([^'")]+)/);
    if (!match) return;
    const img = new Image();
    img.onload = () => m.classList.add("has-img");
    img.src = match[1];
  });

  /* ---------- Preloader ---------- */
  const loader = $(".loader");
  const bar = $(".loader__bar i");
  const count = $(".loader__count");
  let pct = 0;
  const finish = () => {
    loader.classList.add("done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("ready");
    $$(".hero .reveal-up").forEach((el, i) => {
      el.style.setProperty("--d", `${0.6 + i * 0.1}s`);
      el.classList.add("in");
    });
    scramble($(".scramble"));
  };
  if (reduced) {
    finish();
  } else {
    const tick = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 14 + 4);
      bar.style.width = pct + "%";
      count.textContent = Math.floor(pct);
      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(finish, 350);
      }
    }, 90);
  }

  /* ---------- Text scramble ---------- */
  function scramble(el) {
    if (!el || reduced) return;
    const final = el.dataset.scramble;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
    let frame = 0;
    const id = setInterval(() => {
      el.textContent = [...final]
        .map((c, i) => (i < frame / 3 ? c : chars[Math.floor(Math.random() * chars.length)]))
        .join("");
      if (++frame > final.length * 3) {
        clearInterval(id);
        el.textContent = final;
      }
    }, 40);
  }
  const scr = $(".scramble");
  if (scr) scr.addEventListener("mouseenter", () => scramble(scr));

  /* ---------- Scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (e.target.dataset.count !== undefined) countUp(e.target);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  // stagger siblings
  $$(".section, .thanks").forEach((sec) => {
    $$(".reveal-up", sec).forEach((el, i) => el.style.setProperty("--d", `${(i % 6) * 0.08}s`));
  });
  $$(".reveal-up, .reveal-mask, .reveal-scale, .reveal-clip, .section__head, .thanks, [data-count]")
    .filter((el) => !el.closest(".hero"))
    .forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  function countUp(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const dur = 1600;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    const ring = $(".cursor");
    const dot = $(".cursor-dot");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, .skill, .exp-card, .split .ch").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1), color .5s";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  /* ---------- 3D tilt ---------- */
  if (finePointer && !reduced) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Menu ---------- */
  const toggle = $(".nav__toggle");
  toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- Scroll-driven effects ---------- */
  const nav = $(".nav");
  const prog = $(".progress i");
  const heroTitle = $(".hero__title");
  const exp = $(".experience");
  const track = $(".experience__track");
  const expLine = $(".experience__line i");
  const parallax = $$(".parallax");
  const parallaxInner = $$(".parallax-inner");
  const thanksOutline = $(".thanks__word--outline");
  const thanksSec = $(".thanks");
  const navLinks = $$(".nav__links a");
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  const marqueeTrack = $(".marquee__track");
  const displays = $$(".section .display, .exp-intro .display");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  let lastY = scrollY;

  /* ---------- Inertial smooth scroll (mouse wheel / trackpad) ----------
     Wheel input sets a target; each frame the page eases toward it.
     Touch, keyboard and scrollbar keep native scrolling. */
  const smooth = { target: scrollY, current: scrollY, active: false, ease: 0.085 };
  const useSmooth = !reduced && finePointer;

  function smoothStep() {
    const diff = smooth.target - smooth.current;
    smooth.current += diff * smooth.ease;
    if (Math.abs(diff) < 0.5) {
      smooth.current = smooth.target;
      smooth.active = false;
    }
    window.scrollTo(0, smooth.current);
    if (smooth.active) requestAnimationFrame(smoothStep);
  }
  function smoothTo(y, ease = 0.085) {
    smooth.target = clamp(y, 0, maxScroll());
    smooth.ease = ease;
    if (!smooth.active) {
      smooth.active = true;
      smooth.current = scrollY;
      requestAnimationFrame(smoothStep);
    }
  }

  if (useSmooth) {
    document.documentElement.style.scrollBehavior = "auto";
    addEventListener("wheel", (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      e.preventDefault();
      if (document.body.classList.contains("is-loading") || document.body.classList.contains("menu-open")) return;
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 40;
      else if (e.deltaMode === 2) d *= innerHeight;
      smoothTo((smooth.active ? smooth.target : scrollY) + d, 0.085);
    }, { passive: false });
    // keyboard / scrollbar drags: resync so the next wheel starts from here
    addEventListener("scroll", () => {
      if (!smooth.active) smooth.target = smooth.current = scrollY;
    }, { passive: true });
  }

  /* ---------- Smooth anchor links ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = id === "#top" || id === "#" ? document.body : $(id);
      if (!el) return;
      e.preventDefault();
      document.body.classList.remove("menu-open");
      const y = el === document.body ? 0 : el.getBoundingClientRect().top + scrollY;
      if (useSmooth) smoothTo(y, 0.06);
      else scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      history.replaceState(null, "", id === "#" ? location.pathname : id);
    });
  });

  /* ---------- Per-frame scroll effects ---------- */
  let velocity = 0;      // eased scroll speed (px/frame)
  let marqueeX = 0;
  let marqueeDir = -1;
  let expX = 0;
  if (marqueeTrack && !reduced) marqueeTrack.style.animation = "none";

  function frame() {
    const y = scrollY;
    const delta = y - lastY;
    velocity += (delta - velocity) * 0.15;
    if (delta !== 0) marqueeDir = delta > 0 ? -1 : 1;

    const max = maxScroll();
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("is-scrolled", y > 40);
    if (delta > 1 && y > 300 && !document.body.classList.contains("menu-open")) nav.classList.add("is-hidden");
    else if (delta < -1 || y <= 300) nav.classList.remove("is-hidden");
    lastY = y;

    if (!reduced) effects(y);
    requestAnimationFrame(frame);
  }

  function effects(y) {
    // marquee speeds up with scroll and flips direction with it
    if (marqueeTrack) {
      const half = marqueeTrack.scrollWidth / 2;
      marqueeX += marqueeDir * (1 + Math.abs(velocity) * 0.6);
      if (marqueeX <= -half) marqueeX += half;
      if (marqueeX > 0) marqueeX -= half;
      const sk = clamp(velocity * 0.25, -8, 8);
      marqueeTrack.style.transform = `translate3d(${marqueeX}px,0,0) skewX(${-sk}deg)`;
    }

    // big headings lean slightly with scroll speed
    const skew = clamp(velocity * 0.08, -3, 3);
    displays.forEach((d) => (d.style.transform = `skewY(${skew.toFixed(2)}deg)`));

    // hero title drifts & fades
    if (y < innerHeight * 1.2) {
      heroTitle.style.transform = `translateY(${y * 0.35}px) scale(${1 - y * 0.0002})`;
      heroTitle.style.opacity = `${1 - y / (innerHeight * 0.9)}`;
    }

    // horizontal experience
    if (exp && innerWidth > 760) {
      const r = exp.getBoundingClientRect();
      const total = exp.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const dist = track.scrollWidth - innerWidth;
      expX += (-dist * p - expX) * 0.1; // eased so the slide glides instead of snapping
      track.style.transform = `translate3d(${expX.toFixed(2)}px,0,0)`;
      expLine.style.transform = `scaleX(${p})`;
    }

    // parallax
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      const s = +el.dataset.speed || -0.1;
      el.style.transform = `translateY(${(r.top - innerHeight / 2) * s}px)`;
    });
    parallaxInner.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.backgroundPosition = `center ${Math.min(30, Math.max(0, 10 + p * 25))}%`;
    });

    // THANK YOU outline wipe follows scroll
    if (thanksSec) {
      const r = thanksSec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - r.top / innerHeight));
      thanksOutline.style.clipPath = `inset(0 0 0 ${80 - p * 30}%)`;
    }

    // active nav link
    let active = -1;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4) active = i;
    });
    navLinks.forEach((a, i) => a.classList.toggle("is-active", i === active));
  }

  requestAnimationFrame(frame);

  $("#year").textContent = new Date().getFullYear();
})();
