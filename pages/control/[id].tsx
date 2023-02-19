import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";
import PubNub from "pubnub";
import { Message } from "../../types";

export default function ControlPage() {
    const router = useRouter();
    const pubnub = usePubNub();
    const id = router.query.id;
    const [lastMessage, setLastMessage] = useState<Message | null>(null);

    useEffect(() => {
        function onMessage(ev: PubNub.MessageEvent) {
            console.log("Receive", ev.message);
            setLastMessage(ev.message);
        }

        if (id) {
            pubnub.addListener({
                message: onMessage,
            });
            pubnub.subscribe({
                channels: [`room-${id}`],
            });
            return () => {
                pubnub.removeListener({
                    message: onMessage,
                });
            };
        }
    }, [id]);

    return (
        <main style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
        </main>
    );
}
