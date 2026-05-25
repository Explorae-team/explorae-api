import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

interface Review {
  userName?: string;
  userPhotoUrl?: string;
  content: string;
  rating?: number;
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
            {reviews.slice(0, 3).map((review, i) => {
              const avatarUrl = review.userPhotoUrl 
                ? (review.userPhotoUrl.startsWith('http') ? review.userPhotoUrl : `${API_URL}${review.userPhotoUrl}`)
                : null;
              return avatarUrl ? (
                <Image 
                  key={i} 
                  source={{ uri: avatarUrl }} 
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2" 
                />
              ) : (
                <View key={i} className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-gray-300 items-center justify-center">
                  <MaterialCommunityIcons name="account" size={14} color="#003646" />
                </View>
              );
            })}
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
              rating={review.rating}
              userPhotoUrl={review.userPhotoUrl}
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

const Comment = ({ author, text, rating, userPhotoUrl }: { author: string; text: string; rating?: number; userPhotoUrl?: string }) => {
  const avatarUrl = userPhotoUrl 
    ? (userPhotoUrl.startsWith('http') ? userPhotoUrl : `${API_URL}${userPhotoUrl}`)
    : null;

  return (
    <View className="flex-row gap-4">
      {avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          className="w-10 h-10 rounded-full border border-white/10" 
        />
      ) : (
        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
           <MaterialCommunityIcons name="account" size={20} color="#003646" />
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-[#003646] text-sm">{author}</Text>
          {rating !== undefined && (
            <View className="flex-row gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons 
                  key={star} 
                  name={star <= rating ? "star" : "star-border"} 
                  size={14} 
                  color="#FFB700" 
                />
              ))}
            </View>
          )}
        </View>
        <Text className="text-[#003646]/70 text-sm mt-1 leading-5">{text}</Text>
      </View>
    </View>
  );
};
