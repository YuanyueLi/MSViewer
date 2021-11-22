import 'antd/dist/antd.less';
import './App.css';
import {useState, useEffect} from 'react';
import {Row, Col, Button} from 'antd';
import SpectrumInput from "./SpectrumInput";
import PlotSpectrum from "./PlotSpectrum";

function App() {
    const [stateSpectrum1, setSpectrum1] = useState({precursorMZ: null, peaks: ""});
    const [stateSpectrum2, setSpectrum2] = useState({precursorMZ: null, peaks: ""});

    useEffect(() => {
        if (stateSpectrum1) {
            console.log(stateSpectrum1);
        }
    }, [stateSpectrum1]);


    return (
        <div>
            <Row justify={"center"}>
                <Col span={6}>
                    <Row>
                        Input your spectrum here:
                    </Row>
                    <SpectrumInput stateSpectrum={stateSpectrum1} setSpectrum={setSpectrum1}/>
                    <Row>
                        If you want to see a head-to-tail comparison, input another spectrum here:
                    </Row>
                    <SpectrumInput stateSpectrum={stateSpectrum2} setSpectrum={setSpectrum2}/>
                </Col>
                <Col span={16}>
                    <Row justify={"center"}>
                        <PlotSpectrum
                            height={400}
                            precursorMzA={stateSpectrum1.precursorMZ}
                            peaksA={stateSpectrum1.peaks}
                            precursorMzB={stateSpectrum2.precursorMZ}
                            peaksB={stateSpectrum2.peaks}/>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default App;
