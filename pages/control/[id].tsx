import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";
import PubNub from "pubnub";

type Scene = { type: "choice"; options: string[] };

export default function ControlPage() {
    const router = useRouter();
    const pubnub = usePubNub();
    const id = router.query.id;
    const [scene, setScene] = useState<Scene | null>(null);

    useEffect(() => {
        function onMessage(ev: PubNub.MessageEvent) {
            console.log("ev", ev);
            if (ev.message.type === "scene") {
                setScene(ev.message.scene);
            }
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
            <pre>{JSON.stringify(scene, null, 2)}</pre>
        </main>
    );
}
