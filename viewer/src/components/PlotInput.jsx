import {Row, Col, InputNumber, Divider} from 'antd';
import {useState, useEffect} from 'react';
import SpectrumInput from "./SpectrumInput";


const funcCleanPeaks = (peaks) => {
    if (peaks) {
        let peaks_clean = []
        // Determine the line number
        let allPeaksArray = peaks.split(/\r\n|\r|\n/).filter(n => n.trim())
        if (allPeaksArray.length > 1) {
            // Multiple lines, each line is a peak
            allPeaksArray.forEach(peak => {
                let peakArray = peak.split(/[^\d.eE\-]+/).filter(n => n.trim()).map(parseFloat)
                if (peakArray.length >= 2) {
                    peaks_clean.push([peakArray[0], peakArray[1]])
                }
            })
        } else {
            // Single line, each peak is separated by some characters
            // Extract peaks
            peaks.match(/[\d.eE\-]+/g).forEach(peak => {
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


const PlotInput = (props) => {
    const stateData = props.stateData;
    const setData = props.setData;
    const [stateSpectrum1, setSpectrum1] = useState({precursorMz: null, peaks: ""});
    const [stateSpectrum2, setSpectrum2] = useState({precursorMz: null, peaks: ""});

    useState(() => {
        const defaultSpectrum = {
            precursorMz: 179.0697,
            peaks: "133.0648\t19.463591\n151.0754\t8.644951\n155.9745\t3.628786\n161.0597\t100"
        };
        setSpectrum1(defaultSpectrum);
        setData({
            ...stateData,
            specA: {precursorMz: parseFloat(defaultSpectrum.precursorMz), peaks: funcCleanPeaks(defaultSpectrum.peaks)},
        });
    }, [])

    useEffect(() => {
        setData({
            ...stateData,
            specA: {precursorMz: parseFloat(stateSpectrum1.precursorMz), peaks: funcCleanPeaks(stateSpectrum1.peaks)},
            specB: {precursorMz: parseFloat(stateSpectrum2.precursorMz), peaks: funcCleanPeaks(stateSpectrum2.peaks)}
        }) // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateSpectrum1, stateSpectrum2])

    return <>
        <SpectrumInput precursorMz={stateSpectrum1.precursorMz} peaks={stateSpectrum1.peaks}
                       setPrecursorMz={(e) => setSpectrum1({...stateSpectrum1, precursorMz: e})}
                       setPeaks={(e) => setSpectrum1({...stateSpectrum1, peaks: e})}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Tail spectrum (optional)</Divider>
        <SpectrumInput stateSpectrum={stateSpectrum2.precursorMz} peaks={setSpectrum2.peaks}
                       setPrecursorMz={(e) => setSpectrum2({...stateSpectrum1, precursorMz: e})}
                       setPeaks={(e) => setSpectrum2({...stateSpectrum1, peaks: e})}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Plot size</Divider>
        <Row justify={"center"}>
            <Col span={11}>Height (px): <InputNumber
                precision={0}
                step={50} min={50}
                value={stateData.height}
                onChange={(e) => setData({...stateData, height: e})}/></Col>
            <Col span={11}>Weight (px): <InputNumber
                precision={0}
                step={50} min={50}
                value={stateData.width}
                onChange={(e) => setData({...stateData, width: e})}/></Col>
        </Row>
    </>
}

export default PlotInput;