import { useState, React } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <div className="confirm-modal">
            <div className="confirm-modal-content">
                <h2>
                    {title}
                </h2>
                <p>
                    {message}
                </p>
                <div className="confirm-modal-actions">
                    <button onClick={handleClose}>Annuler</button>
                    <button onClick={handleConfirm}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

export default { ConfirmModal };