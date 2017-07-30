import chai from 'chai';
import {checkColor, checkAlpha, rgba} from './canvas';

const {expect} = chai;

// describe('checkColor', function() {
//
// 	it('should clamp numbers to 0-255 range', function() {
// 		const properColor = checkColor(42),
// 			lessThanZero = checkColor(-42),
// 			largerThan8bit = checkColor(372);
//
// 		expect(properColor).equal(42);
// 		expect(lessThanZero).equal(0);
// 		expect(largerThan8bit).equal(255);
// 	});
// });
