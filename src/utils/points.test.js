import chai from 'chai';
import {
	addPointReducer,
	deltaPoint,
	getInitialPoints,
	isPointNearZero,
	movePointReducer,
	resetPointsReducer
} from './points';

const {expect} = chai;

describe('getInitialPoints', function () {

	it('should return empty array', function () {
		const initialPoints = getInitialPoints();

		expect(Array.isArray(initialPoints)).equal(true);
		expect(initialPoints.length).equal(0);
	});
});

describe('resetPointsReducer', function () {

	it('should return empty array', function () {
		const initialPoints = resetPointsReducer();

		expect(Array.isArray(initialPoints)).equal(true);
		expect(initialPoints.length).equal(0);
	});
});

describe('movePointReducer', function () {

	it('should not modify length of points array', function () {
		const points = [
				[0, 0],
				[1, 1]
			],
			moveAction = {
				index: 0,
				pt: [10, 5]
			},
			movedPoints = movePointReducer(points, moveAction);

		expect(Array.isArray(movedPoints)).equal(true);
		expect(movedPoints.length).equal(points.length);
	});

	it('should set new coords to a point at specific index', function () {
		const points = [
				[0, 0],
				[1, 1]
			],
			action = {
				index: 0,
				pt: [10, 5]
			},
			result = movePointReducer(points, action);

		expect(result[action.index]).deep.equal(action.pt);
	});
});

describe('addPointReducer', function () {

	it('should not add new point if MaxNumber exceeded', function () {
		const points = [
				[0, 0],
				[1, 1]
			],
			action = {
				pt: [10, 5]
			},
			result = addPointReducer(2)(points, action);

		expect(Array.isArray(result)).equal(true);
		expect(result.length).equal(points.length);
	});

	it('should add new point with specified coordinates', function () {
		const points = [
				[0, 0],
				[1, 1]
			],
			action = {
				pt: [10, 5]
			},
			result = addPointReducer(10)(points, action);

		expect(Array.isArray(result)).equal(true);
		expect(result.length).equal(points.length + 1);
		expect(result[result.length - 1]).deep.equal(action.pt);
	});
});

describe('deltaPoint', function () {

	it('should return point coords difference', function () {
		const pt1 = [10, 10],
			pt2 = [15, 15];

		expect(deltaPoint(pt1, pt2)).deep.equal([5, 5]);
		expect(deltaPoint(pt2, pt1)).deep.equal([-5, -5]);
	});
});

describe('isPointNearZero', function () {

	it('should return true if point\'s coords are less than provided threshold', function () {
		const pt1 = [10, 10];

		expect(isPointNearZero(15)(pt1)).equal(true);
		expect(isPointNearZero(5)(pt1)).equal(false);
	});
});

/* Add more tests */