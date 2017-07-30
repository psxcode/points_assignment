import {MAX_NUM_POINTS, POINT_RADIUS} from '../constants';

export function addPointReducer(maxNumPoints) {
	return function (points, {pt}) {
		return points.length < maxNumPoints ? [...points, pt] : points;
	}
}

export function movePointReducer(points, {index, pt}) {
	points[index] = pt;
	return points;
}

export function resetPointsReducer() {
	return getInitialPoints();
}

export function getInitialPoints() {
	return [];
}

export function pointsReducer(maxNumPoints) {
	const reducers = {
		'add': addPointReducer(maxNumPoints),
		'move': movePointReducer,
		'reset': resetPointsReducer
	};

	return function (points, action) {
		const {type} = action;
		return reducers[type](points, action);
	}
}

export function toPointActionAdd(pt) {
	return {
		type: 'add',
		pt
	}
}

export function toPointActionReset() {
	return {
		type: 'reset'
	}
}

export function toPointActionMove([index, pt]) {
	return {
		type: 'move',
		index,
		pt
	}
}

export function findPointIndexAtCoords([coords, points]) {
	return points.findIndex(doPointsIntersect.bind(null, POINT_RADIUS * 1.2, coords))
}

export function doPointsIntersect(r, pt1, pt2) {
	return isPointInsideCircle(r, deltaPoint(pt1, pt2));
}

export function deltaPoint([x1, y1], [x2, y2]) {
	return [x2 - x1, y2 - y1];
}


export function isPointNearZero(threshold) {
	return function([x, y]) {
		return Math.abs(x) < threshold && Math.abs(y) < threshold;
	}
}

export function isPointsNear([pt1, pt2]) {
	return isPointNearZero(10)(deltaPoint(pt1, pt2));
}

export function isPointInsideCircle(r, [x, y]) {
	return x * x + y * y < r * r;
}

export function isAllPoints(points) {
	return points.length === MAX_NUM_POINTS;
}

export function isAnyPoint(points) {
	return !!points.length;
}

export function find4PointOfRect([x1, y1], [x2, y2], [x3, y3]) {
	return [x3 - x2 + x1, y3 - y2 + y1];
}

export function findCenterOfRect([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]) {
	return [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
}

export function findAreaOfRect([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]) {
	return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
}

export function findCircleRadius(area) {
	return Math.sqrt(area / Math.PI);
}

export function prepareRectPoints(points) {
	return [...points, find4PointOfRect(...points)];
}