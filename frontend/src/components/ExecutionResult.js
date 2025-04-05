import React, { useEffect, useState } from 'react';
import { useBackend } from '../hooks/backend';
import { LabeledSpinner } from './infrastructure/LabeledSpinner';

export const ExecutionResult = ({ executionId }) => {
    const { call } = useBackend();

    const [loading, setLoading] = useState(true);

    const [output, setOutput] = useState(null);

    useEffect(() => {
        setLoading(true);
        setOutput(null);
    }, [executionId]);

    useEffect(() => {
        if (!executionId) return;

        const interval = setInterval(async () => {
            const response = await call('/code/' + executionId);
            console.log('from  Execution result ', response);
            const rez = JSON.parse(response.data);
            if (rez.status !== 'waiting') {
                setLoading(false);
                setOutput(rez.output);
            }

            if (response.data['status'] !== 'waiting') {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [executionId, call]);

    if (!loading) {
        return <pre>{output}</pre>;
    }

    return <LabeledSpinner label="Compiling..." />;
};
