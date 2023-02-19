import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";
import PubNub from "pubnub";
import { Message } from "../../types";

export default function ControlPage() {
    const router = useRouter();
    const pubnub = usePubNub();
    const id = router.query.id;
    const [options, setOptions] = useState(["", ""]);
    const [title, setTitle] = useState("Choose what should happen:");
    const [time, setTime] = useState("30");
    const [voterCount, setVoterCount] = useState("6");

    function sendMessage(value: Message) {
        console.log("Send", value);
        pubnub.publish({
            channel: `room-${id}`,
            message: value,
        });
    }

    return (
        <main style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
            <form
                onSubmit={(ev) => {
                    ev.preventDefault();
                    sendMessage({ type: "choice", options: options, title: title, time: parseFloat(time), voterCount: parseInt(voterCount) });
                }}>
                <div style={{ padding: "0.2rem" }}>
                    <label htmlFor="title">Title</label>
                    <textarea style={{ marginLeft: "0.2rem" }} id="title" rows={5} value={title} onChange={(ev) => setTitle(ev.target.value)} />
                </div>
                <div style={{ padding: "0.2rem" }}>
                    <label htmlFor="time">Seconds to vote</label>
                    <input type="number" value={time} style={{ marginLeft: "0.2rem" }} id="time" onChange={(ev) => setTime(ev.target.value)} />
                </div>
                <div style={{ padding: "0.2rem" }}>
                    <label htmlFor="voterCount">Voter count</label>
                    <input
                        type="number"
                        value={voterCount}
                        style={{ marginLeft: "0.2rem" }}
                        id="voterCount"
                        onChange={(ev) => setVoterCount(ev.target.value)}
                    />
                </div>
                {options.map((option, i) => (
                    <div key={i} style={{ padding: "0.2rem" }}>
                        <label htmlFor={"option-" + i}>Option {i + 1}</label>
                        <textarea
                            rows={5}
                            style={{ marginLeft: "0.2rem" }}
                            id={"option-" + i}
                            value={option}
                            onChange={(ev) => {
                                let copy = [...options];
                                copy[i] = ev.target.value;
                                setOptions(copy);
                            }}
                        />
                    </div>
                ))}

                <button style={{ width: "100%", background: "green", padding: "0.5rem", marginTop: "0.5rem" }} type="submit">
                    Send options
                </button>
            </form>
            <button type="button" style={{ background: "red", padding: "1rem" }} onClick={() => sendMessage({ type: "clear" })}>
                Clear options
            </button>
        </main>
    );
}
