///print the duplicate element in an array

const arr = [3, 5, 9, 12, 33, 44, 5, 33, 9]
const stringPal = "openanepo"
const sortedArr = arr.sort();
const stringArr = "Giraffe Hefty";
const sortedString = stringArr.split('').sort();
// console.log(arr)
// console.log(sortedArr);



const duplicateFunction = (array) =>{

    const sortedArray = array.sort();
    let prev;
    let curr;
    let duplicateArr = [];

    for(let i = 1; i < sortedArray.length; i++){
        curr = sortedArray[i];
        prev = sortedArray[i-1];
        if(prev == curr){
            duplicateArr.push(curr)
        }
    }
    
    console.log([...new Set(duplicateArr)])
}

const reverseString = (stringToReverse) => {
    let stringArray = stringToReverse.split('')
    let newArray = [];
    for(let i = stringArray.length-1; i>=0; i--){
        newArray.push(stringArray[i])
    }
    console.log(newArray);
}

const palindromeCheck = (stringToCheck) =>{
    const splitString = stringToCheck.split('');
    let j = splitString.length-1;
    console.log(splitString.length/2)
    for(let i = 0; i < splitString.length/2; i++){
        console.log(splitString[i]);
        console.log(splitString[j]);

        if(splitString[i] != splitString[j]){
            return false;
        }
        j--;
    }
    return true;
}


duplicateFunction(sortedString);
reverseString(stringArr);
if(palindromeCheck(stringPal)){
    console.log('ITSA PALINDROME')
}else{
    console.log('NOTTA PALINDROME')
}
