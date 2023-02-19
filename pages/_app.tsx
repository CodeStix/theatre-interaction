import "@/styles/globals.css";
import type { AppProps } from "next/app";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";

const pubnub = new PubNub({
    publishKey: process.env.NEXT_PUBLIC_PUB_KEY!,
    subscribeKey: process.env.NEXT_PUBLIC_SUB_KEY!,
    uuid: process.env.NEXT_PUBLIC_UUID!,
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <PubNubProvider client={pubnub}>
            <Component {...pageProps} />
        </PubNubProvider>
    );
}
