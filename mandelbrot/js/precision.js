
function maxPrecision (nums,min) {
  // https://docs.microsoft.com/en-us/office/troubleshoot/access/floating-calculations-info
  min = min?min:2;
  let arrs = nums.map(x => {return [...(x.toString())]}),
      res = [min],
      digArr = [],
      addArr = [],
      errorMsg = null;

  for (let i=0;i<arrs.length;i++) {
    let arr = arrs[i],
        foundStart = false,
        foundEnd = false,
        foundDecimal = false,
        tmpArr = [],
        addDigits = 0,
        j = 0,
        m = arr.length,
        k = m-1;

    forloop1:
    for (let char,zeros=-1;j<m && !foundStart;j++) {
      char = arr[j];
      switch (char) {
      case "-":
        continue forloop1;
      case "0":
        if (zeros != -1) {
          zeros++;
          addDigits++;
        }
        continue forloop1;
      case ".":
        if (!foundDecimal) {
          zeros++
          foundDecimal = true;
        } else {
          errorMsg = `Extra decimal point found at j=${j} in ${arr.join("")}`;
          break forloop1;
        }
        break;
      default:
        foundStart=true;
        tmpArr.push(char);
        j++;
        break forloop1;
      }
    }

    if (!foundStart) {
      res.push(0);
      digArr.push([]);
      continue;
    } else {
      addArr.push(addDigits);
    }

    forloop2:
    for (let char;k>=j;k--) {
      char = arr[k]
      switch (char) {
      case "0":
        continue forloop2;
      case ".":
        if (foundDecimal) {
          errorMsg = `Unexpected decimal '${char} 'in trailing chars. k = '${k}'`
          break forloop2;
        } else {
          foundDecimal = true;
        }
      case "-":
        errorMsg = `Unexpected char '${char} 'in trailing chars. k = '${k}'`
        break forloop2;
      default:
        break forloop2;
      }
    }
    for (;j<=k;j++) {
        if (arr[j] != ".") tmpArr.push(arr[j]);
    }
    digArr.push(tmpArr);
    res.push(tmpArr.length);
  }

  return [Math.max(...res),Math.max(...addArr),digArr];
}

var testInput = new Array();

// input values should be float or integer
testInput.push(
  [
    [-1.2,5.003,18.0005,10,-0.010,170.0,-700.0001],
    2,
    [7, 1] // <-- expected answer
  ]);

testInput.push(
  [
    [123.45,-0.00000524,-12.34500,6,2.25,-1.589],
    4,
    [5,5]
  ]);

/*

  Run a test like this if using test values:

  maxPrecision(...testInput[i]);
 */