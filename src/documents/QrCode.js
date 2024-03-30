import React from 'react';
import QRCode from 'react-qr-code';

const QrCode = () => {
    const generateQRCode = async (data) => {
        try {
            const url = await QRCode.toString(data);
            return url;
        } catch (error) {
            console.error('Erreur de génération du QR Code', error);
            return null;
        }
    }

    return (
        <div>
            <QRCode value={generateQRCode("test-title")} size={200} />
        </div>
    );
}

export default QrCode;