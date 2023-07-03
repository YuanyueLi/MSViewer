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
                    placeholder={"500.321"}
                    onChange={(e) => props.setPrecursorMz(e.target.value)}
                    style={{width: "150px"}}/>
            </Col>
        </Row>
        <Row justify={"left"}>
            <Col span={8}>
                Peaks:
            </Col>
            <Input.TextArea
                allowClear={true}
                rows="9"
                placeholder={"100.321\t30.0\n300.321\t100.0\n..."}
                value={props.peaks}
                onChange={(e) => props.setPeaks(e.target.value)}/>
        </Row>
    </>
}

export default SpectrumInput;