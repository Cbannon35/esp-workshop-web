"use client"
import React, { useState, useEffect} from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../lib/firebaseConfig';
import { usePathname } from 'next/navigation';

const KeyPage = () => {
  const [data, setData] = useState(null);
  const pathname = usePathname()
  const name = pathname.replace('/', '');

  useEffect(() => {
    const dataRef = ref(database, `/${name}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val();
      setData(newData);
    });

    return () => unsubscribe();
  }, [name]);

  return (
    <div>
      <h1>Data for {name}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default KeyPage;
