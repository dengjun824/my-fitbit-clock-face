import document from "document";
import clock from "clock";
import {gettext} from "i18n";
import { me as appbit } from "appbit";
import {today} from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";
import { battery } from "power";
import { charger } from "power";

let myClock = document.getElementById("myClock");
let myCalendar = document.getElementById("myCalendar");
let myHeartReate = document.getElementById("text_heart_rate");

// let myStep = document.getElementById("myClock");

clock.granularity = 'seconds'; // seconds, minutes, hours

clock.ontick = function(evt) {
    
    myCalendar.text = getDate(evt.date) + " " + getDay(evt.date.getDay());
    let isPowerUpdate = _setBattery();
    if(!isPowerUpdate){
      _getUserActivity();
      /*heart rate reading*/ 
      if (HeartRateSensor) {
        const hrm = new HeartRateSensor({ frequency: 1 });
        hrm.addEventListener("reading", () => {
          myHeartReate.text = hrm.heartRate;
        });
        hrm.start();
      }
    }
};


function _getUserActivity(){
  if( appbit.permissions.granted("access_activity") ) {
    let aDimension = ["steps", "calories", "distance"];
    for (let x of aDimension){
      let oText = document.getElementById("text_"+x);
      oText.text = today.adjusted[x];
    }
  }
}

function getDay(day){
	let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let dayMesgId = days[day];
	return gettext(dayMesgId);
}

function getDate(oDate){
  _setHour(oDate.getHours());
  _setMin(oDate.getMinutes());
  _setSec(oDate.getSeconds());
	let year = oDate.getFullYear();
	let month = oDate.getMonth()+1;
	let date = oDate.getDate();
  let oText = document.getElementById("text_hour_min");
  let sMinute = oDate.getMinutes()>=10 ? oDate.getMinutes() : "0"+oDate.getMinutes();
  let sHour = preferences.clockDisplay === "12h" ? (oDate.getHours()||12) : oDate.getHours();
  sHour = sHour>=10 ? sHour : "0"+sHour;
  oText.text = sHour + " : " + sMinute;
  return year+gettext("year")+month+gettext("month")+date+gettext("date");
}

function _setHour(vHours){
  var vTheta = 360/12*(vHours%12);
  var oHourControl = document.getElementById("clock_hour");
  setArc(oHourControl, {
    mX: 55,
    mY: 65,
    r: 90,
    theta: vTheta,
    vWidth: 10,
    sColor: "deeppink"
  });
}

function _setMin(vMinutes){
  var vTheta = 360/60*vMinutes;
  var oMinControl = document.getElementById("clock_min");
  setArc(oMinControl, {
    mX: 45,
    mY: 55,
    r: 100,
    theta: vTheta,
    vWidth: 10,
    sColor: "dodgerblue"
  });
}

function _setSec(vSeconds){
  var vTheta = 360/60*vSeconds;
  var oSecControl = document.getElementById("clock_sec");
  setArc(oSecControl, {
    mX: 35,
    mY: 45,
    r: 110,
    theta: vTheta,
    vWidth: 10,
    sColor: "lime"
  });
  let oText = document.getElementById("text_sec");
  oText.text = vSeconds;  
}
/**
 * set arc path in svg
 *
 * @param oPath
 * @param oOption {mX, mY, r, theta, vWidth, sColor}
 */
function setArc(oArc, oOption) {
//       var realR = oOption.r - oOption.vWidth;
//       var dArr = ["M", oOption.mX, oOption.mY + oOption.vWidth, "A", realR, realR, 0, 
//       oOption.theta>=180 ? 1 : 0, 1];
//       var cx = oOption.mX, cy = oOption.mY + oOption.r;

//       oOption.theta = oOption.theta%360;
//       // ??360??0??????
//       var theta = oOption.theta == 0 ? 359.9 : oOption.theta;

//       var alpha = theta/180 * Math.PI;
//       var dx = realR * Math.sin(alpha);
//       var dy = realR * Math.cos(alpha);
//       var x = cx + dx, y = cy - dy;

//       dArr.push(x.toFixed(2));
//       dArr.push(y.toFixed(2));
//       var d = dArr.join(" ");
      oArc.x = oOption.mX;
      oArc.y = oOption.mY; 
      oArc.width = oOption.r*2;
      oArc.height = oOption.r*2;
      oArc.arcWidth = oOption.vWidth;
      oArc.startAngle = 0;
      oArc.sweepAngle = oOption.theta;
}

function _setBattery(){
  let oBattery = document.getElementById("battery");
  let oBatteryText = document.getElementById("text_charge_level");
  let oBatteryLevel = document.getElementById("charge_level");
  let oChargerIcon = document.getElementById("charger_icon");
  var sChargeLevel = battery.chargeLevel;
  if(sChargeLevel+"%" === oBatteryText.text){
    return false;
  }
  oBatteryLevel.width = sChargeLevel/100*28;
  oBatteryText.text = sChargeLevel+"%";
  if (sChargeLevel > 50){
    oBatteryLevel.style.fill = "lime";
  }else if (sChargeLevel > 20){
    oBatteryLevel.style.fill = "peach";
  }else{
    oBatteryLevel.style.fill = "red";
  }
  if (charger.connected){
    oChargerIcon.style.display = "inline";
  }else{
    oChargerIcon.style.display = "none";
  }
  return true;
  // console.log(oBattery.width);
}




