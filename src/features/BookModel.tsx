import { useRef, useEffect } from 'react';
import { getBook } from 'opencover-3d';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type BookModelProps = {
  isbn: string;
  index: number;
  total: number;
  spacing: number;
  baseZRef: React.MutableRefObject<number>;
  selectedIndex: number | null;
  onSelect: () => void;
};

export function BookModel({
  isbn,
  index,
  total,
  spacing,
  baseZRef,
  selectedIndex,
  onSelect,
}: BookModelProps) {
  const hoveredRef = useRef(false);
  const groupRef = useRef<THREE.Group | null>(null);

  const baseX = 1;
  const baseY = 0;
  const activeXOffset = 0.75;
  const spreadAmount = 1;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { model, details } = await getBook(isbn);
      console.log(details)
      if (!mounted) return;
      groupRef.current?.add(model);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [isbn]);

  useFrame(() => {
    if (!groupRef.current) return;

    const isSelected = selectedIndex === index;

    const targetX = isSelected
      ? baseX + activeXOffset
      : baseX;

    const reversedIndex = total - 1 - index;

    const baseZOffset =
      (reversedIndex - (total - 1) / 2) * spacing;

    const reversedSelectedIndex =
      selectedIndex === null ? null : total - 1 - selectedIndex;


    let spreadOffset = 0;

    if (reversedSelectedIndex !== null) {
      const diff = reversedIndex - reversedSelectedIndex;

      if (diff !== 0) {
        spreadOffset =
          Math.sign(diff) *
          spreadAmount *
          Math.min(1, Math.abs(diff));
      }
    }

    const targetZ =
      baseZRef.current +
      baseZOffset +
      spreadOffset;

    const isHovered = hoveredRef.current && !isSelected;

    const targetRotZ = isSelected
      ? 0
      : isHovered
        ? -0.2
        : 0;

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      0.1
    );
    groupRef.current.position.lerp(
      new THREE.Vector3(targetX, baseY, targetZ),
      0.1
    );

  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = true;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        hoveredRef.current = false;
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect()
      }}
    />
  );
}
