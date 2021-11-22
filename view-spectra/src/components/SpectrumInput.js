import {Row, Col, Button, Input} from 'antd';


export default (props) => {
    return <>
        <Row justify={"left"}>
            Precursor m/z:
            <Input
                value={props.stateSpectrum.precursorMZ}
                onChange={(e) => props.setSpectrum({...props.stateSpectrum, precursorMZ: e.target.value})}
                style={{width: "100px"}}/>
        </Row>
        <Row justify={"left"}>
            Peaks
            <Input.TextArea
                rows="10"
                value={props.stateSpectrum.peaks}
                onChange={(e) => props.setSpectrum({...props.stateSpectrum, peaks: e.target.value})}/>
        </Row>
    </>
}

