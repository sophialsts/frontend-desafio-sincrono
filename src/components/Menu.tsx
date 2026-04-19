import MenuItem from "./MenuItem";

export default function Menu() {
    return (
        <div
            className="
                w-64 shrink-0
                border-r border-white/40
                bg-[#153050]/95 text-white
                shadow-[10px_0_30px_rgba(21,48,80,0.08)]
                backdrop-blur-md
            "
        >
            <div className="px-6 pt-8 pb-3">
            </div>

            <ul className="flex flex-col gap-3 px-4">
                <MenuItem link="/">
                    Início
                </MenuItem>
                <MenuItem link="/pesquisadores">
                    Pesquisadores
                </MenuItem>
                <MenuItem link="/producoes">
                    Produções
                </MenuItem>
            </ul>
        </div>
    )
}
