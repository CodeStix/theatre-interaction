import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import React, { useEffect, useState } from "react";
import PubNub from "pubnub";
import { Message } from "../../types";

const BUTTON_COLORS = ["#2a8cda", "#d3d30b", "blue", "red"];

export default function ControlPage() {
    const router = useRouter();
    const pubnub = usePubNub();
    const id = router.query.id;
    const [lastMessage, setLastMessage] = useState<Message>({ type: "clear" });

    useEffect(() => {
        function onMessage(ev: PubNub.MessageEvent) {
            console.log("Receive", ev.message);

            let m = ev.message as Message;
            setLastMessage(m);

            if (m.type === "choice") {
                navigator.vibrate(200);
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
            {lastMessage.type === "choice" && (
                <>
                    <h2 style={{ padding: "0.5rem", fontSize: "2rem" }}>{lastMessage.title}</h2>
                    {lastMessage.options.map((option, i) => (
                        <ChoiceButton key={i} color={BUTTON_COLORS[i]}>
                            {option}
                        </ChoiceButton>
                    ))}
                </>
            )}

            {lastMessage.type === "clear" && (
                <div style={{ textAlign: "center", opacity: 0.3 }}>
                    <p>Nothing to see here yet.</p>
                    <p>Watch the show!</p>
                </div>
            )}
            {/* <pre>{JSON.stringify(lastMessage, null, 2)}</pre> */}
        </main>
    );
}

function ChoiceButton(props: { children?: React.ReactNode; color: string }) {
    return (
        <button
            style={{
                flexGrow: 1,
                width: "100%",
                backgroundColor: props.color,
                color: "white",
                mixBlendMode: "difference",
                fontSize: "3rem",
                fontWeight: "bold",
            }}>
            {props.children}
        </button>
    );
}
