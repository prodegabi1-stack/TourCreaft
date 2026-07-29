import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { get, set } from "idb-keyval";
import { Phone, Mail, Copy, X, MapPin, Compass, ChevronLeft, ChevronRight, Maximize, Minimize, CircleHelp, Glasses, Info, Share2 } from "lucide-react";

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
function IcoTexture({ size = 20 }: { size?: number }) {
  // Exact from Texture.svg (viewBox 0 0 41 41)
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 40L40 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11.7586 40L40 11.7586" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22.5172 40L40 22.5172" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 18.4828L18.4828 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M33.2759 40L40 33.2759" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 7.72414L7.72414 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 29.2414L29.2414 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
interface HotspotData {
  id: string;
  yaw: number;
  pitch: number;
  targetId: string | null;
  targetYaw?: number;
  targetPitch?: number;
  targetFov?: number;
  style?: "glow" | "chevron" | "label" | "floor-glow";
}

interface SceneData {
  id: string;
  label: string;
  img: string;
  img4k?: string;
  thumb: string;
  width?: number;
  scene?: any; // Marzipano scene
  isHighlight?: boolean;
  highlightLabel?: string;
  hotspots?: HotspotData[];
  highlightYaw?: number;
  highlightPitch?: number;
  highlightFov?: number;
  floor?: string;
}

interface FloorConfig {
  targetId: string | null;
  targetYaw?: number;
  targetPitch?: number;
  targetFov?: number;
}
type TargetCaptureModeType = 
  | { type: "hotspot"; sourceSceneId: string; hotspotId: string }
  | { type: "floor"; sourceSceneId: string; floorIndex: number };

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
  hasFloors, setHasFloors,
  has3D, setHas3D,
  floorsList, setFloorsList,
  floorConfigs, onUpdateFloorConfig, onStartFloorTargetCapture,
  scenes, activeId,
  onExport, isExporting,
  modelUrl, onModelUpload, onModelRemove,
  untexturedModelUrl, onUntexturedModelUpload, onUntexturedModelRemove
}: any) {
  const modelInputRef = useRef<HTMLInputElement>(null);
  const untexturedModelInputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className="flex-shrink-0 flex flex-col border-r border-white/8 bg-[#0f1110] overflow-hidden"
      style={{ width: 268 }}
    >
      <div style={{ width: 268, minWidth: 268 }} className="h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <span className="text-xs font-bold tracking-widest uppercase text-white/40">Tour Settings</span>
        </div>

        <div className="flex flex-col gap-0 overflow-y-auto flex-1 pb-6">
          {/* Transition */}
          <section className="px-4 py-3 border-b border-white/6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2">Transition</p>
            <div className="flex flex-col gap-2">
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
          <section className="px-4 py-3 border-b border-white/6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2">Controls Style</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between text-xs text-white/60">
                <span>Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={bubbleBg}
                    onChange={(e) => setBubbleBg(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-white/10 bg-transparent"
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
                    className="w-5 h-5 rounded cursor-pointer border border-white/10 bg-transparent"
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
                    className="w-5 h-5 rounded cursor-pointer border border-white/10 bg-transparent"
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

          {/* Floors settings */}
          <section className="px-4 py-3 border-b border-white/6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-2">Organizare Etaje</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[11px] text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFloors}
                  onChange={(e) => setHasFloors(e.target.checked)}
                  className="accent-accent"
                />
                Proiectul are mai multe etaje
              </label>
              {hasFloors && (
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col gap-1 text-[10px] text-white/60">
                    Număr etaje
                    <input
                      type="number" min={0} max={20}
                      value={parseInt(floorsList) || 0}
                      onChange={(e) => setFloorsList(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
                    />
                  </label>
                  
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1 mt-1 border-t border-white/10 pt-2">
                    {Array.from({ length: (parseInt(floorsList) || 0) + 1 }).map((_, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5 relative">
                        <div className="text-[11px] font-semibold text-accent">Etaj {idx} {idx === 0 ? "(Parter)" : ""}</div>
                        
                        <label className="flex flex-col gap-1 text-[10px] text-white/50">
                          Target Scene
                          <select
                            value={floorConfigs[idx]?.targetId || ""}
                            onChange={(e) => onUpdateFloorConfig(idx, { targetId: e.target.value || null })}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
                          >
                            <option value="">-- Select Scene --</option>
                            {scenes.filter((s: any) => s.floor === `Etaj ${idx}`).map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </label>

                        {floorConfigs[idx]?.targetId && (
                          <button
                            onClick={() => onStartFloorTargetCapture(idx, floorConfigs[idx].targetId!)}
                            className="mt-1 bg-white/10 text-white text-[10px] py-1.5 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                          >
                            {floorConfigs[idx]?.targetYaw !== undefined ? "Update Target Angle" : "Set Target Angle"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

          {/* 3D Model Upload */}
          <section className="px-5 py-4 border-b border-white/6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[11px] text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={has3D}
                  onChange={(e) => setHas3D(e.target.checked)}
                  className="accent-accent"
                />
                Proiectul are model 3D
              </label>
            </div>
            
            {has3D && (
              <>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">Textured 3D Model</p>
              <input
                ref={modelInputRef} type="file" accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onModelUpload(file);
                }}
              />
              {modelUrl ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent flex-shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    <span className="text-white/60 text-xs truncate flex-1">Textured Model</span>
                    <button onClick={onModelRemove} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"><X size={14} /></button>
                  </div>
                  <button onClick={() => modelInputRef.current?.click()} className="text-xs text-accent hover:underline text-left">Replace model...</button>
                </div>
              ) : (
                <button onClick={() => modelInputRef.current?.click()} className="w-full border-2 border-dashed border-white/15 hover:border-accent/50 rounded-xl py-4 text-center transition-all cursor-pointer">
                  <svg className="mx-auto mb-1.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p className="text-xs text-white/40"><span className="text-accent">Upload</span> .GLB / .GLTF</p>
                </button>
              )}
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3">Untextured 3D Model</p>
              <input
                ref={untexturedModelInputRef} type="file" accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUntexturedModelUpload(file);
                }}
              />
              {untexturedModelUrl ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent flex-shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    <span className="text-white/60 text-xs truncate flex-1">Untextured Model</span>
                    <button onClick={onUntexturedModelRemove} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"><X size={14} /></button>
                  </div>
                  <button onClick={() => untexturedModelInputRef.current?.click()} className="text-xs text-accent hover:underline text-left">Replace model...</button>
                </div>
              ) : (
                <button onClick={() => untexturedModelInputRef.current?.click()} className="w-full border-2 border-dashed border-white/15 hover:border-accent/50 rounded-xl py-4 text-center transition-all cursor-pointer">
                  <svg className="mx-auto mb-1.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p className="text-xs text-white/40"><span className="text-accent">Upload</span> .GLB / .GLTF</p>
                </button>
              )}
            </div>
            </>
            )}
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
  scenes, activeId, activeHotspotId, setActiveHotspotId, hasFloors, floorsList, onSceneClick, onUpload, onDeleteScene, onUpdateScene, onReorderScenes, onCaptureHighlight,
  onAddHotspot, onUpdateHotspot, onDeleteHotspot, onStartTargetCapture
}: {
  scenes: SceneData[]; activeId: string | null; activeHotspotId: string | null; setActiveHotspotId: (id: string | null) => void; hasFloors: boolean; floorsList: string; onSceneClick: (id: string) => void;
  onUpload: (files: FileList) => void; onDeleteScene: (id: string) => void;
  onUpdateScene: (id: string, updates: Partial<SceneData>) => void;
  onReorderScenes: (startIndex: number, endIndex: number) => void;
  onCaptureHighlight: (id: string) => void;
  onAddHotspot: (sceneId: string) => void;
  onUpdateHotspot: (sceneId: string, hotspotId: string, updates: Partial<HotspotData>) => void;
  onDeleteHotspot: (sceneId: string, hotspotId: string) => void;
  onStartTargetCapture: (sourceSceneId: string, hotspotId: string, targetId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const activeScene = scenes.find(s => s.id === activeId);

  useEffect(() => {
    if (activeHotspotId) {
      const el = document.getElementById(`hs-config-${activeHotspotId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeHotspotId]);

  return (
    <div className="flex-shrink-0 w-[320px] bg-[#0f1110] border-l border-white/10 flex flex-col overflow-hidden">
      {/* Compact Upload zone */}
      <div className="p-3 flex-shrink-0 border-b border-white/10 bg-[#151817]">
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
          className={`border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-all select-none
          ${dragOver ? "border-accent bg-accent/10 text-accent" : "border-white/20 text-white/50 hover:border-white/40 hover:bg-white/5 hover:text-white/90"}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-xs font-semibold">Upload 360° Photos</span>
        </div>
      </div>

      {/* Scene list (Moved up) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {scenes.length === 0 && (
          <div className="text-center text-white/20 text-xs py-8">No scenes yet.<br />Upload 360° photos to start.</div>
        )}
        {scenes.map((s, idx) => (
          <div
            key={s.id}
            draggable
            onDragStart={(e) => {
              setDraggedIdx(idx);
              e.dataTransfer.effectAllowed = "move";
              if (e.dataTransfer) e.dataTransfer.setData("text/plain", idx.toString());
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedIdx !== null && draggedIdx !== idx) onReorderScenes(draggedIdx, idx);
              setDraggedIdx(null);
            }}
            onClick={() => onSceneClick(s.id)}
            className={`group relative flex items-center gap-3 rounded-xl p-2 cursor-pointer border transition-all
            ${s.id === activeId ? "bg-accent/10 border-accent/30" : "bg-white/3 border-white/6 hover:bg-white/6 hover:border-white/12"}
            ${draggedIdx === idx ? "opacity-50" : ""}`}
          >
            <div className="w-12 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/8">
              <img src={s.thumb} alt={s.label} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${s.id === activeId ? "text-accent" : "text-white/80"}`}>{s.label}</p>
              {s.isHighlight && <p className="text-[9px] text-accent mt-0.5 uppercase tracking-wider">Highlight</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteScene(s.id); }}
              className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400 transition-all p-1"
              title="Delete Scene"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Active Scene (Moved to bottom) */}
      {activeScene && (
        <div className="px-4 py-4 flex flex-col gap-3 flex-shrink-0 border-t border-white/10 bg-[#151817] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Edit Scene: <span className="text-white/70">{activeScene.label}</span></p>
          <label className="flex flex-col gap-1 text-[11px] text-white/60">
            Name
            <input
              type="text"
              value={activeScene.label}
              onChange={(e) => onUpdateScene(activeId!, { label: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
            />
          </label>
          <label className="flex items-center gap-2 text-[11px] text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={!!activeScene.isHighlight}
              onChange={(e) => onUpdateScene(activeId!, { isHighlight: e.target.checked })}
              className="accent-accent"
            />
            Show in bottom gallery (Highlight)
          </label>
          
          {hasFloors && (
            <label className="flex flex-col gap-1 text-[11px] text-white/60 mt-3">
              Etaj
              <select
                value={activeScene.floor || ""}
                onChange={(e) => onUpdateScene(activeId!, { floor: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
              >
                <option value="">-- Neselectat --</option>
                {Array.from({ length: (parseInt(floorsList) || 0) + 1 }).map((_, idx) => (
                  <option key={idx} value={`Etaj ${idx}`}>{`Etaj ${idx}`}</option>
                ))}
              </select>
            </label>
          )}
          {activeScene.isHighlight && (
            <div className="flex flex-col gap-2 pl-6 mt-1 border-l-2 border-white/10">
              <label className="flex flex-col gap-1 text-[10px] text-white/60">
                Highlight Label (Optional)
                <input
                  type="text"
                  placeholder="Leave empty to hide label"
                  value={activeScene.highlightLabel || ""}
                  onChange={(e) => onUpdateScene(activeId!, { highlightLabel: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white outline-none focus:border-accent w-full"
                />
              </label>
              <button
                onClick={() => onCaptureHighlight(activeId!)}
                className="bg-white/10 text-white text-[10px] py-1 rounded hover:bg-white/20 transition-colors border border-white/10"
              >
                Set Thumbnail
              </button>
            </div>
          )}
          <div className="flex flex-col gap-1.5 mt-1">
            <p className="text-[9px] font-bold tracking-widest uppercase text-white/30 border-t border-white/10 pt-2">Hotspots</p>
            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
              {activeScene.hotspots?.filter(hs => hs && hs.id).map((hs, i) => (
                <div id={`hs-config-${hs.id}`} key={hs.id} onClick={() => setActiveHotspotId(hs.id)} className={`transition-all duration-300 border rounded-xl p-3 flex flex-col gap-2 relative flex-shrink-0 cursor-pointer ${activeHotspotId === hs.id ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(200,169,110,0.15)]" : "bg-white/5 border-white/10"}`}>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteHotspot(activeId!, hs.id); }} className="absolute top-2 right-2 text-white/30 hover:text-red-400"><X size={14} /></button>
                  <div className={`text-[11px] font-semibold ${activeHotspotId === hs.id ? "text-accent" : "text-white/80"}`}>Hotspot {i + 1}</div>

                  <label className="flex flex-col gap-1 text-[10px] text-white/50">
                    Target Scene
                    <select
                      value={hs.targetId || ""}
                      onChange={(e) => onUpdateHotspot(activeId!, hs.id, { targetId: e.target.value || null })}
                      className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
                    >
                      <option value="">-- Select Target --</option>
                      {scenes.filter(s => s.id !== activeId).map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-[10px] text-white/50">
                    Style
                    <select
                      value={hs.style}
                      onChange={(e) => onUpdateHotspot(activeId!, hs.id, { style: e.target.value as any })}
                      className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-accent w-full"
                    >
                      <option value="glow">Glow (Default)</option>
                      <option value="floor-glow">Floor (Tilted)</option>
                      <option value="chevron">Chevron (Directional)</option>
                      <option value="label">Floating Label</option>
                    </select>
                  </label>

                  {hs.targetId && (
                    <button
                      onClick={() => onStartTargetCapture(activeId!, hs.id, hs.targetId!)}
                      className="mt-1 bg-white/10 text-white text-[10px] py-1.5 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                    >
                      {hs.targetYaw !== undefined ? "Update Target Angle" : "Set Target Angle"}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => onAddHotspot(activeId!)}
              className="mt-1 bg-accent/20 text-accent font-medium text-[11px] py-1.5 rounded-lg hover:bg-accent/30 transition-colors border border-accent/20"
            >
              + Adaugă hotspot (Current View)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const isExported = typeof window !== "undefined" && (window as any).__TOUR_CONFIG__ !== undefined;

const getMaxTextureSize = () => {
  if (typeof window === "undefined") return 8192;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // @ts-ignore
    return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 4096;
  } catch (e) {
    return 4096; // fallback for very old browsers
  }
};
const MAX_TEXTURE_SIZE = getMaxTextureSize();

export default function App() {
  const initialConfig = isExported ? (window as any).__TOUR_CONFIG__ : null;

  // UI state
  const [showThumbnails, setShowThumbnails] = useState(true);
  const galleryInitDone = useRef(false);

  // Viewer
  const [viewMode, setViewMode] = useState<"walk" | "3d">("walk");
  const [isPlaying, setIsPlaying] = useState(false);
  const [agentOpen, setAgentOpen] = useState(true);
  const [scenes, setScenes] = useState<SceneData[]>(initialConfig?.scenes || DEMO_ROOMS);
  const [activeId, setActiveId] = useState<string>(initialConfig?.activeId || "demo_1");
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Settings state
  const [hasFloors, setHasFloors] = useState(initialConfig?.hasFloors || false);
  const [has3D, setHas3D] = useState(initialConfig?.has3D ?? true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [floorsList, setFloorsList] = useState(initialConfig?.floorsList || "2");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!has3D && viewMode === "3d") {
      setViewMode("walk");
    }
  }, [has3D, viewMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const openSpaceInfo = () => {
    setAgentOpen(true);
    setShowSettingsMenu(false);
  };

  const showHelp = () => {
    setShowSettingsMenu(false);
    window.alert("Use the settings menu to open space info, share the tour, enter VR/3D mode, or toggle fullscreen.");
  };

  const shareTour = async () => {
    setShowSettingsMenu(false);

    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Ignore share cancellations and clipboard failures.
    }
  };

  const enterVr = () => {
    setShowSettingsMenu(false);
    if (has3D) {
      setViewMode("3d");
    }
  };

  const handleFullscreenMenuAction = () => {
    setShowSettingsMenu(false);
    toggleFullscreen();
  };

  const [floorConfigs, setFloorConfigs] = useState<Record<number, FloorConfig>>(initialConfig?.floorConfigs || {});
  const [accentColor, setAccentColor] = useState(initialConfig?.accentColor || "#c8a96e");
  const [transitionType, setTransitionType] = useState(initialConfig?.transitionType || "fade");
  const [transitionDuration, setTransitionDuration] = useState(initialConfig?.transitionDuration ?? 0.6);
  const [bubbleBg, setBubbleBg] = useState(initialConfig?.bubbleBg || "#000000");
  const [bubbleOpacity, setBubbleOpacity] = useState(initialConfig?.bubbleOpacity ?? 0.45);
  const [bubbleColor, setBubbleColor] = useState(initialConfig?.bubbleColor || "#ffffff");
  const [bubbleBlur, setBubbleBlur] = useState(initialConfig?.bubbleBlur ?? true);

  // Triggers re-renders when Marzipano async loading finishes
  const [sceneLoadedToken, setSceneLoadedToken] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(!isExported);
  const [isExporting, setIsExporting] = useState(false);
  const [showTitleTemp, setShowTitleTemp] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(initialConfig?.modelUrl || null);
  const [untexturedModelUrl, setUntexturedModelUrl] = useState<string | null>(initialConfig?.untexturedModelUrl || null);
  const [showTexturedModel, setShowTexturedModel] = useState(true);

  // Hotspot capture mode
  const [targetCaptureMode, setTargetCaptureMode] = useState<TargetCaptureModeType | null>(null);
  const [showFloorsMenu, setShowFloorsMenu] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setShowTitleTemp(true);
      const timer = setTimeout(() => setShowTitleTemp(false), 2500); // slightly longer for initial read
      return () => clearTimeout(timer);
    }
  }, [sceneLoadedToken, isPlaying]);

  useEffect(() => {
    async function loadData() {
      if (isExported) {
        setIsLoading(false);
        return;
      }
      try {
        const storedScenes = await get("scenes");
        if (storedScenes && storedScenes.length > 0) {
          setScenes(storedScenes);
          setActiveId(storedScenes[0].id);
        } else {
          setActiveId(DEMO_ROOMS[0].id);
        }
        const storedHasFloors = await get("hasFloors");
        if (storedHasFloors !== undefined) setHasFloors(storedHasFloors);
        const storedHas3D = await get("has3D");
        if (storedHas3D !== undefined) setHas3D(storedHas3D);
        const storedFloorsList = await get("floorsList");
        if (storedFloorsList) setFloorsList(storedFloorsList);
        const storedFloorConfigs = await get("floorConfigs");
        if (storedFloorConfigs) setFloorConfigs(storedFloorConfigs);
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
        const model = await get("modelUrl");
        if (model) setModelUrl(model);
        const untexturedModel = await get("untexturedModelUrl");
        if (untexturedModel) setUntexturedModelUrl(untexturedModel);
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
    set("hasFloors", hasFloors).catch(console.error);
    set("has3D", has3D).catch(console.error);
    set("floorsList", floorsList).catch(console.error);
    set("floorConfigs", floorConfigs).catch(console.error);
    set("accentColor", accentColor).catch(console.error);
    set("transitionType", transitionType).catch(console.error);
    set("transitionDuration", transitionDuration).catch(console.error);
    set("bubbleBg", bubbleBg).catch(console.error);
    set("bubbleOpacity", bubbleOpacity).catch(console.error);
    set("bubbleColor", bubbleColor).catch(console.error);
    set("bubbleBlur", bubbleBlur).catch(console.error);
    if (modelUrl) set("modelUrl", modelUrl).catch(console.error);
    else set("modelUrl", null).catch(console.error);

    if (untexturedModelUrl) set("untexturedModelUrl", untexturedModelUrl).catch(console.error);
    else set("untexturedModelUrl", null).catch(console.error);
  }, [hasFloors, has3D, floorsList, accentColor, transitionType, transitionDuration, bubbleBg, bubbleOpacity, bubbleColor, bubbleBlur, modelUrl, untexturedModelUrl, isLoading]);

  // Marzipano refs
  const panoRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const marzScenes = useRef<Map<string, any>>(new Map());
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<any>(null);
  const hotspotObjsRef = useRef<{ [sceneId: string]: any[] }>({});

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
      switchScene(activeId);
    }

    return () => { /* cleanup handled by scene replacement */ };
  }, [isLoading]); // Runs when isLoading becomes false and the div is mounted

  // ── Load scene into Marzipano ─────────────────────────────────────────────
  const loadMarzipanoScene = useCallback(async (sceneData: SceneData): Promise<any> => {
    if (!viewerRef.current) return null;
    if (marzScenes.current.has(sceneData.id)) return marzScenes.current.get(sceneData.id);

    let imgSrc = sceneData.img;
    let imgWidth = sceneData.width;

    // Use 4K image if device limits us and we have it
    if (MAX_TEXTURE_SIZE < 8192 && sceneData.img4k) {
      imgSrc = sceneData.img4k;
      if (imgWidth) imgWidth = Math.min(imgWidth, 4096);
    }

    if (!imgWidth) {
      const img = new Image();
      img.src = imgSrc;
      await new Promise((res) => { img.onload = res; img.onerror = res; });
      imgWidth = img.naturalWidth || 4096;
    }

    const source = Marzipano.ImageUrlSource.fromString(imgSrc);
    const geometry = new Marzipano.EquirectGeometry([{ width: imgWidth }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(imgWidth, 100 * Math.PI / 180, 120 * Math.PI / 180, 30 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({ yaw: 0, pitch: 0, fov: 75 * Math.PI / 180 }, limiter);
    const scene = viewerRef.current.createScene({ source, geometry, view, pinFirstLevel: true });
    marzScenes.current.set(sceneData.id, scene);
    return scene;
  }, []);

  // ── Switch to a scene ─────────────────────────────────────────────────────
  const switchScene = useCallback(async (id: string, overrideYaw?: number, overridePitch?: number, overrideFov?: number) => {
    if (!viewerRef.current) return;
    const sceneData = scenes.find((s) => s.id === id);
    if (!sceneData) return;
    setActiveId(id);

    const mScene = await loadMarzipanoScene(sceneData);
    if (!mScene) return;

    if (overrideYaw !== undefined && overridePitch !== undefined) {
      mScene.view().setYaw(overrideYaw);
      mScene.view().setPitch(overridePitch);
      if (overrideFov !== undefined) mScene.view().setFov(overrideFov);
    } else if (sceneData.isHighlight && sceneData.highlightYaw !== undefined) {
      mScene.view().setYaw(sceneData.highlightYaw);
      mScene.view().setPitch(sceneData.highlightPitch);
      if (sceneData.highlightFov !== undefined) {
        mScene.view().setFov(sceneData.highlightFov);
      }
    }

    try {
      let transition = undefined;
      if (transitionType !== "none" && transitionDuration > 0) {
        if (transitionType === "fade") transition = { transitionDuration: transitionDuration * 1000, transitionUpdate: Marzipano.TransitionUpdate.opacity() };
        else if (transitionType === "zoom") transition = { transitionDuration: transitionDuration * 1000, transitionUpdate: Marzipano.TransitionUpdate.zoom() };
      }
      mScene.switchTo(transition);
      setSceneLoadedToken((t) => t + 1); // Trigger hotspot rendering now that the scene is guaranteed in marzScenes
    } catch {
      try {
        mScene.switchTo();
        setSceneLoadedToken((t) => t + 1);
      } catch (_) { }
    }
  }, [scenes, loadMarzipanoScene, transitionType, transitionDuration]);


  // ── Upload handler (with image optimization) ──────────────────────────────
  const handleUpload = useCallback((files: FileList) => {
    Array.from(files).forEach((file, idx) => {
      if (!file.type.match("image.*")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          // ── Optimized main image (High Quality 8K, JPEG 0.92) ──
          const MAX_W = 8192;
          const MAX_H = 4096;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w > MAX_W || h > MAX_H) {
            const ratio = Math.min(MAX_W / w, MAX_H / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const mainCanvas = document.createElement("canvas");
          mainCanvas.width = w;
          mainCanvas.height = h;
          const mainCtx = mainCanvas.getContext("2d")!;
          // Use high-quality downscaling
          mainCtx.imageSmoothingEnabled = true;
          mainCtx.imageSmoothingQuality = "high";
          mainCtx.drawImage(img, 0, 0, w, h);
          const optimizedImg = mainCanvas.toDataURL("image/jpeg", 0.92);

          // ── Optimized fallback image (4K, JPEG 0.90) ──
          const MAX_W_4K = 4096;
          const MAX_H_4K = 2048;
          let w4k = img.naturalWidth;
          let h4k = img.naturalHeight;
          if (w4k > MAX_W_4K || h4k > MAX_H_4K) {
            const ratio4k = Math.min(MAX_W_4K / w4k, MAX_H_4K / h4k);
            w4k = Math.round(w4k * ratio4k);
            h4k = Math.round(h4k * ratio4k);
          }
          const canvas4k = document.createElement("canvas");
          canvas4k.width = w4k;
          canvas4k.height = h4k;
          const ctx4k = canvas4k.getContext("2d")!;
          ctx4k.imageSmoothingEnabled = true;
          ctx4k.imageSmoothingQuality = "high";
          ctx4k.drawImage(img, 0, 0, w4k, h4k);
          const img4k = canvas4k.toDataURL("image/jpeg", 0.90);

          // ── Thumbnail (400×200, JPEG 0.90) ──
          const thumbCanvas = document.createElement("canvas");
          thumbCanvas.width = 400; thumbCanvas.height = 200;
          thumbCanvas.getContext("2d")!.drawImage(img, 0, 0, 400, 200);
          const thumb = thumbCanvas.toDataURL("image/jpeg", 0.90);

          const id = `scene_${Date.now()}_${idx}`;
          const label = file.name.replace(/\.[^/.]+$/, "");
          const newScene: SceneData = { id, label, img: optimizedImg, img4k, thumb, width: w };
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
      // Remove the scene itself
      const filtered = prev.filter((s) => s.id !== id);
      // Remove any hotspots pointing to the deleted scene
      const next = filtered.map((s) => ({
        ...s,
        hotspots: (s.hotspots || []).filter((hs) => hs.targetId !== id)
      }));

      if (activeId === id) {
        if (next.length > 0) switchScene(next[0].id);
        else setActiveId(null);
      }
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
      // Immediate jump on play start
      setScenes((prev) => {
        setActiveId((cur) => {
          const curScene = prev.find(s => s.id === cur);
          const highlights = prev.filter(s => s.isHighlight);
          
          let targetScene = curScene;
          if (highlights.length > 0 && !curScene?.isHighlight) {
             targetScene = highlights[0];
          }

          if (targetScene) {
             const pitch = targetScene.highlightPitch ?? 0;
             const fov = targetScene.highlightFov ?? (75 * Math.PI / 180);
             const startYaw = (targetScene.highlightYaw ?? 0) - (30 * Math.PI / 180);
             setTimeout(() => switchScene(targetScene!.id, startYaw, pitch, fov), 0);
          }
          return targetScene?.id ?? cur;
        });
        return prev;
      });

      // Interval for subsequent slides
      playTimerRef.current = setInterval(() => {
        setScenes((prev) => {
          setActiveId((cur) => {
            const highlights = prev.filter(s => s.isHighlight);
            if (highlights.length === 0) return cur;
            
            const curIsHighlight = prev.find(s => s.id === cur)?.isHighlight;
            let next: SceneData;
            if (curIsHighlight) {
              const idx = highlights.findIndex((s) => s.id === cur);
              next = highlights[(idx + 1) % highlights.length];
            } else {
              next = highlights[0];
            }
            
            if (next) {
              const pitch = next.highlightPitch ?? 0;
              const fov = next.highlightFov ?? (75 * Math.PI / 180);
              const startYaw = (next.highlightYaw ?? 0) - (30 * Math.PI / 180);
              setTimeout(() => switchScene(next.id, startYaw, pitch, fov), 0);
            }
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

  // ── Auto-rotate logic ────────────────────────────────────────────────
  useEffect(() => {
    if (!viewerRef.current) return;
    
    if (autoRotateRef.current) {
      viewerRef.current.stopMovement();
      autoRotateRef.current = null;
    }

    if (isPlaying) {
      // 60 degrees over 6 seconds = 10 degrees per second
      const view = viewerRef.current.view();
      const ar = Marzipano.autorotate({ 
        yawSpeed: 10 * Math.PI / 180, 
        yawAccel: 10,
        targetPitch: view.pitch(), 
        targetFov: view.fov() 
      });
      viewerRef.current.startMovement(ar);
      autoRotateRef.current = ar;
    } else if (viewMode === "3d") {
      const ar = Marzipano.autorotate({ 
        yawSpeed: 0.2, 
        yawAccel: 0.1, 
        targetPitch: 0, 
        targetFov: 75 * Math.PI / 180 
      });
      viewerRef.current.startMovement(ar);
      autoRotateRef.current = ar;
    }
  }, [viewMode, isPlaying, sceneLoadedToken]);



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
  const highlightScenes = scenes.filter((s) => s.isHighlight);
  const highlightActiveIdx = highlightScenes.findIndex((s) => s.id === activeId);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnail into view (manual scrollLeft to avoid layout shift)
  useEffect(() => {
    const container = scrollContainerRef.current;
    const thumbsEl = thumbsRef.current;
    if (!container || !thumbsEl || highlightActiveIdx < 0) return;
    const btn = thumbsEl.children[highlightActiveIdx] as HTMLElement | undefined;
    if (!btn) return;
    // Calculate the scroll position to center the active thumbnail
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    const targetScroll = btnCenter - container.clientWidth / 2;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, [highlightActiveIdx]);

  // ── Handle Model Upload ───────────────────────────────────────────────────
  const handleModelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { setModelUrl(e.target?.result as string); };
    reader.readAsDataURL(file);
  };
  const handleModelRemove = () => setModelUrl(null);

  const handleUntexturedModelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { setUntexturedModelUrl(e.target?.result as string); };
    reader.readAsDataURL(file);
  };
  const handleUntexturedModelRemove = () => setUntexturedModelUrl(null);

  // ── Auto-open-then-close gallery on first load ──────────────────────────
  useEffect(() => {
    if (galleryInitDone.current) return;
    galleryInitDone.current = true;
    // Start with gallery visible, then auto-collapse after a short delay
    setShowThumbnails(true);
    const timer = setTimeout(() => {
      setShowThumbnails(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // ─── Gallery button toggle ─────────────────────────────────────
  const handleGalleryClick = () => {
    setShowThumbnails(prev => !prev);
  };



  // ─── Top View ─────────────────────────────────────────────────────────────
  const handleTopView = () => {
    if (viewMode === "3d") {
      // model-viewer: orbit camera to top-down view
      const mv = document.querySelector("model-viewer") as any;
      if (mv) {
        mv.cameraOrbit = "0deg 0deg auto";
        mv.fieldOfView = "30deg";
      }
      return;
    }
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
        scenes, activeId, hasFloors, floorsList, floorConfigs, accentColor, transitionType, transitionDuration,
        bubbleBg, bubbleOpacity, bubbleColor, bubbleBlur, modelUrl, untexturedModelUrl
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

  // ── Scene Modification ────────────────────────────────────────────────────
  const updateScene = useCallback((id: string, updates: Partial<SceneData>) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const reorderScenes = useCallback((startIndex: number, endIndex: number) => {
    setScenes((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const captureHighlight = useCallback((id: string) => {
    if (!viewerRef.current) return;
    const canvas = document.querySelector("#pano canvas") as HTMLCanvasElement;
    if (canvas) {
      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.width = 400;
      thumbCanvas.height = 200;
      const ctx = thumbCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, 400, 200);
        const dataUrl = thumbCanvas.toDataURL("image/jpeg", 0.90);

        const view = viewerRef.current.view();
        updateScene(id, {
          thumb: dataUrl,
          highlightYaw: view.yaw(),
          highlightPitch: view.pitch(),
          highlightFov: view.fov()
        });
      }
    }
  }, [updateScene]);

  const addHotspot = useCallback((sceneId: string) => {
    if (!viewerRef.current) return;
    const view = viewerRef.current.view();
    const newHotspot: HotspotData = {
      id: `hs_${Date.now()}`,
      yaw: view.yaw(),
      pitch: view.pitch(),
      targetId: null,
      style: "glow",
    };
    setScenes((prev) => prev.map(s => {
      if (s.id !== sceneId) return s;
      return { ...s, hotspots: [...(s.hotspots || []), newHotspot] };
    }));
  }, []);

  const updateHotspot = useCallback((sceneId: string, hotspotId: string, updates: Partial<HotspotData>) => {
    setScenes((prev) => prev.map(s => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        hotspots: (s.hotspots || []).map(hs => hs.id === hotspotId ? { ...hs, ...updates } : hs)
      };
    }));
  }, []);

  const deleteHotspot = useCallback((sceneId: string, hotspotId: string) => {
    setScenes((prev) => prev.map(s => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        hotspots: (s.hotspots || []).filter(hs => hs.id !== hotspotId)
      };
    }));
  }, []);

  const startTargetCapture = useCallback((sourceSceneId: string, hotspotId: string, targetId: string) => {
    setTargetCaptureMode({ type: "hotspot", sourceSceneId, hotspotId });
    switchScene(targetId);
  }, [switchScene]);

  const startFloorTargetCapture = useCallback((floorIndex: number, targetId: string) => {
    setTargetCaptureMode({ type: "floor", sourceSceneId: activeId, floorIndex });
    switchScene(targetId);
  }, [activeId, switchScene]);

  const saveTargetCapture = useCallback(() => {
    if (!targetCaptureMode || !viewerRef.current) return;
    const view = viewerRef.current.view();
    
    if (targetCaptureMode.type === "hotspot") {
      updateHotspot(targetCaptureMode.sourceSceneId, targetCaptureMode.hotspotId, {
        targetYaw: view.yaw(),
        targetPitch: view.pitch(),
        targetFov: view.fov()
      });
    } else if (targetCaptureMode.type === "floor") {
      setFloorConfigs(prev => ({
        ...prev,
        [targetCaptureMode.floorIndex]: {
          ...prev[targetCaptureMode.floorIndex],
          targetId: prev[targetCaptureMode.floorIndex]?.targetId || null,
          targetYaw: view.yaw(),
          targetPitch: view.pitch(),
          targetFov: view.fov()
        }
      }));
    }
    
    switchScene(targetCaptureMode.sourceSceneId);
    setTargetCaptureMode(null);
  }, [targetCaptureMode, updateHotspot, switchScene]);

  const cancelTargetCapture = useCallback(() => {
    if (!targetCaptureMode) return;
    switchScene(targetCaptureMode.sourceSceneId);
    setTargetCaptureMode(null);
  }, [targetCaptureMode, switchScene]);

  // ── Hotspot Rendering & Dragging ──────────────────────────────────────────
  const activeHotspots = useMemo(() => scenes.find((s) => s.id === activeId)?.hotspots || [], [scenes, activeId]);

  useEffect(() => {
    const marzScene = marzScenes.current.get(activeId);
    if (!marzScene || !viewerRef.current) return;
    const container = marzScene.hotspotContainer();
    if (!container) return;

    // Clear existing DOM hotspots to avoid duplicates
    if (hotspotObjsRef.current[activeId]) {
      hotspotObjsRef.current[activeId].forEach((hsObj: any) => {
        try { container.destroyHotspot(hsObj); } catch (e) { }
      });
    }
    hotspotObjsRef.current[activeId] = [];

    if (isPlaying) return;

    try {
      activeHotspots.forEach((hsData) => {
        if (typeof hsData.yaw !== 'number' || typeof hsData.pitch !== 'number') return; // Strict check to ignore corrupted hotspots

        const wrapper = document.createElement("div");
        const el = document.createElement("div");
        if (hsData.style === "chevron") el.className = "hs-chevron";
        else if (hsData.style === "floor-glow") {
          el.className = "hs-floor-glow";
          // Dynamic tilt based on absolute pitch: straight down/up (90) = 0 tilt, horizon (0) = 90 tilt
          const pitchDeg = hsData.pitch * (180 / Math.PI);
          let tiltDeg = 90 - Math.abs(pitchDeg);
          if (tiltDeg < 0) tiltDeg = 0;
          if (tiltDeg > 85) tiltDeg = 85; // Cap to prevent making it fully edge-on/invisible
          el.style.rotate = `x ${tiltDeg}deg`;
        }
        else if (hsData.style === "label") {
          el.className = "hs-label";
          const targetScene = scenes.find((s) => s.id === hsData.targetId);
          el.innerText = targetScene ? targetScene.label : "Hotspot";
        } else {
          el.className = "hs-glow"; // default
        }
        wrapper.appendChild(el);

        const options = hsData.style === "floor-glow"
          ? { perspective: { radius: 1000 } }
          : undefined;

        const hotspotObj = container.createHotspot(wrapper, { yaw: hsData.yaw, pitch: hsData.pitch }, options);

        if (isExported) {
          // In exported tour, hotspots are fixed. Clicking them navigates.
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (hsData.targetId) {
              switchScene(hsData.targetId, hsData.targetYaw, hsData.targetPitch, hsData.targetFov);
            }
          });
          // Prevent panning if we just want to click, but allow panning if dragging over it?
          // Actually, let standard pointer events fall through if not clicked, but we can stop propagation on pointerdown so it acts like a button.
          el.addEventListener("pointerdown", (e) => {
            setActiveHotspotId(hsData.id);
            e.stopPropagation(); // Prevent Marzipano from starting a pan when clicking a hotspot
          });
        } else {
          // In Editor Mode, allow dragging to reposition
          let isDragging = false;
          let hasDragged = false;
          let startX = 0, startY = 0;
          let offsetX = 0, offsetY = 0;

          el.addEventListener("pointerdown", (e) => {
            setActiveHotspotId(hsData.id);
            isDragging = true;
            hasDragged = false;
            startX = e.clientX;
            startY = e.clientY;

            if (viewerRef.current) {
              const view = viewerRef.current.view();
              const hsScreen = view.coordinatesToScreen({ yaw: hsData.yaw, pitch: hsData.pitch });
              if (hsScreen) {
                offsetX = e.clientX - hsScreen.x;
                offsetY = e.clientY - hsScreen.y;
              } else {
                offsetX = 0;
                offsetY = 0;
              }
            }

            el.setPointerCapture(e.pointerId);
            e.stopPropagation();
          });

          el.addEventListener("pointermove", (e) => {
            if (!isDragging || !viewerRef.current) return;
            const dist = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
            if (dist > 5) hasDragged = true;

            if (hasDragged) {
              const view = viewerRef.current.view();
              const targetX = e.clientX - offsetX;
              const targetY = e.clientY - offsetY;
              const coords = view.screenToCoordinates({ x: targetX, y: targetY });
              if (coords) {
                hotspotObj.setPosition(coords);

                // Update dynamic tilt in real-time during drag
                if (hsData.style === "floor-glow") {
                  const pitchDeg = coords.pitch * (180 / Math.PI);
                  let tiltDeg = 90 - Math.abs(pitchDeg);
                  if (tiltDeg < 0) tiltDeg = 0;
                  if (tiltDeg > 85) tiltDeg = 85;
                  el.style.rotate = `x ${tiltDeg}deg`;
                }
              }
            }
          });

          el.addEventListener("pointerup", (e) => {
            if (!isDragging) return;
            isDragging = false;
            el.releasePointerCapture(e.pointerId);
            e.stopPropagation();

            if (hasDragged && viewerRef.current) {
              // Save new position
              const view = viewerRef.current.view();
              const targetX = e.clientX - offsetX;
              const targetY = e.clientY - offsetY;
              const coords = view.screenToCoordinates({ x: targetX, y: targetY });
              if (coords) updateHotspot(activeId, hsData.id, { yaw: coords.yaw, pitch: coords.pitch });
            } else {
              // Clicked! Navigate if there is a target.
              if (hsData.targetId) {
                switchScene(hsData.targetId, hsData.targetYaw, hsData.targetPitch, hsData.targetFov);
              }
            }
          });
        }

        hotspotObjsRef.current[activeId].push(hotspotObj);
      });
    } catch (err) {
      console.error("Hotspot rendering error:", err);
    }
  }, [activeHotspots, activeId, switchScene, updateHotspot, scenes, sceneLoadedToken, isExported, isPlaying]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-full bg-[#0a0c0b]">
        <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-accent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="flex h-[100dvh] w-full overflow-hidden bg-[#0a0c0b] select-none relative"
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
      {targetCaptureMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-accent text-black px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
          <span className="font-bold text-sm tracking-wide">Position camera for target view</span>
          <div className="flex items-center gap-2">
            <button onClick={saveTargetCapture} className="bg-black/90 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black transition-colors">
              Save Angle
            </button>
            <button onClick={cancelTargetCapture} className="bg-black/10 text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-black/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
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
          hasFloors={hasFloors} setHasFloors={setHasFloors}
          has3D={has3D} setHas3D={setHas3D}
          floorsList={floorsList} setFloorsList={setFloorsList}
          floorConfigs={floorConfigs}
          onUpdateFloorConfig={(idx: number, updates: Partial<FloorConfig>) => setFloorConfigs(prev => ({ ...prev, [idx]: { ...prev[idx], ...updates } }))}
          onStartFloorTargetCapture={startFloorTargetCapture}
          scenes={scenes} activeId={activeId}
          onExport={handleExport} isExporting={isExporting}
          modelUrl={modelUrl} onModelUpload={handleModelUpload} onModelRemove={handleModelRemove}
          untexturedModelUrl={untexturedModelUrl} onUntexturedModelUpload={handleUntexturedModelUpload} onUntexturedModelRemove={handleUntexturedModelRemove}
        />
      )}

      {/* ── Central Viewer ─────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Marzipano pano (visible in walk mode and if scenes exist) */}
        <div id="pano" ref={panoRef} className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${(viewMode === "walk" && scenes.length > 0) ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"}`} style={{ cursor: "grab" }} />

        {/* Empty State for walk mode */}
        {viewMode === "walk" && scenes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
            <div className="text-center">
              <svg className="mx-auto mb-3 text-white/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-white/30 text-sm">Nicio poză încărcată</p>
              <p className="text-white/20 text-xs mt-1">Încarcă poze din panoul de setări</p>
            </div>
          </div>
        )}

        {/* 3D Model Viewer (visible in 3d mode) */}
        {viewMode === "3d" && (
          (showTexturedModel ? modelUrl : untexturedModelUrl) ? (
            // @ts-ignore
            <model-viewer
              src={(showTexturedModel ? modelUrl : untexturedModelUrl)!}
              alt="3D Model"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              shadow-intensity="1"
              environment-image="neutral"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#000000",
                zIndex: 0,
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
              <div className="text-center">
                <svg className="mx-auto mb-3 text-white/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <p className="text-white/30 text-sm">No 3D model loaded</p>
                <p className="text-white/20 text-xs mt-1">Upload a .GLB or .GLTF file in Settings</p>
              </div>
            </div>
          )
        )}

        {/* Gradient overlays for UI legibility */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none z-10 transition-opacity duration-500 ${viewMode === "3d" ? "opacity-40" : "opacity-100"}`} />
        <div className={`absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent pointer-events-none z-10 transition-opacity duration-500 ${viewMode === "3d" ? "opacity-0" : "opacity-100"}`} />

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
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pl-[calc(1.25rem+env(safe-area-inset-left))] pr-[calc(1.25rem+env(safe-area-inset-right))] flex flex-col gap-3 pointer-events-none">
          {/* Room label + Prev/Next */}
          <div className={`flex items-end justify-between transition-all duration-500 ease-in-out ${(viewMode === "walk" && (!isPlaying || showTitleTemp) && !showFloorsMenu && !showSettingsMenu) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-white/40 text-xs font-medium tracking-widest uppercase mb-1">
                {activeIdx + 1} / {scenes.length}
              </p>
              <h2 className="text-white font-semibold text-xl leading-tight truncate pointer-events-auto" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                {activeScene?.label ?? "—"}
              </h2>
            </div>
            {/* Hide Prev/Next buttons completely in autoplay to keep it clean */}
            <div className={`flex-shrink-0 flex items-center gap-1 p-1.5 translate-y-1.5 transition-all duration-300 ${isPlaying ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"}`}>
              <button id="btn-prev" onClick={goPrev} className="pointer-events-auto w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button id="btn-next" onClick={goNext} className="pointer-events-auto w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Main controls row */}
          <div className="flex flex-wrap landscape:flex-nowrap items-center w-full justify-between gap-y-3">
            {/* ── LEFT toolbar (custom SVGs) ──────────────────────────────── */}
            <div
              className="relative pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5 flex-shrink-0 order-1"
              style={{
                background: bubbleBgStyle,
                backdropFilter: bubbleBlurStyle,
                WebkitBackdropFilter: bubbleBlurStyle,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Settings (only if has3D is true) */}
              {has3D && (
                <>
                  <button
                    id="btn-settings"
                    onClick={() => {
                      setShowFloorsMenu(false);
                      setShowSettingsMenu(prev => !prev);
                    }}
                    className={`shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${showSettingsMenu ? "bg-accent" : "hover:bg-white/12"} ${isPlaying ? "w-0 h-0 opacity-0 m-0" : "w-10 h-10 opacity-100"}`}
                    style={{ color: showSettingsMenu ? "#000" : bubbleColor }}
                    title="Settings"
                  >
                    <IcoSettings size={24} />
                  </button>

                  {/* Settings Dropdown Menu */}
                  <div
                    className={`absolute bottom-[calc(100%+12px)] left-0 w-full flex flex-col gap-1 p-1.5 rounded-2xl transition-all duration-300 transform origin-bottom ${showSettingsMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
                    style={{
                      background: bubbleBgStyle,
                      backdropFilter: bubbleBlurStyle,
                      WebkitBackdropFilter: bubbleBlurStyle,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <button
                      onClick={openSpaceInfo}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Info size={16} />
                      <span>Space Info</span>
                    </button>
                    <button
                      onClick={showHelp}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <CircleHelp size={16} />
                      <span>Help</span>
                    </button>
                    <button
                      onClick={shareTour}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={enterVr}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Glasses size={16} />
                      <span>VR</span>
                    </button>
                    <button
                      onClick={handleFullscreenMenuAction}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                      <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Floors */}
              {hasFloors && (
                <>
                  <button
                    id="btn-floors"
                    onClick={() => {
                      setShowSettingsMenu(false);
                      setShowFloorsMenu(prev => !prev);
                    }}
                    className={`shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${showFloorsMenu ? "bg-accent" : "hover:bg-white/12"} ${isPlaying ? "w-0 h-0 opacity-0 m-0" : "w-10 h-10 opacity-100"}`}
                    style={{ color: showFloorsMenu ? "#000" : bubbleColor }}
                    title="Floors / Etaje"
                  >
                    <IcoFloors size={19} />
                  </button>

                  {/* Floors Dropdown Menu */}
                  <div
                    className={`absolute bottom-[calc(100%+12px)] left-0 w-full flex flex-col gap-1 p-1.5 rounded-2xl transition-all duration-300 transform origin-bottom ${showFloorsMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
                    style={{
                      background: bubbleBgStyle,
                      backdropFilter: bubbleBlurStyle,
                      WebkitBackdropFilter: bubbleBlurStyle,
                      border: "1px solid rgba(255,255,255,0.1)",
                      maxHeight: "240px",
                      overflowY: "auto",
                      scrollbarWidth: "none"
                    }}
                  >
                    {Array.from({ length: (parseInt(floorsList) || 0) + 1 }).map((_, idx) => {
                      const isActive = activeScene?.floor === ("Etaj " + idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isActive) {
                              setShowFloorsMenu(false);
                              return;
                            }
                            const config = floorConfigs[idx];
                            if (config?.targetId) {
                              switchScene(config.targetId, config.targetYaw, config.targetPitch, config.targetFov);
                            }
                            setShowFloorsMenu(false);
                          }}
                          className={`w-full h-10 px-3 text-xs font-semibold text-center rounded-xl transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center ${isActive ? "bg-accent" : "hover:bg-white/15"}`}
                          style={{ color: isActive ? "#000" : bubbleColor }}
                        >
                          Etajul {idx}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Gallery / Texture Toggle */}
              <button
                id="btn-gallery-texture"
                onClick={() => viewMode === "walk" ? handleGalleryClick() : setShowTexturedModel(!showTexturedModel)}
                className="relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all overflow-hidden hover:bg-white/12"
                style={{ color: bubbleColor }}
                title={viewMode === "walk" ? "Toggle Gallery" : "Toggle Texture"}
              >
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${viewMode === "walk" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50 pointer-events-none"}`}>
                  <IcoGallery size={18} />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${viewMode === "3d" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50 pointer-events-none"}`}>
                  <IcoTexture size={18} />
                </div>
              </button>

              {/* Play/Pause (walk mode) OR Top View (3D mode) */}
              <button
                id="btn-play-topview"
                onClick={() => viewMode === "walk" ? handlePlayPause() : handleTopView()}
                className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all overflow-hidden ${viewMode === "walk" && isPlaying ? "bg-accent" : "hover:bg-white/12"}`}
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
              className={`pointer-events-auto overflow-hidden flex items-center order-3 landscape:order-2 portrait:w-full landscape:min-w-0 ${showThumbnails
                ? "landscape:max-w-[1500px] landscape:ml-3 landscape:mr-2 portrait:max-h-[100px]"
                : "landscape:max-w-0 landscape:ml-0 landscape:mr-0 portrait:max-h-0"
                }`}
              style={{
                transition: 'max-width 500ms cubic-bezier(0.4,0,0.2,1), max-height 500ms cubic-bezier(0.4,0,0.2,1), margin 500ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto py-1"
                style={{
                  scrollbarWidth: "none",
                  opacity: showThumbnails ? 1 : 0,
                  transform: showThumbnails ? 'translateX(0) scale(1)' : 'translateX(-60px) scale(0.95)',
                  transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div ref={thumbsRef} className="flex gap-2 px-1 w-max">
                  {highlightScenes.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => { setIsPlaying(false); switchScene(s.id); }}
                      className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200
                        ${s.id === activeId
                          ? "ring-2 ring-accent ring-offset-1 ring-offset-black/50 scale-100"
                          : "opacity-60 hover:opacity-90 scale-95 hover:scale-100"
                        }`}
                      style={{ width: 96, height: 60 }}
                    >
                      <img src={s.thumb} alt={s.label} className="w-full h-full object-cover" draggable={false} />
                      {s.id === activeId && <div className="absolute inset-0 bg-accent/10" />}
                      {s.highlightLabel && s.highlightLabel.trim() !== "" && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                          <span className="text-white text-[9px] font-medium leading-none block truncate">{s.highlightLabel}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right side ───────────────────────────── */}
            <div className={`pointer-events-auto flex gap-2 flex-shrink-0 transition-all duration-500 ease-in-out order-2 landscape:order-3 landscape:ml-auto ${isPlaying ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-100 translate-x-0"}`}>
              {has3D ? (
                <ViewModeSwitch
                  value={viewMode}
                  onChange={(mode) => {
                    if (mode === "3d" && showThumbnails) setShowThumbnails(false);
                    setViewMode(mode);
                  }}
                  bgStyle={bubbleBgStyle}
                  blurStyle={bubbleBlurStyle}
                />
              ) : (
                <div
                  className="relative flex items-center gap-1 rounded-2xl p-1.5"
                  style={{
                    background: bubbleBgStyle,
                    backdropFilter: bubbleBlurStyle,
                    WebkitBackdropFilter: bubbleBlurStyle,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Fullscreen Toggle */}
                  <button
                    id="btn-fullscreen"
                    onClick={toggleFullscreen}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isFullscreen ? "bg-accent" : "hover:bg-white/12"}`}
                    style={{ color: isFullscreen ? "#000" : bubbleColor }}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>

                  {/* Settings Button moved here */}
                  <button
                    id="btn-settings-right"
                    onClick={() => {
                      setShowFloorsMenu(false);
                      setShowSettingsMenu(prev => !prev);
                    }}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${showSettingsMenu ? "bg-accent" : "hover:bg-white/12"}`}
                    style={{ color: showSettingsMenu ? "#000" : bubbleColor }}
                    title="Settings"
                  >
                    <IcoSettings size={24} />
                  </button>

                  {/* Settings Dropdown Menu */}
                  <div
                    className={`absolute bottom-[calc(100%+12px)] right-0 w-[10rem] max-w-[calc(100vw-2rem)] flex flex-col gap-1 p-1.5 rounded-2xl transition-all duration-300 transform origin-bottom ${showSettingsMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
                    style={{
                      background: bubbleBgStyle,
                      backdropFilter: bubbleBlurStyle,
                      WebkitBackdropFilter: bubbleBlurStyle,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <button
                      onClick={openSpaceInfo}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Info size={16} />
                      <span>Space Info</span>
                    </button>
                    <button
                      onClick={showHelp}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <CircleHelp size={16} />
                      <span>Help</span>
                    </button>
                    <button
                      onClick={shareTour}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={enterVr}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      <Glasses size={16} />
                      <span>VR</span>
                    </button>
                    <button
                      onClick={handleFullscreenMenuAction}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition-colors hover:bg-white/12"
                      style={{ color: bubbleColor }}
                    >
                      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                      <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                    </button>
                  </div>
                </div>
              )}
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
          scenes={scenes} activeId={activeId} activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} hasFloors={hasFloors} floorsList={floorsList}
          onSceneClick={switchScene}
          onUpload={handleUpload}
          onDeleteScene={deleteScene}
          onUpdateScene={updateScene}
          onReorderScenes={reorderScenes}
          onCaptureHighlight={captureHighlight}
          onAddHotspot={addHotspot}
          onUpdateHotspot={updateHotspot}
          onDeleteHotspot={deleteHotspot}
          onStartTargetCapture={startTargetCapture}
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

        /* Dropdown Options */
        option {
          background-color: #151817;
          color: white;
        }

        /* Hotspot Styles */
        .hs-glow {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 15px rgba(255,255,255,0.4);
          cursor: pointer;
          transition: scale 0.2s, background 0.2s;
          margin-top: -20px;
          margin-left: -20px;
          transform-origin: 50% 50% !important;
        }
        .hs-glow:hover { scale: 1.15; background: rgba(255,255,255,0.3); }

        .hs-floor-glow {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          /* Box-shadow trick: inset for the ring, 1px blur for anti-aliasing edge, 20px for the glow */
          box-shadow: 
            inset 0 0 0 3px rgba(255,255,255,0.6), 
            0 0 2px 1px rgba(255,255,255,0.3),
            0 0 20px rgba(255,255,255,0.4);
          cursor: pointer;
          transition: scale 0.2s, background 0.2s;
          margin-top: -50px;
          margin-left: -50px;
          transform-origin: 50% 50% !important;
          /* Keep optimizations */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
        }
        .hs-floor-glow:hover { scale: 1.15; background: rgba(255,255,255,0.3); }

        .hs-chevron {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: scale 0.2s, background 0.2s;
          margin-top: -20px;
          margin-left: -20px;
          transform-origin: 50% 50% !important;
        }
        .hs-chevron::after {
          content: ''; width: 10px; height: 10px;
          border-top: 2px solid white; border-right: 2px solid white;
          transform: rotate(-45deg) translate(2px, 2px);
        }
        .hs-chevron:hover { scale: 1.15; background: rgba(0,0,0,0.7); }

        .hs-label {
          padding: 8px 14px;
          border-radius: 20px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: white; font-size: 13px; font-weight: 600;
          display: flex; align-items: center; gap: 8px;
          cursor: pointer;
          transition: scale 0.2s, background 0.2s;
          white-space: nowrap;
          margin-top: -18px; /* Approximate half height */
          transform-origin: 50% 50% !important;
        }
        .hs-label::before {
          content: ''; width: 14px; height: 14px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>') no-repeat center;
          display: inline-block;
        }
        .hs-label:hover { scale: 1.05; background: rgba(0,0,0,0.8); border-color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
