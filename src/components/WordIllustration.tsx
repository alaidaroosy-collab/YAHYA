import React from "react";

interface Props {
  type: string;
  className?: string;
}

export const WordIllustration: React.FC<Props> = ({ type, className = "w-full h-44" }) => {
  switch (type) {
    case "torch":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 ${className}`}>
          {/* Light beam */}
          <div className="absolute right-2 w-36 h-28 bg-gradient-to-l from-yellow-300/40 via-amber-200/20 to-transparent clip-path-polygon rounded-r-full blur-xs" />
          {/* Torch vector */}
          <div className="relative z-10 flex items-center">
            {/* Handle */}
            <div className="w-16 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-l-lg border-2 border-red-700 flex items-center px-1 shadow-md">
              <div className="w-4 h-2 bg-amber-300 rounded-full shadow-inner" />
              <div className="flex-1 space-y-1 px-1">
                <div className="h-0.5 bg-red-800/40 rounded" />
                <div className="h-0.5 bg-red-800/40 rounded" />
              </div>
            </div>
            {/* Neck */}
            <div className="w-4 h-10 bg-slate-700 border-y-2 border-slate-900" />
            {/* Torch Head */}
            <div className="w-8 h-14 bg-gradient-to-r from-slate-600 to-slate-400 rounded-r-xl border-2 border-slate-700 flex items-center justify-center relative shadow-lg">
              {/* Glass Lens */}
              <div className="w-2 h-12 bg-yellow-200 rounded-r-md shadow-lg shadow-yellow-300/80 animate-pulse" />
            </div>
          </div>
          {/* Dust motes */}
          <div className="absolute right-8 top-6 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping opacity-60" />
          <div className="absolute right-16 bottom-8 w-1 h-1 bg-yellow-100 rounded-full animate-pulse" />
        </div>
      );

    case "light":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-400 border-4 border-yellow-200 shadow-xl flex items-center justify-center relative">
            {/* Rays */}
            <div className="absolute -inset-4 border-2 border-dashed border-amber-400/60 rounded-full animate-spin duration-1000" />
            <div className="w-16 h-16 rounded-full bg-yellow-200/90 flex items-center justify-center text-amber-600">
              <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      );

    case "dark":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-black p-4 ${className}`}>
          {/* Crescent Moon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-amber-200 shadow-lg shadow-amber-200/40 relative">
              <div className="absolute -top-1 -right-2 w-18 h-18 rounded-full bg-slate-900" />
            </div>
          </div>
          {/* Stars */}
          <div className="absolute top-4 left-6 text-yellow-300 text-xs animate-ping">✦</div>
          <div className="absolute bottom-6 left-12 text-yellow-200 text-xs">★</div>
          <div className="absolute top-8 right-10 text-cyan-200 text-xs animate-pulse">✦</div>
          <div className="absolute bottom-8 right-8 text-amber-200 text-xs">★</div>
        </div>
      );

    case "shadow":
      return (
        <div className={`relative flex items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-stone-200 via-amber-50 to-sky-100 p-4 ${className}`}>
          {/* Desk surface */}
          <div className="w-full flex items-end justify-center gap-2 pb-2">
            {/* Tin Can */}
            <div className="w-14 h-24 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-lg border-2 border-slate-600 shadow-md relative z-10 flex flex-col justify-between py-1">
              <div className="h-1 bg-slate-500 rounded mx-1" />
              <span className="text-[9px] font-bold text-slate-700 text-center font-mono">CAN</span>
              <div className="h-1 bg-slate-500 rounded mx-1" />
            </div>
            {/* Shadow cast on table */}
            <div className="w-28 h-6 bg-slate-800/80 rounded-full blur-[1px] transform -skew-x-12 -ml-4" />
          </div>
          {/* Torch icon */}
          <div className="absolute top-4 left-6 text-amber-500 text-xs font-bold font-mono bg-white/90 px-2 py-0.5 rounded shadow">
            Light Beam ➜
          </div>
        </div>
      );

    case "reflect":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-slate-900 to-blue-950 p-4 ${className}`}>
          {/* Mirror line */}
          <div className="w-1 h-32 bg-cyan-300 rounded shadow-lg shadow-cyan-300/80" />
          {/* Incident ray */}
          <div className="absolute left-6 top-8 w-28 h-0.5 bg-yellow-300 origin-bottom-right transform rotate-25 shadow-md shadow-yellow-300" />
          {/* Reflected ray */}
          <div className="absolute left-6 bottom-8 w-28 h-0.5 bg-yellow-300 origin-top-right transform -rotate-25 shadow-md shadow-yellow-300" />
          <div className="absolute text-yellow-300 text-xs font-mono font-bold bg-black/60 px-2 py-1 rounded">
            Light Bounces Off!
          </div>
        </div>
      );

    case "sun":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-full bg-yellow-300 border-4 border-amber-200 shadow-2xl flex items-center justify-center relative animate-pulse">
            <span className="text-4xl">☀️</span>
          </div>
        </div>
      );

    case "protect":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-100 to-emerald-200 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl flex items-center justify-center text-white border-4 border-emerald-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      );

    case "pattern":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 ${className}`}>
          <div className="flex items-end gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-20 bg-indigo-500 rounded-t shadow text-[10px] text-white font-mono flex items-center justify-center">24</div>
              <span className="text-[10px] font-mono text-slate-500">20cm</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-15 bg-indigo-400 rounded-t shadow text-[10px] text-white font-mono flex items-center justify-center">18</div>
              <span className="text-[10px] font-mono text-slate-500">40cm</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-11 bg-indigo-300 rounded-t shadow text-[10px] text-white font-mono flex items-center justify-center">14</div>
              <span className="text-[10px] font-mono text-slate-500">60cm</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-8 bg-indigo-200 rounded-t shadow text-[10px] text-indigo-900 font-mono flex items-center justify-center">11</div>
              <span className="text-[10px] font-mono text-slate-500">100cm</span>
            </div>
          </div>
        </div>
      );

    case "mirror":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 p-4 ${className}`}>
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-tr from-cyan-200 via-white to-sky-200 border-4 border-amber-400 shadow-xl flex items-center justify-center relative overflow-hidden">
            {/* Reflection Glint */}
            <div className="absolute -top-8 -left-8 w-24 h-12 bg-white/60 transform rotate-45" />
            <span className="text-3xl">🪞</span>
          </div>
        </div>
      );

    case "opaque":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-200 p-4 ${className}`}>
          <div className="w-28 h-20 bg-amber-800 rounded-xl border-4 border-amber-950 shadow-2xl flex flex-col items-center justify-center text-white">
            <span className="text-xs font-bold font-mono">WOOD BLOCK</span>
            <span className="text-[10px] text-amber-200">Blocks 100% Light</span>
          </div>
        </div>
      );

    case "crust":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 p-4 ${className}`}>
          <div className="w-32 h-14 bg-gradient-to-r from-emerald-600 to-amber-700 rounded-t-full border-b-4 border-stone-800 shadow-lg flex items-center justify-center text-white font-bold text-xs">
            Crust (القشرة)
          </div>
        </div>
      );

    case "mantle":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-900 via-orange-950 to-red-950 p-4 ${className}`}>
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 border-4 border-orange-400 shadow-2xl flex items-center justify-center text-white font-bold text-xs text-center p-2 animate-pulse">
            Mantle: 2,900 km thick hot rock!
          </div>
        </div>
      );

    case "outer_core":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-orange-500 shadow-2xl shadow-red-500/70 border-4 border-red-300 flex items-center justify-center text-white font-bold text-xs text-center">
            Outer Core (Liquid 4,000°C)
          </div>
        </div>
      );

    case "inner_core":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-stone-900 p-4 ${className}`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-100 via-yellow-300 to-amber-400 shadow-2xl shadow-yellow-300/80 border-4 border-white flex items-center justify-center text-amber-950 font-bold text-xs text-center">
            Inner Core (Solid Iron Ball)
          </div>
        </div>
      );

    case "granite":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-rose-200 via-stone-300 to-zinc-400 border-3 border-stone-500 shadow-lg relative p-2 overflow-hidden flex items-center justify-center">
            {/* Speckles */}
            <div className="absolute top-2 left-3 w-3 h-2 bg-black rounded-full" />
            <div className="absolute bottom-3 right-4 w-4 h-2 bg-rose-400 rounded" />
            <div className="absolute top-5 right-3 w-2 h-3 bg-white rounded" />
            <div className="absolute bottom-2 left-4 w-3 h-3 bg-stone-800 rounded-full" />
            <span className="relative z-10 text-xs font-bold text-stone-900 bg-white/80 px-2 py-0.5 rounded font-mono">GRANITE</span>
          </div>
        </div>
      );

    case "basalt":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-zinc-900 via-stone-800 to-zinc-700 border-3 border-black shadow-xl flex items-center justify-center text-white font-mono text-xs font-bold">
            BASALT
          </div>
        </div>
      );

    case "chalk":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-emerald-950 p-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-20 bg-white rounded-md shadow-lg border border-slate-200 transform -rotate-12 flex flex-col justify-end p-1">
              <div className="h-2 bg-slate-200 rounded" />
            </div>
            <span className="text-white font-kid text-sm font-bold">Soft White Chalk</span>
          </div>
        </div>
      );

    case "limestone":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-amber-50 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-stone-300 to-amber-200 border-2 border-stone-400 shadow-md flex flex-col items-center justify-center text-stone-800 p-2">
            <span className="text-2xl mb-1">🐚</span>
            <span className="text-[10px] font-bold font-mono">LIMESTONE</span>
          </div>
        </div>
      );

    case "marble":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-300 shadow-lg relative overflow-hidden flex items-center justify-center">
            {/* Marble veins */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-300/40 to-transparent transform rotate-45" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-200/30 to-transparent transform -rotate-30" />
            <span className="relative z-10 text-xs font-bold text-slate-800 bg-white/90 px-2 py-0.5 rounded shadow font-mono">MARBLE</span>
          </div>
        </div>
      );

    case "sandstone":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-amber-50 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 border-2 border-amber-700 shadow-md flex flex-col items-center justify-center text-amber-950 p-2">
            <div className="w-full h-1 bg-amber-600/50 mb-1" />
            <span className="text-[10px] font-bold font-mono bg-white/80 px-1 rounded">SANDSTONE</span>
            <div className="w-full h-1 bg-amber-600/50 mt-1" />
          </div>
        </div>
      );

    case "slate":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-200 p-4 ${className}`}>
          <div className="flex flex-col -space-y-3">
            <div className="w-24 h-8 bg-slate-800 rounded border border-slate-900 shadow-md" />
            <div className="w-24 h-8 bg-slate-700 rounded border border-slate-900 shadow-md" />
            <div className="w-24 h-8 bg-slate-600 rounded border border-slate-900 shadow-md flex items-center justify-center text-[10px] text-white font-mono">
              SLATE TILES
            </div>
          </div>
        </div>
      );

    case "pumice":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-blue-200 p-4 ${className}`}>
          <div className="flex flex-col items-center">
            {/* Floating rock on water */}
            <div className="w-20 h-14 rounded-2xl bg-stone-300 border-2 border-dashed border-stone-500 shadow-lg flex items-center justify-center text-xs font-bold text-stone-700 relative animate-bounce duration-1000">
              <span className="text-[10px] font-mono">FLOATING!</span>
            </div>
            {/* Water surface line */}
            <div className="w-32 h-1 bg-blue-500 rounded-full mt-1" />
            <span className="text-[10px] text-blue-900 font-bold mt-0.5">Water Surface</span>
          </div>
        </div>
      );

    case "fossil":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-amber-100 p-4 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-stone-300 border-2 border-stone-500 shadow-inner flex flex-col items-center justify-center text-amber-900">
            <span className="text-3xl animate-pulse">🐚</span>
            <span className="text-[10px] font-bold font-mono mt-1">FOSSIL</span>
          </div>
        </div>
      );

    case "soil":
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-100 via-amber-200 to-amber-900 p-4 ${className}`}>
          <div className="w-28 h-20 bg-amber-950 rounded-xl border-t-4 border-emerald-600 shadow-lg flex flex-col items-center justify-center text-amber-200 p-1">
            <span className="text-xs">🌱 🪱 🪨</span>
            <span className="text-[10px] font-mono font-bold">GARDEN SOIL</span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-slate-100 p-4 ${className}`}>
          <span className="text-3xl">🔬</span>
        </div>
      );
  }
};
