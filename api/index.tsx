import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

const londonGlobal = await fetch(
	"https://assets.devpinata.cloud/OldLondon.ttf",
);
export const app = new Frog({
	assetsPath: "/",
	basePath: "/api",

	imageOptions: {
		fonts: [
			{
				name: "LondonGlobal",
				data: await londonGlobal.arrayBuffer(),
				weight: 600,
				style: "normal",
			},
		],
	},
	// Supply a Hub to enable frame verification.
	// hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame("/", async (c) => {
	const londonLocal = await fetch(
		"https://assets.devpinata.cloud/OldLondon.ttf",
	);
	return c.res({
		image: (
			<div style={{ display: "flex", gap: 20 }}>
				<p
					style={{
						fontFamily: "LondonGlobal",
						fontWeight: 600,
						color: "white",
						fontSize: 60,
					}}
				>
					World 1
				</p>
				<p
					style={{
						fontFamily: "LondonLocal",
						fontWeight: 600,
						color: "white",
						fontSize: 60,
					}}
				>
					World 2
				</p>
			</div>
		),
		intents: [],
		imageOptions: {
			fonts: [
				{
					name: "LondonLocal",
					data: await londonLocal.arrayBuffer(),
					weight: 600,
					style: "normal",
				},
			],
		},
	});
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
