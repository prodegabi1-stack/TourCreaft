import { useState, useEffect, useRef, useCallback } from "react";
import { get, set } from "idb-keyval";
import { Phone, Mail, Copy, X, MapPin, Compass, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Marzipano global type ────────────────────────────────────────────────────
declare const Marzipano: any;

// ─── SVG Icon Components (from user's SVG files) ──────────────────────────────

function IcoSettings({ size = 20 }: { size?: number }) {
  // Exact from Setings.svg (viewBox 0 0 10 39) — 3 circles, one per position
  return (
    <svg width={size * (10 / 39)} height={size} viewBox="0 0 10 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3.7" cy="3.7" r="3.7" transform="matrix(1 0 0 -1 1 38)" stroke="currentColor" strokeWidth="2" />
      <circle cx="3.7" cy="3.7" r="3.7" transform="matrix(1 0 0 -1 1 23.2)" stroke="currentColor" strokeWidth="2" />
      <circle cx="3.7" cy="3.7" r="3.7" transform="matrix(1 0 0 -1 1 8.39999)" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IcoGallery({ size = 20 }: { size?: number }) {
  // Exact from Highlights.svg (viewBox 0 0 40 34)
  return (
    <svg width={size * (40 / 34)} height={size} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.02324 1H32.1395C35.4532 1 38.1395 3.68629 38.1395 7V25.4242" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4.58139 4.7576H30.6977C32.9068 4.7576 34.6977 6.54846 34.6977 8.7576V29.1818" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="1" y="-1" width="30.3954" height="24.5454" rx="3" transform="matrix(-1 0 0 1 32.3954 9.45456)" stroke="currentColor" strokeWidth="2" />
      <path d="M9.74442 12.2121C8.16089 12.2121 7.02371 13.5855 7.02371 15.091C7.02377 16.5964 8.16093 17.9699 9.74442 17.9699C11.3278 17.9698 12.4651 16.5964 12.4651 15.091C12.4651 13.5856 11.3278 12.2122 9.74442 12.2121Z" stroke="currentColor" strokeWidth="2" />
      <path d="M23.5116 16.5L22.8387 17.2397L22.805 17.209L22.7742 17.1755L23.5116 16.5ZM20.5 16.5L19.749 15.8396L19.7557 15.832L19.7626 15.8245L20.5 16.5ZM10.9254 28.9028C10.5607 29.3175 9.92881 29.3581 9.51406 28.9934C9.09932 28.6287 9.05875 27.9968 9.42345 27.5821L10.1744 28.2424L10.9254 28.9028ZM31.2558 23.5454L30.5829 24.2851L22.8387 17.2397L23.5116 16.5L24.1846 15.7603L31.9288 22.8058L31.2558 23.5454ZM23.5116 16.5L22.7742 17.1755C22.5171 16.8948 22.2399 16.7955 22.0058 16.7955C21.7717 16.7955 21.4945 16.8948 21.2374 17.1755L20.5 16.5L19.7626 15.8245C20.366 15.1658 21.1643 14.7955 22.0058 14.7955C22.8473 14.7955 23.6457 15.1658 24.249 15.8245L23.5116 16.5ZM20.5 16.5L21.251 17.1603L10.9254 28.9028L10.1744 28.2424L9.42345 27.5821L19.749 15.8396L20.5 16.5Z" fill="currentColor" />
      <path d="M12.3256 25.4242L8.02326 22.1363C7.1628 21.6667 6.30233 21.594 5.44187 22.1363L1.13954 25.8939" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IcoFloors({ size = 20 }: { size?: number }) {
  // Exact from Floors.svg (viewBox 0 0 39 39)
  return (
    <svg width={size} height={size} viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.00015 19.4997L19.5002 30.76L38.0002 19.4997M1.00015 26.7386L19.5002 37.9989L38.0002 26.7386M1.00015 12.2608L19.5002 23.5211L38.0002 12.2608L19.5002 1L1.00015 12.2608Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoPlay({ size = 20 }: { size?: number }) {
  // Pad the viewBox slightly and set overflow visible to prevent the browser from clipping the bezier curve tip
  return (
    <svg width={size * (34 / 35)} height={size} viewBox="0 0 34 35" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.7852 14.5688C31.8791 15.7037 31.8791 18.7092 29.7852 19.8441L5.42969 33.0443C3.43087 34.1277 1.00025 32.6811 1 30.4076V4.00528C1.00025 1.73183 3.43087 0.285196 5.42969 1.36856L29.7852 14.5688Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IcoPause({ size = 20 }: { size?: number }) {
  // Exact from Pause.svg (viewBox 0 0 27 36)
  return (
    <svg width={size * (27 / 36)} height={size} viewBox="0 0 27 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="8.91489" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="17.0851" y="1" width="8.91489" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IcoTopView({ size = 20 }: { size?: number }) {
  // Exact from Top View.svg (viewBox 0 0 39 39)
  return (
    <svg width={size} height={size} viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3628 27.5179L19.5 29.614L23.6372 27.5179M19.5 28.6273V1M13.6602 22.2131L1 28.6272L19.5 38L38 28.6272L25.3398 22.2131" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Ico3D({ size = 20 }: { size?: number }) {
  // Exact from 3d.svg (viewBox 0 0 39 39) — NO fill, stroke only
  return (
    <svg width={size} height={size} viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.59 38L1 30.3923V19.1921L5.02469 16.9501V6.80648L10.1874 3.90324L15.35 1L38 13.6795V24.8797L14.59 38Z" fill="none" />
      <path d="M5.02469 16.9501V6.80648L10.1874 3.90324L15.35 1L38 13.6795V24.8797L14.59 38L1 30.3923V19.1921L5.02469 16.9501L14.0847 11.8783L12.5188 11.0017L5.02469 6.80648M14.59 38V26.7999M38 13.6795L30.5059 17.8748L22.548 22.3373L14.59 26.7999M14.59 26.7999L8.49411 23.3874L1 19.1921" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoWalkthrough({ size = 15 }: { size?: number }) {
  // Exact from Man.svg (viewBox 0 0 36 36)
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.2222 8.88889L12 11.3333C11.8222 11.5111 11.6296 11.8518 11.5556 12L9.77777 16.6667C9.6 17.2 10.1481 17.7778 10.4444 18C11.3333 18.3556 11.8518 17.8518 12 17.5556L13.7778 13.3333L15.7778 12.6667L13.1111 25.7778L8 32C7.46666 32.7111 7.92592 33.3333 8.22222 33.5556C8.75555 34.0889 9.48148 33.6296 9.77778 33.3333L14.8889 27.3333C15.2444 26.9778 15.4815 26.1481 15.5556 25.7778L16.4444 21.7778L20.8889 24.8889V32.8889C20.8889 33.6 21.7778 33.7778 22.2222 33.7778C23.1111 33.7778 23.3333 33.1852 23.3333 32.8889V24.6667C23.3333 23.9556 22.8889 23.4815 22.6667 23.3333L19.1111 20.6667L20.2222 14.8889L21.1111 16.6667C21.4667 17.5556 22 17.7778 22.2222 17.7778L26.6667 19.1111C27.5556 19.4667 28.0741 18.8148 28.2222 18.4444C28.5778 17.5556 27.9259 17.037 27.5556 16.8889L23.5556 15.5556L21.1111 10.2222C20.4 8.8 18.8889 8.74074 18.2222 8.88889Z" fill="currentColor" stroke="currentColor" />
      <circle cx="20" cy="4.88885" r="3.11111" fill="currentColor" />
    </svg>
  );
}

// ─── Agent data ───────────────────────────────────────────────────────────────
const AGENT = {
  name: "Gabriel Prode",
  title: "Real Estate Agent",
  phone: "0722 000 000",
  email: "gabriel@prode.ro",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format",
};

// ─── Demo scenes (Unsplash equirect-ish wide shots for demo) ──────────────────
const DEMO_ROOMS = [
  { id: "demo_1", label: "Master Bedroom", img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=4096&h=2048&fit=crop", thumb: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=200&h=100&fit=crop" },
  { id: "demo_2", label: "Living Room", img: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=4096&h=2048&fit=crop", thumb: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=200&h=100&fit=crop" },
  { id: "demo_3", label: "Kitchen", img: "https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=4096&h=2048&fit=crop", thumb: "https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=200&h=100&fit=crop" },
  { id: "demo_4", label: "Master Bathroom", img: "https://images.unsplash.com/photo-1651951646668-46562cfb4518?w=4096&h=2048&fit=crop", thumb: "https://images.unsplash.com/photo-1651951646668-46562cfb4518?w=200&h=100&fit=crop" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface SceneData {
  id: string;
  label: string;
  img: string;
  thumb: string;
  scene?: any; // Marzipano scene
}

// ─── Copy button helper ───────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors" title="Copy">
      <Copy size={11} className={copied ? "text-accent" : ""} />
    </button>
  );
}

// ─── View mode pill ───────────────────────────────────────────────────────────
function ViewModeSwitch({
  value,
  onChange,
  bgStyle,
  blurStyle,
}: {
  value: "walk" | "3d";
  onChange: (v: "walk" | "3d") => void;
  bgStyle?: string;
  blurStyle?: string;
}) {
  return (
    <div
      className="relative flex items-center rounded-2xl p-1.5 gap-0 flex-shrink-0"
      style={{
        background: bgStyle || "rgba(0,0,0,0.5)",
        backdropFilter: blurStyle || "blur(12px)",
        WebkitBackdropFilter: blurStyle || "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Sliding accent pill */}
      <div
        className="absolute top-1.5 bottom-1.5 w-10 rounded-xl bg-accent"
        style={{
          left: value === "walk" ? 6 : 46,
          transition: "left 0.25s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      />
      {/* Walk / Omulet button */}
      <button
        id="btn-walk-mode"
        onClick={() => onChange("walk")}
        className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200 ${value === "walk" ? "text-black" : "text-white"
          }`}
        title="Walkthrough"
      >
        <IcoWalkthrough size={22} />
      </button>
      {/* 3D button — exact 3d.svg, stroke only, no fill */}
      <button
        id="btn-3d-mode"
        onClick={() => onChange("3d")}
        className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200 ${value === "3d" ? "text-black" : "text-white"
          }`}
        title="3D Space"
      >
        <Ico3D size={22} />
      </button>
    </div>
  );
}

// ─── Left Settings Panel ──────────────────────────────────────────────────────
function LeftPanel({
  transitionType, setTransitionType,
  transitionDuration, setTransitionDuration,
  bubbleBg, setBubbleBg,
  bubbleOpacity, setBubbleOpacity,
  bubbleColor, setBubbleColor,
  bubbleBlur, setBubbleBlur,
  accentColor, setAccentColor,
  onExport, isExporting
}: any) {
  return (
    <div
      className="flex-shrink-0 flex flex-col border-r border-white/8 bg-[#0f1110] overflow-hidden"
      style={{ width: 268 }}
    >
      <div style={{ width: 268, minWidth: 268 }} className="h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <span className="text-xs font-bold tracking-widest uppercase text-white/40">Tour Settings</span>
        </div>

        <div className="flex flex-col gap-0 overflow-y-auto flex-1 pb-6">
          {/* Transition */}
          <section className="px-5 py-4 border-b border-white/6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">Transition</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Type</span>
                <select
                  value={transitionType}
                  onChange={(e) => setTransitionType(e.target.value)}
                  className="bg-white/8 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-accent cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="fade">Fade</option>
                  <option value="zoom">Zoom</option>
                </select>
              </label>
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Duration (s)</span>
                <input
                  type="number" min={0} max={5} step={0.1}
                  value={transitionDuration}
                  onChange={(e) => setTransitionDuration(parseFloat(e.target.value))}
                  className="bg-white/8 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none w-16 text-center focus:border-accent"
                />
              </label>
            </div>
          </section>

          {/* Controls appearance */}
          <section className="px-5 py-4 border-b border-white/6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">Controls Style</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={bubbleBg}
                    onChange={(e) => setBubbleBg(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <span className="text-white/40 font-mono text-[10px]">{bubbleBg}</span>
                </div>
              </label>
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Icon Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={bubbleColor}
                    onChange={(e) => setBubbleColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <span className="text-white/40 font-mono text-[10px]">{bubbleColor}</span>
                </div>
              </label>
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <span className="text-white/40 font-mono text-[10px]">{accentColor}</span>
                </div>
              </label>
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Opacity</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range" min={0} max={1} step={0.05}
                    value={bubbleOpacity}
                    onChange={(e) => setBubbleOpacity(parseFloat(e.target.value))}
                    className="w-20" style={{ accentColor }}
                  />
                  <span className="text-white/40 text-[10px] w-8">{Math.round(bubbleOpacity * 100)}%</span>
                </div>
              </label>
              <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                <span>Glass Blur</span>
                <button
                  onClick={() => setBubbleBlur(!bubbleBlur)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${bubbleBlur ? "bg-accent" : "bg-white/15"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${bubbleBlur ? "left-4" : "left-0.5"}`} />
                </button>
              </label>
            </div>
          </section>

          {/* Agent card settings */}
          <section className="px-5 py-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">Agent Card</p>
            <div className="flex flex-col gap-2">
              <input
                type="text" defaultValue="Gabriel Prode" placeholder="Agent name"
                className="bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent placeholder-white/20 w-full"
              />
              <input
                type="text" defaultValue="Real Estate Agent" placeholder="Title"
                className="bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent placeholder-white/20 w-full"
              />
              <input
                type="text" defaultValue="0722 000 000" placeholder="Phone"
                className="bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent placeholder-white/20 w-full"
              />
              <input
                type="text" defaultValue="gabriel@prode.ro" placeholder="Email"
                className="bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent placeholder-white/20 w-full"
              />
            </div>
          </section>

          {/* Export */}
          <section className="px-5 py-6 mt-auto">
            <button
              onClick={onExport}
              disabled={isExporting}
              className="w-full bg-accent text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isExporting ? "Generating ZIP..." : "Export Tour (.ZIP)"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Right Scenes Panel ─────────────────────────────────────────────────────
function RightPanel({
  scenes, activeId, onSceneClick, onUpload, onDeleteScene
}: {
  scenes: SceneData[]; activeId: string | null; onSceneClick: (id: string) => void;
  onUpload: (files: FileList) => void; onDeleteScene: (id: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex-shrink-0 w-[300px] bg-[#0f1110] border-l border-white/10 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-wide">Gallery & Scenes</h2>
      </div>

      {/* Upload zone */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <input
          ref={fileInputRef} type="file" multiple accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all select-none
          ${dragOver ? "border-accent bg-accent/8" : "border-white/15 hover:border-white/30 hover:bg-white/3"}`}
        >
          <div className="text-white/30 mb-1">
            <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-xs font-medium text-white/50">
              <span className="text-accent">Click / Drop</span> 360° Photos
            </p>
            <p className="text-[10px] text-white/25 mt-0.5">JPG, PNG</p>
          </div>
        </div>
      </div>

      {/* Scene list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2" style={{ scrollbarWidth: "thin" }}>
        {scenes.length === 0 && (
          <div className="text-center text-white/20 text-xs py-8">No scenes yet.<br />Upload 360° photos to start.</div>
        )}
        {scenes.map((s) => (
          <div
            key={s.id}
            onClick={() => onSceneClick(s.id)}
            className={`group relative flex items-center gap-3 rounded-xl p-2.5 cursor-pointer border transition-all
            ${s.id === activeId
                ? "bg-accent/10 border-accent/30"
                : "bg-white/3 border-white/6 hover:bg-white/6 hover:border-white/12"
              }`}
          >
            <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/8">
              <img src={s.thumb} alt={s.label} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${s.id === activeId ? "text-accent" : "text-white/80"}`}>{s.label}</p>
              {s.id === activeId && <p className="text-[10px] text-white/30 mt-0.5">Active</p>}
            </div>
            {scenes.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteScene(s.id); }}
                className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400 transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const isExported = typeof window !== "undefined" && (window as any).__TOUR_CONFIG__ !== undefined;

export default function App() {
  const initialConfig = isExported ? (window as any).__TOUR_CONFIG__ : null;

  // UI state
  const [showThumbnails, setShowThumbnails] = useState(true);

  // Viewer
  const [viewMode, setViewMode] = useState<"walk" | "3d">("walk");
  const [isPlaying, setIsPlaying] = useState(false);
  const [agentOpen, setAgentOpen] = useState(true);
  const [scenes, setScenes] = useState<SceneData[]>(initialConfig?.scenes || DEMO_ROOMS);
  const [activeId, setActiveId] = useState<string>(initialConfig?.activeId || "demo_1");

  // Settings state
  const [accentColor, setAccentColor] = useState(initialConfig?.accentColor || "#c8a96e");
  const [transitionType, setTransitionType] = useState(initialConfig?.transitionType || "fade");
  const [transitionDuration, setTransitionDuration] = useState(initialConfig?.transitionDuration ?? 0.6);
  const [bubbleBg, setBubbleBg] = useState(initialConfig?.bubbleBg || "#000000");
  const [bubbleOpacity, setBubbleOpacity] = useState(initialConfig?.bubbleOpacity ?? 0.45);
  const [bubbleColor, setBubbleColor] = useState(initialConfig?.bubbleColor || "#ffffff");
  const [bubbleBlur, setBubbleBlur] = useState(initialConfig?.bubbleBlur ?? true);

  const [isLoading, setIsLoading] = useState(!isExported);
  const [isExporting, setIsExporting] = useState(false);
  const [showTitleTemp, setShowTitleTemp] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setShowTitleTemp(true);
      const timer = setTimeout(() => setShowTitleTemp(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeId, isPlaying]);

  useEffect(() => {
    async function loadData() {
      try {
        const storedScenes = await get("scenes");
        if (storedScenes) setScenes(storedScenes);
        const active = await get("activeId");
        if (active) setActiveId(active);
        const accent = await get("accentColor");
        if (accent) setAccentColor(accent);
        const tType = await get("transitionType");
        if (tType) setTransitionType(tType);
        const tDur = await get("transitionDuration");
        if (tDur !== undefined) setTransitionDuration(tDur);
        const bg = await get("bubbleBg");
        if (bg) setBubbleBg(bg);
        const opacity = await get("bubbleOpacity");
        if (opacity !== undefined) setBubbleOpacity(opacity);
        const color = await get("bubbleColor");
        if (color) setBubbleColor(color);
        const blur = await get("bubbleBlur");
        if (blur !== undefined) setBubbleBlur(blur);
      } catch (err) {
        console.error("Failed to load settings from DB", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const saveableScenes = scenes.map(({ scene, ...rest }) => rest);
    set("scenes", saveableScenes).catch(console.error);
  }, [scenes, isLoading]);

  useEffect(() => {
    if (!isLoading) set("activeId", activeId).catch(console.error);
  }, [activeId, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    set("accentColor", accentColor).catch(console.error);
    set("transitionType", transitionType).catch(console.error);
    set("transitionDuration", transitionDuration).catch(console.error);
    set("bubbleBg", bubbleBg).catch(console.error);
    set("bubbleOpacity", bubbleOpacity).catch(console.error);
    set("bubbleColor", bubbleColor).catch(console.error);
    set("bubbleBlur", bubbleBlur).catch(console.error);
  }, [accentColor, transitionType, transitionDuration, bubbleBg, bubbleOpacity, bubbleColor, bubbleBlur, isLoading]);

  // Marzipano refs
  const panoRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const marzScenes = useRef<Map<string, any>>(new Map());
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRotateRef = useRef<any>(null);

  // Compute bubble style
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${isNaN(r) ? 0 : r}, ${isNaN(g) ? 0 : g}, ${isNaN(b) ? 0 : b}`;
  };
  const bubbleBgStyle = `rgba(${hexToRgb(bubbleBg)}, ${bubbleOpacity})`;
  const bubbleBlurStyle = bubbleBlur ? "blur(16px)" : "none";

  // ── Init Marzipano viewer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!panoRef.current || typeof Marzipano === "undefined") return;
    viewerRef.current = new Marzipano.Viewer(panoRef.current, {
      stage: { preserveDrawingBuffer: true },
      controls: { mouseViewMode: "drag" },
    });

    // Stop autoplay on drag
    const stop = (e: Event) => { if ((e as MouseEvent).isTrusted) stopAutoPlay(); };
    panoRef.current.addEventListener("mousedown", stop);
    panoRef.current.addEventListener("touchstart", stop);
    panoRef.current.addEventListener("wheel", stop);

    // Load initial scene
    if (activeId) {
      const sceneData = scenes.find((s) => s.id === activeId);
      if (sceneData) {
        const mScene = loadMarzipanoScene(sceneData);
        if (mScene) try { mScene.switchTo(); } catch (_) { }
      }
    }

    return () => { /* cleanup handled by scene replacement */ };
  }, [isLoading]); // Runs when isLoading becomes false and the div is mounted

  // ── Load scene into Marzipano ─────────────────────────────────────────────
  const loadMarzipanoScene = useCallback((sceneData: SceneData): any => {
    if (!viewerRef.current) return null;
    if (marzScenes.current.has(sceneData.id)) return marzScenes.current.get(sceneData.id);

    const source = Marzipano.ImageUrlSource.fromString(sceneData.img);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180, 120 * Math.PI / 180, 30 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({ yaw: 0, pitch: 0, fov: 75 * Math.PI / 180 }, limiter);
    const scene = viewerRef.current.createScene({ source, geometry, view, pinFirstLevel: true });
    marzScenes.current.set(sceneData.id, scene);
    return scene;
  }, []);

  // ── Switch to a scene ─────────────────────────────────────────────────────
  const switchScene = useCallback((id: string) => {
    if (!viewerRef.current) return;
    const sceneData = scenes.find((s) => s.id === id);
    if (!sceneData) return;
    setActiveId(id);

    const mScene = loadMarzipanoScene(sceneData);
    if (!mScene) return;

    try {
      let transition = undefined;
      if (transitionType !== "none" && transitionDuration > 0) {
        if (transitionType === "fade") transition = { transitionDuration: transitionDuration * 1000, transitionUpdate: Marzipano.TransitionUpdate.opacity() };
        else if (transitionType === "zoom") transition = { transitionDuration: transitionDuration * 1000, transitionUpdate: Marzipano.TransitionUpdate.zoom() };
      }
      mScene.switchTo(transition);
    } catch {
      try { mScene.switchTo(); } catch (_) { }
    }
  }, [scenes, loadMarzipanoScene, transitionType, transitionDuration]);


  // ── Upload handler ────────────────────────────────────────────────────────
  const handleUpload = useCallback((files: FileList) => {
    Array.from(files).forEach((file, idx) => {
      if (!file.type.match("image.*")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          // Create thumbnail
          const canvas = document.createElement("canvas");
          canvas.width = 200; canvas.height = 100;
          canvas.getContext("2d")!.drawImage(img, 0, 0, 200, 100);
          const thumb = canvas.toDataURL("image/jpeg", 0.75);

          const id = `scene_${Date.now()}_${idx}`;
          const label = file.name.replace(/\.[^/.]+$/, "");
          const newScene: SceneData = { id, label, img: dataUrl, thumb };
          setScenes((prev) => [...prev, newScene]);
          // Auto-switch to first uploaded
          if (idx === 0) setTimeout(() => switchScene(id), 100);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }, [switchScene]);

  // ── Delete scene ──────────────────────────────────────────────────────────
  const deleteScene = useCallback((id: string) => {
    marzScenes.current.delete(id);
    setScenes((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeId === id && next.length > 0) switchScene(next[0].id);
      return next;
    });
  }, [activeId, switchScene]);

  // ── Auto-play slideshow ───────────────────────────────────────────────────
  const stopAutoPlay = useCallback(() => {
    if (playTimerRef.current) { clearInterval(playTimerRef.current); playTimerRef.current = null; }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setScenes((prev) => {
          setActiveId((cur) => {
            const idx = prev.findIndex((s) => s.id === cur);
            const next = prev[(idx + 1) % prev.length];
            if (next) setTimeout(() => switchScene(next.id), 0);
            return next?.id ?? cur;
          });
          return prev;
        });
      }, 6000);
    } else {
      if (playTimerRef.current) { clearInterval(playTimerRef.current); playTimerRef.current = null; }
    }
    return () => { if (playTimerRef.current) clearInterval(playTimerRef.current); };
  }, [isPlaying, switchScene]);

  // ── Auto-rotate in 3D mode ────────────────────────────────────────────────
  useEffect(() => {
    if (!viewerRef.current) return;
    if (viewMode === "3d" && !isPlaying) {
      if (!autoRotateRef.current) {
        const ar = Marzipano.autorotate({ yawSpeed: 0.2, yawAccel: 0.1, targetPitch: 0, targetFov: 75 * Math.PI / 180 });
        viewerRef.current.startMovement(ar);
        autoRotateRef.current = ar;
      }
    } else {
      if (autoRotateRef.current && viewerRef.current) {
        viewerRef.current.stopMovement();
        autoRotateRef.current = null;
      }
    }
  }, [viewMode, isPlaying]);

  // ── Prev / Next ───────────────────────────────────────────────────────────
  const goNext = () => {
    const idx = scenes.findIndex((s) => s.id === activeId);
    const next = scenes[(idx + 1) % scenes.length];
    if (next) switchScene(next.id);
  };
  const goPrev = () => {
    const idx = scenes.findIndex((s) => s.id === activeId);
    const prev = scenes[(idx - 1 + scenes.length) % scenes.length];
    if (prev) switchScene(prev.id);
  };

  const activeScene = scenes.find((s) => s.id === activeId);
  const activeIdx = scenes.findIndex((s) => s.id === activeId);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnail into view
  useEffect(() => {
    const el = thumbsRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIdx]);

  // ─── Gallery button toggle ─────────────────────────────────────
  const handleGalleryClick = () => {
    setShowThumbnails(prev => !prev);
  };

  // ─── Floors button (placeholder) ─────────────────────────────────────────
  const handleFloorsClick = () => {
    // Future: show floor plan overlay
    console.log("Floors/etaje clicked");
  };

  // ─── Top View ─────────────────────────────────────────────────────────────
  const handleTopView = () => {
    if (!viewerRef.current) return;
    const view = viewerRef.current.view();
    if (view) view.setPitch(-Math.PI / 2.2);
  };

  // ─── Play / Pause toggle ──────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      setIsPlaying(true);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const config = {
        scenes, activeId, accentColor, transitionType, transitionDuration,
        bubbleBg, bubbleOpacity, bubbleColor, bubbleBlur
      };
      const res = await fetch('/api/export', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'virtual-tour.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Export failed. Check console.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-full bg-[#0a0c0b]">
        <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-accent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="flex h-[100dvh] w-full overflow-hidden bg-[#0a0c0b] select-none"
      style={{
        fontFamily: "var(--font-sans)",
        "--accent": accentColor,
        "--color-accent": accentColor,
        "--primary": accentColor,
        "--color-primary": accentColor,
        "--ring": accentColor,
        "--color-ring": accentColor,
      } as any}
    >
      {/* ── Left Settings Panel ──────────────────────────────────────────────── */}
      {!isExported && (
        <LeftPanel
          transitionType={transitionType} setTransitionType={setTransitionType}
          transitionDuration={transitionDuration} setTransitionDuration={setTransitionDuration}
          bubbleBg={bubbleBg} setBubbleBg={setBubbleBg}
          bubbleOpacity={bubbleOpacity} setBubbleOpacity={setBubbleOpacity}
          bubbleColor={bubbleColor} setBubbleColor={setBubbleColor}
          bubbleBlur={bubbleBlur} setBubbleBlur={setBubbleBlur}
          accentColor={accentColor} setAccentColor={setAccentColor}
          onExport={handleExport} isExporting={isExporting}
        />
      )}

      {/* ── Central Viewer ─────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Marzipano pano */}
        <div id="pano" ref={panoRef} className="absolute inset-0 w-full h-full" style={{ cursor: "grab" }} />

        {/* Gradient overlays for UI legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent pointer-events-none z-10" />

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className={`absolute top-0 left-0 right-0 flex items-start justify-between p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pl-[calc(1.25rem+env(safe-area-inset-left))] pr-[calc(1.25rem+env(safe-area-inset-right))] z-20 pointer-events-none transition-all duration-500 ease-in-out ${isPlaying ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
          {/* Logo + address */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2">
              <Compass size={16} className="text-accent" />
              <span className="text-white font-semibold text-sm tracking-wide">Prode<span className="text-accent">Go</span></span>
            </div>
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2">
              <span className="text-white/70 text-xs font-medium flex items-center gap-1.5">
                <MapPin size={11} className="text-accent" />
                Str. Florilor 12, Cluj-Napoca
              </span>
            </div>
          </div>

          {/* Agent card */}
          {agentOpen ? (
            <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-64 overflow-hidden">
              <div className="flex items-center gap-3 p-4 pb-3">
                <img src={AGENT.avatar} alt={AGENT.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{AGENT.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{AGENT.title}</div>
                </div>
                <button onClick={() => setAgentOpen(false)} className="ml-auto text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={12} className="text-accent flex-shrink-0" />
                  <span className="font-medium">{AGENT.phone}</span>
                  <CopyButton text={AGENT.phone} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={12} className="text-accent flex-shrink-0" />
                  <span className="font-medium truncate">{AGENT.email}</span>
                  <CopyButton text={AGENT.email} />
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <a href={`tel:${AGENT.phone.replace(/\s/g, "")}`} className="flex-1 bg-accent text-black text-xs font-semibold rounded-lg py-2 text-center hover:opacity-90 transition-opacity">Call Now</a>
                <a href={`mailto:${AGENT.email}`} className="flex-1 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg py-2 text-center hover:bg-gray-50 transition-colors">Email</a>
              </div>
            </div>
          ) : (
            <button onClick={() => setAgentOpen(true)} className="pointer-events-auto bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 hover:shadow-2xl transition-shadow">
              <img src={AGENT.avatar} alt={AGENT.name} className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-xs font-semibold text-gray-800">{AGENT.name}</span>
            </button>
          )}
        </div>

        {/* ── Bottom controls ─────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pl-[calc(1.25rem+env(safe-area-inset-left))] pr-[calc(1.25rem+env(safe-area-inset-right))] flex flex-col gap-3">
          {/* Room label + Prev/Next */}
          <div className={`flex items-end justify-between transition-all duration-500 ease-in-out ${(!isPlaying || showTitleTemp) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            <div>
              <p className="text-white/40 text-xs font-medium tracking-widest uppercase mb-1">
                {activeIdx + 1} / {scenes.length}
              </p>
              <h2 className="text-white font-semibold text-xl leading-tight">{activeScene?.label ?? "—"}</h2>
            </div>
            {/* Hide Prev/Next buttons completely in autoplay to keep it clean */}
            <div className={`flex items-center gap-2 translate-y-1.5 transition-all duration-300 ${isPlaying ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"}`}>
              <button id="btn-prev" onClick={goPrev} className="w-[42px] h-[42px] rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button id="btn-next" onClick={goNext} className="w-[42px] h-[42px] rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Main controls row */}
          <div className="flex flex-wrap items-center w-full justify-between">
            {/* ── LEFT toolbar (custom SVGs) ──────────────────────────────── */}
            <div
              className="flex items-center gap-1 rounded-2xl p-1.5 flex-shrink-0 order-1"
                style={{
                  background: bubbleBgStyle,
                  backdropFilter: bubbleBlurStyle,
                  WebkitBackdropFilter: bubbleBlurStyle,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Settings */}
                <button
                  id="btn-settings"
                  className={`shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden hover:bg-white/12 ${isPlaying ? "w-0 h-0 opacity-0 m-0" : "w-10 h-10 opacity-100"}`}
                  style={{ color: bubbleColor }}
                  title="Settings"
                >
                  <IcoSettings size={24} />
                </button>

                {/* Gallery */}
                <button
                  id="btn-gallery"
                  onClick={handleGalleryClick}
                  className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all hover:bg-white/12"
                  style={{ color: bubbleColor }}
                  title="Toggle Gallery"
                >
                  <IcoGallery size={18} />
                </button>

                {/* Floors */}
                <button
                  id="btn-floors"
                  onClick={handleFloorsClick}
                  className={`shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden hover:bg-white/12 ${isPlaying ? "w-0 h-0 opacity-0 m-0" : "w-10 h-10 opacity-100"}`}
                  style={{ color: bubbleColor }}
                  title="Floors / Etaje"
                >
                  <IcoFloors size={19} />
                </button>

                {/* Play/Pause (walk mode) OR Top View (3D mode) */}
                <button
                  id="btn-play-topview"
                  onClick={() => viewMode === "walk" ? handlePlayPause() : handleTopView()}
                  className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all overflow-hidden ${viewMode === "walk" && isPlaying ? "bg-accent" : "hover:bg-white/12"
                    }`}
                  style={{ color: viewMode === "walk" && isPlaying ? "#000" : bubbleColor }}
                  title={viewMode === "walk" ? (isPlaying ? "Pause tour" : "Play tour") : "Top View"}
                >
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${viewMode === "walk" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50 pointer-events-none"}`}>
                    {isPlaying ? (
                      <div className="translate-x-[1px]"><IcoPause size={18} /></div>
                    ) : (
                      <div className="translate-x-[2px]"><IcoPlay size={18} /></div>
                    )}
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${viewMode === "3d" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50 pointer-events-none"}`}>
                    <IcoTopView size={19} />
                  </div>
                </button>
              </div>

            {/* ── Thumbnail strip ─────────────────────────────────────────── */}
            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex items-center order-3 landscape:order-2 portrait:w-full ${showThumbnails ? "landscape:flex-1 landscape:max-w-[1500px] landscape:mx-3 portrait:max-h-[100px] portrait:mt-3 portrait:opacity-100" : "landscape:flex-none landscape:max-w-0 landscape:mx-0 portrait:max-h-0 portrait:mt-0 portrait:opacity-0"
                }`}
            >
              <div className={`w-full overflow-x-auto py-1 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showThumbnails ? 'translate-x-0 translate-y-0' : 'landscape:-translate-x-16 portrait:translate-y-8'}`} style={{ scrollbarWidth: "none" }}>
                <div ref={thumbsRef} className="flex gap-2 px-1 w-max">
                    {scenes.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => switchScene(s.id)}
                        className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200
                        ${s.id === activeId
                            ? "ring-2 ring-accent ring-offset-1 ring-offset-black/50 scale-100"
                            : "opacity-60 hover:opacity-90 scale-95 hover:scale-100"
                          }`}
                        style={{ width: 96, height: 60 }}
                      >
                        <img src={s.thumb} alt={s.label} className="w-full h-full object-cover" draggable={false} />
                        {s.id === activeId && <div className="absolute inset-0 bg-accent/10" />}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                          <span className="text-white text-[9px] font-medium leading-none block truncate">{s.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
            </div>

            {/* ── View Mode Switch (right side) ───────────────────────────── */}
            <div className={`flex-shrink-0 transition-all duration-500 ease-in-out order-2 landscape:order-3 ${isPlaying ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-100 translate-x-0"}`}>
              <ViewModeSwitch
                value={viewMode}
                onChange={setViewMode}
                bgStyle={bubbleBgStyle}
                blurStyle={bubbleBlurStyle}
              />
            </div>
          </div>

          {/* Playing progress bar */}
          {isPlaying && (
            <div className="w-full h-0.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ animation: "tourprogress 6s linear infinite" }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Right Scenes Panel ──────────────────────────────────────────────── */}
      {!isExported && (
        <RightPanel
          scenes={scenes} activeId={activeId}
          onSceneClick={switchScene}
          onUpload={handleUpload}
          onDeleteScene={deleteScene}
        />
      )}

      <style>{`
        @keyframes tourprogress {
          from { width: 0%; }
          to { width: 100%; }
        }
        #pano canvas { display: block; }
        #pano { cursor: grab; }
        #pano:active { cursor: grabbing; }
      `}</style>
    </div>
  );
}
