
const compToHEX = (c) => {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function XYtoHEX(x, y, bri){
	z = 1.0 - x - y;
	Y = bri / 255.0; // Brightness of lamp
	X = (Y / y) * x;
	Z = (Y / y) * z;
	r = X * 1.612 - Y * 0.203 - Z * 0.302;
	g = -X * 0.509 + Y * 1.412 + Z * 0.066;
	b = X * 0.026 - Y * 0.072 + Z * 0.962;
	r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
	g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
	b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
	maxValue = Math.max(r,g,b);
	r /= maxValue;
	g /= maxValue;
	b /= maxValue;
	r = r * 255;   if (r < 0) { r = 255 };
	g = g * 255;   if (g < 0) { g = 255 };
	b = b * 255;   if (b < 0) { b = 255 };

	r = parseInt(r.toFixed(0));
	g = parseInt(g.toFixed(0));
	b = parseInt(b.toFixed(0));

	return '#' + compToHEX(r) + compToHEX(g) + compToHEX(b);
}

const HEXToRGB = (hex) => {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

const setTextColor = (rgb) => {
	const brightness = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.g) * 114)) / 1000);
	return (brightness > 125) ? '#1D2129' :  '#FAFAFA';
}


const extractRGBNumbers = (str) => {
	const rex = /-?\d(?:[\d]*\.\d+|[\d]*)/g;
	let rgbArray = [];
	while ((match = rex.exec(str)) !== null) {
		rgbArray.push(match[0]);
	}
	let rgb = {
		r: rgbArray[0],
		g: rgbArray[1],
		b: rgbArray[2]
	}
	console.log(rgb.r, rgb.b, rgb.g);
	return rgb
}

function RGBtoXY(rgbColor) {
	let r = rgbColor.r;
	let g = rgbColor.g;
	let b = rgbColor.b;

	let x = (r * 0.649926) + (g * 0.103455) + (b * 0.197109);
	let y = (r * 0.234327) + (g * 0.743075) + (b * 0.022598);
	let z = (r * 0.0000000) + (g * 0.053077) + (b * 1.035763);
	
	let cx, cy;
	
	if (0 == (x + y + z)) {
		cx = 0;
		cy = 0;
	} else {
		cx = x / (x + y + z);
		cy = y / (x + y + z);
	}
	
	let xyColor = [];
	xyColor.push(cx); xyColor.push(cy);

	return xyColor;
}
