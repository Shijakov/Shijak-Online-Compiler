import { Spinner } from 'react-bootstrap';

export const LabeledSpinner = ({ label = '' }) => {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: '70vh' }}
        >
            <Spinner animation="border" role="status" />
            <span className="mt-2">{label}</span>
        </div>
    );
};
