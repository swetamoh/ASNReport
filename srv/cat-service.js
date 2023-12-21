const cds = require('@sap/cds');
const axios = require('axios');

module.exports = (srv) => {

    const { GetASNHeaderList } = srv.entities;
    
    srv.on('READ', GetASNHeaderList, async (req) => {
        const {AddressCode} = req._queryOptions
        //const AddressCode = 'PAI-01-03'
        const results = await getASNHeaderList(AddressCode);
        if (!results) throw new Error('Unable to fetch ASN Header List.');
        return results

    });
};

async function getASNHeaderList(AddressCode) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://imperialauto.co:84/IAIAPI.asmx/GetASNHeaderList?RequestBy='Manikandan'&AddressCode='${AddressCode}'`,
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