import {Row, Col, InputNumber, Divider, Checkbox, Space, Alert} from 'antd';
import {useState, useEffect} from 'react';
import {useAtom} from "jotai";
import SpectrumInput from "./SpectrumInput";

import {atomParams, atomSpecA, atomSpecB} from "./App";

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
    // For entropy similarity
    const [stateRemovePrecursor, setRemovePrecursor] = useState(true);
    const [stateRemovePrecursorValue, setRemovePrecursorValue] = useState(1.6);


    const [stateSpectrum1, setSpectrum1] = useState({precursorMz: null, peaks: ""});
    const [stateSpectrum2, setSpectrum2] = useState({precursorMz: null, peaks: ""});

    const [stateParams, setParams] = useAtom(atomParams);
    const [stateSpecA, setSpecA] = useAtom(atomSpecA);
    const [stateSpecB, setSpecB] = useAtom(atomSpecB);

    useEffect(() => {
        const defaultSpectrum1 = {
            precursorMz: 505.988,
            peaks: "78.9592\t4.1\n158.9257\t161.94\n176.9363\t17.98\n238.8921\t6.99\n272.9577\t3.1\n370.9345\t3.3\n408.0122\t98.4\n409.0155\t7.59\n426.0229\t5.99\n487.9789\t6.49\n505.9892\t99.0\n506.9916\t79.92"
        };
        setSpectrum1(defaultSpectrum1);
        setSpecA({...stateSpecA, ...defaultSpectrum1,});

        const defaultSpectrum2 = {
            precursorMz: 426.022,
            peaks: "78.9592\t4.7\n134.0476\t17.38\n158.9258\t31.77\n290.9684\t3.1\n328.046\t57.54\n329.0496\t3.6\n408.0126\t18.08\n426.0229\t99.0\n427.0255\t63.84"
        }
        setSpectrum2(defaultSpectrum2);
        setSpecB({...stateSpecB, ...defaultSpectrum2,});
    }, [])

    useEffect(() => {
        const precursorMZ = parseFloat(stateSpectrum1.precursorMz);
        const peaks = funcCleanPeaks(stateSpectrum1.peaks);
        let peaksClean = peaks;
        if (precursorMZ && precursorMZ > 0 && peaks && peaks.length > 0 && stateRemovePrecursor) {
            peaksClean = peaks.filter(peak => precursorMZ - peak[0] > stateRemovePrecursorValue)
        }
        setSpecA({...stateSpecA, precursorMz: precursorMZ, peaks: peaks, peaksClean: peaksClean,})
    }, [stateSpectrum1, stateRemovePrecursor, stateRemovePrecursorValue])

    useEffect(() => {
        const precursorMZ = parseFloat(stateSpectrum2.precursorMz);
        const peaks = funcCleanPeaks(stateSpectrum2.peaks);
        let peaksClean = peaks;
        if (precursorMZ && precursorMZ > 0 && peaks && peaks.length > 0 && stateRemovePrecursor) {
            peaksClean = peaks.filter(peak => precursorMZ - peak[0] > stateRemovePrecursorValue)
        }
        setSpecB({...stateSpecB, precursorMz: precursorMZ, peaks: peaks, peaksClean: peaksClean,})
    }, [stateSpectrum2, stateRemovePrecursor, stateRemovePrecursorValue])

    return <>
        <SpectrumInput precursorMz={stateSpectrum1.precursorMz} peaks={stateSpectrum1.peaks}
                       setPrecursorMz={(e) => setSpectrum1({...stateSpectrum1, precursorMz: e})}
                       setPeaks={(e) => setSpectrum1({...stateSpectrum1, peaks: e})}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Tail spectrum (optional)</Divider>
        <SpectrumInput precursorMz={stateSpectrum2.precursorMz} peaks={stateSpectrum2.peaks}
                       setPrecursorMz={(e) => setSpectrum2({...stateSpectrum2, precursorMz: e})}
                       setPeaks={(e) => setSpectrum2({...stateSpectrum2, peaks: e})}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Entropy similarity</Divider>

        {((stateSpecA.peaks || []).length > 0 && (stateSpecB.peaks || []).length > 0) ? <>
            <Space direction={"vertical"}>
                <InputNumber addonBefore={
                    <Checkbox checked={stateRemovePrecursor}
                              onChange={(e) => setRemovePrecursor(e.target.checked)}>
                        Remove precursor ions:
                    </Checkbox>}
                             addonAfter="Da"
                             defaultValue={stateRemovePrecursorValue}
                             disabled={!stateRemovePrecursor}
                             onChange={(e) => setRemovePrecursorValue(e)}
                             controls={false}/>
                <InputNumber addonBefore={"Fragment ion matching tolerance:"}
                             addonAfter="Da"
                             defaultValue={stateParams.matching_ms2_tol}
                             onChange={(e) => setParams({...stateParams, matching_ms2_tol: e})}
                             controls={false}/>
                <InputNumber addonBefore={"Remove noise below:"}
                             addonAfter="% of most intense ion"
                             defaultValue={stateParams.remove_noise * 100}
                             onChange={(e) => setParams({...stateParams, remove_noise: e / 100})}
                             controls={true}/>
            </Space>
        </> : <>
            <Alert message="Please input two spectra to calculate entropy similarity." type="info"/>
        </>}

        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Plot size</Divider>
        <Row justify={"space-between"}>
            <Col span={11}>
                <InputNumber style={{width: "100%"}}
                             precision={0}
                             step={50} min={50}
                             addonBefore="Height:"
                             addonAfter="px"
                             value={stateParams.height}
                             onChange={(e) => setParams({...stateParams, height: e})}/></Col>
            <Col span={11}>
                <InputNumber style={{width: "100%"}}
                             precision={0}
                             step={50} min={50}
                             addonBefore="Weight:"
                             addonAfter="px"
                             value={stateParams.width}
                             onChange={(e) => setParams({...stateParams, width: e})}/></Col>
        </Row>
    </>
}

export default PlotInput;