export type Message =
    | { type: "choice"; title: string; options: string[]; time: number; voterCount: number }
    | { type: "clear" }
    | { type: "vote"; userId: string; option: string };

export const BUTTON_COLORS = ["#2a8cda", "#d3d30b", "blue", "red"];
