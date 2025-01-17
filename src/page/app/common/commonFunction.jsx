export const priceCommaHandler = (price) => {
    price = Number(price.replaceAll(",",''));
    if(isNaN(price)) {
        return 0;
    }
    else {
        return price.toLocaleString(('ko-KR'));
    }
}