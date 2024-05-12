
export function numberWithCommas(x:number | null) {
    var symbol = "₦";
       
    if (Number.isInteger(x) && x !== null) {
         return symbol + addCommasToNumber(x);
    } else {
        return x;
    }
}
function addCommasToNumber(number: { toString: () => any; }) {
    // Convert the number to a string
    let numberString = number.toString();
    
    // Split the number string into parts based on the decimal point (if any)
    let parts = numberString.split('.');
    
    // Add commas to the integer part of the number
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Join the parts back together with the decimal point (if any)
    return parts.join('.');
}