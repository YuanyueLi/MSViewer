import React, {useEffect, useRef} from 'react';

const PlotSpectrum = (props) => {
    const refPlot = useRef(null)
    const precursorMzA = parseFloat(props.precursorMzA)
    const precursorMzB = parseFloat(props.precursorMzB)
    const peaksA = props.peaksA
    const peaksB = props.peaksB

    const funcCleanPeaks = (peaks) => {
        if (peaks) {
            let peaks_clean = []
            for (let peak of peaks.split("\n")) {
                let peak_array = peak.split(/(\s+)/).filter(e => e.trim().length > 0)
                peak_array = peak_array.map(e => parseFloat(e)).filter(e => !isNaN(e))
                if (peak_array.length > 1) {
                    peaks_clean.push(peak_array)
                }
            }
            return peaks_clean
        } else {
            return peaks
        }
    }

    const funcNormalizeSpec = (peaks) => {
        const intensityMax = Math.max.apply(Math, peaks.map((p) => p[1]))
        if (intensityMax > 0) {
            peaks = peaks.map(p => [p[0], p[1] / intensityMax])
        }
        return peaks
    }

    useEffect(() => {
        const peaksCleanA = funcCleanPeaks(peaksA)
        if (refPlot.current && peaksCleanA && peaksCleanA.length > 0) {
            import('plotly.js').then(Plotly => {
                //console.log(spectrum, precursor_mz)
                const peaksCleanB = funcCleanPeaks(peaksB)
                let plotComparisonSpec = false
                if (peaksCleanB && peaksCleanB.length > 0) {
                    plotComparisonSpec = true
                }
                let plotAllPeaks = []
                let spectrumUp, spectrumDown

                // Normalize spectra
                if (plotComparisonSpec) {
                    spectrumUp = funcNormalizeSpec(peaksCleanA)
                    spectrumDown = funcNormalizeSpec(peaksCleanB)
                } else {
                    spectrumUp = peaksCleanA
                }

                // Add peaks to plot
                for (let peak of spectrumUp) {
                    plotAllPeaks.push({
                        x0: peak[0], x1: peak[0],
                        y0: 0, y1: peak[1],
                        line: {color: "#8884d8", width: 1}, type: 'line'
                    })
                }
                let data = [{
                    x: spectrumUp.map((x) => x[0]),
                    y: spectrumUp.map((x) => x[1]),
                    hovertemplate: "m/z: %{x}<br>" +
                        "Abundance: %{y}<extra></extra>", showlegend: false,
                    mode: 'markers', type: 'scatter',
                    hoverlabel: {bgcolor: "#FFF"}, marker: {color: "#8884d8", size: 0.1},
                }]

                if (plotComparisonSpec) {
                    for (let peak of spectrumDown) {
                        plotAllPeaks.push({
                            x0: peak[0], x1: peak[0],
                            y0: 0, y1: -peak[1],
                            line: {color: "#d88484", width: 1}, type: 'line'
                        })
                    }
                    data.push(
                        {
                            x: spectrumDown.map((x) => x[0]),
                            y: spectrumDown.map((x) => -x[1]),
                            hovertemplate: "m/z: %{x}<br>Abundance: %{y}<extra></extra>",
                            showlegend: false, mode: 'markers', type: 'scatter',
                            hoverlabel: {bgcolor: "#FFF"}, marker: {color: "#8884d8", size: 0.1},
                        }
                    )
                }

                // Calculate figure's size
                let xMax, yMin, yMax
                if (plotComparisonSpec) {
                    xMax = 1.05 * Math.max(...(spectrumUp.map(x => x[0])), ...(spectrumDown.map(x => x[0])),
                        precursorMzA, precursorMzB)
                    yMax = 1.2
                    yMin = -1.2
                } else {
                    xMax = 1.05 * Math.max(...(spectrumUp.map(x => x[0])), precursorMzA)
                    yMax = 1.2 * Math.max(...(spectrumUp.map(x => x[0] < precursorMzA - 1 ? x[1] : 0)))
                    yMin = 0
                }

                // Add precursor ion
                if (!isNaN(precursorMzA)) {
                    plotAllPeaks.push({
                        x0: precursorMzA, x1: precursorMzA,
                        y0: 0, y1: yMax,
                        type: 'line', line: {color: 'black', width: 1, dash: 'dot'}
                    })
                }
                if (!isNaN(precursorMzB)) {
                    plotAllPeaks.push({
                        x0: precursorMzB, x1: precursorMzB,
                        y0: 0, y1: yMin,
                        type: 'line', line: {color: 'black', width: 1, dash: 'dot'}
                    })
                }

                // Set layout
                let layout = {
                    xaxis: {title: {text: 'm/z',}, range: [0, xMax]},
                    yaxis: {title: {text: 'Abundance',}, range: [yMin, yMax]},
                    hovermode: "closest",
                    shapes: plotAllPeaks,
                    margin: {l: 55, r: 10, b: 30, t: 10, pad: 0},
                };
                if (props.height) {
                    layout.height = props.height
                }
                let config = {
                    responsive: true,
                    scrollZoom: true,
                    displayModeBar: false
                }

                if (refPlot.current) {
                    //console.log(data,layout,config)
                    Plotly.newPlot(refPlot.current, data, layout, config);
                }
            })
        }
    }, [precursorMzA, precursorMzB, peaksA, peaksB])

    return (
        <div ref={refPlot}/>
    )
}

export default PlotSpectrum