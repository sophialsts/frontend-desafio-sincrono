"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface MenuItemProps {
    children: React.ReactNode;
    link: string;
    icone?: React.ReactNode;
}

export default function MenuItem(props: MenuItemProps) {
    const pathname = usePathname();
    const ativo = pathname === props.link;

    return (
        <Link href={props.link} className="block">
            <li
                className="
                    flex items-center
                    gap-2
                    rounded-xl px-4 py-3
                    border border-white/10
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:border-sky-200/60 hover:bg-white/12
                    hover:text-white
                "
                style={{
                    backgroundColor: ativo ? "rgba(125, 211, 252, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    boxShadow: ativo ? "0 12px 30px rgba(14, 165, 233, 0.14)" : "none",
                }}
            >
                {props.icone ? <span>{props.icone}</span> : null}
                <span className={`${!props.icone ? "ml-1" : ""} font-medium tracking-[0.01em]`}>
                    {props.children}
                </span>
            </li>
        </Link>
    )
}
