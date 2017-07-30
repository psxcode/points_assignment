import {rgba} from './utils/color';

export const MAX_NUM_POINTS = 3;

export const POINT_RADIUS = 10;

export const POINT_RENDER_DATA = {
	radius: POINT_RADIUS,
	fillStyle: rgba(100, 100, 100, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1)
};

export const POINT_MOUSEOVER_RENDER_DATA = {
	radius: POINT_RADIUS * 1.4,
	fillStyle: rgba(160, 160, 160, 0.5),
	lineWidth: 1,
	strokeStyle: rgba(40, 40, 40, 1)
};

export const CIRCLE_RENDER_DATA = {
	radius: POINT_RADIUS,
	fillStyle: rgba(100, 100, 100, 0.2),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1),
	crossRenderData: {
		lineWidth: 1,
		strokeStyle: rgba(60, 60, 60, 1),
	}
};

export const RECT_RENDER_DATA = {
	fillStyle: rgba(100, 100, 100, 0.2),
	lineWidth: 1,
	strokeStyle: rgba(25, 25, 25, 1),
	lastPointRenderData: Object.assign({}, POINT_RENDER_DATA, {
		radius: POINT_RADIUS * 1.2,
		fillStyle: 'none',
		lineDash: [5, 5]
	})
};

export const RESET_POINTS_VALUE = void 0;