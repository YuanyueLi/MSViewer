// import 'antd/dist/antd.less';
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

    useEffect(() => {
        console.log(statePlotData)
    }, [statePlotData])

    return (
        <div>
            <Row justify={"center"}
                 style={{"boxShadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2)"}}>
                <h2>Spectra Visualizer</h2>
            </Row>
            <br/>
            <Row justify={"space-evenly"} align={"top"}>
                <Col md={6} sm={23}>
                    <PlotInput stateData={statePlotData} setData={setPlotData}/>
                </Col>
                <Col md={12} sm={23}>
                    <PlotSpectrum height={statePlotData.height}
                                  width={statePlotData.width}
                                  specA={statePlotData.specA}
                                  specB={statePlotData.specB}/>
                </Col>
            </Row>
        </div>
    );
}

export default App;
