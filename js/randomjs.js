
jQuery(document).ready(function(){
  var startDate = new Date('03/06/2019');
  var endDate = new Date();
  var numOfDates = getBusinessDatesCount(startDate,endDate);
  document.getElementById("days-of-testing").innerHTML = numOfDates;
  var coffe_drinked = (numOfDates*1.3).toFixed(0);
  document.getElementById("cups-drinked").innerHTML = coffe_drinked;

function getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if(!(dayOfWeek in [0, 6])) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }
})
