import 'antd/dist/antd.less';
import './App.css';
import {useState, useEffect} from 'react';
import {Row, Col} from 'antd';
import PlotSpectrum from "./PlotSpectrum";
import PlotInput from "./PlotInput";

function App() {
    const [statePlotData, setPlotData] = useState({
        height: 400,
        width: 600,
        specA: {},
        specB: {}
    })

    useEffect(() => {
        if (statePlotData) {
            // console.log(statePlotData)
        }
    }, [statePlotData])

    return (
        <div>
            <Row justify={"center"}
                 style={{"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2)"}}>
                <h2>Spectra Visualizer</h2>
            </Row>
            <br/>
            <Row justify={"center"} align={"middle"}>
                <Col span={6}>
                    <PlotInput stateData={statePlotData} setData={setPlotData}/>
                </Col>
                <Col span={16}>
                    <Row justify={"center"} align={"middle"}>
                        <PlotSpectrum data={statePlotData}/>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default App;
