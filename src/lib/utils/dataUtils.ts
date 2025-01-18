export function movingAverage(ts: number[], windowSize: number): number[] {
    if (windowSize <= 0) {
        throw new Error("Window size must be greater than 0");
    }
    if (windowSize > ts.length) {
        throw new Error("Window size must not be greater than the length of the time series");
    }

    const movingAverages: number[] = [];
    for (let i = 0; i <= ts.length - windowSize; i++) {
        const window = ts.slice(i, i + windowSize);
        const average = window.reduce((sum, value) => sum + value, 0) / windowSize;
        movingAverages.push(average);
    }

    return movingAverages;
}
