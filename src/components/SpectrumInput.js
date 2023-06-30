import {Row, Col, Input} from 'antd';

const SpectrumInput = (props) => {
    return <>
        <Row justify={"left"}>
            <Col span={8}>
                Precursor m/z:
            </Col>
            <Col span={16}>
                <Input
                    value={props.precursorMz}
                    onChange={(e) => props.setPrecursorMz(e.target.value)}
                    style={{width: "100px"}}/>
            </Col>
        </Row>
        <Row justify={"left"}>
            <Col span={8}>
                Peaks:
            </Col>
            <Input.TextArea
                rows="9"
                value={props.peaks}
                onChange={(e) => props.setPeaks(e.target.value)}/>
        </Row>
    </>
}

export default SpectrumInput;