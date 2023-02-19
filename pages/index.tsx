import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = crypto.randomUUID();
            setUrl(`${location.href}/control/${id}`);
        }
    }, []);

    return (
        <main
            style={{ background: "black", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column" }}>
            {url && (
                <>
                    <QRCodeSVG style={{ border: "1rem solid white" }} width="400px" height="400px" value={url} />
                    <p style={{ fontSize: "3rem", marginTop: "2rem", fontWeight: "bold" }}>Scan the QR code to control the show!</p>
                    {/* <pre style={{ fontSize: "3rem" }}>{url}</pre> */}
                </>
            )}
        </main>
    );
}
