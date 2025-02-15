import { InteractiveEngine } from "./logic/engine";

export const load = async () => {
	const engine = new InteractiveEngine();
	await engine.initialize({
		age: 20,
		isMale: true,
		hb: 10.4,
		// wbc: 40,
		// plt: 20,
		// mcv: 60,
		creatinine: 0.6
	})

	await engine.run()
}
