import chai from 'chai';
import {checkColor, checkAlpha, rgba} from './color';

const {expect} = chai;

describe('checkColor', function() {

	it('should clamp numbers to 0-255 range', function() {
		const properColor = checkColor(42),
			lessThanZero = checkColor(-42),
			largerThan8bit = checkColor(372);

		expect(properColor).equal(42);
		expect(lessThanZero).equal(0);
		expect(largerThan8bit).equal(255);
	});
});

describe('checkAlpha', function() {

	it('should clamp numbers to 0-1 range', function() {
		const properAlpha = checkAlpha(0.5),
			lessThanZero = checkAlpha(-42),
			largerThan1 = checkAlpha(1.5);

		expect(properAlpha).equal(0.5);
		expect(lessThanZero).equal(0);
		expect(largerThan1).equal(1);
	});
});

describe('rgba', function() {

	it('should return rgba() string with checked color', function() {
		const properRgba = rgba(42, 42, 42, 0.5),
			invalidColors = rgba(-42, 42, 442, 0.5);

		expect(properRgba).equal('rgba(42, 42, 42, 0.5)');
		expect(invalidColors).equal('rgba(0, 42, 255, 0.5)');
	});

	it('should return rgba() string with checked alpha', function() {
		const properRgba = rgba(42, 42, 42, -0.5),
			invalidColors = rgba(-42, 42, 442, 1.5);

		expect(properRgba).equal('rgba(42, 42, 42, 0)');
		expect(invalidColors).equal('rgba(0, 42, 255, 1)');
	});

	it('should return rgba() with alpha defaulted to 1.0', function() {
		const properRgba = rgba(42, 42, 42);

		expect(properRgba).equal('rgba(42, 42, 42, 1)');
	});
});