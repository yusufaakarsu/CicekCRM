"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (isLoading) return <div>Yükleniyor...</div>;

  const { deliveryStats, stockNeeds } = data || {};

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Teslimat İstatistikleri */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Bekleyen Teslimatlar</h3>
        <div className="mt-2">
          <p className="text-2xl font-bold">
            {deliveryStats?.delivered_orders || 0} / {deliveryStats?.total_orders || 0} Teslimat
          </p>
          <p className="text-sm text-gray-500">
            {deliveryStats?.pending_orders || 0} bekleyen teslimat
          </p>
        </div>
      </Card>

      {/* Stok Durumu */}
      <Card className="p-4 col-span-2">
        <h3 className="text-lg font-semibold">Yarınki Siparişler İçin Stok Durumu</h3>
        <div className="mt-2 space-y-2">
          {stockNeeds?.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span>{item.name}</span>
              <div className="flex gap-2 items-center">
                <span className="text-sm">
                  Mevcut: {item.current_stock} / Gerekli: {item.needed_quantity}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  item.remaining_stock < 0 ? 'bg-red-100 text-red-800' : 
                  item.remaining_stock < item.min_stock ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {item.remaining_stock < 0 ? `${Math.abs(item.remaining_stock)} adet eksik` :
                   item.remaining_stock < item.min_stock ? 'Kritik seviye' : 
                   'Yeterli'}
                </span>
              </div>
            </div>
          ))}
          {(!stockNeeds || stockNeeds.length === 0) && (
            <p className="text-sm text-gray-500">Stok durumu normal</p>
          )}
        </div>
      </Card>
    </div>
  );
}
