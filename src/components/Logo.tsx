import Image from "next/image";

export default function Logo() {
    return (
        <Image src={"/npai_logo.svg"} alt="Logo NPAI" width={150} height={35} />
    )
}