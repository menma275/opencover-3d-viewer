import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { BookModel } from "./BookModel"

function Loading() {
  return (
    <Html center>
      <div
        style={{
          width: "fit-content",
          padding: "0.75rem 1.25rem",
          background: "#ffffffcc",
          backdropFilter: "blur(6px)",
          borderRadius: "9999px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        }}
      >
        Loading books…
      </div>
    </Html>
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

      <Suspense fallback={<Loading />}>
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
