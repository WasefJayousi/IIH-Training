
let lst = [1,2,3,4,5,6,7,8,9,10]
let lst2 = ["wasef" , "farid"]

//اضافة عنصر في اخر المصفوفة , وارجاع اعداد المصفوفة 
console.log(`The added element: ${lst.push(11)}`)

//ازالة اخر عنصر في المصفوفة
lst.pop()
console.log("The removed element: " + lst)

// ارجاع مؤشر الرقم الموجود في المصفوفة , وان اذا الرقم غير موجود يرجع -1
console.log("The index of the element 5 : " + lst.indexOf(5))

unsorted_lst = [2,4,3,5,6,7,10,8,9,1]
//ترنيب المصفوفة من اصغر الى اكبر
console.log(unsorted_lst.sort())

console.log(lst.unshift(0))