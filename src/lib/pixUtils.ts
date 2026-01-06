/**
 * Utility to generate PIX BRCode (Static QR Code)
 * Based on the Pix specification by Bacen
 */

const crc16 = (data: string): string => {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
        let b = data.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            let bit = ((b >> (7 - j) & 1) === 1);
            let c15 = ((crc >> 15 & 1) === 1);
            crc <<= 1;
            if (c15 !== bit) crc ^= polynomial;
        }
    }

    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

const formatField = (id: string, value: string): string => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
};

export const generatePixPayload = (
    key: string,
    name: string,
    city: string,
    amount?: number,
    transactionId: string = '***'
): string => {
    // Merchant Account Info
    const gui = formatField('00', 'br.gov.bcb.pix');
    const keyField = formatField('01', key);
    const info = formatField('26', `${gui}${keyField}`);

    // Basic Fields
    const payloadContents = [
        formatField('00', '01'), // Payload Format Indicator
        formatField('01', '11'), // Point of Initiation Method (11 for static, 12 for dynamic)
        info,
        formatField('52', '0000'), // Merchant Category Code
        formatField('53', '986'),  // Transaction Currency (BRL)
        amount ? formatField('54', amount.toFixed(2)) : '', // Transaction Amount
        formatField('58', 'BR'),   // Country Code
        formatField('59', name.substring(0, 25).toUpperCase()), // Merchant Name
        formatField('60', city.substring(0, 15).toUpperCase()), // Merchant City
        formatField('62', formatField('05', transactionId.substring(0, 25))), // Additional Data Field
    ].join('');

    const result = `${payloadContents}6304`;
    return `${result}${crc16(result)}`;
};
