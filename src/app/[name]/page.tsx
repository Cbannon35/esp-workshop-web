"use client"
import React, { useState, useEffect, use} from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../lib/firebaseConfig';
import { usePathname } from 'next/navigation';
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
// import { toast } from "sonner"


const KeyPage = () => {
  const [data, setData] = useState(null);
  const pathname = usePathname()
  const name = pathname.replace('/', '');
  const [isOpen, setIsOpen] = React.useState<boolean[]>([])

  useEffect(() => {
    console.log(isOpen)
  }, [isOpen])

  useEffect(() => {
    const dataRef = ref(database, `/${name}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val();
      // toast("Data uploaded to Firebase", {
      //     description: new Date().toLocaleTimeString(),
      //     action: {
      //       label: "Close",
      //       onClick: () => {},
      //     },
      //   })

      setData(newData);
      // set isOpen to an array of the same length as the number of sensors, but also preserve the previous state
      const length = Object.keys(newData).length
      setIsOpen((prev) => {
        if (prev.length === length) return prev
        return Array.from({ length }, (_, i) => prev[i] ?? false)
      })
    });

    return () => unsubscribe();
  }, [name]);

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Hello {name}</h1>
      <h2>View your data in real-time</h2>

      {Object.keys(data).map((sensor, index) => (
        <Collapsible
          key={index}
          open={isOpen[Number(index)]}
          onOpenChange={() => {
            setIsOpen((prev) => prev.map((_, i) => i === Number(index) ? !prev[i] : prev[i]))
          }}
          className="w-[350px] space-y-2"
        >
          <div className="flex items-center rounded-md border">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen[Number(index)] ? <img width="24px" src={"/down-arrow-svgrepo-com.svg"} alt="down arrow" /> : <img width="24px" src={"/right-arrow-svgrepo-com.svg"} alt="right arrow" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <h4 className="text-sm font-semibold">
              Sensor: {sensor}
            </h4>
            <h4 className="text-sm font-semibold">
              Total Readings: {Object.keys(data[sensor]).length}
            </h4>
          </div>
          <CollapsibleContent className="space-y-2">
            {Object.keys(data[sensor]).map((reading) => (
              <div key={reading} className="flex items-center justify-around rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                <p>{data[sensor][reading].data}</p>
                <p>{formatDate(data[sensor][reading].timestamp)}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        // <div key={sensor}>
        //   <h2>Sensor: {sensor}</h2>
        //   {Object.keys(data[sensor]).map((reading) => (
        //     <div key={reading}>
        //       <p>{data[sensor][reading].data}</p>
        //       <p>{formatDate(data[sensor][reading].timestamp)}</p>
        //     </div>
        //   ))}
        // </div>
      ))}
    </div>
  );
};

export default KeyPage;
