import { init, type EChartsOption } from 'echarts'
import type { Action } from 'svelte/action'

export const mountEchart: Action<HTMLDivElement, EChartsOption> = (node, options) => {
	$effect(() => {
		const echart = init(node)
		echart.setOption(options)
		return () => {
			echart.dispose()
		}
	})
}
