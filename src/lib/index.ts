
export function numberWithCommas(x:   number | null) {
    if (x != null &&  !isNaN(x)) {
        var symbol = "₦";
         return symbol + x.toLocaleString();
    } else {
        return x;
    }
}