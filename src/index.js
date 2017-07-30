import {Observable, Subject} from 'rxjs';
import './rxjs.imports';
import {clearCanvas, drawCircle, drawPoints, drawRect, getCanvasCtx, resizeCanvas} from './utils/canvas';
import {toElementEventObservable, toMouseCoords} from './utils/event';
import {
	findAreaOfRect,
	findCenterOfRect,
	findCircleRadius,
	findPointIndexAtCoords,
	getInitialPoints,
	isAllPoints,
	isPointsNear,
	pointsReducer,
	prepareRectPoints,
	toPointActionAdd,
	toPointActionMove,
	toPointActionReset
} from './utils/points';
import {
	CIRCLE_RENDER_DATA,
	MAX_NUM_POINTS,
	POINT_MOUSEOVER_RENDER_DATA,
	POINT_RENDER_DATA,
	RECT_RENDER_DATA
} from './constants';

const
	/**
	 * 'Resize event on window' stream
	 */
	resize$ = toElementEventObservable('resize')(window).debounceTime(200),

	/**
	 * 'Mouseup event on window' stream
	 */
	mouseup$ = toElementEventObservable('mouseup')(window),

	/**
	 * 'Reset Click event on ResetButton' stream
	 */
	resetClick$ = Observable.of(document.getElementById('reset'))
		.switchMap(toElementEventObservable('click')),

	/**
	 * Canvas element stream
	 */
	canvasElement$ = Observable.of(document.getElementById('canvas')),

	/**
	 * 'Mouseup event on Canvas' stream
	 * Begin with Canvas element
	 */
	canvasMouseup$ = canvasElement$
	/* switch to Mouseup event stream */
		.switchMap(toElementEventObservable('mouseup'))
		/* remap to mouse coords */
		.map(toMouseCoords),

	/**
	 * 'Mousedown event on Canvas' stream
	 * Begin with Canvas element
	 */
	canvasMousedown$ = canvasElement$
	/* switch to Mousedown event stream */
		.switchMap(toElementEventObservable('mousedown'))
		/* remap to mouse coords */
		.map(toMouseCoords),

	/**
	 * 'Mousemove event on Canvas' stream
	 * Begin with Canvas element
	 */
	canvasMousemove$ = canvasElement$
	/* switch to Mousedown event stream */
		.switchMap(toElementEventObservable('mousemove'))
		/* remap to mouse coords */
		.map(toMouseCoords),

	/**
	 * Points actions stream
	 */
	pointsActions$ = new Subject(),

	/**
	 * Points data stream
	 * Begin with Points Actions stream
	 */
	points$ = pointsActions$
	/* Accumulate points data */
		.scan(pointsReducer(MAX_NUM_POINTS), getInitialPoints()),

	/**
	 * 'Point index no Mousedown' stream
	 * Begin with every Mousedown event on Canvas
	 */
	pointMousedownIndex$ = canvasMousedown$
	/* add latest points data */
		.withLatestFrom(points$)
		/* find point index at coords */
		.map(findPointIndexAtCoords)
		/* continue only when clicked on valid point */
		.filter(index => index >= 0),

	/**
	 * 'Point index on Mouseover' stream
	 * Begin with every Mousemove event on Canvas
	 */
	pointMouseoverIndex$ = canvasMousemove$
	/* add latest points data */
		.withLatestFrom(points$)
		/* find point index at coords */
		.map(findPointIndexAtCoords)
		/* stop firing same index constantly
		 * report only when index changes
		 */
		.distinctUntilChanged(),

	/**
	 * Canvas context stream
	 * Begin with Resize event,
	 */
	canvasCtx$ = resize$
	/* startWith provides initial tick, since Resize event does not fire immediately */
		.startWith(void 0)
		/* switch to canvas element */
		.switchMapTo(canvasElement$)
		/* resize canvas by the way */
		.do(resizeCanvas)
		/* remap to canvas context */
		.map(getCanvasCtx),

	/**
	 * Rect points stream
	 * Begin with points stream
	 */
	rectPoints$ = points$
	/* continue only when all points are ready */
		.filter(isAllPoints)
		/* remap to Rect points */
		.map(prepareRectPoints),

	/**
	 * Center of mass stream
	 * Begin with Rect points stream
	 */
	center$ = rectPoints$
	/* remap to center of mass */
		.map(findCenterOfRect),

	/**
	 * Rect area stream
	 * Begin with Rect points
	 */
	rectArea$ = rectPoints$
	/* remap to Rect area */
		.map(findAreaOfRect),

	/**
	 * Circle radius stream
	 * Begin with Rect area
	 */
	circleRadius$ = rectArea$
	/* remap to circle radius calculated from area */
		.map(findCircleRadius),

	/**
	 * Points Render Data stream
	 * Combine the following streams latest values:
	 */
	pointsRenderData$ = Observable.combineLatest(
		/* Points stream */
		points$,
		/* 'Point index on Mouseover' stream */
		pointMouseoverIndex$
		/* add more streams to render additional information */
	)
	/* remap to Points Render Data */
		.map(toPointsRenderData),

	/**
	 * Rect Render Data stream
	 * Begin with Rect points
	 */
	rectRenderData$ = rectPoints$
	/* remap to Rect Render Data */
		.map(toRectRenderData),

	/**
	 * Circle Render Data stream
	 * Combine the following stream values by pairs
	 */
	circleRenderData$ = Observable.zip(
		/* Center os mass stream */
		center$,
		/* Circle radius stream */
		circleRadius$
	)
	/* remap to Circle Render Data */
		.map(toCircleRenderData);

/**
 * Point Add Action stream
 * Combine mousedown and mouseup events
 */
Observable.zip(
	canvasMousedown$,
	canvasMouseup$
)
/* proceed only if 2 points are near */
	.filter(isPointsNear)
	/* remap to mouseup point */
	.map(([_, pt2]) => pt2)
	/* remap to PointAdd action */
	.map(toPointActionAdd)
	/* dispatch action */
	.subscribe(pointsActions$);

/**
 * Reset Action stream
 */
resetClick$
/* remap to PointReset action */
	.map(toPointActionReset)
	/* dispatch action */
	.subscribe(pointsActions$);

/**
 * Point Move Action stream
 */
pointMousedownIndex$
	.switchMap((index) => Observable.combineLatest(
		Observable.of(index),
		canvasMousemove$.takeUntil(mouseup$))
	)
	/* remap to PointMove action */
	.map(toPointActionMove)
	/* dispatch action */
	.subscribe(pointsActions$);

/**
 * Render
 * Combine the following
 */
Observable.combineLatest(
	/* Canvas context */
	canvasCtx$,
	/* Render Data combined stream */
	Observable.combineLatest(
		/* Points Render Data */
		pointsRenderData$,
		/* Rect Render Data,
		 * starting with anything,
		 * since Rect will not provide Render data until all points are ready */
		rectRenderData$.startWith(void 0),
		/* Circle Render Data, starting with anything */
		circleRenderData$.startWith(void 0)
	)
	/* debounce incoming stream,
	 * to render once all streams provided data  */
		.debounceTime(0)
)
/* Render function */
	.subscribe(([ctx, [points, rect, circle]]) => {
		clearCanvas(ctx);
		drawPoints(ctx, points);

		/* Do not render rect and circle when points are not complete */
		if (isAllPoints(points)) {
			if (rect) drawRect(ctx, rect);
			if (circle) drawCircle(ctx, circle);
		}
	});

const ptInfos = [
		document.querySelector('#pt1 .value'),
		document.querySelector('#pt2 .value'),
		document.querySelector('#pt3 .value')
	],
	circleCenterInfo = document.querySelector('#circle-center .value'),
	circleRadiusInfo = document.querySelector('#circle-radius .value'),
	circleAreaInfo = document.querySelector('#circle-area .value'),
	rectCenterInfo = document.querySelector('#rect-center .value'),
	rectAreaInfo = document.querySelector('#rect-area .value');

/**
 * Display points info
 */
points$.subscribe((points) => {
	for (var i = 0; i < points.length; ++i) {
		const [x, y] = points[i];
		ptInfos[i].innerHTML = `[${x} ${y}]`;
	}
	for (; i < MAX_NUM_POINTS; ++i) {
		ptInfos[i].innerHTML = '[- -]';
	}
});

Observable.combineLatest(
	points$,
	center$,
	(points, center) => isAllPoints(points) ? center : []
).subscribe(([x, y]) => {
	x = isFinite(x) ? Math.round(x) : '-';
	y = isFinite(y) ? Math.round(y) : '-';
	const text = `[${x} ${y}]`;
	circleCenterInfo.innerHTML = text;
	rectCenterInfo.innerHTML = text;
});

Observable.combineLatest(
	points$,
	rectArea$,
	(points, area) => isAllPoints(points) ? area : 0
).subscribe((area) => {
	const text = `${area} px2`;
	circleAreaInfo.innerHTML = text;
	rectAreaInfo.innerHTML = text;
});

circleRadius$.subscribe((radius) => {
	circleRadiusInfo.innerHTML = `${Math.round(radius)} px`;
});

function toPointsRenderData([points, mouseoverIndex]) {
	return points.map(([x, y], index) => {
		return Object.assign(
			{},
			POINT_RENDER_DATA,
			mouseoverIndex === index ? POINT_MOUSEOVER_RENDER_DATA : {},
			{x, y}
		);
	});
}

function toRectRenderData(points) {
	const [lastX, lastY] = points[3];

	return Object.assign(
		{},
		RECT_RENDER_DATA,
		{
			lastPointRenderData: Object.assign({}, RECT_RENDER_DATA.lastPointRenderData, {
				x: lastX,
				y: lastY
			})
		},
		{points}
	);
}

function toCircleRenderData([[x, y], radius]) {
	return Object.assign({}, CIRCLE_RENDER_DATA, {x, y, radius});
}