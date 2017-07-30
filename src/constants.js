import {rgba} from './utils/color';

export const NUM_POINTS = 3;

export const POINT_RADIUS = 10;

export const POINT_RENDER_DATA = {
	radius: POINT_RADIUS,
	fillStyle: rgba(100, 100, 100, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1)
};

export const POINT_MOUSEOVER_RENDER_DATA = {
	radius: POINT_RADIUS * 1.2,
	fillStyle: rgba(140, 140, 140, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(40, 40, 40, 1)
};

export const CIRCLE_RENDER_DATA = {
	radius: 10,
	fillStyle: rgba(100, 100, 100, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1)
};

export const RECT_RENDER_DATA = {
	fillStyle: rgba(100, 100, 100, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1)
};

export const RESET_POINTS_VALUE = void 0;