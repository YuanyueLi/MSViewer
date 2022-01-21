import 'antd/dist/antd.less';
import './App.css';
import {useState, useEffect} from 'react';
import {Row, Col} from 'antd';
import PlotSpectrum from "./PlotSpectrum";
import PlotInput from "./PlotInput";

function App() {
    const [statePlotData, setPlotData] = useState({
        height: Math.min(window.innerWidth * 0.8 * 2 / 3, 400),
        width: Math.min(window.innerWidth * 0.8, 600),
        specA: {},
        specB: {}
    })
    useEffect(() => {
        if (window.innerWidth >= 768) {
            setPlotData({
                height: Math.min(window.innerWidth * 0.8 * 2 / 3 * 2 / 3, 400),
                width: Math.min(window.innerWidth * 0.8 * 2 / 3, 600),
                specA: {},
                specB: {}
            })
        }
    }, [])

    return (
        <div>
            <Row justify={"center"}
                 style={{"boxShadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2)"}}>
                <h2>Spectra Visualizer</h2>
            </Row>
            <br/>
            <Row justify={"center"} align={"middle"}>
                <Col md={6} sm={23}>
                    <PlotInput stateData={statePlotData} setData={setPlotData}/>
                </Col>
                <Col md={16} sm={23}>
                    <Row justify={"center"} align={"middle"}>
                        <PlotSpectrum data={statePlotData}/>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default App;
