"use client"
import React, { useState, useEffect, use} from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../lib/firebaseConfig';
import { usePathname } from 'next/navigation';
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';


type SensorData = {
  [sensor: string]: {
    [reading: string]: {
      data: string;
      timestamp: number;
    };
  };
};

const KeyPage = () => {
  const { toast } = useToast()
  const [data, setData] = useState<SensorData>({});
  const pathname = usePathname()
  const name = pathname.replace('/', '');
  const [isOpen, setIsOpen] = React.useState<boolean[]>([])
  const [loading, setLoading] = useState(false)
  const [isRow, setIsRow] = useState(true)

  useEffect(() => {
    const dataRef = ref(database, `/${name}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val();
      const newUploadTime = new Date().toLocaleTimeString()
      console.log("yuh")
      toast({
          title: "Firebase data updated",
          description: newUploadTime,
        })
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
    <div className='mt-4'>
      <h1 className='text-xl'>Participant: {name}</h1>
      <h2 className='text-sm mb-4'>View your data in real-time 👇</h2>

      <Tabs defaultValue="row" className="right-0 flex justify-end">
        <TabsList>
          <TabsTrigger value="row" onClick={() => setIsRow(true)}>Row</TabsTrigger>
          <TabsTrigger value="col" onClick={() => setIsRow(false)}>Column</TabsTrigger>
        </TabsList>
      </Tabs>

      <hr className='mb-2'/>
      <div className={`flex ${isRow ? 'space-x-2' : 'space-y-2'}`} style={{flexDirection: isRow ? "row" : "column" }}>
        {Object.keys(data).map((sensor, index) => (
          
          <Collapsible
            key={index}
            open={isOpen[Number(index)]}
            onOpenChange={() => {
              setIsOpen((prev) => prev.map((_, i) => i === Number(index) ? !prev[i] : prev[i]))
            }}
            className="w-[250px] space-y-2"
          >
            <div className="flex items-center justify-between rounded-md border pr-2">
              <div className='flex items-center'>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {loading ? <LoadingSpinner className=''/> : isOpen[Number(index)] ? <img width="24px" src={"/down-arrow-svgrepo-com.svg"} alt="down arrow" /> : <img width="24px" src={"/right-arrow-svgrepo-com.svg"} alt="right arrow" />}
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
                <h4 className="text-sm font-semibold">
                {sensor}
                </h4>
              </div>
              <h4 className="text-sm font-semibold">
                {Object.keys(data[sensor]).length}
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
        ))}
      </div>
    </div>
  );
};

export default KeyPage;