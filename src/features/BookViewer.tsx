import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { getBookModel } from 'opencover-3d';
import * as THREE from 'three';

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
      const model = await getBookModel(isbn);
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

type Book3DViewerProps = {
  books: string[];
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
}

export default function Book3DViewer({
  books,
  selectedIndex,
  onSelectIndex
}: Book3DViewerProps) {

  const baseZRef = useRef(0);
  const spacing = 0.75;

  const lastYRef = useRef<number | null>(null);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      baseZRef.current += e.deltaY * 0.002;
    };

    const onTouchStart = (e: TouchEvent) => {
      lastYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lastYRef.current === null) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastYRef.current - currentY;

      baseZRef.current += deltaY * 0.01;
      lastYRef.current = currentY;
    };

    const onTouchEnd = () => {
      lastYRef.current = null;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <Canvas
      orthographic
      camera={{
        position: [10, 10, 10],
        zoom: 100,
        near: 0.01,
        far: 1000,
      }}
      onPointerMissed={() => {
        onSelectIndex(null);
      }}
    >
      <color attach="background" args={['#eee']} />
      <ambientLight intensity={2.5} />

      <Suspense fallback={null}>
        {books.map((isbn, index) => (
          <BookModel
            key={isbn}
            isbn={isbn}
            index={index}
            total={books.length}
            spacing={spacing}
            baseZRef={baseZRef}
            selectedIndex={selectedIndex}
            onSelect={() => {
              onSelectIndex(
                selectedIndex === index ? null : index
              );
            }}
          />
        ))}
      </Suspense>

      <gridHelper args={[100, 800, '#ddd', '#ddd']} />
    </Canvas>
  );
}
