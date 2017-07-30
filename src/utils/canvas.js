export function getCanvasSizeReferenceElement(canvas) {
	return canvas.parentElement;
}

export function resizeCanvas(canvas) {
	var {clientWidth: width, clientHeight: height} = getCanvasSizeReferenceElement(canvas);
	canvas.width = width;
	canvas.height = height;
}

export function getCanvasCtx(canvas) {
	return canvas.getContext('2d');
}

export function clearCanvas(ctx) {
	const {width, height} = ctx.canvas;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, width, height);
}

export function drawPoint(ctx, {x, y, strokeStyle, fillStyle, radius, lineDash}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	if (lineDash) ctx.setLineDash(lineDash);
	ctx.arc(x, y, radius, Math.PI * 2, 0, false);
	ctx.moveTo(x, y);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

export function drawCircle(ctx, {x, y, strokeStyle, fillStyle, radius, lineDash, crossRenderData}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	if (lineDash) ctx.setLineDash(lineDash);
	ctx.arc(x, y, radius, Math.PI * 2, 0, false);
	ctx.moveTo(x, y);

	ctx.fill();
	ctx.stroke();

	/* render center cross */
	const crLength = radius * 0.1;

	ctx.strokeStyle = crossRenderData.strokeStyle;

	ctx.beginPath();
	ctx.setLineDash([crLength * 0.15, crLength * 0.15]);
	ctx.moveTo(x, y - crLength);
	ctx.lineTo(x, y + crLength);
	ctx.moveTo(x - crLength, y);
	ctx.lineTo(x + crLength, y);

	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

export function drawRect(ctx, {points, strokeStyle, fillStyle, lastPointRenderData}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	ctx.moveTo(...points[0]);
	for (var i = 1; i < points.length; ++i) {
		ctx.lineTo(...points[i]);
	}
	ctx.lineTo(...points[0]);
	ctx.stroke();
	ctx.fill();

	/* draw fourth point placeholder */
	drawPoint(ctx, lastPointRenderData);

	ctx.restore();
}

export function drawPoints(ctx, points) {
	for (var i = 0; i < points.length; ++i) {
		drawPoint(ctx, points[i]);
	}
}