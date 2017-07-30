import chai from 'chai';
import {toMouseCoords, toMousemoveCoords} from './event';

const {expect} = chai;

describe('toMouseCoords', function () {

	it('should return mouse coords as [x, y], taken from clientX, clientY', function () {
		const event = {
				clientX: 42,
				clientY: 378
			},
			[x, y] = toMouseCoords(event);

		expect(x).equal(42);
		expect(y).equal(378);
	});
});

describe('toMousemoveCoords', function () {

	it('should return mouse coords as [x, y], taken from movementX, movementY', function () {
		const event = {
				movementX: 42,
				movementY: 378
			},
			[x, y] = toMousemoveCoords(event);

		expect(x).equal(42);
		expect(y).equal(378);
	});
});
