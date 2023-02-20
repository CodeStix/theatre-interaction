# Theatre Interaction System

This repo contains the source code of the voting system made during the All Screens A Stage makeathon. The audience can scan a QR code which redirects them to a voting page. The 'master' can send prompts to the audiences screens. These votes will then be shown on the voting screen. The most voted for option will influence the theatre show.

To start developing, make sure NodeJS is installed on your system follow the steps at Getting Started.

When running, it persists of 4 pages:
- *http://localhost:3000/*: Generates a QR code that the audience can scan. It contains the link to *http://localhost:3000/control/aabbccdd*. Where *aabbccdd* is a randomly generated id.
- *http://localhost:3000/control/aabbccdd*: The voting screen meant for the audience.
- *http://localhost:3000/master/aabbccdd*: The master screen used to set up the options for the audiance.
- *http://localhost:3000/votes/aabbccdd*: The overview screen containing a graph indicating amount of votes per option.

(localhost will be replaced with another origin when hosted)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Install dependencies using:
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
