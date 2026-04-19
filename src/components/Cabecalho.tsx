import Logo from "./Logo";

export default function Cabecalho() {
    return (
        <header
            className="
                flex justify-between items-center
                px-6 py-4
                border-b border-white/40
                bg-white/75 backdrop-blur-md
                shadow-[0_10px_30px_rgba(21,48,80,0.08)]
            "
        >
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Pesquisadores NPAI</h1>
            <Logo />
        </header>
    );
}
