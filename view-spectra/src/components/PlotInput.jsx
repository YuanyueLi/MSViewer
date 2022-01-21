import {Row, Col, InputNumber, Divider} from 'antd';
import {useState, useEffect} from 'react';
import SpectrumInput from "./SpectrumInput";


const PlotInput = (props) => {
    const stateData = props.stateData;
    const setData = props.setData;
    const [stateSpectrum1, setSpectrum1] = useState({precursorMz: null, peaks: ""});
    const [stateSpectrum2, setSpectrum2] = useState({precursorMz: null, peaks: ""});

    useEffect(() => {
        setSpectrum1({
            precursorMz: 179.0697,
            peaks: "133.0648\t19.463591\n151.0754\t8.644951\n155.9745\t3.628786\n161.0597\t100"
        })
    }, []);

    useEffect(() => {
        setData({
            ...stateData,
            specA: stateSpectrum1,
            specB: stateSpectrum2
        }) // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateSpectrum1, stateSpectrum2])


    return <>
        <SpectrumInput stateSpectrum={stateSpectrum1} setSpectrum={setSpectrum1}/>
        <Divider plain style={{marginTop: "8px", marginBottom: "8px"}}>Tail spectrum (optional)</Divider>
        <SpectrumInput stateSpectrum={stateSpectrum2} setSpectrum={setSpectrum2}/>
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