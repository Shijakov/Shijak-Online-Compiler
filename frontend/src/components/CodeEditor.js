import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useBackend } from '../hooks/backend';
import { ExecutionResult } from './ExecutionResult';

export const CodeEditor = () => {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');

    const [executionId, setExecutionId] = useState(null);

    const { call } = useBackend();

    const handleCompile = async () => {
        const res = await call('/code', 'POST', { input, code });
        setExecutionId(res.data);
    };

    return (
        <Container fluid className="p-4">
            <Row>
                {/* Left Side - Code Input and Text Input */}
                <Col md={6} className="d-flex flex-column">
                    <h5>Code Input</h5>
                    <ReactCodeMirror
                        value={code}
                        height="70vh"
                        onChange={(val) => setCode(val)}
                    />
                    <Form.Group className="mt-3">
                        <Form.Label>Input for Code</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </Form.Group>
                </Col>

                {/* Right Side - Output and Compile Button */}
                <Col md={6} className="d-flex flex-column">
                    <h5>Output</h5>
                    <div
                        className="border p-3 bg-light flex-grow-1"
                        style={{ minHeight: '200px' }}
                    >
                        {executionId && (
                            <ExecutionResult executionId={executionId} />
                        )}
                    </div>
                    <Button
                        className="mt-3 align-self-start"
                        onClick={handleCompile}
                    >
                        Compile
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CodeEditor;
