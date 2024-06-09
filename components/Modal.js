import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '5px',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                color: 'black'
            }}>
                {children}
                <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
