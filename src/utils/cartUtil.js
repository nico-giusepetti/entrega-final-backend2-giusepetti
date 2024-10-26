const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const calcularTotal = (productos) => {
    let total = 0;

    productos.forEach(item => {
        total += item.product.price * item.quantity;
    });

    return total;
}

export { generateRandomCode, calcularTotal };