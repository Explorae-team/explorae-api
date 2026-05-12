import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Review {
  userName?: string;
  content: string;
}

interface AttractionCommunityTipsProps {
  reviews: Review[];
}

export default function AttractionCommunityTips({ reviews }: AttractionCommunityTipsProps) {
  return (
    <View className="mt-12 bg-white rounded-[40px] p-8">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-black text-[#003646]">Dicas da Galera</Text>
        {reviews && reviews.length > 0 && (
          <View className="flex-row">
            {reviews.slice(0, 3).map((_, i) => (
              <View key={i} className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-gray-300" />
            ))}
            {reviews.length > 3 && (
              <View className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#F2641F] items-center justify-center">
                <Text className="text-[10px] text-white font-bold">+{reviews.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View className="gap-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Comment 
              key={index} 
              author={review.userName || '@explorador'} 
              text={review.content} 
            />
          ))
        ) : (
          <Text className="text-[#003646]/50 italic text-sm">
            Nenhuma dica ainda. Seja o primeiro a explorar e comentar!
          </Text>
        )}
      </View>
    </View>
  );
}

const Comment = ({ author, text }: { author: string; text: string }) => (
  <View className="flex-row gap-4">
    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
       <MaterialCommunityIcons name="account" size={20} color="#003646" />
    </View>
    <View className="flex-1">
      <Text className="font-bold text-[#003646] text-sm">{author}</Text>
      <Text className="text-[#003646]/70 text-sm mt-1 leading-5">{text}</Text>
    </View>
  </View>
);
