module.exports = (price) => {

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const newPrice = VND.format(price);
    console.log('Việt Nam đồng: ' + VND.format(price)); // Việt Nam đồng: 21.450 ₫

    return newPrice;
}