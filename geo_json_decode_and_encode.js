/**
 * 来自echarts源码 lib/coord/geo/parseGeoJson.js
 * @param coordinate 字符串
 * @param encodeOffsets 2个整数构成的数组 如[124384, 32068]
 * @returns {Array}
 */
function decodePolygon(coordinate, encodeOffsets)
{
	let result = [];
	let prevX = encodeOffsets[0];
	let prevY = encodeOffsets[1];
	
	for(let i = 0; i<coordinate.length; i += 2)
	{
		let x = coordinate.charCodeAt(i) - 64;
		let y = coordinate.charCodeAt(i + 1) - 64;
		// ZigZag decoding
		x = (x >> 1) ^ (-(x & 1));
		y = (y >> 1) ^ (-(y & 1));
		// Delta deocding
		x += prevX;
		y += prevY;
		
		prevX = x;
		prevY = y;
		// Dequantize
		result.push([x/1024, y/1024]);
	}
	
	return result;
}

/**
 * zigzag压缩 decodePolygon的逆运算
 * @param coordinate
 * @returns {{coordinate: string, encodeOffsets: Array}}
 */
function encodePolygon(coordinate) {
	let coordinateStr = '';
	for(let i = coordinate.length - 1; i>0; i--)
	{
		let x = coordinate[i][0];
		let y = coordinate[i][1];
		x = x*1024;
		y = y*1024;
		x -= coordinate[i - 1][0]*1024;
		y -= coordinate[i - 1][1]*1024;
		x = (x << 1) ^ (x >> 31);
		y = (y << 1) ^ (y >> 31);
		coordinateStr = String.fromCharCode(x + 64) + String.fromCharCode(y + 64) + coordinateStr;
	}
	coordinateStr = '@@' + coordinateStr;
	let encodeOffsets = [coordinate[0][0]*1024, coordinate[0][1]*1024];
	return {coordinate: coordinateStr, encodeOffsets: encodeOffsets};
}

module.exports = {
	decodePolygon,
	encodePolygon
};