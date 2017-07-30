export function resizeCanvas(canvas) {
	var {clientWidth: width, clientHeight: height} = canvas.parentElement;
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

export function drawPoint(ctx, {x, y, strokeStyle, fillStyle, radius}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	ctx.arc(x, y, radius, Math.PI * 2, 0, false);
	ctx.moveTo(x, y);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

export function drawCircle(ctx, {x, y, strokeStyle, fillStyle, radius}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	ctx.arc(x, y, radius, Math.PI * 2, 0, false);
	ctx.moveTo(x, y);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

export function drawRect(ctx, {points, strokeStyle, fillStyle}) {

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for (var i = 1; i < points.length; ++i) {
		ctx.lineTo(points[i][0], points[i][1]);
	}
	ctx.lineTo(points[0][0], points[0][1]);
	ctx.stroke();
	ctx.fill();

	ctx.restore();
}

export function drawPoints(ctx, points) {
	for(var i = 0; i < points.length; ++i) {
		drawPoint(ctx, points[i]);
	}
}