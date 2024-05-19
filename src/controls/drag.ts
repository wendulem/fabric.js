import type { TransformActionHandler } from '../EventTypeDefs';
import { LEFT, TOP } from '../constants';
import { fireEvent } from './fireEvent';
import { commonEventInfo, isLocked } from './util';

/**
 * Action handler
 * @private
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if the translation occurred
 */
export const dragHandler: TransformActionHandler = (
  eventData,
  transform,
  x,
  y
) => {
  const { target, offsetX, offsetY } = transform,
    newLeft = x - offsetX,
    newTop = y - offsetY,
    moveX = !isLocked(target, 'lockMovementX') && target.left !== newLeft,
    moveY = !isLocked(target, 'lockMovementY') && target.top !== newTop;

  // Get bounding box (if any)
  const boundingBox = target.boundingBox
    ? target.boundingBox.getBoundingRect()
    : null;
  const objBoundingBox = target.getBoundingRect();

  if (boundingBox) {
    if (newLeft < boundingBox.left) {
      target.left = boundingBox.left;
    } else if (
      newLeft + objBoundingBox.width >
      boundingBox.left + boundingBox.width
    ) {
      target.left = boundingBox.left + boundingBox.width - objBoundingBox.width;
    } else {
      moveX && target.set(LEFT, newLeft);
    }

    if (newTop < boundingBox.top) {
      target.top = boundingBox.top;
    } else if (
      newTop + objBoundingBox.height >
      boundingBox.top + boundingBox.height
    ) {
      target.top = boundingBox.top + boundingBox.height - objBoundingBox.height;
    } else {
      moveY && target.set(TOP, newTop);
    }
  } else {
    moveX && target.set(LEFT, newLeft);
    moveY && target.set(TOP, newTop);
  }

  if (moveX || moveY) {
    fireEvent('moving', commonEventInfo(eventData, transform, x, y));
  }
  return moveX || moveY;
};
