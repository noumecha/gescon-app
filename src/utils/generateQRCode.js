import QRCode from 'qrcode';

export const generateQRCode = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch {
        return null;
    }
};