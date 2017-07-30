import {Observable, Subject} from 'rxjs';
import './rxjs.imports';
import {clearCanvas, drawCircle, drawPoints, drawRect, getCanvasCtx, resizeCanvas} from './utils/canvas';
import {toElementEventObservable, toMouseCoords} from './utils/event';
import {
	findAreaOfRect,
	findCenterOfRect,
	findPointIndexAtCoords,
	getInitialPoints,
	isAllPoints,
	pointsReducer,
	prepareRectPoints,
	findCircleRadius,
	isPointsNear,
	toPointActionAdd,
	toPointActionReset,
	toPointActionMove
} from './utils/points';
import {
	CIRCLE_RENDER_DATA,
	NUM_POINTS,
	POINT_MOUSEOVER_RENDER_DATA,
	POINT_RENDER_DATA,
	RECT_RENDER_DATA
} from './constants';

const resize$ = toElementEventObservable('resize')(window).debounceTime(200),

	mouseup$ = toElementEventObservable('mouseup')(window),

	resetClick$ = Observable.of(document.getElementById('reset'))
		.switchMap(toElementEventObservable('click')),

	canvasElement$ = Observable.of(document.getElementById('canvas')),

	canvasMouseup$ = canvasElement$
		.switchMap(toElementEventObservable('mouseup'))
		.map(toMouseCoords),

	canvasMousedown$ = canvasElement$
		.switchMap(toElementEventObservable('mousedown'))
		.map(toMouseCoords),

	canvasMousemove$ = canvasElement$
		.switchMap(toElementEventObservable('mousemove'))
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
		.scan(pointsReducer(NUM_POINTS), getInitialPoints()),

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
		/* stop from firing same index constantly
		 * report only when index changes
		 */
		.distinctUntilChanged(),

	canvasCtx$ = resize$
		.startWith(void 0)
		.switchMapTo(canvasElement$)
		.do(resizeCanvas)
		.map(getCanvasCtx),

	rectPoints$ = points$
		.filter(isAllPoints)
		.map(prepareRectPoints),

	center$ = rectPoints$
		.map(findCenterOfRect),

	rectArea$ = rectPoints$
		.map(findAreaOfRect),

	circleRadius$ = rectArea$
		.map(findCircleRadius),

	pointsRenderData$ = Observable.combineLatest(
		points$,
		pointMouseoverIndex$
	).map(toPointsRenderData),

	rectRenderData$ = rectPoints$
		.map(toRectRenderData),

	circleRenderData$ = Observable.zip(
		center$,
		circleRadius$
	).map(toCircleRenderData);

/**
 * Point Add Action stream
 * combine mousedown and mouseup events
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
 */
Observable.combineLatest(
	canvasCtx$,
	Observable.combineLatest(
		pointsRenderData$,
		rectRenderData$.startWith(void 0),
		circleRenderData$.startWith(void 0)
	).debounceTime(0)
).subscribe(([ctx, [points, rect, circle]]) => {
	clearCanvas(ctx);
	drawPoints(ctx, points);
	if (isAllPoints(points)) {
		if (rect) drawRect(ctx, rect);
		if (circle) drawCircle(ctx, circle);
	}
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
	return Object.assign({}, RECT_RENDER_DATA, {points});
}

function toCircleRenderData([[x, y], radius]) {
	return Object.assign({}, CIRCLE_RENDER_DATA, {x, y, radius});
}