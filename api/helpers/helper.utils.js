exports.validateNumber = (value) => {
  if (!Number.isInteger(parseInt(value))) {
    throw new Error("Invalid data provided");
  }
};

//intersection
exports.mergeArrays = (arr1, arr2, key1, key2) => {
  let merged = [];
  for (let i = 0; i < arr1.length; i++) {
    merged.push({
      ...arr1[i],
      ...arr2.find((item) => item[key1] === arr1[i][key2]),
    });
  }
  return merged;
};

//symmetric difference
exports.disjointArrays = (arr1, arr2, key1, key2) => {};

exports.computeDues = (memberDetails) => {
  let openingBalanceAbs = Math.abs(memberDetails.openingBalance);
  let overDueArray = [];
  let dueFor = "";
  let advancePaidArray = [];

  let now = new Date();
  if (memberDetails.openingBalance < 0) {
    let prevBalanceMonthCount =
      openingBalanceAbs / memberDetails.maintenanceAmount;
    for (let i = 0; i < prevBalanceMonthCount; i++) {
      let newDate = new Date(now);
      newDate.setMonth(newDate.getMonth() - (i + 1)); // we are pushing the date object, and mongo can converts this into toISOString() internally before persisiting into the DB ( as per my understanding )
      overDueArray.push(newDate);
    }
    dueFor = overDueArray.splice(1);
  } else if (memberDetails.openingBalance > 0) {
    let advancePaidMonthCount =
      openingBalanceAbs / memberDetails.maintenanceAmount;
    for (let i = 0; i < advancePaidMonthCount; i++) {
      let newDate = new Date(now);
      newDate.setMonth(newDate.getMonth() + (i + 1));
      advancePaidArray.push(newDate);
    }
  }
  return { advancePaidArray, overDueArray };
};
