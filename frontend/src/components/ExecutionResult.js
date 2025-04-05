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
            console.log("Making request for execution status");
            const response = await call('/code/' + executionId);

            const rez = JSON.parse(response.data);
            if (rez.status !== 'waiting') {
                setLoading(false);
                setOutput(rez.output);
            }

            if (rez.status !== 'waiting') {
                console.log('Clearing interval because status is not waiting');
                console.log(rez);
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            console.log('Clearing interval because exiting');
            clearInterval(interval);
        } ;
    }, [executionId, call]);

    if (!loading) {
        return <pre>{output}</pre>;
    }

    return <LabeledSpinner label="Compiling..." />;
};
