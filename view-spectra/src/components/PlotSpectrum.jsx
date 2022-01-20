import React, {useEffect, useRef} from 'react';
import {Row, Col} from 'antd';

const funcCleanData = (data) => {
    let dataClean = {
        height: parseFloat(data.height) || 400,
        width: parseFloat(data.width) || 600,
        specA: {
            precursorMz: parseFloat(data.specA.precursorMz) || null,
            peaks: null
        },
        specB: {
            precursorMz: parseFloat(data.specB.precursorMz) || null,
            peaks: null
        }
    }

    const funcCleanPeaks = (peaks) => {
        if (peaks && peaks.length > 0) {
            let peaks_clean = []
            // Determine the line number
            let peaksArray = peaks.split(/\r\n|\r|\n/).filter(n => n.trim())
            if (peaksArray.length > 1) {
                // Multiple lines, each line is a peak
                peaksArray.forEach(peak => {
                    let peak_array = []
                    peak.match(/\d+\.*\d*/g).forEach(peak => {
                        peak_array.push(parseFloat(peak))
                    })
                    if (peak_array.length >= 2) {
                        peaks_clean.push([peak_array[0], peak_array[1]])
                    }
                })
            } else {
                // Single line, each peak is separated by some characters
                // Extract peaks
                peaks.match(/\d+\.*\d*/g).forEach(peak => {
                    peaks_clean.push(parseFloat(peak))
                })

                // Sort peaks
                peaks_clean = peaks_clean.reduce((result, cur, index) => {
                    if (index % 2 === 0) {
                        result.push([cur])
                    } else {
                        result[result.length - 1].push(cur)
                    }
                    return result
                }, [])
            }

            // If last peak is not complete, remove it
            if ((peaks_clean[peaks_clean.length - 1] || []).length < 2) {
                peaks_clean.pop()
            }

            if (peaks_clean.length > 0) {
                return peaks_clean
            } else {
                return null
            }
        } else {
            return null
        }
    }

    dataClean.specA.peaks = funcCleanPeaks(data.specA.peaks || null) || null
    dataClean.specB.peaks = funcCleanPeaks(data.specB.peaks || null) || null
    return dataClean
};

const funcNormalizeSpec = (peaks) => {
    const intensityMax = Math.max.apply(Math, peaks.map((p) => p[1]))
    if (intensityMax > 0) {
        peaks = peaks.map(p => [p[0], p[1] / intensityMax])
    }
    return peaks
}

const PlotSpectrum = (props) => {
    const refPlot = useRef(null)
    const [stateEmpty, setEmpty] = React.useState(true)

    useEffect(() => {
        const plotData = funcCleanData(props.data)
        // console.log(refPlot.current, plotData, plotData.specA, plotData.specA.peaks)
        if (plotData && plotData.specA && plotData.specA.peaks) {
            setEmpty(false)
            const plotHeight = plotData.height || 400;
            const plotWidth = plotData.width || 600;
            const precursorMzA = plotData.specA.precursorMz
            const precursorMzB = plotData.specB.precursorMz
            const peaksA = plotData.specA.peaks
            const peaksB = plotData.specB.peaks

            import('plotly.js').then(Plotly => {
                //console.log(spectrum, precursor_mz)
                let spectrumUp, spectrumDown
                let plotComparisonSpec = false
                if (peaksB) {
                    plotComparisonSpec = true
                    spectrumUp = funcNormalizeSpec(peaksA)
                    spectrumDown = funcNormalizeSpec(peaksB)
                } else {
                    plotComparisonSpec = false
                    spectrumUp = peaksA
                }
                let plotAllPeaks = []

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
                    yMax = 1.2 * Math.max(...(spectrumUp.map(x => x[1])))
                    yMin = 0
                }

                // Add precursor ion
                if (precursorMzA && !isNaN(precursorMzA)) {
                    plotAllPeaks.push({
                        x0: precursorMzA, x1: precursorMzA,
                        y0: 0, y1: yMax,
                        type: 'line', line: {color: 'black', width: 1, dash: 'dot'}
                    })
                }
                if (precursorMzB && !isNaN(precursorMzB)) {
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
                if (plotComparisonSpec) {
                    layout.yaxis.title.text = 'Normalized abundance'
                }
                layout.height = plotHeight
                layout.width = plotWidth
                let config = {
                    responsive: true,
                    scrollZoom: true,
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'zoom2d', 'pan2d'],
                    toImageButtonOptions: {
                        format: 'svg', // one of png, svg, jpeg, webp
                        filename: 'spectrum',
                        height: plotHeight,
                        width: plotWidth,
                        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                    }
                }

                if (refPlot.current) {
                    //console.log(data,layout,config)
                    Plotly.newPlot(refPlot.current, data, layout, config);
                }
            })
        } else {
            setEmpty(true)
        }
    }, [props.data])

    return (
        <div>
            <div hidden={!stateEmpty}>
                <Row justify="space-around" align={"middle"} style={{height: "600px"}}>
                    <Col>
                        <h1>Input the spectral data left to visual it.</h1>
                    </Col>
                </Row>
            </div>
            <div hidden={stateEmpty} ref={refPlot}/>
        </div>
    )
}

export default PlotSpectrum