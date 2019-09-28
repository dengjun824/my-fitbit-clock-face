import { battery } from "power";
import { charger } from "power";


let oBattery = document.getElementById("battery");
let oBatteryText = document.getElementById("text_charge_level");
let oBatteryLevel = document.getElementById("charge_level");
let oChargerIcon = document.getElementById("charger_icon");

function setBattery(){
  let oBattery = document.getElementById("battery");
  let oBatteryText = document.getElementById("text_charge_level");
  let oBatteryLevel = document.getElementById("charge_level");
  let oChargerIcon = document.getElementById("charger_icon");
  var sChargeLevel = battery.chargeLevel;
  oBatteryLevel.width = sChargeLevel/100*28;
  oBatteryText.text = sChargeLevel+"%";
  if (sChargeLevel > 50){
    oBatteryLevel.style.fill = "Lime";
  }else if (sChargeLevel > 20){
    oBatteryLevel.style.fill = "Peach";
  }else{
    oBatteryLevel.style.fill = "red";
  }
  if (charger.connected){
    oChargerIcon.style.display = "inline";
  }else{
    oChargerIcon.style.display = "none";
  }
}

export { setBattery/*, oBattery as batteryComponent, oBatteryText as batteryText, oBatteryLevel as batteryLevel*/ };