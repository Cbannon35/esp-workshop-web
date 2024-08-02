"use client"

import { useEffect, useState } from 'react';
import { database} from '@/lib/firebaseConfig';
import { ref, get, onValue } from "firebase/database";
import { useRouter } from 'next/navigation';

interface FirebaseData {
  [key: string]: any;
}

export default function Home() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const dataRef = ref(database, '/');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val();
      setData(newData);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleCardClick = (key: string) => {
    router.push(`/${key}`);
  };

  return (
    <div>
        {data &&
          Object.keys(data).map((key) => (
            <div
              key={key}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '16px',
                margin: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => handleCardClick(key)}
            >
              <h2>{key}</h2>
            </div>
          ))}
      </div>
  );
}
