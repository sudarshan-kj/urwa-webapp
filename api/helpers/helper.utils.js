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

exports.generatePreviousOverDues = (memberDetails) => {
  let overDueArray = [];
  if (memberDetails.monthlyMaintenance && memberDetails.openingBalance > 0) {
    let prevBalanceCount =
      memberDetails.openingBalance / memberDetails.maintenanceAmount;
    for (let i = 0; i < prevBalanceCount; i++) {
      let newDate = new Date(memberDetails.subscriptionStartDate);
      newDate.setMonth(newDate.getMonth() - (i + 1));
      overDueArray.push(newDate);
    }
  }
  return overDueArray;
};
