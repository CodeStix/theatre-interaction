import { useRouter } from "next/router";
import { usePubNub } from "pubnub-react";
import React, { useEffect, useRef, useState } from "react";
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
    const [screen, setScreen] = useState({
        title: "",
        showVotes: false,
        voterCount: 100,
        votes: {} as VoteMap,
        secondsRemain: 0,
    });

    useEffect(() => {
        function onMessage(ev: PubNub.MessageEvent) {
            console.log("Receive", ev.message);

            let m = ev.message as Message;
            if (m.type === "choice") {
                let map = {} as VoteMap;
                m.options.forEach((o) => {
                    map[o] = [];
                });
                setScreen({
                    title: m.title,
                    showVotes: true,
                    votes: map,
                    voterCount: m.voterCount,
                    secondsRemain: m.time,
                });
            } else if (m.type === "vote") {
                setScreen((screen) => {
                    if (m.type === "vote" && screen.secondsRemain > 0) {
                        let mapCopy = { ...screen.votes };
                        let count = 0;
                        for (let k in mapCopy) {
                            mapCopy[k] = mapCopy[k].filter((e) => e !== (m as any).userId);
                            if (k === m.option) {
                                mapCopy[k].push(m.userId);
                            }
                            count += mapCopy[k].length;
                        }

                        if (count >= screen.voterCount) {
                            return {
                                ...screen,
                                secondsRemain: 0,
                                votes: mapCopy,
                            };
                        } else {
                            return {
                                ...screen,
                                votes: mapCopy,
                            };
                        }
                    } else {
                        return screen;
                    }
                });
            } else if (m.type === "clear") {
                setScreen((screen) => ({
                    votes: {},
                    title: "",
                    showVotes: false,
                    voterCount: screen.voterCount,
                    secondsRemain: 0,
                }));
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

    useEffect(() => {
        function countDown() {
            setScreen((screen) => ({
                ...screen,
                secondsRemain: screen.secondsRemain > 0 ? screen.secondsRemain - 1 : screen.secondsRemain,
            }));
        }

        let handle = setInterval(countDown, 1000);
        return () => {
            clearInterval(handle);
        };
    }, []);

    return (
        <main style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {screen.showVotes && (
                <>
                    <h2 style={{ padding: "0.5rem", fontSize: "2rem", textAlign: "center" }}>{screen.title}</h2>
                    <div style={{ display: "flex" }}>
                        <Bar
                            style={{ flexGrow: 1 }}
                            plugins={[ChartDataLabels]}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                indexAxis: "y",
                                plugins: {
                                    datalabels: {
                                        anchor: "end",
                                        align: "right",
                                        formatter: Math.round,
                                        color: "white",
                                        font: {
                                            weight: "bold",
                                            size: 30,
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
                                labels: Object.keys(screen.votes),
                                datasets: [
                                    {
                                        label: "Votes",
                                        data: Object.values(screen.votes).map((e) => e.length),
                                        backgroundColor: Object.values(screen.votes).map((_, i) => BUTTON_COLORS[i]),
                                    },
                                ],
                            }}
                        />

                        {screen.secondsRemain > 0 && (
                            <div style={{ padding: "2rem", width: "200px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        width="100px"
                                        style={{ animation: "rotate 5s infinite linear", padding: "1rem", opacity: 0.5 }}>
                                        <path
                                            fill="white"
                                            d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM288 437v11H96V437c0-25.5 10.1-49.9 28.1-67.9L192 301.3l67.9 67.9c18 18 28.1 42.4 28.1 67.9z"
                                        />
                                    </svg>
                                    <p style={{ textAlign: "center", fontSize: "4rem", opacity: 0.5 }}>{screen.secondsRemain}</p>
                                </>
                            </div>
                        )}
                    </div>
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
