  
const websocket_endpoint = "wss://relay.aricodes.net/ws";

var IsSeparated = false;
var IsPlayer2 = false;

var currentGameName = "None";

const pad = i => i.toString().padStart(2, '0');

window.onload = function () {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// SEPARATE PLAYER STATS
	const separated = urlParams.get('separated');
	if (separated != null) {
		IsSeparated = true;
	}

	// IS PLAYER 2 CHECK
	const isPlayer2 = urlParams.get('isplayer2');
	if (isPlayer2 != null) {
		IsPlayer2 = true;
	}

	// CHECK FOR AUTH TOKEN
	const token = urlParams.get('token');
	if (token != null) {
		const socket = new WebSocket(websocket_endpoint);
		socket.onopen = () => socket.send(`listen:${token}`);
		socket.onmessage = (event) => appendData(JSON.parse(event.data));
	}
	else {
		let mainContainer = document.getElementById("srtQueryData");
		mainContainer.innerHTML = "Please provide username params to url to listen to.";
	}

};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function GetCSS(name) {
	if (!document.getElementById('myCss'))
	{
		currentGameName = name;
	    var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = 'myCss';
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = name + ".css";
	    link.media = 'all';
		head.appendChild(link);
		return;
	}
	else if (currentGameName != name){
		document.getElementById('myCss').remove();
		currentGameName = name;
	    var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = cssId;
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = name + ".css";
	    link.media = 'all';
		head.appendChild(link);
		return;
	}
}

function appendData(data) {
	//console.log(data);
	GetCSS(data.GameName);
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	var player1Container = document.getElementById("srtPlayer1");
	player1Container.innerHTML = "";

	var player2Container = document.getElementById("srtPlayer2");
	player2Container.innerHTML = "";

	var rerContainer = document.getElementById("inventoryRER");
	rerContainer.innerHTML = "";

	var re8Container = document.getElementById("inventory");
	re8Container.innerHTML = "";

	if (data.GameName != "RE5") 
	{
		player1Container.style.background = "none";
		player2Container.style.background = "none";
	}
	else if (data.GameName == "RE5")
	{
		player1Container.style.background = "url(https://cdn.discordapp.com/attachments/845799949312196618/854475812232626216/unknown.png)";
		player2Container.style.background = "url(https://cdn.discordapp.com/attachments/845799949312196618/854475812232626216/unknown.png)";
	}

	switch (data.GameName)
	{
		case "RE0":
			RE0GetItems(data);
			return;
		case "RE1":
			RE1GetItems(data);
			return;
		case "RE2":
			RE2GetItems(data);
			return;
		case "RE3":
			RE3GetItems(data);
			return;
		case "RE1R":
			return;
		case "RE2R":
			RE2RGetItems(data);
			return;
		case "RE3R":
			RE3RGetItems(data);
			return;
		case "RE5":
			if (!IsSeparated)
			{
				RE5GetItemsPlayer1(data);
				RE5GetItemsPlayer2(data);
				return;
			}
			else 
			{
				if (IsPlayer2) 
				{
					RE5GetItemsPlayer2(data);
					player1Container.style.background = "none";
					return;
				}
				RE5GetItemsPlayer1(data);
				player2Container.style.background = "none";
			}
			return;
		case "RE7":
			RE7GetItems(data);
			return;
		case "RE8":
			RE8GetItems(data)
			return;
		default:
			mainContainer.innerHTML = "No Plugin Detected";
			player1Container.innerHTML = "";
			player2Container.innerHTML = "";
			return;
	}
}

// RESIDENT EVIL 0 REMAKE
const RE0ItemImage = (itemId) => `<img src="RE0/${itemId}.png"></img>`;

function RE0GetItems(data) {
	let mainContainer = document.getElementById("srtQueryData");
	let Inventory = data.PlayerInventory;
	mainContainer.innerHTML = "";

	//Equipped Weapon
	//mainContainer.innerHTML += `<div class="equipped-item"><img class="e-item" src="RE0/${data.CurrentWeapon}.png"></img><div class="inventory-item-quantity2"><font color="#00FF00">${RE1GetCurrentItemAmmo(data.PlayerInventory, data.CurrentWeapon)}</font></div></div>`;

	//Inventory Display
	let inventory = '<div class="inventory">';

	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot1ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot1Quantity}</font></div></div>`;
	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot2ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot2Quantity}</font></div></div>`;
	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot3ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot3Quantity}</font></div></div>`;
	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot4ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot4Quantity}</font></div></div>`;
	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot5ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot5Quantity}</font></div></div>`;
	inventory += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory.Slot6ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory.Slot6Quantity}</font></div></div>`;

    inventory += "</div>";
	mainContainer.innerHTML += inventory;

	mainContainer.innerHTML += `<div class="equipped-item"><img class="e-item" src="RE0/${data.PlayerInventory.EquippedSlotID}.png"></img><div class="inventory-item-quantity2"><font color="#00FF00">${data.PlayerInventory.EquippedSlotAmmo}</font></div></div>`;
	
	let inventory2 = '<div class="inventory2">';

	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot1ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot1Quantity}</font></div></div>`;
	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot2ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot2Quantity}</font></div></div>`;
	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot3ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot3Quantity}</font></div></div>`;
	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot4ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot4Quantity}</font></div></div>`;
	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot5ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot5Quantity}</font></div></div>`;
	inventory2 += `<div class="inventory-item">${RE0ItemImage(data.PlayerInventory2.Slot6ID)}<div class="inventory-item-quantity"><font color="#00FF00">${data.PlayerInventory2.Slot6Quantity}</font></div></div>`;

    inventory2 += "</div>";
	mainContainer.innerHTML += inventory2;
	
	mainContainer.innerHTML += `<div class="equipped-item2"><img class="e-item" src="RE0/${data.PlayerInventory.EquippedSlotID}.png"></img><div class="inventory-item-quantity2"><font color="#00FF00">${data.PlayerInventory2.EquippedSlotAmmo}</font></div></div>`;
}

// RESIDENT EVIL 1 REBIRTH
const RE1ItemImage = (itemId) => `<img src="RE1C/${itemId}.png"></img>`;

function RE1GetItems(data) {
	let mainContainer = document.getElementById("srtQueryData");
	let Inventory = RE1GetInventory(data);
	mainContainer.innerHTML = "";

	//Equipped Weapon
	mainContainer.innerHTML += `<div class="equipped-item"><img class="e-item" src="RE1C/${data.CurrentWeapon}.png"></img><div class="inventory-item-quantity2"><font color="#00FF00">${RE1GetCurrentItemAmmo(data.PlayerInventory, data.CurrentWeapon)}</font></div></div>`;

	//Inventory Display
	let inventory = '<div class="inventory">';
	Inventory.map(item => {
		let quantity = item.ItemID <= 18 && item.ItemID >= 2? item.Quantity : "";
		inventory += `<div class="inventory-item">${RE1ItemImage(item.ItemID)}<div class="inventory-item-quantity"><font color="#00FF00">${quantity}</font></div></div>`
	});
    inventory += "</div>"
    mainContainer.innerHTML += inventory;
}

function RE1GetCurrentItemAmmo(inventory, currentWeaponID) 
{
	for (let i = 0; i < inventory.length; i++) 
	{
		if (inventory[i].ItemID == currentWeaponID)
		{
			let quantity = inventory[i].ItemID <= 18 && inventory[i].ItemID >= 2 ? inventory[i].Quantity : "";
			return quantity;
		}
	}
}

function RE1GetInventory(data) {
	if (data.PlayerMaxHealth == 140) 
	{
		return data.PlayerInventory.slice(0, 6);
	}
	return data.PlayerInventory;
}

// RESIDENT EVIL 2 REBIRTH
const RE2ItemImage = (itemId) => `<img src="RE2C/${pad(itemId)}.bmp"></img>`;

function RE2GetItems(data) {
	let mainContainer = document.getElementById("srtQueryData");
	let Inventory = RE2GetInventory(data);
	mainContainer.innerHTML = "";

	//Equipped Weapon
	mainContainer.innerHTML += `<div class="equipped-item"><img class="e-item" src="RE2C/${pad(data.EquippedItemId)}.bmp"></img><div class="inventory-item-quantity2"><font color="#00FF00">${RE2GetCurrentItemAmmo(data.PlayerInventory, data.EquippedItemId)}</font></div></div>`;

	//Inventory Display
	let inventory = '<div class="inventory">';
	Inventory.map(item => {
		let quantity = item.ItemID <= 18 && item.ItemID >= 2? item.Quantity : "";
		inventory += `<div class="inventory-item">${RE2ItemImage(item.ItemID)}<div class="inventory-item-quantity"><font color="#00FF00">${quantity}</font></div></div>`
	});
    inventory += "</div>"
    mainContainer.innerHTML += inventory;
}

function RE2GetCurrentItemAmmo(inventory, currentWeaponID) 
{
	for (let i = 0; i < inventory.length; i++) 
	{
		if (inventory[i].ItemID == currentWeaponID)
		{
			let quantity = inventory[i].ItemID <= 18 && inventory[i].ItemID >= 2 ? inventory[i].Quantity : "";
			return quantity;
		}
	}
}

function RE2GetInventory(data) {
	if (data.PlayerMaxHealth == 140) 
	{
		return data.PlayerInventory.slice(0, 6);
	}
	return data.PlayerInventory;
}

// RESIDENT EVIL 2 REMAKE
function RE2RGetItems(data) {
	var mainContainer = document.getElementById("inventoryRER");
	mainContainer.innerHTML = "";
	
	if (data.PlayerInventory[0].SlotPosition == null) {
		mainContainer.innerHTML = `<div class="emptyslot"></div>`;
		return;
	}
	PlayerInventory = data.PlayerInventory;
	
	PlayerInventory.sort(function (a, b) {
		return Asc(a.SlotPosition, b.SlotPosition);
	});
	//console.log(`Inventory: ${PlayerInventory}`);
	
	InventoryCount = PlayerInventory.length;

	var newData = [];

	for (var i = 0; i < InventoryCount; i++) {
		var previousItem = PlayerInventory[i - 1];
		var previousItemExists = typeof previousItem !== "undefined";
		var previousItemIsDouble =
			previousItemExists &&
			typeof newData[previousItem.SlotPosition] !== "undefined" &&
			newData[previousItem.SlotPosition].includes("inventoryslot2");

		if (PlayerInventory[i].IsEmptySlot) {
			if (!previousItemIsDouble) {
				newData[PlayerInventory[i].SlotPosition] = `<div class="emptyslot"></div>`;
			}
		} else if (PlayerInventory[i].IsItem) {
			switch (PlayerInventory[i].ItemID) {

				case 1:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/FirstAidSpray.png" alt="First Aid Spray"/></div>`;
					break;

				case 2:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GreenHerb.png" alt="Green Herb"/></div>`;
					break;

				case 3:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/RedHerb.png" alt="Red Herb"/></div>`;
					break;

				case 4:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BlueHerb.png" alt="Blue Herb"/></div>`;
					break;

				case 5:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGG.png" alt="Mixed Herb (G+G)"/></div>`;
					break;

				case 6:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGR.png" alt="Mixed Herb (G+R)"/></div>`;
					break;

				case 7:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGB.png" alt="Mixed Herb (G+B)"/></div>`;
					break;

				case 8:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGGB.png" alt="Mixed Herb (G+G+B)"/></div>`;
					break;

				case 9:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGGG.png" alt="Mixed Herb (G+G+G)"/></div>`;
					break;

				case 10:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsGRB.png" alt="Mixed Herb (G+R+B)"/></div>`;
					break;

				case 11:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MixedHerbsRB.png" alt="Mixed Herb (R+B)"/></div>`;
					break;

				case 12:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GreenHerb2.png" alt="Green Herb 2"/></div>`;
					break;

				case 13:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/RedHerb2.png" alt="Red Herb 2"/></div>`;
					break;

				case 14:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BlueHerb2.png" alt="Blue Herb 2"/></div>`;
					break;

				case 15:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/HandgunAmmo.png" alt="Handgun Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 16:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/ShotgunAmmo.png" alt="Shotgun Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 17:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SubmachineGunAmmo.png" alt="Submachine Gun Ammo "><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 18:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MAGAmmo.png" alt="MAG Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 22:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/AcidRounds.png" alt="Acid Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 23:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/FlameRounds.png" alt="Flame Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 24:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/NeedleCartridges.png" alt="NeedleCartridges"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 25:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Fuel.png" alt="Fuel"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
					
				case 26:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/HandgunLargeCaliberAmmo.png" alt="Handgun Large Caliber Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 27:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SLS60HighPoweredRounds.png" alt="SLS60 High Powered Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 31:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Detonator.png" alt="Detonator"></div>`;
					break;

				case 32:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/InkRibbon.png" alt="InkRibbon"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 33:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/WoodenBoard.png" alt="Wooden Board"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 34:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DetonatorNoBattery.png" alt="Electronic Gadget"></div>`;
					break;

				case 35:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Battery9Volt.png" alt="Battery 9 Volt"></div>`;
					break;

				case 36:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Gunpowder.png" alt="Gunpowder"/></div>`;
					break;

				case 37:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GunpowderLarge.png" alt="Gunpowder Large"/></div>`;
					break;

				case 38:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GunpowderHighGradeYellow.png" alt="Gunpowder High Grade Yellow"/></div>`;
					break;

				case 39:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GunpowderHighGradeWhite.png" alt="Gunpowder High Grade White"/></div>`;
					break;

				case 48:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MatildaHighCapacityMagazine.png" alt="Matilda High Capacity Magazine"/></div>`;
					break;

				case 49:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MatildaMuzzleBrake.png" alt="Matilda Muzzle Brake"/></div>`;
					break;

				case 50:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MatildaGunStock.png" alt="Matilda Gun Stock"/></div>`;
					break;

				case 51:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SLS60SpeedLoader.png" alt="SLS60 Speed Loader"/></div>`;
					break;

				case 52:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/JMBHp3LaserSight.png" alt="JMBHp3 Laser Sight"/></div>`;
					break;

				case 53:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SLS60ReinforcedFrame.png" alt="SLS60 Reinforced Frame"/></div>`;
					break;

				case 54:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/JMBHp3HighCapacityMagazine.png" alt="JMBHp3 High Capacity Magazine"/></div>`;
					break;

				case 55:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/W870ShotgunStock.png" alt="W870 Shotgun Stock"/></div>`;
					break;

				case 56:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/W870LongBarrel.png" alt="W870 Long Barrel"/></div>`;
					break;

				case 58:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MQ11HighCapacityMagazine.png" alt="MQ11 High Capacity Magazine"/></div>`;
					break;

				case 60:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MQ11Suppressor.png" alt="MQ11 Suppressor"/></div>`;
					break;

				case 61:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/LightningHawkRedDotSight.png" alt="Lightning Hawk Red Dot Sight"/></div>`;
					break;

				case 62:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/LightningHawkLongBarrel.png" alt="Lightning Hawk Long Barrel"/></div>`;
					break;

				case 64:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GM79ShoulderStock.png" alt="GM79 Shoulder Stock"/></div>`;
					break;

				case 65:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/FlamethrowerRegulator.png" alt="Flamethrower Regulator"/></div>`;
					break;

				case 66:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SparkShotHighVoltageCondenser.png" alt="Spark Shot High Voltage Condenser"/></div>`;
					break;

				case 72:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Film_HidingPlace.png" alt="Film Hiding Place"/></div>`;
					break;

				case 73:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Film_RisingRookie.png" alt="Film Rising Rookie"/></div>`;
					break;

				case 74:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Film_Commemorative.png" alt="Film Commemorative"/></div>`;
					break;

				case 75:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Film_3FLocker.png" alt="Film 3F Locker"/></div>`;
					break;

				case 76:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Film_LionStatue.png" alt="Film Lion Statue"/></div>`;
					break;

				case 77:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyStorageRoom.png" alt="Key Storage Room"/></div>`;
					break;

				case 79:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/JackHandle.png" alt="Jack Handle"/></div>`;
					break;

				case 80:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SquareCrank.png" alt="Square Crank"/></div>`;
					break;

				case 81:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MedallionUnicorn.png" alt="Medallion Unicorn"/></div>`;
					break;
					
				case 82:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeySpade.png" alt="Key Spade"/></div>`;
					break;

				case 83:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyCardParkingGarage.png" alt="Key Card Parking Garage"/></div>`;
					break;

				case 84:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyCardWeaponsLocker.png" alt="Key Card Weapons Locker"/></div>`;
					break;

				case 86:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/ValveHandle.png" alt="Valve Handle"/></div>`;
					break;

				case 87:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/STARSBadge.png" alt="STARSBadge"/></div>`;
					break;

				case 88:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Scepter.png" alt="Scepter"/></div>`;
					break;

				case 90:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/RedJewel.png" alt="Red Jewel"/></div>`;
					break;

				case 91:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BejeweledBox.png" alt="Bejeweled Box"/></div>`;
					break;

				case 93:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugBishop.png" alt="Plug Bishop"/></div>`;
					break;

				case 94:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugRook.png" alt="Plug Rook"/></div>`;
					break;
					
				case 95:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugKing.png" alt="Plug King"/></div>`;
					break;

				case 98:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PictureBlock.png" alt="Picture Block"/></div>`;
					break;

				case 102:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/USBDongleKey.png" alt="USB Dongle Key"/></div>`;
					break;

				case 112:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SpareKey.png" alt="Spare Key"/></div>`;
					break;

				case 114:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/RedBook.png" alt="Red Book"/></div>`;
					break;

				case 115:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/StatuesLeftArm.png" alt="Statues Left Arm"/></div>`;
					break;

				case 116:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/StatuesLeftArmWithRedBook.png" alt="Statues Left Arm With Red Book"/></div>`;
					break;

				case 118:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MedallionLion.png" alt="Medallion Lion"/></div>`;
					break;

				case 119:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyDiamond.png" alt="Key Diamond"/></div>`;
					break;

				case 120:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyCar.png" alt="Key Car"/></div>`;
					break;

				case 124:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/MedallionMaiden.png" alt="Medallion Maiden"/></div>`;
					break;

				case 126:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PowerPanelPart.png" alt="Power Panel Part 1"/></div>`;
					break;

				case 127:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PowerPanelPart.png" alt="Power Panel Part 2"/></div>`;
					break;

				case 128:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/LoversRelief.png" alt="Lovers Relief"/></div>`;
					break;

				case 129:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GearSmall.png" alt="Gear Small"/></div>`;
					break;

				case 130:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE2R/GearLarge.png" alt="Gear Large"/></div>`;
					break;

				case 131:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyCourtyard.png" alt="Key Courtyard"/></div>`;
					break;

				case 132:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugKnight.png" alt="Plug Knight"/></div>`;
					break;

				case 133:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugPawn.png" alt="Plug Pawn"/></div>`;
					break;

				case 134:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PlugQueen.png" alt="Plug Queen"/></div>`;
					break;

				case 135:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BoxedElectronicPart.png" alt="Boxed Electronic Part 1"/></div>`;
					break;

				case 136:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BoxedElectronicPart.png" alt="Boxed Electronic Part 2"/></div>`;
					break;

				case 159:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyOrphanage.png" alt="Key Orphanage"/></div>`;
					break;

				case 160:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyClub.png" alt="Key Club"/></div>`;
					break;

				case 169:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeyHeart.png" alt="Key Heart"/></div>`;
					break;

				case 170:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DigitalVideoCassette.png" alt="USS Digital Video Cassette"/></div>`;
					break;

				case 176:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/TBarValveHandle.png" alt="TBar Valve Handle"/></div>`;
					break;

				case 179:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DispersalCartridgeEmpty.png" alt="Dispersal Cartridge Empty"/></div>`;
					break;

				case 180:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DispersalCartridgeSolution.png" alt="Dispersal Cartridge Solution"/></div>`;
					break;

				case 181:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DispersalCartridgeHerbicide.png" alt="Dispersal Cartridge Herbicide"/></div>`;
					break;

				case 183:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/JointPlug.png" alt="Joint Plug"/></div>`;
					break;

				case 186:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/UpgradeChipAdministrator.png" alt="Upgrade Chip Administrator"/></div>`;
					break;

				case 187:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandAdministrator.png" alt="ID Wristband Administrator"/></div>`;
					break;
					
				case 188:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/ElectronicChip.png" alt="Electronic Chip"/></div>`;
					break;

				case 189:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/SignalModulator.png" alt="Signal Modulator"/></div>`;
					break;

				case 190:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Trophy.png" alt="Trophy 1"/></div>`;
					break;

				case 191:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Trophy.png" alt="Trophy 2"/></div>`;
					break;

				case 194:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/KeySewers.png" alt="Key Sewers"/></div>`;
					break;

				case 195:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandVisitor1.png" alt="ID Wristband Visitor 1"/></div>`;
					break;

				case 196:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandGeneralStaff1.png" alt="ID Wristband General Staff 1"/></div>`;
					break;

				case 197:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandSeniorStaff1.png" alt="ID Wristband Senior Staff 1"/></div>`;
					break;

				case 198:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/UpgradeChipGeneralStaff.png" alt="Upgrade Chip General Staff"/></div>`;
					break;

				case 199:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/UpgradeChipSeniorStaff.png" alt="Upgrade Chip Senior Staff"/></div>`;
					break;

				case 200:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandVisitor2.png" alt="ID Wristband Visitor 2"/></div>`;
					break;

				case 201:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandGeneralStaff2.png" alt="ID Wristband General Staff 2"/></div>`;
					break;

				case 202:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/IDWristbandSeniorStaff2.png" alt="ID Wristband Senior Staff 2"/></div>`;
					break;

				case 203:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/DigitalVideoCassette.png" alt="Lab Digital Video Cassette"/></div>`;
					break;

				case 230:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Briefcase.png" alt="Briefcase"/></div>`;
					break;

				case 240:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/FuseMainHall.png" alt="Fuse Main Hall"/></div>`;
					break;

				case 241:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/FuseBreakRoom.png" alt="Fuse Break Room"/></div>`;
					break;

				case 243:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/Scissors.png" alt="Scissors"/></div>`;
					break;

				case 244:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/BoltCutters.png" alt="BoltCutters"/></div>`;
					break;

				case 245:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/StuffedDoll.png" alt="Stuffed Doll"/></div>`;
					break;

				case 262:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/HipPouch.png" alt="Hip Pouch"/></div>`;
					break;

				case 286:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/OldKey.png" alt="Old Key"/></div>`;
					break;

				case 291:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/PortableSafe.png" alt="PortableSafe"/></div>`;
					break;

				case 293:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/TinStorageBox.png" alt="Tin Storage Box 1"/></div>`;
					break;

				case 294:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/WoodenBox.png" alt="Wooden Box 1"/></div>`;
					break;

				case 295:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/WoodenBox.png" alt="Wooden Box 2"/></div>`;
					break;

				case 296:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/TinStorageBox.png" alt="Tin Storage Box 2"/></div>`;
					break;

				case 2130706433:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/JointPlug.png" alt="Joint Plug 2"/></div>`;
					break;
					
				case 2130706434:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE2R/GearLarge.png" alt="Gear Large 2"/></div>`;
					break;
			}
		} else if (PlayerInventory[i].IsWeapon) {
			switch (PlayerInventory[i].WeaponID) {

				case 1:
					equipped = Equipped(data, 1);
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div></div><img src="RE2R/Handgun_Matilda1.png" alt="Handgun Matilda First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda2.png" alt="Handgun Matilda Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda3.png" alt="Handgun Matilda First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 4) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda4.png" alt="Handgun Matilda Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].S*lotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda5.png" alt="Handgun Matilda First Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 6) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda6.png" alt="Handgun Matilda Second, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 7) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda7.png" alt="Handgun Matilda First, Second, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_Matilda.png" alt="Handgun Matilda"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					break;

				case 2:
					equipped = Equipped(data, 2);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_M19.png" alt="Handgun M19"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 3:
					equipped = Equipped(data, 3);
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_1.png" alt="Handgun JMB Hp3 First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_2.png" alt="Handgun JMB Hp3 Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_3.png" alt="Handgun JMB Hp3 First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 4) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_3.png" alt="Handgun JMB Hp3 Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_3.png" alt="Handgun JMB Hp3 First, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 6) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_3.png" alt="Handgun JMB Hp3 Second, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 7) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3_3.png" alt="Handgun JMB Hp3 First, Second, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_JMB_Hp3.png" alt="Handgun JMB Hp3"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					
					break;

				case 4:
					equipped = Equipped(data, 4);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_Quickdraw_Army.png" alt="Handgun Quickdraw Army"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 7:
					equipped = Equipped(data, 7);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_MUP.png" alt="Handgun MUP"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 8:
					equipped = Equipped(data, 8);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_BroomHc.png" alt="Handgun BroomHc"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;

				case 9:
					equipped = Equipped(data, 9);
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS601.png" alt="Handgun SLS60 First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS60.png" alt="Handgun SLS60 Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS601.png" alt="Handgun SLS60 First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 4) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS601.png" alt="Handgun SLS60 Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS601.png" alt="Handgun SLS60 First, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 6) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS601.png" alt="Handgun SLS60 Second, Third"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SLS60.png" alt="Handgun SLS60"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					break;

				case 11:
					equipped = Equipped(data, 11);
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Shotgun_W8701.png" alt="Shotgun W870 First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Shotgun_W8702.png" alt="Shotgun W870 Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Shotgun_W8703.png" alt="Shotgun W870 First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Shotgun_W870.png" alt="Shotgun W870"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
				break;

				case 21:
					equipped = Equipped(data, 21);
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/SMG_MQ11_1.png" alt="SMG MQ11 First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/SMG_MQ11_2.png" alt="SMG MQ11 Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/SMG_MQ11_3.png" alt="SMG MQ11 First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/SMG_MQ11.png" alt="SMG MQ11"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
				break;

				case 23:
					equipped = Equipped(data, 23);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/SMG_LE5_Infinite.png" alt="SMG LE5 Infinite"/><div class="quantity">∞</div></div>`;
					break;

				case 31:
					equipped = Equipped(data, 31);
						if (PlayerInventory[i].Attachments == 1) {
							newData[
								PlayerInventory[i].SlotPosition
							] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_LightningHawk1.png" alt="Handgun LightningHawk First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
						}
						else if (PlayerInventory[i].Attachments == 2) {
							newData[
								PlayerInventory[i].SlotPosition
							] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_LightningHawk2.png" alt="Handgun LightningHawk Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
						}
						else if (PlayerInventory[i].Attachments == 3) {
							newData[
								PlayerInventory[i].SlotPosition
							] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/Handgun_LightningHawk3.png" alt="Handgun LightningHawk First, Second"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
						}
						else {
							newData[
								PlayerInventory[i].SlotPosition
							] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_LightningHawk.png" alt="Handgun LightningHawk"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
						}
					break;

				case 41:
					equipped = Equipped(data, 41);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/EMF_Visualizer.png" alt="EMF Visualizer"/><div class="quantity">∞</div></div>`;
					break;

				case 42:
					equipped = Equipped(data, 42);
					if (PlayerInventory[i].Attachments == 1 || PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/GrenadeLauncher_GM791.png" alt="GrenadeLauncher GM79 First?"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/GrenadeLauncher_GM79.png" alt="GrenadeLauncher GM79"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					
				break;

				case 43:
					equipped = Equipped(data, 43);
					if (PlayerInventory[i].Attachments == 1 || PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/ChemicalFlamethrower2.png" alt="Chemical Flamethrower First"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/ChemicalFlamethrower.png" alt="Chemical Flamethrower"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
				break;

				case 44:
					equipped = Equipped(data, 44);
					if (PlayerInventory[i].Attachments == 1 || PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/SparkShot1.png" alt="SparkShot First?"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/SparkShot.png" alt="SparkShot"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
				break;

				case 45:
					equipped = Equipped(data, 45);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><div class=${equipped}></div><img src="RE2R/ATM4.png" alt="ATM4"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 46:
					equipped = Equipped(data, 46);
					let perc = Math.floor((PlayerInventory[i].Quantity / 1000) * 100);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/CombatKnife.png" alt="Combat Knife"/><div class="quantity">${perc}%</div></div>`;
				break;

				case 47:
					equipped = Equipped(data, 47);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/CombatKnife_Infinite.png" alt="Combat Knife Infinite"/><div class="quantity">∞</div></div>`;
				break;

				case 49:
					equipped = Equipped(data, 49);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/AntiTankRocketLauncher.png" alt="Anti Tank Rocket Launcher"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 50:
					equipped = Equipped(data, 50);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Minigun.png" alt="Minigun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 65:
					equipped = Equipped(data, 65);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/HandGrenade.png" alt="Hand Grenade"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 66:
					equipped = Equipped(data, 66);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/FlashGrenade.png" alt="Flash Grenade"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 82:
					equipped = Equipped(data, 82);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SamuraiEdge_Infinite.png" alt="Handgun Samurai Edge Albert Wesker"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 83:
					equipped = Equipped(data, 83);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SamuraiEdge_ChrisRedfield.png" alt="Handgun Samurai Edge Chris Redfield"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 84:
					equipped = Equipped(data, 84);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SamuraiEdge_JillValentine.png" alt="Handgun Samurai Edge Jill Valentine"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 85:
					equipped = Equipped(data, 85);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Handgun_SamuraiEdge_AlbertWesker.png" alt="Handgun Samurai Edge Albert Wesker"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
				break;

				case 222:
					equipped = Equipped(data, 222);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/ATM4.png" alt="ATM4 Infinite"/><div class="quantity">∞</div></div>`;
				break;

				case 242:
					equipped = Equipped(data, 242);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/AntiTankRocketLauncher.png" alt="Anti Tank Rocket Launcher Infinite"/><div class="quantity">∞</div></div>`;
				break;

				case 252:
					equipped = Equipped(data, 252);
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><div class=${equipped}></div><img src="RE2R/Minigun.png" alt="Minigun Infinite"/><div class="quantity">∞</div></div>`;
				break;

			}
		}
		mainContainer.innerHTML = newData.join("\n");
	}
	mainContainer.innerHTML = newData.join("\n");
}

function Equipped(data, i) {

	if (i == data.PlayerInventoryMainEquipped) {
		return "main"
	}

	else if (i == data.PlayerInventorySubEquipped) {
		return "sub"
	}

	else {
		let s = SlotEquipped(data, i);
		return s;
	}

}

function SlotEquipped(data, i) {

	if (i == data.PlayerInventorySlot1) {
		return "slot1"
	}

	else if (i == data.PlayerInventorySlot2) {
		return "slot2"
	}

	else if (i == data.PlayerInventorySlot3) {
		return "slot3"
	}

	else if (i == data.PlayerInventorySlot4) {
		return "slot4"
	}

	else {
		return "none"
	}

}

// RESIDENT EVIL 3 REBIRTH
const RE3ItemImage = (itemId) => `<img src="RE3C/${itemId}.png"></img>`;

function RE3GetItems(data) {
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	//Equipped Weapon
	mainContainer.innerHTML += `
	<div class="equipped-item">
		<img class="e-item" src="RE3C/${data.EquippedItemId}.png"></img>
		<div class="equipped">EQUIP</div>
		<div class="inventory-item-quantity2">
			<font color="#00FF00">${RE3GetCurrentItemAmmo(data.PlayerInventory, data.EquippedItemId)}</font>
		</div>
	</div>`;

	//Inventory Display
	let inventory = '<div class="inventory">';
	data.PlayerInventory.map(item => {
		var quantity = (item.ItemType != 0 && item.ItemType != 15 && item.ItemType != 22) 
		? item.Quantity : 
		item.ItemType == 15 
		? `<div class="infinity">∞</div>` : 
		item.ItemType == 22 
		? `${item.Quantity}%` : "";
		inventory += `<div class="inventory-item">${RE3ItemImage(item.ItemID)}<div class="inventory-item-quantity"><font color="#00FF00">${quantity}</font></div></div>`;
	});
    inventory += "</div>"
    mainContainer.innerHTML += inventory;
}

function RE3GetCurrentItemAmmo(inventory, currentWeaponID) 
{
	var filteredItems = inventory.filter(item => { return (item.ItemID == currentWeaponID) });
	var quantity = (filteredItems[0].ItemType != 0 && filteredItems[0].ItemType != 15 && filteredItems[0].ItemType != 22) 
		? filteredItems[0].Quantity : 
		filteredItems[0].ItemType == 15 
		? `<div class="infinity">∞</div>` : 
		filteredItems[0].ItemType == 22 
		? `${filteredItems[0].Quantity}%` : "";
	return quantity;
}

// RESIDENT EVIL 3 REMAKE
function RE3RGetItems(data) {
	var mainContainer = document.getElementById("inventoryRER");
	mainContainer.innerHTML = "";
	if (data.PlayerInventory[0].SlotPosition == null) {
		mainContainer.innerHTML = `<div class="emptyslot"></div>`;
		return;
	}
	PlayerInventory = data.PlayerInventory;
	PlayerInventory.sort(function (a, b) {
		if (a.SlotPosition > b.SlotPosition) {
			return 1;
		}

		if (a.SlotPosition < b.SlotPosition) {
			return -1;
		}
		return 0;
	});
	InventoryCount = data.PlayerInventoryCount;

	var newData = [];

	for (var i = 0; i < InventoryCount; i++) {
		var previousItem = PlayerInventory[i - 1];
		var previousItemExists = typeof previousItem !== "undefined";
		var previousItemIsDouble =
			previousItemExists &&
			typeof newData[previousItem.SlotPosition] !== "undefined" &&
			newData[previousItem.SlotPosition].includes("inventoryslot2");

		if (PlayerInventory[i].IsEmptySlot) {
			if (!previousItemIsDouble) {
				newData[PlayerInventory[i].SlotPosition] = `<div class="emptyslot"></div>`;
			}
		} else if (PlayerInventory[i].IsItem) {
			switch (PlayerInventory[i].ItemID) {
				case 1:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FirstAidSpray.png" alt="First Aid Spray"/></div>`;
					break;
				case 2:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/GreenHerb.png" alt="Green Herb"/></div>`;
					break;
				case 3:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/RedHerb.png" alt="Red Herb"/></div>`;
					break;
				case 5:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/MixedHerbsGG.png" alt="Mixed Herb (G+G)"/></div>`;
					break;
				case 6:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/MixedHerbsGR.png" alt="Mixed Herb (G+R)"/></div>`;
					break;
				case 9:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/MixedHerbsGGG.png" alt="Mixed Herb (G+G+G)"/></div>`;
					break;
				case 22:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/GreenHerb2.png" alt="Green Herb 2"/></div>`;
					break;
				case 23:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/RedHerb2.png" alt="Red Herb 2"/></div>`;
					break;
				case 31:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/HandgunAmmo.png" alt="Handgun Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 32:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ShotgunAmmo.png" alt="Shotgun Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 33:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/AssaultRifleAmmo.png" alt="Assault Rifle Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 34:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/MAGAmmo.png" alt="MAG Ammo"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 36:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/MineRounds.png" alt="Mine Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 37:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ExplosiveRounds.png" alt="Explosive Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 38:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/AcidRounds.png" alt="Acid Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 39:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FlameRounds.png" alt="Flame Rounds"><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 61:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Gunpowder.png" alt="Gunpowder"/></div>`;
					break;
				case 62:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/HighGradeGunpowder.png" alt="High-Grade Gunpowder"/></div>`;
					break;
				case 63:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ExplosiveA.png" alt="Explosive A"/></div>`;
					break;
				case 64:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ExplosiveB.png" alt="Explosive B"/></div>`;
					break;
				case 76:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ModeratorHandgun.png" alt="Moderator Handgun"/></div>`;
					break;
				case 77:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/DotSightHandgun.png" alt="Dot Sight Handgun"/></div>`;
					break;
				case 78:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ExtendedMagazineHandgun.png" alt="Extended Magazine Handgun"/></div>`;
					break;
				case 91:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SemiAutoBarrel.png" alt="Semi-Auto Barrel"/></div>`;
					break;
				case 92:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/TacticalStockShotgun.png" alt="Tactical Stock Shotgun"/></div>`;
					break;
				case 93:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ShellHolderShotgun.png" alt="Shell Holder Shotgun"/></div>`;
					break;
				case 96:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ScopeAssaultRifle.png" alt="Scope Assault Rifle"/></div>`;
					break;
				case 97:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/DualMagazineAssaultRifle.png" alt="Dual Magazine Assault Rifle"/></div>`;
					break;
				case 98:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/TacticalGripAssaultRifle.png" alt="Tactical Grip Assault Rifle"/></div>`;
					break;
				case 101:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/ExBarrelMAG.png" alt="Ex Barrel MAG"/></div>`;
					break;
				case 131:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/AudiocassetteTape.png" alt="Audiocassette Tape"/></div>`;
					break;
				case 151:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/LockPick.png" alt="Lock Pick"/></div>`;
					break;
				case 152:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/BoltCutters.png" alt="Bolt Cutters"/></div>`;
					break;
				case 161:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Battery.png" alt="Battery"/></div>`;
					break;
				case 162:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SafetyDepositKey.png" alt="Safety Deposit Key"/></div>`;
					break;
				case 164:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/BradsIDCard.png" alt="Brads ID Card"/></div>`;
					break;
				case 165:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/DetonatorNoBattery.png" alt="Detonator No Battery"/></div>`;
					break;
				case 166:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Detonator.png" alt="Detonator"/></div>`;
					break;
				case 181:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FireHose.png" alt="Fire Hose"/></div>`;
					break;
				case 182:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/KendosGateKey.png" alt="Kendo's Gate Key"/></div>`;
					break;
				case 185:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/CaseLockPick.png" alt="Case Lock Pick"/></div>`;
					break;
				case 186:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/BatteryPack.png" alt="Battery Pack"/></div>`;

					break;
				case 187:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/GreenJewel.png" alt="Green Jewel"/></div>`;
					break;
				case 188:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/BlueJewel.png" alt="Blue Jewel"/></div>`;
					break;
				case 189:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/RedJewel.png" alt="Red Jewel"/></div>`;
					break;
				case 192:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FancyBox.png" alt="Fancy Box Green Jewel"/></div>`;
					break;
				case 193:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FancyBox.png" alt="Fancy Box Blue Jewel"/></div>`;
					break;
				case 194:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FancyBox.png" alt="Fancy Box Red Jewel"/></div>`;
					break;
				case 211:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/HospitalIDCard.png" alt="Hospital ID Card"/></div>`;
					break;
				case 212:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/TapePlayerTapeInserted.png" alt="Tape Player Tape Inserted"/></div>`;
					break;
				case 213:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/AudiocassetteTape.png" alt="Audiocassette Tape2"/></div>`;
					break;
				case 214:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/TapePlayer.png" alt="Tape Player"/></div>`;
					break;
				case 215:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/VaccineSample.png" alt="Vaccine Sample"/></div>`;
					break;
				case 217:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Detonator.png" alt="Detonator2"/></div>`;
					break;
				case 218:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/LockerRoomKey.png" alt="Locker Room Key"/></div>`;
					break;
				case 222:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Fuse3.png" alt="Fuse3"/></div>`;
					break;
				case 223:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Fuse2.png alt="Fuse2"/></div>`;
					break;
				case 224:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Fuse1.png" alt="Fuse1"/></div>`;
					break;
				case 231:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/" alt="Wristband"/></div>`;
					break;
				case 232:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FlashDrive.png" alt="Flash Drive"/></div>`;
					break;
				case 233:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/Vaccine.png" alt="Vaccine"/></div>`;
					break;
				case 234:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/CultureSample.png" alt="Culture Sample"/></div>`;
					break;
				case 235:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/LiquidFilledTestTube.png" alt="Liquid-Filled Test Tube"/></div>`;
					break;
				case 236:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/VaccineBase.png" alt="Vaccine Base"/></div>`;
					break;
				case 264:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FireHose.png" alt="Fire Hose2"/></div>`;
					break;
				case 301:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/IronDefenseCoin.png" alt="Iron Defense Coin"/></div>`;
					break;
				case 302:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/AssaultCoin.png" alt="Assault Coin"/></div>`;
					break;
				case 303:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/RecoveryCoin.png" alt="Recovery Coin"/></div>`;
					break;
				case 304:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/CraftingCompanion.png" alt="Crafting Companion"/></div>`;
					break;
				case 305:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/STARSFieldCombatManual.png" alt="STARS Field Combat Manual"/></div>`;
					break;
				case 311:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Extended Magazine Handgun"/></div>`;
					break;
				case 312:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Moderator Handgun"/></div>`;
					break;
				case 313:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Shotgun Shells"/></div>`;
					break;
				case 314:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Acid Rounds"/></div>`;
					break;
				case 315:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Flame Rounds"/></div>`;
					break;
				case 316:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SupplyCrate.png" alt="Supply Crate Extended Barrel MAG"/></div>`;
					break;
			}
		} else if (PlayerInventory[i].IsWeapon) {
			switch (PlayerInventory[i].WeaponID) {
				case 1:
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/G19Handgun1.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 2)
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/G19Handgun2.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/G19Handgun3.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 4)
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/G19Handgun4.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/G19Handgun5.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 6)
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/G19Handgun6.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					else if (PlayerInventory[i].Attachments == 7) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/G19Handgun7.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/G19Handgun.png" alt="G19 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 2:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/G18BurstHandgun.png" alt="G18 Burst Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 3:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/G18Handgun.png" alt="G18 Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 4:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SamuraiEdge.png" alt="Samurai Edge"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 7:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/InfiniteMUPHandgun.png" alt="Infinite MUP Handgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 11:
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/M3Shotgun1.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/M3Shotgun2.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/M3Shotgun3.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 4) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/M3Shotgun4.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/M3Shotgun5.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 6) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/M3Shotgun6.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else if (PlayerInventory[i].Attachments == 7) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/M3Shotgun7.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} 
					else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/M3Shotgun.png" alt="M3 Shotgun"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					break;
				case 21:
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle1.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 2) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle2.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 3) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle3.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 4) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle4.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 5) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle5.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 6) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle6.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else if (PlayerInventory[i].Attachments == 7) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle7.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot2"><img src="RE3R/CQBRAssaultRifle.png" alt="CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					break;
				case 22:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/InfiniteCQBRAssaultRifle.png" alt="Infinite CQBR Assault Rifle"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 31:
					if (PlayerInventory[i].Attachments == 1) {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/LightningHawk1.png" alt="Lightning Hawk"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					} else {
						newData[
							PlayerInventory[i].SlotPosition
						] = `<div class="inventoryslot"><img src="RE3R/LightningHawk.png" alt="Lightning Hawk"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					}
					break;
				case 32:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/RAIDEN.png" alt="RAI-DEN"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 42:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/MGLGrenadeLauncher.png" alt="MGL Grenade Launcher"/>
<div class="ammo"><img src="RE3R/Explosive.png"/></div><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 46:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/CombatKnife.png" alt="Combat Knife"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 47:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/SurvivalKnife.png" alt="Survival Knife"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 48:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/HotDogger.png" alt="Hot Dogger"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 49:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot2"><img src="RE3R/RocketLauncher.png" alt="Infinite Rocket Launcher"/><div class="quantity">∞</div></div>`;
					break;
				case 65:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/HandGrenade.png" alt="Hand Grenade"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				case 66:
					newData[
						PlayerInventory[i].SlotPosition
					] = `<div class="inventoryslot"><img src="RE3R/FlashGrenade.png" alt="Flash Grenade"/><div class="quantity">${PlayerInventory[i].Quantity}</div></div>`;
					break;
				default:
					break;
			}
		}
		mainContainer.innerHTML = newData.join("\n");
	}
	mainContainer.innerHTML = newData.join("\n");
}

// RESIDENT EVIL 5
function RE5GetItemsPlayer1(data) {
	let mainContainer = document.getElementById("srtPlayer1");
	mainContainer.innerHTML = "";

	var filteredItems = data.PlayerInventory.filter((item) => {
		return (item.IsItem && item.SlotNo < 9);
	});
	
	filteredItems.sort(function (a, b) {
		return Asc(a.SlotNo, b.SlotNo) || Desc(a.SlotNo, b.SlotNo);
	}).map(item => {
		if (data.ChrisDA > 0) {
			RE5GetPlayer1(item);
		}
	});
}

function RE5GetItemsPlayer2(data) {
	let mainContainer2 = document.getElementById("srtPlayer2");
	mainContainer2.innerHTML = "";
	
	var filteredItems2 = data.Player2Inventory.filter((item) => {
		return (item.IsItem && item.SlotNo < 9);
	});
	
	filteredItems2.sort(function (a, b) {
		return Asc(a.SlotNo, b.SlotNo) || Desc(a.SlotNo, b.SlotNo);
	}).map(item => {
		if (data.ShevaDA > 0) {
			RE5GetPlayer2(item);
		}
	});
}

function RE5GetPlayer1(item) {
	let mainContainer = document.getElementById("srtPlayer1");
	mainContainer.innerHTML += `
		<div class="item" id="slot${item.SlotNo}">
			<div id="${item.ItemName}">
				<div class="quantity">
					<font color="#00FF00">
						${item.StackSize}
					</font>
				</div>
			</div>
		</div>`;
}

function RE5GetPlayer2(item) {
	let mainContainer = document.getElementById("srtPlayer2");
	mainContainer.innerHTML += `
		<div class="item" id="slot${item.SlotNo}">
			<div id="${item.ItemName}">
				<div class="quantity">
					<font color="#00FF00">
						${item.StackSize}
					</font>
				</div>
			</div>
		</div>`;
}

// RESIDENT EVIL 7
var InventoryCount;
var PlayerInventory;
var SortedInventory = [
];

const defaultItemObject = {
	_DebuggerDisplay: "[#-1] Empty Slot",
	SlotPosition: -1,
	SlotCount: -1,
	DebugItemName: null,
	ItemName: null,
	Quantity: -1,
	IsItem: false,
	IsWeapon: false,
	IsEmptySlot: true
}

function RE7GetItems(data) {
	var newData = [];
	InventoryCount = data.PlayerInventorySlots;
	resetInventory();

	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	PlayerInventory = data.PlayerInventory;
	PlayerInventory.sort(function (a, b) {
		if (a.SlotPosition > b.SlotPosition) {
			return 1;
		}

		if (a.SlotPosition < b.SlotPosition) {
			return -1;
		}
		return 0;
	});

	PlayerInventory.map(item => {
		if (item.SlotPosition != -1)
		{
			SortedInventory[item.SlotPosition] = item;
		}
	});

	for (var i = 0; i < InventoryCount; i++) {
		var previousItem = SortedInventory[i - 1];
		var previousItemExists = typeof previousItem !== "undefined";
		var previousItemIsDouble =
			previousItemExists &&
			typeof newData[previousItem.SlotPosition] !== "undefined" &&
			newData[previousItem.SlotPosition].includes("inventoryslot2");
		var aboveItem = SortedInventory[i - 4];
		var aboveItemExists = typeof aboveItem !== "undefined";
		var aboveItemIsDouble =
			aboveItemExists &&
			typeof newData[aboveItem.SlotPosition] !== "undefined" &&
			newData[aboveItem.SlotPosition].includes("inventoryslot2");
		if (SortedInventory[i].IsEmptySlot) {
			console.log(previousItem, aboveItem);
			if (i != 0 && i > 4 && previousItemIsDouble || SortedInventory[i].SlotPosition < 4 && aboveItemIsDouble) {
				newData[i] = ``;
			}
			else {
				newData[i] = `<div class="emptyslot" id="slot${i}"></div>`;
			}
		}
		else if (SortedInventory[i].IsItem) {
			if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition > 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}.png" alt=${SortedInventory[i].ItemName}/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
			else if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition <= 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2H" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}H.png" alt=${SortedInventory[i].ItemName}/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
			else {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}.png"/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
		}
		else if (SortedInventory[i].IsWeapon) {
			if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition > 3) {
			newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}.png" alt=${SortedInventory[i].ItemName}/></div>`;
			}
			else if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition <= 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2H" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}H.png" alt=${SortedInventory[i].ItemName}/></div>`;
			}
			else {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot" id="slot${i}"><img src="./RE7/${SortedInventory[i].ItemName}.png"/></div>`;
			}
		}
		mainContainer.innerHTML = newData.join("\n");
	}
	mainContainer.innerHTML = newData.join("\n");

	mainContainer.innerHTML += `<div id="equip0"></div>`;
	mainContainer.innerHTML += `<div id="equip1"></div>`;
	mainContainer.innerHTML += `<div id="equip2"></div>`;
	mainContainer.innerHTML += `<div id="equip3"></div>`;
}

function resetInventory() {
	for (var i = 0; i < InventoryCount; i++) 
	{
		SortedInventory[i] = defaultItemObject;
		SortedInventory[i].SlotPosition = i;
	}
}

// RESIDENT EVIL 8 (Village)
var StashState = "Small";
var count = 0;

function RE8GetItems(data) {
	var mainContainer = document.getElementById("inventory");
	mainContainer.innerHTML = "";

	var keyItems = data.PlayerInventory.filter((item) => {
		return item.IsKeyItem && item.ItemName == "ExtraBaggage";
	});
	
	//console.log(keyItems);

	if (keyItems.length == 1) {
		GetInventorySize(keyItems[0].StackSize);
	} else {
		GetInventorySize(0);
	}

	//console.log(StashState);
	var inventoryItems = data.PlayerInventory.filter((item) => {
		return (item.IsItem && !item.IsAmmoClip && !item.IsHidden) || item.IsWeapon;
	});

	inventoryItems
		.sort(function (a, b) {
			return Asc(a.SlotNo, b.SlotNo);
		})
		.map((i) => {
			SetItems(i);
		});
}

function DebugMe(data) {
	var first = document.getElementById("first");
	var last = document.getElementById("last");
	let firstItem = data.PlayerInventory[0];
	if (firstItem.ItemName == "None") {
		first.innerHTML = `First Item - Unknown Item: 0x${lastItem.ItemID.toString(
			16
		).toUpperCase()}`;
	} else {
		first.innerHTML = `First Item - ${
			firstItem.ItemName
		}: 0x${firstItem.ItemID.toString(16).toUpperCase()}`;
	}

	let lastItem = GetLastItems(data.PlayerInventory);
	if (lastItem.ItemName == "None") {
		last.innerHTML = `Last Item - Unknown Item: 0x${lastItem.ItemID.toString(
			16
		).toUpperCase()}`;
	} else {
		last.innerHTML = `Last Item - ${
			lastItem.ItemName
		}: 0x${lastItem.ItemID.toString(16).toUpperCase()}`;
	}
}

function GetLastItems(inventory) {
	for (var i = 0; i < inventory.length; i++) {
		if (inventory[i].ItemID == 0xffffffff) {
			//console.log(i);
			return inventory[i - 1];
		}
	}
}

function SetItems(item) {
	let mainContainer = document.getElementById("inventory");
	var IsHorizontal = item.IsHorizontal == 1 ? "" : "Vertical";
	var IsQuickSlot =
		item.QuickSlotHash == 4093525667
			? `<div class="Equip1"></div>`
			: item.QuickSlotHash == 2032792067
			? `<div class="Equip2"></div>`
			: item.QuickSlotHash == 249966296
			? `<div class="Equip3"></div>`
			: item.QuickSlotHash == 2311674127
			? `<div class="Equip4"></div>`
			: "";
	var MaxStackSize =
		item.CustomParameter.StackSize + item.CustomParameter.ExtendedStackSize;
	var ColorStack =
			MaxStackSize == 1 ? `` :
		item.StackSize == MaxStackSize
			? `<div class="quantity"><font color="#00FF00">${item.StackSize}</font></div>`
			: `<div class="quantity">${item.StackSize}</div>`;
	var ColorIncludedStack =
			MaxStackSize == 1 ? `` :
		item.IncludeStackSize == MaxStackSize
			? `<div class="quantity"><font color="#00FF00">${item.IncludeStackSize}</font></div>`
			: item.IncludeStackSize < MaxStackSize / 4
			? `<div class="quantity"><font color="#FF0000">${item.IncludeStackSize}</font></div>`
			: `<div class="quantity">${item.IncludeStackSize}</div>`;
	if (item.SlotNo < 9) {
		if (item.IsItem) {
			mainContainer.innerHTML += `
				<div class="slot${item.SlotNo}">
					<div class="${GetItemSize(item)}">
						<div id="${item.ItemName}${IsHorizontal}">
							${IsQuickSlot}
							${ColorStack}
						</div>
					</div>
				</div>`;
		} else if (item.IsWeapon) {
			mainContainer.innerHTML += `
				<div class="slot${item.SlotNo}">
					<div class="${GetItemSize(item)}">
						<div id="${item.ItemName}${IsHorizontal}">
							${IsQuickSlot}
							${ColorIncludedStack}
						</div>
					</div>
				</div>`;
		}
	} else {
		if (item.IsItem) {
			mainContainer.innerHTML += `
				<div class="slot${item.SlotNo}${StashState}">
					<div class="${GetItemSize(item)}">
						<div id="${item.ItemName}${IsHorizontal}">
							${IsQuickSlot}
							${ColorStack}
						</div>
					</div>
				</div>`;
		} else if (item.IsWeapon) {
			mainContainer.innerHTML += `
				<div class="slot${item.SlotNo}${StashState}">
					<div class="${GetItemSize(item)}">
						<div id="${item.ItemName}${IsHorizontal}">
							${IsQuickSlot}
							${ColorIncludedStack}
						</div>
					</div>
				</div>`;
		}
	}
}

function GetInventorySize(size) {
	let mainContainer = document.getElementById("inventory");
	if (size == 1) {
		StashState = "Medium";
		mainContainer.innerHTML += `<div id="InventoryMedium"></div>`;
		return;
	} else if (size == 2) {
		StashState = "Large";
		mainContainer.innerHTML += `<div id="InventoryLarge"></div>`;
		return;
	} else if (size == 3) {
		StashState = "XLarge";
		mainContainer.innerHTML += `<div id="InventoryXLarge"></div>`;
		return;
	}
	StashState = "Small";
	mainContainer.innerHTML += `<div id="InventorySmall"></div>`;
	return;
}

function GetItemSize(item) {
	return `Slot${item.SizeX}x${item.SizeY}`;
}