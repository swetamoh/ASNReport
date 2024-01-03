const cds = require('@sap/cds');
const axios = require('axios');

module.exports = (srv) => {

    const { GetASNHeaderList, GetASNDetailList } = srv.entities;
    
    srv.on('READ', GetASNHeaderList, async (req) => {
        const params = req._queryOptions
        const results = await getASNHeaderList(params);
        if (!results) throw new Error('Unable to fetch ASN Header List.');
        return results

    });

    srv.on('READ', GetASNDetailList, async (req) => {
        const {AddressCode, ASNNumber} = req._queryOptions
        const results = await getASNDetailList(AddressCode, ASNNumber);
        if (!results) throw new Error('Unable to fetch ASN Header List.');
        return results

    });
};

async function getASNHeaderList(params) {
    try {
        const {
            AddressCode, PoNumber, ASNNumber, ASNFromdate, ASNTodate,
            InvoiceStatus, MRNStatus, ApprovedBy
        } = params;
        const url = `https://imperialauto.co:84/IAIAPI.asmx/GetASNHeaderList?RequestBy='Manikandan'&AddressCode='${AddressCode}'&PoNumber='${PoNumber}'&ASNNumber='${ASNNumber}'&ASNFromdate='${ASNFromdate}'&ASNTodate='${ASNTodate}'&InvoiceStatus='${InvoiceStatus}'&MRNStatus='${MRNStatus}'&ApprovedBy='${ApprovedBy}'`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': 'Bearer IncMpsaotdlKHYyyfGiVDg==',
                'Content-Type': 'application/json'
            },
            data: {}
        });

        if (response.data && response.data.d) {
            return JSON.parse(response.data.d);
        } else {
            console.error('Error parsing response:', response.data);
            throw new Error('Error parsing the response from the API.');
        }
    } catch (error) {
        console.error('Error in getASNHeaderList API call:', error);
        throw new Error('Unable to fetch ASN Header List.');
    }
}

async function getASNDetailList(AddressCode, ASNNumber) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://imperialauto.co:84/IAIAPI.asmx/GetASNDetailList?RequestBy='Manikandan'&AddressCode='${AddressCode}'&ASNNumber='${ASNNumber}'`,
            headers: {
                'Authorization': 'Bearer IncMpsaotdlKHYyyfGiVDg==',
                'Content-Type': 'application/json'
            },
            data: {}
        });

        if (response.data && response.data.d) {
            return JSON.parse(response.data.d);
        } else {
            console.error('Error parsing response:', response.data);
            throw new Error('Error parsing the response from the API.');
        }
    } catch (error) {
        console.error('Error in getASNDetailList API call:', error);
        throw new Error('Unable to fetch ASN Detail List.');
    }
}
