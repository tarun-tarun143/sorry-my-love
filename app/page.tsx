'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Heart, Sparkles, Music2, Volume2, VolumeX, ChevronDown, RotateCcw, Check, LockKeyhole, Flower2, Mic2, Play, Pause, MailOpen, Clock3, Gift, PenLine } from 'lucide-react'

const memories = [
  { title: 'Every laugh', date: 'A memory worth keeping', text: 'The kind of laughter that makes an ordinary moment feel like the best part of the day.', tone: 'from-rose-200 via-pink-100 to-peach-100', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=82' },
  { title: 'Late-night talks', date: 'The little hours', text: 'Some conversations somehow make the world quieter and a little warmer.', tone: 'from-purple-200 via-violet-100 to-rose-100', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=82' },
  { title: 'Silly arguments', date: 'Even the messy moments', text: 'Not every moment was perfect. That is exactly why I want to keep learning from them.', tone: 'from-peach-200 via-amber-100 to-rose-100', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=82' }
]

const reasons = [
  ['Your smile', 'Because somehow it can make a hard day feel softer.'],
  ['Your kindness', 'You care in ways that deserve to be noticed and treasured.'],
  ['The little things', 'The tiny details you do are often the ones I remember most.'],
  ['How you care', 'There is warmth in the way you make people feel seen.'],
  ['Ordinary moments', 'With you, even nothing-special days can feel special.'],
  ['Simply… you ❤️', 'No explanation really beats that one.']
]

const promises = [
  'I’ll listen better.',
  'I’ll communicate better.',
  'I’ll think before I react.',
  'I’ll appreciate you more.',
  'I’ll never take your presence for granted.',
  'And I’ll keep choosing you, every single day.'
]

const demoPeople = {
  boy: 'https://randomuser.me/api/portraits/men/32.jpg',
  girl: 'https://randomuser.me/api/portraits/women/44.jpg',
  couple: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=85'
}

const timeline = [
  ['The beginning', 'A hello that became a thousand little memories.'],
  ['The little things', 'Late-night talks, silly jokes, random smiles, and everything in between.'],
  ['The hard moment', 'A moment I wish I could rewrite — but one I will learn from.'],
  ['Right now', 'This is me choosing honesty, softness, and a better next chapter.']
]

function useReducedMotionFlag() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  return reduced
}

function Ambient() {
  const hearts = useMemo(() => Array.from({ length: 18 }, (_, i) => i), [])
  return <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
    <div className="aurora aurora-a" />
    <div className="aurora aurora-b" />
    <div className="aurora aurora-c" />
    <div className="grain" />
    {hearts.map((i) => <motion.div key={i} className="absolute text-white/20" initial={{ opacity: 0 }} animate={{ opacity: [0, .4, 0], y: [-10, -80, -150], x: [0, (i % 2 ? 1 : -1) * (8 + (i % 5) * 8)] }} transition={{ duration: 5 + (i % 4), delay: (i % 6) * .7, repeat: Infinity, ease: 'easeOut' }} style={{ left: `${4 + (i * 5.4) % 94}%`, bottom: `${-10 + (i % 4) * 6}%`, fontSize: `${10 + (i % 4) * 4}px` }}>♥</motion.div>)}
  </div>
}

function MusicButton({ audioRef }: { audioRef: React.MutableRefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const saved = window.localStorage.getItem('sorry-music')
    if (saved === 'on') setPlaying(false)
  }, [])
  async function toggle() {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      try { await audioRef.current.play(); setPlaying(true); window.localStorage.setItem('sorry-music', 'on') } catch { setPlaying(false) }
    } else {
      audioRef.current.pause(); setPlaying(false); window.localStorage.setItem('sorry-music', 'off')
    }
  }
  return <button aria-label={playing ? 'Pause music' : 'Play music'} onClick={toggle} className="music-button"><AnimatePresence mode="wait"><motion.span key={playing ? 'on' : 'off'} initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 20, opacity: 0 }}>{playing ? <Volume2 size={18} /> : <Music2 size={18} />}</motion.span></AnimatePresence></button>
}

function Section({ id, children, className = '' }: { id: string, children: React.ReactNode, className?: string }) {
  return <section id={id} className={`section-wrap ${className}`}>{children}</section>
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: .24 })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .8, delay, ease: [0.22,1,0.36,1] }} className={className}>{children}</motion.div>
}

function VoiceMessage({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false)
  const [supported, setSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const text = `Hey ${name}. This is my little voice message for you. I know I made a mistake, and I am really sorry. I do not expect this to erase anything. I just want you to know that you matter to me, and I want to do better. Thank you for listening.`

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  function toggle() {
    if (!supported) return
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.94; u.pitch = 1.06; u.volume = 1
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)
    utteranceRef.current = u
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    setPlaying(true)
  }

  return <div className="glass-card p-6 sm:p-8">
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-300/30 to-violet-300/20 border border-white/10"><Mic2 size={20} /></div>
      <div><div className="eyebrow">A voice from me</div><h3 className="mt-1 text-xl font-semibold">A little voice message, just for you</h3></div>
    </div>
    <p className="mt-4 text-sm leading-6 text-white/62">Tap play to hear the message spoken by your phone. No autoplay, no surprises.</p>
    <button onClick={toggle} disabled={!supported} className="voice-button mt-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">{playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}</span>
      <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-semibold">{supported ? (playing ? 'Playing…' : 'Play my voice message') : 'Voice message unavailable'}</span><span className="mt-0.5 block text-xs text-white/45">A sincere apology • 00:28</span></span>
      <div className={`voice-bars ${playing ? 'is-playing' : ''}`} aria-hidden>{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
    </button>
  </div>
}

function InteractiveLetter({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const pages = [
    { title: 'Dear ' + name + ',', body: 'I wanted to say sorry in a way that lets you breathe, pause, and read every word at your own pace.' },
    { title: 'What I mean', body: 'I am not asking you to forget. I am asking you to see that I understand, I care, and I want to grow from this.' },
    { title: 'What I hope', body: 'I hope there is still room for softer conversations, honest apologies, and new memories that feel lighter than the last one.' }
  ]
  return <div className="letter-scene">
    <AnimatePresence mode="wait">
      {!open ? <motion.button key="closed" onClick={() => setOpen(true)} whileTap={{ scale: .97 }} className="envelope-card">
        <div className="envelope-flap" /><MailOpen size={32} className="mx-auto" /><div className="mt-4 text-xl font-semibold">Open my letter</div><p className="mt-2 text-sm text-white/55">Tap the envelope and read one page at a time.</p><div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/50"><PenLine size={13} /> Written for {name}</div>
      </motion.button> : <motion.div key="open" initial={{ opacity: 0, y: 20, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} className="letter-card">
        <div className="flex items-center justify-between text-xs text-white/45"><span>My letter · {page + 1}/{pages.length}</span><button onClick={() => setOpen(false)} className="text-white/55">close</button></div>
        <AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: .35 }} className="mt-7 min-h-[210px]"><h3 className="text-2xl font-semibold">{pages[page].title}</h3><p className="mt-5 text-lg leading-8 text-white/72">{pages[page].body}</p></motion.div></AnimatePresence>
        <div className="mt-6 flex items-center justify-between gap-3"><button onClick={() => setPage((p) => Math.max(0, p - 1))} className="secondary-button">Back</button>{page < pages.length - 1 ? <button onClick={() => setPage((p) => p + 1)} className="premium-button">Next page <ChevronDown className="rotate-[-90deg]" size={17} /></button> : <div className="inline-flex items-center gap-2 text-sm text-rose-200"><Heart size={15} fill="currentColor" /> end of letter</div>}</div>
      </motion.div>}
    </AnimatePresence>
  </div>
}

function ScratchCard({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const drawing = useRef(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current; const box = boxRef.current
    if (!canvas || !box) return
    const dpr = window.devicePixelRatio || 1
    const rect = box.getBoundingClientRect()
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.scale(dpr, dpr)
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    g.addColorStop(0, '#d8b6c7'); g.addColorStop(.45, '#9f7da6'); g.addColorStop(1, '#f0cdb1')
    ctx.fillStyle = g; ctx.fillRect(0,0,rect.width,rect.height)
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random()*.08})`; ctx.beginPath(); ctx.arc(Math.random()*rect.width, Math.random()*rect.height, 1.5 + Math.random()*2.4, 0, Math.PI*2); ctx.fill() }
  }, [])

  function scratch(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect(); const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 23, 0, Math.PI*2); ctx.fill()
    // Mark as revealed after enough rubbing by estimating cleared pixels around sample points.
    const sample = ctx.getImageData(0,0,canvas.width,canvas.height).data
    let clear = 0
    for (let i=3;i<sample.length;i+=4) if (sample[i] < 20) clear++
    if (clear / (sample.length/4) > .45) setRevealed(true)
  }
  return <div className="scratch-wrap">
    <div className="scratch-card" ref={boxRef}>
      <div className="scratch-underlay"><Gift size={30} /><div className="mt-4 text-2xl font-semibold">{revealed ? `${name}, you found it ❤️` : 'There is a little secret here…'}</div><p className="mt-2 text-sm leading-6 text-white/60">{revealed ? 'You are worth more than any perfectly written apology.' : 'Use your finger to scratch away the silver layer.'}</p></div>
      {!revealed && <canvas ref={canvasRef} onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e) }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false }} onPointerCancel={() => { drawing.current = false }} />}
    </div>
    <p className="mt-3 text-center text-xs uppercase tracking-[.18em] text-white/35">A tiny surprise hidden for you</p>
  </div>
}

function Timeline({ name }: { name: string }) {
  return <div className="timeline">{timeline.map(([title, text], i) => <div key={title} className="timeline-item"><div className="timeline-dot">{i + 1}</div><div className="timeline-line" /><div className="glass-card p-5"><div className="flex items-center gap-2 text-xs uppercase tracking-[.16em] text-white/40"><Clock3 size={13} /> chapter {i + 1}</div><h3 className="mt-2 text-xl font-semibold">{title}{i === 3 ? ', ' + name : ''}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div></div>)}</div>
}

export default function Home() {
  const reduced = useReducedMotionFlag()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [name, setName] = useState('')
  const [draft, setDraft] = useState('')
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [heartTaps, setHeartTaps] = useState(0)
  const [secret, setSecret] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [timeMessage, setTimeMessage] = useState(false)
  const [reasonsIndex, setReasonsIndex] = useState(0)
  const [promiseIndex, setPromiseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [welcome, setWelcome] = useState(true)
  const [welcomeStep, setWelcomeStep] = useState(0)

  useEffect(() => {
    const saved = window.localStorage.getItem('sorry-name')
    if (saved) setDraft(saved)
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.round((window.scrollY / max) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function begin() {
    const clean = draft.trim()
    if (!clean) { setError('I need your name first, beautiful ❤️'); return }
    setError(''); setName(clean); window.localStorage.setItem('sorry-name', clean); setStarted(true); setWelcomeStep(0);
    setTimeout(() => document.getElementById('welcome')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  function continueWelcome() {
    if (welcomeStep < 3) {
      setWelcomeStep((step) => step + 1)
      return
    }
    document.getElementById('apology')?.scrollIntoView({ behavior: 'smooth' })
  }

  function replay() {
    setStarted(false); setCelebrate(false); setTimeMessage(false); setWelcome(true); setWelcomeStep(0); setHeartTaps(0); setSecret(false); setPromiseIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function tapHeart() {
    const count = heartTaps + 1; setHeartTaps(count)
    if (count >= 5) setSecret(true)
  }

  return <main className="min-h-screen overflow-x-hidden bg-[#23121a] text-[#fff8f4]">
    <audio ref={audioRef} loop preload="none" src="/music/romantic.mp3" />
    <Ambient />
    <MusicButton audioRef={audioRef} />
    <div className="progress-line"><motion.div animate={{ width: `${progress}%` }} /></div>

    <AnimatePresence mode="wait">
      {!started ? <motion.section key="entry" className="relative z-10 min-h-[100svh] grid place-items-center px-5 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }} transition={{ duration: .7 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,170,187,.22),transparent_32%),radial-gradient(circle_at_80%_12%,rgba(186,150,255,.25),transparent_28%),radial-gradient(circle_at_60%_90%,rgba(255,159,114,.18),transparent_30%)]" />
        <div className="relative w-full max-w-md rounded-[34px] border border-white/15 bg-white/10 backdrop-blur-2xl p-7 sm:p-9 shadow-glass">
          <div className="mb-7 flex items-center gap-2 text-white/70 text-sm"><Sparkles size={15} /><span>Before I say what I came here to say…</span></div>
          <div className="text-center">
            <motion.button onClick={tapHeart} aria-label="Secret heart" whileTap={{ scale: .9 }} animate={reduced ? {} : { scale: [1, 1.05, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-rose-300 via-fuchsia-300 to-peach-200 text-rose-900 shadow-[0_0_80px_rgba(247,165,190,.25)] animate-pulseGlow"><Heart size={42} fill="currentColor" /></motion.button>
            <p className="text-sm uppercase tracking-[.24em] text-white/55">A little something from my heart</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Enter your name <span className="text-rose-200">❤️</span></h1>
            <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-white/70">Because this message is only meant for one special person.</p>
            <div className="mt-7">
              <input value={draft} onChange={(e) => { setDraft(e.target.value); setError('') }} onKeyDown={(e) => { if (e.key === 'Enter') begin() }} autoComplete="off" inputMode="text" placeholder="Enter your name…" className="premium-input" aria-label="Your name" />
              <button onClick={begin} className="premium-button mt-3 w-full">Continue <Heart size={18} fill="currentColor" /></button>
              <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-rose-200">{error}</motion.p>}</AnimatePresence>
            </div>
            {secret && <motion.p initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 rounded-2xl bg-black/10 p-4 text-sm text-white/80">Okay… you found my secret ❤️<br />I love you more than this website can explain.</motion.p>}
          </div>
          <div className="mt-7 flex items-center justify-between text-xs text-white/45"><span>360px → desktop ready</span><span className="flex items-center gap-1"><LockKeyhole size={13} /> Private little story</span></div>
        </div>
      </motion.section> : <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .65 }} className="relative z-10">
        <Section id="welcome" className="min-h-[100svh] items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center">
            <AnimatePresence mode="wait">
              {welcomeStep === 0 && <motion.div key="w0" initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }} transition={{ duration: .55 }}>
                <div className="eyebrow">Chapter 01 · Just for you</div>
                <h2 className="display-title mt-4">Hey, <span className="gradient-text">{name}</span>…</h2>
                <p className="mx-auto mt-5 max-w-2xl text-xl leading-9 text-white/76">I made something for you.</p>
              </motion.div>}
              {welcomeStep === 1 && <motion.div key="w1" initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }} transition={{ duration: .55 }}>
                <div className="eyebrow">A little honesty</div>
                <h2 className="display-title mt-4">I know I hurt you.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-xl leading-9 text-white/76">And I am genuinely sorry for that.</p>
              </motion.div>}
              {welcomeStep === 2 && <motion.div key="w2" initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }} transition={{ duration: .55 }}>
                <div className="eyebrow">From my heart</div>
                <h2 className="display-title mt-4">You matter to me.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-xl leading-9 text-white/76">More than one bad moment could ever explain.</p>
              </motion.div>}
              {welcomeStep === 3 && <motion.div key="w3" initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }} transition={{ duration: .55 }}>
                <div className="eyebrow">One last thing before the letter</div>
                <h2 className="display-title mt-4">Every word here is for you.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-xl leading-9 text-white/76">Take your time. Read it when you are ready.</p>
              </motion.div>}
            </AnimatePresence>
            <motion.button onClick={continueWelcome} whileTap={{ scale: .96 }} className="premium-button mx-auto mt-10">
              Continue <ChevronDown size={18} />
            </motion.button>
            <p className="mt-4 text-xs uppercase tracking-[.22em] text-white/35">{welcomeStep + 1} / 4</p>
          </div>
        </Section>

        <Section id="apology" className="items-center">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
            <Reveal><div className="glass-card mx-auto max-w-3xl p-7 sm:p-10">
              <div className="eyebrow">Chapter 02 · The apology</div>
              <h2 className="section-title">I’m Sorry, <span className="gradient-text">{name}.</span></h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-white/78">
                {['I know I made a mistake.', 'I know I may have hurt you.', 'And honestly… that’s the last thing I ever wanted to do.', 'I’m not here to make excuses.', 'I just want you to know that I understand that I was wrong.', 'You mean far more to me than my ego, my anger, or one bad moment ever could.', 'If I could go back and change that moment, I would.', 'But since I can’t change the past, I can promise to learn from it and become better.'].map((line, i) => <motion.p key={line} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ delay: i * .06 }}>{line}</motion.p>)}
              </div>
            </div></Reveal>
          </div>
        </Section>

        <Section id="reasons" className="items-center">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 03 · Why you matter</div><h2 className="section-title">Do you know why you’re so special to me?</h2></Reveal>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map(([title, text], i) => <motion.button key={title} onClick={() => setReasonsIndex(i)} whileTap={{ scale: .97 }} className={`reason-card text-left ${reasonsIndex === i ? 'ring-2 ring-rose-200/60' : ''}`}><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Flower2 size={20} /></div><div className="text-xl font-semibold">{title}</div><p className="mt-2 text-sm leading-6 text-white/65">{text}</p></motion.button>)}
            </div>
            <Reveal delay={.12}><div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/55">Tap any card — the little details matter more than the perfect words.</div></Reveal>
          </div>
        </Section>

        <Section id="memories" className="items-center">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 04 · Our little moments</div><h2 className="section-title">A tiny scrapbook of things I never want to take for granted.</h2></Reveal>
            <div className="mt-9 flex snap-x gap-5 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible">
              {memories.map((memory, i) => <motion.article key={memory.title} whileHover={{ y: -8 }} className="memory-card min-w-[83%] snap-center sm:min-w-0"><div className={`overflow-hidden rounded-[26px] bg-gradient-to-br ${memory.tone}`}><img src={memory.image} alt="Romantic demo memory" className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-105" /></div><div className="px-1 pb-2 pt-5"><div className="text-xs uppercase tracking-[.18em] text-white/45">{memory.date}</div><h3 className="mt-2 text-xl font-semibold">{memory.title}</h3><p className="mt-2 text-sm leading-6 text-white/62">{memory.text}</p><div className="mt-4 flex items-center gap-2 text-sm text-rose-200"><Heart size={15} fill="currentColor" /> one more reason to smile</div></div></motion.article>)}
            </div>
          </div>
        </Section>

        <Section id="voice" className="items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 05 · Hear me out</div><h2 className="section-title">Some apologies deserve a voice.</h2><p className="max-w-xl text-white/62">A little spoken message, generated safely by the browser — tap once when you are ready.</p></Reveal>
            <div className="mt-8"><Reveal delay={.08}><VoiceMessage name={name} /></Reveal></div>
          </div>
        </Section>

        <Section id="letter" className="items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 06 · The interactive letter</div><h2 className="section-title">I wrote this one slowly.</h2><p className="max-w-xl text-white/62">Open the envelope and turn the pages when you are ready.</p></Reveal>
            <div className="mt-8"><Reveal delay={.08}><InteractiveLetter name={name} /></Reveal></div>
          </div>
        </Section>

        <Section id="timeline" className="items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 07 · Our timeline</div><h2 className="section-title">A little story, told honestly.</h2></Reveal>
            <div className="mt-9"><Timeline name={name} /></div>
          </div>
        </Section>

        <Section id="scratch" className="items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 08 · One tiny surprise</div><h2 className="section-title">Scratch here.</h2><p className="max-w-xl text-white/62">There is a little message underneath — and yes, you have to discover it yourself.</p></Reveal>
            <div className="mt-8"><Reveal delay={.08}><ScratchCard name={name} /></Reveal></div>
          </div>
        </Section>

        <Section id="photos" className="items-center">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 09 · Demo photos</div><h2 className="section-title">A place for our faces, not just our words.</h2><p className="max-w-xl text-white/62">These are demo images for now. Replace the URLs in <span className="font-mono text-rose-200">demoPeople</span> with your own photos later.</p></Reveal>
            <div className="mt-9 grid gap-4 sm:grid-cols-[1fr_1.15fr_1fr]">
              <motion.div whileHover={{ y: -7 }} className="photo-frame"><img src={demoPeople.boy} alt="Demo boy portrait" /><div className="photo-label"><span>Boy demo</span><span>❤️</span></div></motion.div>
              <motion.div whileHover={{ y: -7 }} className="photo-frame featured"><img src={demoPeople.couple} alt="Demo couple photo" /><div className="photo-label"><span>Couple demo</span><span>Our little frame</span></div></motion.div>
              <motion.div whileHover={{ y: -7 }} className="photo-frame"><img src={demoPeople.girl} alt="Demo girl portrait" /><div className="photo-label"><span>Girl demo</span><span>🥹</span></div></motion.div>
            </div>
          </div>
        </Section>

        <Section id="promises" className="items-center">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
            <Reveal><div className="eyebrow">Chapter 10 · The promise</div><h2 className="section-title">I Promise…</h2><p className="max-w-xl text-white/65">Not perfect words. Just things I can actually work on.</p></Reveal>
            <div className="mt-9 space-y-3">
              {promises.map((promise, i) => <motion.button key={promise} onClick={() => setPromiseIndex(i)} whileTap={{ scale: .985 }} className={`promise-row ${promiseIndex === i ? 'active' : ''}`}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><Check size={17} /></span><span>{promise}</span>{promiseIndex === i && <motion.span layoutId="promise-dot" className="ml-auto h-2 w-2 rounded-full bg-rose-200" />}</motion.button>)}
            </div>
          </div>
        </Section>

        <Section id="big-message" className="items-center bg-[radial-gradient(circle_at_50%_20%,rgba(246,180,200,.18),transparent_30%),linear-gradient(180deg,rgba(20,8,15,.1),rgba(20,8,15,.45))]">
          <div className="mx-auto w-full max-w-4xl px-5 py-20 text-center">
            <Reveal><div className="eyebrow">Chapter 11 · From the heart</div><h2 className="display-title">{name},</h2><div className="mx-auto mt-8 max-w-2xl space-y-4 text-xl leading-9 text-white/75"><p>I don’t expect one website to erase a mistake.</p><p>I just hope it reminds you of something…</p><p className="text-white">You are important to me.<br />You are loved.<br />You are appreciated.<br />And I genuinely don’t want to lose you.</p></div></Reveal>
            <Reveal delay={.15}><motion.button onClick={tapHeart} aria-label="Heart" whileTap={{ scale: .88 }} animate={reduced ? {} : { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }} transition={{ duration: 2.2, repeat: Infinity }} className="mx-auto mt-10 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-rose-300 via-pink-200 to-peach-200 text-rose-900 shadow-[0_0_80px_rgba(246,172,196,.25)]"><Heart size={42} fill="currentColor" /></motion.button></Reveal>
            <p className="mt-6 text-2xl font-semibold text-white">I’m truly sorry. ❤️</p>
          </div>
        </Section>

        <Section id="forgive" className="items-center">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center">
            <Reveal><div className="glass-card p-7 sm:p-11"><div className="eyebrow">Chapter 12 · One honest question</div><h2 className="section-title">So… can I have one more chance?</h2><p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/65">I promise I’ll make the next chapter better than the last one.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><button onClick={() => { setCelebrate(true); setTimeMessage(false) }} className="premium-button w-full">❤️ Yes, I forgive you</button><button onClick={() => { setTimeMessage(true); setCelebrate(false) }} className="secondary-button w-full">🥺 I need some time</button></div></div></Reveal>
            <AnimatePresence mode="wait">
              {celebrate && <motion.div key="celebrate" initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-rose-200/20 bg-gradient-to-br from-rose-500/20 via-fuchsia-400/15 to-peach-300/15 p-7"><div className="text-3xl">💖 ✨ 🌸</div><h3 className="mt-4 text-2xl font-semibold">YOU JUST MADE MY HEART SO HAPPY ❤️</h3><p className="mt-3 text-white/70">Thank you, {name}.</p><p className="mt-2 text-white/70">I promise I’ll do my best to make you smile more than I ever make you cry.</p><div className="celebrate-layer" aria-hidden>{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ left: `${(i * 17) % 100}%`, animationDelay: `${(i % 7) * .12}s` }}>{i % 3 === 0 ? '♥' : '✦'}</span>)}</div></motion.div>}
              {timeMessage && <motion.div key="time" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-7"><h3 className="text-2xl font-semibold">That’s okay ❤️</h3><p className="mt-4 leading-7 text-white/68">I understand.<br />Take all the time you need.<br />I’ll be here when you’re ready.</p></motion.div>}
            </AnimatePresence>
          </div>
        </Section>

        <Section id="final" className="items-center">
          <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:py-24">
            <Reveal><div className="eyebrow">Final note · Always with love</div><div className="glass-card p-7 sm:p-10"><p className="text-2xl leading-10 sm:text-3xl">Made with a little code,<br />a lot of love,<br />and one very sincere apology. ❤️</p><p className="mt-6 text-white/55">— From someone who really cares about you.</p><button onClick={replay} className="secondary-button mt-7"><RotateCcw size={17} /> Replay Our Story</button></div></Reveal>
          </div>
        </Section>
        <footer className="relative z-10 px-5 pb-8 text-center text-xs text-white/35">Made for one special person. Built to feel like a love letter, not a template.<br /><span className="mt-2 inline-block text-white/55">Made by Tarun D</span></footer>
      </motion.div>}
    </AnimatePresence>
  </main>
}
