import {Observable} from 'rxjs/Observable';

export function toMouseCoords({clientX: x, clientY: y}) {
	return [x, y];
}

export function toMousemoveCoords({movementX: dx, movementY: dy}) {
	return [dx, dy];
}

export function toElementEventObservable(eventName) {
	return function (element) {
		return Observable.fromEvent(element, eventName);
	}
}