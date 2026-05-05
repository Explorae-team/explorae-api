import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RecentActivity() {
  const activities = [
    { id: 1, title: 'Farol do Cabo Branco', time: '2 days ago', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwS_8mqv-FvvB4ubgtBZMAmaI6bRNZU8Tl2zOBldaUSjZ7TfySJNSALTHZk4N7SXoLFwWjhstgPgZwzEIwxWrIyOVKdSnez7pkWYsbqgYpxGV1fLPcmHZ3qc3enXggYmyGzm1W-jF8OnXUpw3lrKVrDcVKIP6sMmnX_eG9oDPGuG6IRQRfzcNtXzka6oU1nWpCAnGWLOnJnzbXHU6Y2vyuFVCNsfHUIcc1xC5Yo4qrNmHpIlY9ZlhYFpVZJbqbaDPNj_uh1x5Jai0' },
    { id: 2, title: 'Mercado Municipal', time: '5 days ago', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC28YN3o5-O2GGVSuuDxJadkOzpWI7P_5htytdkDFo1Gn0OozQLutocMppCeaVwEe00gjT_V8K4FiL4hPRdvX796qKtJm6Mf3xqHJDSOuP0eb4N8tDH9jgoQ0o1WEWL-g7UpKsSHUFB9em4p7P4Cpdi8m5M5wlVA3PO2KQ_YV-TIz8_IlRGecSubNgUlzcy4EZ6-TuIFk-43Gze4cGUhg1DTCx1-qOBfl3N6ZmNFl2TPvO8Vyt24voCLHRbkI-kOp8-OC6P1x56Fss' }
  ];

  return (
    <View className="mt-10 mb-8">
      <Text className="text-xl font-bold tracking-tight mb-6 text-on-surface">Recent Adventures</Text>
      {activities.map((item) => (
        <View key={item.id} className="bg-white rounded-xl p-3 flex-row items-center mb-4">
          <Image source={{ uri: item.img }} className="w-20 h-20 rounded-lg" />
          <View className="flex-1 px-4">
            <Text className="text-surface-container-lowest font-extrabold text-lg leading-tight">{item.title}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="schedule" size={14} color="#001017" />
              <Text className="text-xs font-bold text-surface-container-lowest ml-1">{item.time}</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#fd6c28" />
        </View>
      ))}
    </View>
  );
}
