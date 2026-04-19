"use client";

interface AdicionarBotaoProps {
    label: string;
    aberto: boolean;
    onClick: () => void;
}

export default function AdicionarBotao({ label, aberto, onClick }: AdicionarBotaoProps) {
    return (
        <div className="relative group">
            <button
                type="button"
                aria-label={label}
                aria-expanded={aberto}
                onClick={onClick}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-white text-2xl font-light leading-none text-sky-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
            >
                +
            </button>

            <span className="pointer-events-none absolute right-0 top-14 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {label}
            </span>
        </div>
    );
}
