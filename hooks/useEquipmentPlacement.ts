import { useState, useCallback } from 'react';

export interface Position2D {
  x: number;
  y: number;
}

export interface ExclusionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseEquipmentPlacementOptions {
  gridStepPx?: number;
  roofBounds: { minX: number; maxX: number; minY: number; maxY: number };
  exclusions: ExclusionZone[];
}

export function useEquipmentPlacement({
  gridStepPx = 20,
  roofBounds,
  exclusions,
}: UseEquipmentPlacementOptions) {
  const [position, setPosition] = useState<Position2D>({ x: 210, y: 225 });
  const [isValidPlacement, setIsValidPlacement] = useState<boolean>(true);

  const validateCoordinates = useCallback(
    (x: number, y: number, width: number = 23, height: number = 40): boolean => {
      if (
        x < roofBounds.minX + 15 ||
        x + width > roofBounds.maxX - 15 ||
        y < roofBounds.minY + 15 ||
        y + height > roofBounds.maxY - 15
      ) {
        return false;
      }

      for (const zone of exclusions) {
        if (
          x < zone.x + zone.width &&
          x + width > zone.x &&
          y < zone.y + zone.height &&
          y + height > zone.y
        ) {
          return false;
        }
      }

      return true;
    },
    [roofBounds, exclusions]
  );

  const moveTo = useCallback(
    (rawX: number, rawY: number) => {
      const snappedX = Math.round(rawX / gridStepPx) * gridStepPx;
      const snappedY = Math.round(rawY / gridStepPx) * gridStepPx;
      const valid = validateCoordinates(snappedX, snappedY);

      setPosition({ x: snappedX, y: snappedY });
      setIsValidPlacement(valid);
    },
    [gridStepPx, validateCoordinates]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const step = event.shiftKey ? gridStepPx * 2 : gridStepPx;
      let nextX = position.x;
      let nextY = position.y;

      switch (event.key) {
        case 'ArrowUp':
          nextY -= step;
          break;
        case 'ArrowDown':
          nextY += step;
          break;
        case 'ArrowLeft':
          nextX -= step;
          break;
        case 'ArrowRight':
          nextX += step;
          break;
        default:
          return;
      }

      event.preventDefault();
      const valid = validateCoordinates(nextX, nextY);
      setPosition({ x: nextX, y: nextY });
      setIsValidPlacement(valid);
    },
    [position, gridStepPx, validateCoordinates]
  );

  return {
    position,
    isValidPlacement,
    moveTo,
    handleKeyDown,
  };
}

