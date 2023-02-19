import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import React, { useEffect, useState } from "react";
import PubNub from "pubnub";
import { BUTTON_COLORS, Message } from "../../types";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

type VoteMap = { [option: string]: string[] };

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function ControlPage() {
    const router = useRouter();
    const pubnub = usePubNub();
    const id = router.query.id;
    const [title, setTitle] = useState("");
    const [showVotes, setShowVotes] = useState(false);
    const [votes, setVotes] = useState<VoteMap>({});

    useEffect(() => {
        function onMessage(ev: PubNub.MessageEvent) {
            console.log("Receive", ev.message);

            let m = ev.message as Message;
            if (m.type === "choice") {
                setTitle(m.title);
                let map = {} as VoteMap;
                m.options.forEach((o) => {
                    map[o] = [];
                });
                setVotes(map);
                setShowVotes(true);
            } else if (m.type === "vote") {
                setVotes((votes) => {
                    if (m.type === "vote") {
                        let mapCopy = { ...votes };
                        for (let k in mapCopy) {
                            mapCopy[k] = mapCopy[k].filter((e) => e !== (m as any).userId);
                            if (k === m.option) {
                                mapCopy[k].push(m.userId);
                            }
                        }
                        return mapCopy;
                    } else {
                        return votes;
                    }
                });
            } else if (m.type === "clear") {
                setVotes({});
                setTitle("");
                setShowVotes(false);
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
                console.log("Remove listener");
                pubnub.removeListener({
                    message: onMessage,
                });
            };
        }
    }, [id]);

    return (
        <main style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {showVotes && (
                <>
                    <h2 style={{ padding: "0.5rem", fontSize: "2rem" }}>{title}</h2>

                    <Bar
                        style={{ padding: "1rem" }}
                        plugins={[ChartDataLabels]}
                        options={{
                            // responsive: true,
                            indexAxis: "y",
                            plugins: {
                                datalabels: {
                                    anchor: "end",
                                    align: "right",
                                    formatter: Math.round,
                                    color: "white",
                                    font: {
                                        weight: "bold",
                                        size: 50,
                                    },
                                },
                                legend: {
                                    display: false,
                                },
                            },

                            scales: {
                                x: {
                                    display: false,
                                },
                            },
                            layout: {
                                padding: 50,
                            },
                        }}
                        data={{
                            labels: Object.keys(votes),
                            datasets: [
                                {
                                    label: "Votes",
                                    data: Object.values(votes).map((e) => e.length),
                                    borderColor: "rgb(255, 99, 132)",
                                    backgroundColor: Object.values(votes).map((_, i) => BUTTON_COLORS[i]),
                                },
                            ],
                        }}
                    />
                </>
            )}

            {/* <pre>
                {JSON.stringify(
                    {
                        title,
                        showVotes,
                        votes,
                    },
                    null,
                    2
                )}
            </pre> */}
        </main>
    );
}
