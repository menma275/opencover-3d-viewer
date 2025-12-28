import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { getBookModel } from 'opencover-3d';
import * as THREE from 'three';

function BookModel({ isbn, position }: { isbn: string, position: [number, number, number] }) {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    getBookModel(isbn).then(setModel);
  }, [isbn]);

  if (!model) return null;
  return <primitive object={model} position={position} />;
}

export default function Book3DViewer({ books }: { books: string[] }) {
  const spacing = 0.5;
  return (
    <Canvas
      orthographic
      camera={{
        position: [3, 3, 3],
        zoom: 150,
        near: 0.01,
        far: 1000
      }}>
      <color attach="background" args={['#eee']} />
      <ambientLight intensity={2.5} />

      <Suspense fallback={null}>
        {books.map((book, index) => (
          <BookModel
            key={index}
            isbn={book}
            position={[1, 0, (index - (books.length - 1) / 2) * spacing]}
          />
        ))}
      </Suspense>

      <gridHelper args={[100, 800, "#ddd", "#ddd"]} position={[0, 0, 0]} />

      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}
