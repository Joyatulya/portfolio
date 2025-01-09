export function roundNum(num : number,decimal_places = 2) : number{
 let mul_factor = 10 ** decimal_places
 let new_num = Math.round(num * mul_factor) / mul_factor
 return new_num
}