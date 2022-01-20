import {Row, Col, InputNumber, Divider} from 'antd';
import {useState, useEffect} from 'react';
import SpectrumInput from "./SpectrumInput";


const PlotInput = (props) => {
    const stateData = props.stateData;
    const setData = props.setData;
    const [stateSpectrum1, setSpectrum1] = useState({precursorMz: null, peaks: ""});
    const [stateSpectrum2, setSpectrum2] = useState({precursorMz: null, peaks: ""});

    useEffect(() => {
        setData({
            ...stateData,
            specA: stateSpectrum1,
            specB: stateSpectrum2
        });
    }, [stateSpectrum1, stateSpectrum2]);


    return <>
        <SpectrumInput stateSpectrum={stateSpectrum1} setSpectrum={setSpectrum1}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Tail spectrum (optional)</Divider>
        <SpectrumInput stateSpectrum={stateSpectrum2} setSpectrum={setSpectrum2}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Plot size</Divider>
        <Row>
            <Col span={12}>Height (px): <InputNumber
                step={50} min={50}
                defaultValue={stateData.height}
                onChange={(e) => setData({...stateData, height: e})}/></Col>
            <Col span={12}>Weight (px): <InputNumber
                step={50} min={50}
                defaultValue={stateData.width}
                onChange={(e) => setData({...stateData, width: e})}/></Col>
        </Row>
    </>
}

export default PlotInput;