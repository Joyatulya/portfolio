import { parse_bm } from "./insulinAnalysis";
import { dummyBM } from "./mockDB";

export async function load() {
	const data = dummyBM

	const parsedData = parse_bm(data)

	return { data: parsedData }
}
