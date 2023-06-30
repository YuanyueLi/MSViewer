import {useState, useEffect} from 'react';
import {Row, Col, Divider} from 'antd';
import {atom, useAtom} from "jotai";

import PlotSpectrum from "./PlotSpectrum";
import PlotInput from "./PlotInput";
import {calculateEntropySimilarity} from "./CalculateEntropySimilarity";

const atomParams = atom({
    height: 400, width: 600,
    matching_ms2_tol: 0.02,
    remove_noise: 0.01,
});
const atomSpecA = atom({});
const atomSpecB = atom({});

function App() {
    const [stateParams, setParams] = useAtom(atomParams);
    const [stateSpecA, setSpecA] = useAtom(atomSpecA);
    const [stateSpecB, setSpecB] = useAtom(atomSpecB);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setParams({
                ...stateParams,
                height: Math.min(window.innerWidth * 0.8 * 2 / 3 * 2 / 3, 400),
                width: Math.min(window.innerWidth * 0.8 * 2 / 3, 600),
            })
        } else {
            setParams({
                ...stateParams,
                height: Math.min(window.innerWidth * 0.8 * 2 / 3, 400),
                width: Math.min(window.innerWidth * 0.8, 600),
            })
        }
    }, [])

    useEffect(() => {
        console.log("stateSpecA", stateSpecA, "stateSpecB", stateSpecB);
    }, [stateSpecA, stateSpecB])

    // useEffect(() => {
    //     console.log("stateParams", stateParams);
    // }, [stateParams])

    const [stateEntropySimilarity, setEntropySimilarity] = useState(null);
    useEffect(() => {
        if (((stateSpecA.peaksClean || []).length > 0) && ((stateSpecB.peaksClean || []).length > 0)) {
            calculateEntropySimilarity(stateSpecA.peaksClean, stateSpecB.peaksClean, {
                ms2ToleranceInDa: stateParams.matching_ms2_tol,
                removeNoise: stateParams.remove_noise,
            }).then((result) => {
                setEntropySimilarity(result);
            })
        } else {
            setEntropySimilarity(null);
        }
    }, [stateSpecA, stateSpecB, stateParams])

    return (<div>
        <Row justify={"center"}
             style={{"boxShadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2)"}}>
            <h2 style={{marginBlock: "6px"}}>Spectra Visualizer</h2>
        </Row>
        <br/>
        <Row justify={"space-evenly"} align={"top"}>
            <Col lg={6} md={23}>
                <PlotInput/>
            </Col>
            <Col lg={12} md={23}>
                {
                    stateEntropySimilarity ? <>
                        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Spectral similarity</Divider>
                        <Row>
                            <Col span={24}>
                                Entropy similarity: {stateEntropySimilarity.toFixed(3)}
                            </Col>
                        </Row>
                        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Plot</Divider>
                    </> : <></>
                }
                <Row>
                    <Col span={24}>
                        <PlotSpectrum height={stateParams.height}
                                      width={stateParams.width}
                                      specA={stateSpecA}
                                      specB={stateSpecB}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>);
}

export {atomParams, atomSpecA, atomSpecB};
export default App;
