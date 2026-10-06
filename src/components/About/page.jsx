'use client';



import { useEffect, useRef, useMemo } from 'react';
import { Inter_Tight } from 'next/font/google';

const inter = Inter_Tight({ subsets: ['latin'], display: 'swap' });

/* ------------------------------------------------------------------ */
/*  CONTENT                                                             */
/* ------------------------------------------------------------------ */
const VIDEO_SRC = '/assets/sample3.jpg';
const IMG_TRAY = '/assets/sample2.jpg';
const IMG_BALL = '/assets/sample1.png';

const CENTER_LINES = [
    'I bring clarity to',
    'complex digital ideas',
    'turning systems into',
    'seamless experiences',
    'crafted with intent.'
];

const BLOCK_LINES = [
    'interface systems',
    'product strategy',
    'visual identity',
    'clean user flows'
];

// position of each floating block in % of the viewport
const BLOCKS = [
    { x: 27.2, y: 19.8 },
    { x: 9.5, y: 34.8 },
    { x: 18.9, y: 58.3 },
    { x: 74.9, y: 27.6 },
    { x: 79.3, y: 60.0 },
];

const LINKS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karan-malkar-75579a3b4?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { label: 'GitHub', href: 'https://github.com/karanmalkar' },
    { label: 'Resume', href: '/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf' },
];

/* ------------------------------------------------------------------ */
/*  TIMELINE (u = scroll distance in viewport heights, once pinned)     */
/* ------------------------------------------------------------------ */
const BAND = 6; // black band above the video (vh)
const PIN = 1.75; // how long the section stays pinned (vh of scroll)
const VIDEO_H = 190; // height of the travelling video (vh)
const VIDEO_RATE = 0.45; // video travel per vh of scroll
const SCATTER_FROM = 0.22; // characters start leaving here
const DECODE_FROM = 0.35; // centre copy starts decoding
const DECODE_SPAN = 0.45;
const IMG_START = 0.65; // images enter from the bottom
const TRAY = { left: 24.5, w: 28.6, ratio: 1.22, rate: 1.25 }; // rate = vh travelled per vh scrolled
const BALL = { left: 62.3, w: 13.6, ratio: 0.73, rate: 1.55 };

const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@§è!?.:;(ŭ';
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
};

function mulberry32(seed) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* deterministic per-character data (same on server and client) */
function buildBlocks() {
    const rng = mulberry32(21);
    return BLOCKS.map((b) => ({
        ...b,
        lines: BLOCK_LINES.map((ln, li) => {
            const chars = [...ln];
            return chars.map((ch, ci) => ({
                ch,
                ci,
                len: chars.length,
                li,
                th: SCATTER_FROM + rng() * 0.8,
                dur: 0.35 + rng() * 0.3,
                dx: (rng() - 0.5) * 150,
                dy: 40 + rng() * 280,
                rot: (rng() - 0.5) * 80,
                glitch: 0.04 + rng() * 0.08,
            }));
        }),
    }));
}

function buildCenter() {
    const rng = mulberry32(5);
    const total = CENTER_LINES.join('').length;
    let n = 0;
    return CENTER_LINES.map((ln) =>
        [...ln].map((ch) => {
            const r = DECODE_FROM + (n++ / total) * DECODE_SPAN + rng() * 0.14;
            return { ch, r };
        })
    );
}

/* ------------------------------------------------------------------ */
/*  Placeholder media (replaced by VIDEO_SRC / IMG_*)                    */
/* ------------------------------------------------------------------ */
function ElevatorPlaceholder() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample3.jpg"
                alt="Background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                }}
            />
        </div>
    );
}

function TrayPlaceholder() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample2.jpg"
                alt="Sample 2"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
        </div>
    );
}

function BallPlaceholder() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample1.png"
                alt="Sample 1"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function AboutSection() {
    const rootRef = useRef(null);
    const trackRef = useRef(null);
    const videoRef = useRef(null);
    const dimRef = useRef(null);
    const centerRef = useRef(null);
    const trayRef = useRef(null);
    const ballRef = useRef(null);
    const scatterRef = useRef(null);

    const blocks = useMemo(buildBlocks, []);
    const center = useMemo(buildCenter, []);

    useEffect(() => {
        const track = trackRef.current;
        const video = videoRef.current;
        const dim = dimRef.current;
        const cen = centerRef.current;
        const tray = trayRef.current;
        const ball = ballRef.current;
        const sc = scatterRef.current;
        if (!track) return;

        // flatten char data + their elements (same order as render)
        const flat = blocks.flatMap((b) => b.lines.flat());
        const scEls = sc.querySelectorAll('[data-sc]');
        const cFlat = center.flat();
        const ccEls = cen.querySelectorAll('[data-cc]');

        const sCache = flat.map((c) => ({ t: c.ch, tr: '', op: '1' }));
        const cCache = cFlat.map((c) => ({ t: c.ch, op: '0' }));

        let raf = 0;
        let sm = null;
        let last = performance.now();
        let lastFk = -1;
        let lastScrollStep = -1;
        let isScrolling = false;
        let scrollTimer = null;

        const onScroll = () => {
            isScrolling = true;
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling = false;
            }, 100);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(64, now - last);
            last = now;
            const vh = window.innerHeight;

            const target = Math.max(0, -track.getBoundingClientRect().top);
            if (sm === null) sm = target;
            sm += (target - sm) * (1 - Math.pow(1 - 0.16, dt / 16.667));
            if (Math.abs(target - sm) < 0.05) sm = target;
            const u = Math.min(sm / vh, PIN); // pinned scroll in vh

            // Track active scroll motion
            const scrollStep = Math.floor(sm / 6);
            const scrollMoved = scrollStep !== lastScrollStep;
            lastScrollStep = scrollStep;

            const isMoving = isScrolling || Math.abs(target - sm) > 0.08 || scrollMoved;

            const fk = Math.floor(now / 90);
            const flick = isMoving && (fk !== lastFk || scrollMoved);
            lastFk = fk;

            /* video travel + darkness */
            if (video) video.style.transform = `translate3d(0,${-u * VIDEO_RATE * vh}px,0)`;
            if (dim) {
                const d = 0.93 * smooth(0.25, 0.75, u) + 0.07 * smooth(0.75, 1.6, u);
                dim.style.opacity = d.toFixed(3);
            }

            /* scattering characters */
            for (let i = 0; i < flat.length; i++) {
                const c = flat[i];
                if (c.ch === ' ') continue;
                const el = scEls[i];
                const cache = sCache[i];
                const q = clamp((u - c.th) / c.dur, 0, 1);

                let txt = cache.t;
                let tr = '';
                let op = '1';

                if (u <= 0.01) {
                    txt = c.ch;
                    tr = '';
                    op = '1';
                } else if (q <= 0) {
                    if (isMoving && flick) {
                        const scrollIntensity = Math.min(1, u / SCATTER_FROM);
                        txt = Math.random() < c.glitch * scrollIntensity * 4 ? glyph() : c.ch;
                    } else {
                        txt = cache.t;
                    }
                } else {
                    if (isMoving && flick) {
                        txt = q < 0.6 && Math.random() < 0.55 ? glyph() : c.ch;
                    } else {
                        txt = cache.t;
                    }
                    const e = q * q;
                    const spread = (c.ci - c.len / 2) * q * 7;
                    tr = `translate3d(${(c.dx * q + spread).toFixed(1)}px,${(c.dy * e).toFixed(1)}px,0) rotate(${(c.rot * q).toFixed(1)}deg)`;
                    op = q < 0.2 ? '1' : Math.max(0, 1 - Math.pow((q - 0.2) / 0.8, 0.8)).toFixed(3);
                }

                if (txt !== cache.t) {
                    el.textContent = txt;
                    cache.t = txt;
                }
                if (tr !== cache.tr) {
                    el.style.transform = tr;
                    cache.tr = tr;
                }
                if (op !== cache.op) {
                    el.style.opacity = op;
                    cache.op = op;
                }
            }

            /* centre copy: decode */
            let ci = 0;
            for (let i = 0; i < cFlat.length; i++) {
                const c = cFlat[i];
                if (c.ch === ' ') continue;
                const el = ccEls[i];
                const cache = cCache[i];
                let txt = cache.t;
                let op = '1';
                if (u < c.r - 0.14) {
                    op = '0';
                    txt = c.ch;
                } else if (u < c.r) {
                    if (isMoving && flick) {
                        txt = glyph();
                    } else {
                        txt = cache.t === c.ch ? glyph() : cache.t;
                    }
                } else {
                    txt = c.ch;
                }
                if (txt !== cache.t) {
                    el.textContent = txt;
                    cache.t = txt;
                }
                if (op !== cache.op) {
                    el.style.opacity = op;
                    cache.op = op;
                }
                ci++;
            }
            // centre copy drifts up and fades once the images have passed
            const out = smooth(1.15, 1.65, sm / vh);
            cen.style.transform = `translate3d(0,${(-out * 0.22 * vh).toFixed(1)}px,0)`;
            cen.style.opacity = (1 - out).toFixed(3);

            /* rising images (parallax) */
            const yT = (1.02 - TRAY.rate * (u - IMG_START)) * vh;
            const yB = (1.02 - BALL.rate * (u - IMG_START)) * vh;
            tray.style.transform = `translate3d(0,${yT.toFixed(1)}px,0)`;
            ball.style.transform = `translate3d(0,${yB.toFixed(1)}px,0)`;
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, [blocks, center]);

    return (
        <div
            id="about"
            ref={rootRef}
            className={inter.className}
            style={{ background: '#000', color: '#fff', WebkitFontSmoothing: 'antialiased', overflowX: 'clip' }}
        >
            {/* thin black band (scrolls away) */}
            <div style={{ height: `${BAND}vh`, background: '#000' }} />

            {/* pinned track */}
            <div ref={trackRef} style={{ position: 'relative', height: `${(1 + PIN) * 100}vh` }}>
                <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#000', zIndex: 1 }}>
                    {/* tall video, travels up with scroll */}
                    <div
                        ref={videoRef}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: `${VIDEO_H}vh`,
                            willChange: 'transform',
                            background: '#46555a',
                        }}
                    >
                        {VIDEO_SRC ? (
                            VIDEO_SRC.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video
                                    src={VIDEO_SRC}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={VIDEO_SRC}
                                    alt="Background"
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                                />
                            )
                        ) : (
                            <ElevatorPlaceholder />
                        )}
                    </div>

                    {/* darkening */}
                    <div ref={dimRef} style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }} />

                    {/* floating glitch blocks */}
                    <div ref={scatterRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        {blocks.map((b, bi) => (
                            <div
                                key={bi}
                                style={{
                                    position: 'absolute',
                                    left: `${b.x}%`,
                                    top: `${b.y}%`,
                                    fontSize: 'clamp(11px,1.07vw,20px)',
                                    lineHeight: 1.04,
                                    fontWeight: 400,
                                    letterSpacing: '-0.01em',
                                    whiteSpace: 'pre',
                                }}
                            >
                                {b.lines.map((line, li) => (
                                    <div key={li}>
                                        {line.map((c, ci) => (
                                            <span
                                                key={ci}
                                                data-sc=""
                                                style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform, opacity' }}
                                            >
                                                {c.ch}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* centre copy (decodes in) */}
                    <p
                        ref={centerRef}
                        style={{
                            position: 'absolute',
                            left: '46%',
                            top: '29.3%',
                            margin: 0,
                            fontSize: 'clamp(11px,1.14vw,22px)',
                            lineHeight: 1.03,
                            fontWeight: 400,
                            letterSpacing: '-0.012em',
                            whiteSpace: 'pre',
                            willChange: 'transform, opacity',
                        }}
                    >
                        {center.map((line, li) => (
                            <span key={li} style={{ display: 'block' }}>
                                {line.map((c, ci) => (
                                    <span key={ci} data-cc="" style={{ opacity: 0, whiteSpace: 'pre' }}>
                                        {c.ch}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </p>

                    {/* rising images */}
                    <div
                        ref={trayRef}
                        style={{
                            position: 'absolute',
                            left: `${TRAY.left}vw`,
                            top: 0,
                            width: `${TRAY.w}vw`,
                            aspectRatio: String(TRAY.ratio),
                            transform: 'translate3d(0,110vh,0)',
                            willChange: 'transform',
                            overflow: 'hidden',
                        }}
                    >
                        {IMG_TRAY ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={IMG_TRAY} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <TrayPlaceholder />
                        )}
                    </div>
                    <div
                        ref={ballRef}
                        style={{
                            position: 'absolute',
                            left: `${BALL.left}vw`,
                            top: 0,
                            width: `${BALL.w}vw`,
                            aspectRatio: String(BALL.ratio),
                            transform: 'translate3d(0,110vh,0)',
                            willChange: 'transform',
                            overflow: 'hidden',
                        }}
                    >
                        {IMG_BALL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={IMG_BALL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <BallPlaceholder />
                        )}
                    </div>
                </div>
            </div>

            {/* Narrative & Experience Breakdown */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    background: '#07080a',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: 'clamp(50px, 6vw, 100px) clamp(20px, 7vw, 120px)',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header statement */}
                    <div style={{ maxWidth: '820px', marginBottom: 'clamp(40px, 5vw, 70px)' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: 'clamp(11px, 0.9vw, 14px)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#a1a1aa',
                                marginBottom: '14px',
                            }}
                        >
                            About Karan Malkar
                        </span>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'clamp(28px, 3.4vw, 54px)',
                                fontWeight: 500,
                                lineHeight: 1.15,
                                letterSpacing: '-0.03em',
                                color: '#f4f4f5',
                            }}
                        >
                            Where ideas become systems.
                        </h2>
                        <p
                            style={{
                                margin: '20px 0 0 0',
                                fontSize: 'clamp(15px, 1.25vw, 20px)',
                                lineHeight: 1.6,
                                color: '#a1a1aa',
                                fontWeight: 400,
                            }}
                        >
                            I’m Karan, a UI/UX and graphic designer who enjoys turning complex products into experiences that feel simple, useful and visually considered. My work balances product thinking with a strong visual eye—moving between research, flows, interface systems, prototyping and the details that give a brand character.
                        </p>
                    </div>

                    {/* 2-column Grid: Experience & Process */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: 'clamp(30px, 4vw, 60px)',
                            paddingTop: '30px',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        {/* Experience Column */}
                        <div>
                            <h3
                                style={{
                                    fontSize: 'clamp(13px, 1vw, 16px)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#71717a',
                                    marginBottom: '28px',
                                }}
                            >
                                Experience & Practice
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ borderLeft: '2px solid #6366f1', paddingLeft: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                                        <h4 style={{ margin: 0, fontSize: 'clamp(18px, 1.3vw, 22px)', fontWeight: 600, color: '#fff' }}>
                                            UI/UX Designer
                                        </h4>
                                        <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 500 }}>2026 — Present</span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '4px' }}>Masterstroke</div>
                                    <p style={{ margin: '10px 0 0 0', fontSize: '14px', lineHeight: 1.6, color: '#94a3b8' }}>
                                        Working on live product and client design work, translating requirements into wireframes, prototypes, and developer-ready designs for marketplaces, booking products, and fintech platforms.
                                    </p>
                                </div>

                                <div style={{ borderLeft: '2px solid rgba(255,255,255,0.25)', paddingLeft: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                                        <h4 style={{ margin: 0, fontSize: 'clamp(18px, 1.3vw, 22px)', fontWeight: 600, color: '#fff' }}>
                                            Graphic & Visual Designer
                                        </h4>
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Selected Practice</span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '4px' }}>Branding · Visual Assets · Campaign Design</div>
                                    <p style={{ margin: '10px 0 0 0', fontSize: '14px', lineHeight: 1.6, color: '#94a3b8' }}>
                                        Building visual languages that stay coherent across product screens, marketing posters, presentation design, and 3D promotional assets.
                                    </p>
                                </div>

                                <div style={{ borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: '20px' }}>
                                    <h4 style={{ margin: 0, fontSize: 'clamp(16px, 1.15vw, 19px)', fontWeight: 600, color: '#e2e8f0' }}>
                                        Education & Training
                                    </h4>
                                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                                        B.Sc. in Computer Science & Professional Training in UI/UX & Graphic Design. Hands-on design-dev collaboration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Process Column */}
                        <div>
                            <h3
                                style={{
                                    fontSize: 'clamp(13px, 1vw, 16px)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#71717a',
                                    marginBottom: '28px',
                                }}
                            >
                                How I Approach Design
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { step: '01', title: 'Discover', desc: 'Understand the people, context and real decisions the product must support.' },
                                    { step: '02', title: 'Define', desc: 'Turn findings into a focused problem, useful hierarchy and measurable design intent.' },
                                    { step: '03', title: 'Explore', desc: 'Map flows and test multiple structural directions before visual polish begins.' },
                                    { step: '04', title: 'Design', desc: 'Build accessible, responsive interfaces with consistent visual and interaction systems.' },
                                    { step: '05', title: 'Refine', desc: 'Prototype, test and remove friction until every state feels deliberate.' },
                                ].map((p) => (
                                    <div
                                        key={p.step}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '16px',
                                            padding: '14px 18px',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>
                                            {p.step}
                                        </span>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{p.title}</div>
                                            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.45 }}>{p.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resume Download CTA */}
                    <div
                        style={{
                            marginTop: 'clamp(40px, 5vw, 60px)',
                            padding: 'clamp(20px, 3vw, 36px)',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(30,41,59,0.4) 100%)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '20px',
                        }}
                    >
                        <div>
                            <h4 style={{ margin: 0, fontSize: 'clamp(18px, 1.4vw, 22px)', color: '#fff', fontWeight: 600 }}>
                                Curious to know more about my background?
                            </h4>
                            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
                                Download my resume for detailed experience, project breakdowns, and design credentials.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a
                                href="/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: '#fff',
                                    color: '#000',
                                    padding: '10px 22px',
                                    borderRadius: '999px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
                                }}
                            >
                                View Resume (PDF) ↗
                            </a>
                            <a
                                href="/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf"
                                download="Karan_Govind_Malkar_Resume.pdf"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '10px 20px',
                                    borderRadius: '999px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                }}
                            >
                                Download CV ↓
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}