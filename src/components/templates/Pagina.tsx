/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Cabecalho from "../Cabecalho";
import Menu from "../Menu";

// Definindo a interface para garantir o tipo do children
interface PaginaProps {
    children: React.ReactNode;
}

export default function Pagina({ children }: PaginaProps) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-transparent">
            <Cabecalho />

            <div className="flex flex-1 overflow-hidden">
                <Menu />
                
                <main className="flex flex-1 flex-col overflow-hidden p-4 md:p-8">
                    
                    <div className="mx-auto w-full max-w-6xl h-full overflow-y-scroll rounded-[28px] border border-white/50 bg-white/55 shadow-[0_22px_50px_rgba(21,48,80,0.08)] backdrop-blur-sm rounded-scrollbar md:p-10 p-6">
                        {children}
                    </div>

                </main>
            </div>
        </div>
    );
}