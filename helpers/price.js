module.exports = (query) => {
    const firstPrice = parseInt(query.firstPrice);
        const ecoPrice = parseInt(query.ecoPrice);
        const businessPrice = parseInt(query.businessPrice);
        const vipPrice = parseInt(query.vipPrice);


        let price = [
            { priceName: 'firstPrice', price: firstPrice },
            { priceName: 'ecoPrice', price: ecoPrice },
            { priceName: 'businessPrice', price: businessPrice },
            { priceName: 'vipPrice', price: vipPrice }
        ];

    return price;

}