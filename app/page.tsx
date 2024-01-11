import Claim from '@/components/Claim';
import Sale from '@/components/Sale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main>
      <div className='py-5 sm:py-8'>
        <div className='max-w-[95%] sm:max-w-[70%] md:max-w-[460.8px] mx-auto'>
          <Tabs defaultValue='sale'>
            <TabsList className='grid w-full grid-cols-2 mb-3'>
              <TabsTrigger value='sale'>Sale</TabsTrigger>
              <TabsTrigger value='claim'>Claim</TabsTrigger>
            </TabsList>
            <TabsContent value='sale'>
              <Sale
                title='Sale'
                description='Hold LBC before snapshot and claim your free share of OCS or increase your OCS share by
                burning your LBC for OCS'
              />
            </TabsContent>
            <TabsContent value='claim'>
              <Claim
                title='Claim'
                description='Claim your free OCS after trade open or claim your purchased OCS from the sale and your vested tokens overtime here'
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
