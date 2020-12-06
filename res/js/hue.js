
const hueHost = 'hue bridge ip';  // IP address of Hue bridge
const hueUser = 'hue user name' // user token Hue bridge
const svgUrl = 'http://www.w3.org/2000/svg';
const xlinkUrl = 'http://www.w3.org/1999/xlink';
const xmlnsUrl = 'http://www.w3.org/2000/xmlns/';
const titleSectionEl = document.querySelector('#t-section');
const switchSectionEl = document.querySelector('#ps-section');
const settingsSectionEl = document.querySelector('#s-section');


let lightsStatus = () => {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			let lights = [];
			let lightsObj = JSON.parse(xmlhttp.responseText);
			for (let key in lightsObj) {
				if (lightsObj.hasOwnProperty(key)) {
					lights.push(lightsObj[key]);
				}
			}
			lights.forEach((el, index) => {
				index++;
				let xmlhttp2 = new XMLHttpRequest();
				xmlhttp2.onreadystatechange = () => {
					if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
						let lightObj = JSON.parse(xmlhttp2.responseText);
						console.log(lightObj);
						let bri = 0;
						if (lightObj.state.on === true) bri = lightObj.state.bri;
						let titleEl = createTitleElement(index, lightObj.name, lightObj.state.on)
						titleSectionEl.appendChild(titleEl);
						let switchEl = createPowerSwitchElement(index, lightObj.state.on)
						switchSectionEl.appendChild(switchEl);
						switchEl.addEventListener('click', () => {
							let id = switchEl.id.substring(switchEl.id.length, switchEl.id.length - 1)	
							if (switchEl.getElementsByTagName('input')[0].checked == true) {
								setLightsOnOrOff(id, true);
							} else {
								setLightsOnOrOff(id, false);
							}
						});

						let settingsEl = createSettingsElement(index, el.type, lightObj.state.on, bri);
						settingsSectionEl.appendChild(settingsEl);
						let briSilderEl = document.getElementById(`bri-slider-${index}`);
						briSilderEl.addEventListener('change', () => {
							if(lightObj.state.on === true) {
								setBri(index, briSilderEl.value);
							}
						});
						if (el.type.toLowerCase().includes('color')) {
							let hexColor = XYtoHEX(lightObj.state.xy[0], lightObj.state.xy[1], lightObj.state.bri);
							let colorInputEl = document.querySelector(`#color-input-${index}`);
							let colorInputLabelEl = document.getElementById(`color-input-label-${index}`);
							colorInputEl.value = hexColor;
							colorInputLabelEl.innerHTML = hexColor.toString().toUpperCase();
							if (lightObj.state.on === true) {
								let rgbColor = HEXToRGB(XYtoHEX(lightObj.state.xy[0], lightObj.state.xy[1], lightObj.state.bri));
								let titleEl = document.querySelector(`#ti-${index}`);
								titleEl.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
								titleEl.style.color = setTextColor(rgbColor);
							}

							let colorEl = document.getElementById(`color-input-${index}`);
							colorEl.addEventListener('change', () => {
								setColor(index, colorEl.value);
								colorInputLabelEl = document.getElementById(`color-input-label-${index}`);
								colorInputLabelEl.innerHTML = colorEl.value.toString().toUpperCase();
							});
						}
					}
				};
				xmlhttp2.open('GET', `http://${hueHost}/api/${hueUser}/lights/${index}`, true);
				xmlhttp2.send();	
			});
		}
	};
	xmlhttp.open('GET', `http://${hueHost}/api/${hueUser}/lights`, true);
	xmlhttp.send();
}

const createTitleElement = (index, lightName, state) => {
	let lighStatus = "off";
	if(state === true) lighStatus = "on";	
	let tItemEl = document.createElement('div');
	tItemEl.id = 'ti-' + index;
	tItemEl.classList.add('t-item', lighStatus);
	tItemEl.textContent = lightName;

	return tItemEl;
}

const createPowerSwitchElement = (index, state) => {
	let lightStatus = "off";
	if(state === true) lightStatus = "on";
	let psItemEl = document.createElement('div');
	psItemEl.id = 'ps-' + index;
	psItemEl.classList.add('ps-item', lightStatus);
	
	let psCheckBoxEl = document.createElement('input');
	psCheckBoxEl.type = 'checkbox';
	if(state === true ) psCheckBoxEl.checked = true;
	psItemEl.appendChild(psCheckBoxEl);
	
	let buttonEl = document.createElement('div');
	buttonEl.classList.add('button');
	let svgPowerOffEl = document.createElementNS(svgUrl, 'svg');
	svgPowerOffEl.classList.add('power-off');
	let svgPowerOnEl = document.createElementNS(svgUrl, 'svg');
	svgPowerOnEl.classList.add('power-on');
	let svgUseLineOffEl = document.createElementNS(svgUrl, 'use');
	svgUseLineOffEl.classList.add('line');
	svgUseLineOffEl.setAttributeNS(xlinkUrl, 'xlink:href', '#line');
	let svgUseCircleOffEl = document.createElementNS(svgUrl, 'use');
	svgUseCircleOffEl.classList.add('circle');
	svgUseCircleOffEl.setAttributeNS(xlinkUrl, 'xlink:href', '#circle');
	let svgUseLineOnEl = document.createElementNS(svgUrl, 'use');
	svgUseLineOnEl.classList.add('line');
	svgUseLineOnEl.setAttributeNS(xlinkUrl, 'xlink:href', '#line');
	let svgUseCircleOnEl = document.createElementNS(svgUrl, 'use');
	svgUseCircleOnEl.classList.add('circle');
	svgUseCircleOnEl.setAttributeNS(xlinkUrl, 'xlink:href', '#circle');
	svgPowerOffEl.appendChild(svgUseLineOffEl);
	svgPowerOffEl.appendChild(svgUseCircleOffEl);
	svgPowerOnEl.appendChild(svgUseLineOnEl);
	svgPowerOnEl.appendChild(svgUseCircleOnEl);
	buttonEl.appendChild(svgPowerOffEl);
	buttonEl.appendChild(svgPowerOnEl);
	psItemEl.appendChild(buttonEl);

	let svgEl = document.createElementNS(svgUrl, 'svg');
	svgEl.setAttributeNS(xmlnsUrl, 'xmlns', svgUrl);
	svgEl.setAttribute('display', 'none');
	svgEl.setAttribute('width', '50px');
	svgEl.setAttribute('height', '50px');
	let svgLineSymbolEl = document.createElementNS(svgUrl, 'symbol');
	svgLineSymbolEl.setAttributeNS(xmlnsUrl, 'xmlns', svgUrl);
	svgLineSymbolEl.setAttribute('viewBox', '0 0 150 150');
	svgLineSymbolEl.id = 'line';
	let svgLineEl = document.createElementNS(svgUrl, 'line');
	svgLineEl.setAttribute('x1', '30');
	svgLineEl.setAttribute('y1', '56');
	svgLineEl.setAttribute('x2', '30');
	svgLineEl.setAttribute('y2', '80');
	svgLineSymbolEl.appendChild(svgLineEl);
	let svgCircleSymbolEl = document.createElementNS(svgUrl, 'symbol');
	svgCircleSymbolEl.setAttributeNS(xmlnsUrl, 'xmlns', svgUrl)
	svgCircleSymbolEl.setAttribute('viewBox', '0 0 150 150');
	svgCircleSymbolEl.id = 'circle';
	let svgCircleEl = document.createElementNS(svgUrl, 'circle');
	svgCircleEl.setAttribute('cx', '75');
	svgCircleEl.setAttribute('cy', '80');
	svgCircleEl.setAttribute('r', '35');
	svgCircleSymbolEl.appendChild(svgCircleEl);
	svgEl.appendChild(svgLineSymbolEl);
	svgEl.appendChild(svgCircleSymbolEl);
	psItemEl.appendChild(svgEl);

	return psItemEl;

}

const createSettingsElement = (index, lightType, state, bri) => {
	let lightStatus = "off";
	if(state === true) lightStatus = "on";	
	let sItemEl = document.createElement('div');
	sItemEl.id = 'se-' + index;
	sItemEl.classList.add('s-item', lightStatus);
	let briEl = document.createElement('div');
	briEl.classList.add('bri');
	let briSpanEl = document.createElement('span');
	briSpanEl.textContent = 'Brightness';
	briEl.appendChild(briSpanEl);
	let briSliderEl = document.createElement('input');
	briSliderEl.id = 'bri-slider-' + index;
	briSliderEl.classList.add('bri-slider');
	briSliderEl.type = 'range';
	briSliderEl.setAttribute('min', '0');
	briSliderEl.setAttribute('max', '254');
	briSliderEl.value = bri;
	briEl.appendChild(briSliderEl);

	sItemEl.appendChild(briEl);

	if (lightType.toLowerCase().includes('color')) {
		let colorEl = document.createElement('div');
		colorEl.classList.add('color');
		let colorSpanEl = document.createElement('span');
		colorSpanEl.textContent = 'Color';
		colorEl.appendChild(colorSpanEl);
		let colorInputDiv = document.createElement('div');
		colorInputDiv.classList.add('colorInput');
		let colorInputEl = document.createElement('input');
		colorInputEl.id = 'color-input-' + index;
		colorInputEl.classList.add('color-input');
		colorInputEl.type = 'color';
		let colorInputLabelEl = document.createElement('label');
		colorInputLabelEl.for = 'color-input-' + index;
		colorInputLabelEl.id = 'color-input-label-' + index;
		colorInputDiv.appendChild(colorInputEl);
		colorInputDiv.appendChild(colorInputLabelEl);
		colorEl.appendChild(colorInputDiv);
		sItemEl.appendChild(colorEl);
	}

	return sItemEl;
}

const setLightsOnOrOff = (id, state) => {
	console.log('executing')
	let lightId = id;
	let tiEl = document.querySelector(`#ti-${id}`);
	let psEl = document.querySelector(`#ps-${id}`);
	let seEl = document.querySelector(`#se-${id}`);
	let briEl = document.querySelector(`#bri-slider-${id}`);
	let lightElsArray = [tiEl, psEl, seEl];
	let colorInputEl = document.getElementById('color-input-' + id);
	
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (state === true) {
				console.log(`Turning light ${lightId} on`);
				lightElsArray.forEach((el) => {
					if (el.classList.contains('off')) el.classList.replace('off', 'on')
				});
				let xmlhttp2 = new XMLHttpRequest();
				xmlhttp2.onreadystatechange = () => {
					if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
						let lightObj = JSON.parse(xmlhttp2.responseText);
						briEl.value = lightObj.state.bri;
		
						if(colorInputEl !== null) {
							let hexColor = XYtoHEX(lightObj.state.xy[0], lightObj.state.xy[1], lightObj.state.bri);
							let rgbColor = HEXToRGB(hexColor);
							tiEl.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.g}, 1)`;
							tiEl.style.color = setTextColor(rgbColor);
						}
					}
				};
				xmlhttp2.open('GET', `http://${hueHost}/api/${hueUser}/lights/${lightId}`, true);
				xmlhttp2.send();	
			} else {
				console.log(`Turning light ${lightId} off`);
				briEl.value = 0;
				lightElsArray.forEach((el) => {
					if (el.classList.contains('on')) el.classList.replace('on', 'off')
				});
				
				if(colorInputEl !== null) {
					let currBgColor = tiEl.style.backgroundColor;
					if (currBgColor.includes('rgb')) tiEl.style.backgroundColor = `rgba(${currBgColor.substring(4, currBgColor.lastIndexOf(')'))}, .7)`;
					if (currBgColor.includes('rgba')) tiEl.style.backgroundColor = `${currBgColor.substring(0, currBgColor.lastIndexOf(','))}, .7)`;
					tiEl.style.color = setTextColor(extractRGBNumbers(currBgColor));
				}
			}
		}
	}
	xmlhttp.open('PUT', `http://${hueHost}/api/${hueUser}/lights/${lightId}/state`, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xmlhttp.send(JSON.stringify({"on": state}))

}

const setBri = (index, bri) => {
	let lightId = index;
	let colorInputEl = document.getElementById(`color-input-${lightId}`);
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if(colorInputEl !== null) {
				let xmlhttp2 = new XMLHttpRequest();
				xmlhttp2.onreadystatechange = () => {
					if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
						let lightObj = JSON.parse(xmlhttp2.responseText);
						let hexColor = XYtoHEX(lightObj.state.xy[0], lightObj.state.xy[1], lightObj.state.bri);
						let rgbColor = HEXToRGB(hexColor);
						let titleEl = document.getElementById(`ti-${index}`);
						let colorInputLabelEl = document.getElementById(`color-input-label-${index}`);
						titleEl.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
						titleEl.style.color = setTextColor(rgbColor);
						colorInputEl.value = hexColor;
						colorInputLabelEl.innerHTML = hexColor.toString().toUpperCase();
					}
				};
				xmlhttp2.open('GET', `http://${hueHost}/api/${hueUser}/lights/${lightId}`, true);
				xmlhttp2.send();
			}
		}
	}
	xmlhttp.open('PUT', `http://${hueHost}/api/${hueUser}/lights/${lightId}/state`, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xmlhttp.send(JSON.stringify( {"bri": parseInt(bri, 10)} ));
}

const setColor = (index, hexColor) => {
	const lightId = index;
	let rgbColor = HEXToRGB(hexColor);
	let xyColor = RGBtoXY(rgbColor);
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open('PUT', `http://${hueHost}/api/${hueUser}/lights/${lightId}/state/xy`, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xmlhttp.send(JSON.stringify( {"xy": xyColor} ));
	let titleEl = document.getElementById(`ti-${index}`);
	titleEl.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
	titleEl.style.color = setTextColor(rgbColor);
	
}

window.onload = () => {
	lightsStatus();
}
