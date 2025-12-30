import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { getBookModel } from 'opencover-3d';
import * as THREE from 'three';


function BookModel({
  isbn,
  indexOffset,
  baseZRef,
}: {
  isbn: string;
  indexOffset: number;
  baseZRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const hoveredRef = useRef(false);

  const baseX = 1;
  const baseY = 0;
  const hoverOffset = 0.75;

  useEffect(() => {
    let mounted = true;

    getBookModel(isbn).then((model) => {
      if (!mounted) return;
      groupRef.current?.add(model);
    });

    return () => {
      mounted = false;
    };
  }, [isbn]);

  useFrame(() => {
    if (!groupRef.current) return;

    const targetX = hoveredRef.current
      ? baseX + hoverOffset
      : baseX;

    const targetZ = baseZRef.current + indexOffset;

    const target = new THREE.Vector3(
      targetX,
      baseY,
      targetZ
    );

    groupRef.current.position.lerp(target, 0.1);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => (hoveredRef.current = true)}
      onPointerOut={() => (hoveredRef.current = false)}
    />
  );
}

// export default function Book3DViewer({ books }: { books: string[] }) {
//   const baseZRef = useRef(0.5);
//   const spacing = 0.75;
//
//   useEffect(() => {
//     const onWheel = (e: WheelEvent) => {
//       baseZRef.current += e.deltaY * 0.002; // ← 感度
//     };
//
//     window.addEventListener('wheel', onWheel, { passive: true });
//     return () => window.removeEventListener('wheel', onWheel);
//   }, []);
//
//   return (
//     <Canvas
//       orthographic
//       camera={{
//         position: [10, 10, 10],
//         zoom: 100,
//         near: 0.01,
//         far: 1000,
//       }}
//     >
//       <color attach="background" args={['#eee']} />
//       <ambientLight intensity={2.5} />
//
//       <Suspense fallback={null}>
//         {books.map((book, index) => (
//           <BookModel
//             key={book}
//             isbn={book}
//             indexOffset={(index - (books.length - 1) / 2) * spacing}
//             baseZRef={baseZRef}
//           />
//         ))}
//       </Suspense>
//
//       <gridHelper args={[100, 800, '#ddd', '#ddd']} />
//     </Canvas>
//   );
// }


export default function Book3DViewer({ books }: { books: string[] }) {
  const baseZRef = useRef(0);
  const spacing = 0.75;

  const lastYRef = useRef<number | null>(null);

  useEffect(() => {
    // PC：ホイール
    const onWheel = (e: WheelEvent) => {
      baseZRef.current += e.deltaY * 0.002;
    };

    // スマホ：タッチ開始
    const onTouchStart = (e: TouchEvent) => {
      lastYRef.current = e.touches[0].clientY;
    };

    // スマホ：スワイプ
    const onTouchMove = (e: TouchEvent) => {
      if (lastYRef.current === null) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastYRef.current - currentY;

      baseZRef.current += deltaY * 0.01; // ← 感度
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
    >
      <color attach="background" args={['#eee']} />
      <ambientLight intensity={2.5} />

      <Suspense fallback={null}>
        {books.map((book, index) => (
          <BookModel
            key={book}
            isbn={book}
            indexOffset={(index - (books.length - 1) / 2) * spacing}
            baseZRef={baseZRef}
          />
        ))}
      </Suspense>

      <gridHelper args={[100, 800, '#ddd', '#ddd']} />
    </Canvas>
  );
}

