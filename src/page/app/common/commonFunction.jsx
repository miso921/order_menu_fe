export const priceCommaHandler = (price) => {
    if (typeof price === "string") {
        price = Number(price.replaceAll(",", ""));
    }

    if (isNaN(price)) {
        return "0";
    }

    return price.toLocaleString("ko-KR");
};