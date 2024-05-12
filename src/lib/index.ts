
export function numberWithCommas(x:number | null) {
    var symbol = "₦";
       
    if (Number.isInteger(x) && x !== null) {
         return symbol + x.toLocaleString();
    } else {
        return x;
    }
}