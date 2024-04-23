// const cds = require('@sap/cds');
const axios = require('axios');

module.exports = (srv) => {

    const { GetASNHeaderList, GetASNDetailList } = srv.entities;

    srv.on('READ', GetASNHeaderList, async (req) => {
        const params = req._queryOptions;
        const results = await getASNHeaderList(params);
        if (results.error) req.reject(500, results.error);
        return results;

    });

    srv.on('READ', GetASNDetailList, async (req) => {
        const { username, AddressCode, ASNNumber, UnitCode } = req._queryOptions;
        const results = await getASNDetailList(username, AddressCode, ASNNumber, UnitCode);
        if (results.error) req.reject(500, results.error);
        return results;
    });
};

async function getASNHeaderList(params) {

    try {
        const {
            username, AddressCode, PoNumber, ASNNumber, ASNFromdate, ASNTodate,
            InvoiceStatus, MRNStatus, ApprovedBy
        } = params;

        const token = await generateToken(username);

        const url = `https://imperialauto.co:84/IAIAPI.asmx/GetASNHeaderList?RequestBy='${username}'&AddressCode='${AddressCode}'&PoNumber='${PoNumber}'&ASNNumber='${ASNNumber}'&ASNFromdate='${ASNFromdate}'&ASNTodate='${ASNTodate}'&InvoiceStatus='${InvoiceStatus}'&MRNStatus='${MRNStatus}'&ApprovedBy='${ApprovedBy}'`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {}
        });

        if (response.data && response.data.d) {
            return JSON.parse(response.data.d);
        } else {
            return {
                error: response.data.ErrorDescription
            }
        }
    } catch (error) {
        console.error('Error in getASNHeaderList API call:', error);
        throw new Error(error);
    }
}

async function getASNDetailList(username, AddressCode, ASNNumber, UnitCode) {
    try {

        const token = await generateToken(username);

        const response = await axios({
            method: 'get',
            url: `https://imperialauto.co:84/IAIAPI.asmx/GetASNDetailList?RequestBy='${username}'&AddressCode='${AddressCode}'&ASNNumber='${ASNNumber}'&UnitCode='${UnitCode}'`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {}
        });

        if (response.data && response.data.d) {
            return JSON.parse(response.data.d);
        } else {
            return {
                error: response.data.ErrorDescription
            }
        }
    } catch (error) {
        console.error('Error in getASNDetailList API call:', error);
        throw new Error(error);
    }
}


async function generateToken(username) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://imperialauto.co:84/IAIAPI.asmx/GenerateToken',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "InputKey": username
            }
        });

        if (response.data && response.data.d) {
            return response.data.d;
        } else {
            console.error('Error parsing token response:', response.data);
            throw new Error('Error parsing the token response from the API.');
        }
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Unable to generate token.');
    }
}
