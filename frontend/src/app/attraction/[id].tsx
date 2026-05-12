import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AttractionDetail = () => {

  const router = useRouter()

  return (
    <View className="flex-1 bg-[#003646]">
      {/* Header Fixo */}
      <SafeAreaView className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 py-2">
        <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden">
          <BlurView intensity={20} className="absolute inset-0" />
          <MaterialCommunityIcons name="arrow-left" size={24} color="#F2641F" onPress={()=>router.push('/dashboard')} />
        </TouchableOpacity>
        
        <Text className="font-bold text-lg text-[#F2641F]">Exploraê</Text>
        
        <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden">
          <BlurView intensity={20} className="absolute inset-0" />
          <MaterialCommunityIcons name="share-variant" size={24} color="#F2641F" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative h-[530px] w-full">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1590505183015-84906596144e?q=80&w=1000' }} 
            className="w-full h-full object-cover"
          />
          <LinearGradient
            colors={['transparent', '#003646']}
            className="absolute inset-0"
            style={{ height: '100%' }}
          />
          
          {/* Indicators */}
          <View className="absolute bottom-24 flex-row self-center gap-2">
            <View className="w-8 h-1.5 rounded-full bg-[#F2641F]" />
            <View className="w-2 h-1.5 rounded-full bg-white/30" />
            <View className="w-2 h-1.5 rounded-full bg-white/30" />
          </View>
        </View>

        {/* Content Canvas */}
        <View className="px-6 -mt-20">
          {/* Tags e Info */}
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-[#FFB700]/20 px-3 py-1 rounded-full">
              <Text className="text-[#FFB700] text-[10px] font-bold uppercase">Natureza & História</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-[#0d3e4e]/80 px-2 py-1 rounded-lg">
              <MaterialCommunityIcons name="star" size={14} color="#FFB700" />
              <Text className="text-white text-sm font-bold">4.8</Text>
            </View>
          </View>

          <Text className="text-4xl font-black text-[#bde9fe] mb-2">Farol do Cabo Branco</Text>
          <Text className="text-[#bde9fe]/90 text-sm leading-6">
            O Farol do Cabo Branco, em João Pessoa (PB), é famoso por seu formato triangular único no Brasil, 
            inspirado na planta de sisal. Localizado sobre uma falésia a 800 metros da Ponta do Seixas.
          </Text>

          {/* Primary CTA */}
          <TouchableOpacity 
            className="w-full bg-[#F2641F] py-5 rounded-2xl flex-row items-center justify-center gap-3 mt-8 shadow-lg shadow-orange-950"
          >
            <MaterialCommunityIcons name="navigation-variant" size={24} color="white" />
            <Text className="text-white font-bold text-lg">TRAÇAR ROTA</Text>
          </TouchableOpacity>

          {/* Bento Grid */}
          <View className="flex-row justify-between gap-4 mt-8">
            <View className="flex-1 bg-[#002e3c] p-4 rounded-3xl items-center">
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#FFB700" />
              <Text className="text-[10px] text-white/60 uppercase mt-1">Distância</Text>
              <Text className="text-sm font-bold text-white">2.5km</Text>
            </View>
            <View className="flex-1 bg-[#002e3c] p-4 rounded-3xl items-center">
              <MaterialCommunityIcons name="clock-outline" size={24} color="#FFB700" />
              <Text className="text-[10px] text-white/60 uppercase mt-1">Melhor Horário</Text>
              <Text className="text-sm font-bold text-white">Pôr do Sol</Text>
            </View>
            <View className="flex-1 bg-[#002e3c] p-4 rounded-3xl items-center">
              <MaterialCommunityIcons name="cash" size={24} color="#FFB700" />
              <Text className="text-[10px] text-white/60 uppercase mt-1">Preço</Text>
              <Text className="text-sm font-bold text-white">Grátis</Text>
            </View>
          </View>

          {/* O que encontrar Section */}
          <View className="mt-10">
            <View className="flex-row items-center gap-4 mb-6">
              <Text className="text-xl font-bold text-[#bde9fe]">O que encontrar</Text>
              <View className="flex-1 h-[1px] bg-[#053a4a]" />
            </View>
            
            <View className="flex-row flex-wrap gap-4">
              {['Monumento', 'Mirante', 'Estação', 'Falésias'].map((item, index) => (
                <View key={index} style={{ width: (width - 64) / 2 }} className="bg-[#0d3e4e]/40 p-4 rounded-2xl flex-row items-center gap-3 border border-white/5">
                  <View className="bg-[#F2641F]/10 p-2 rounded-xl">
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color="#F2641F" />
                  </View>
                  <Text className="text-white text-[10px] font-semibold">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Community Tips (White Card) */}
          <View className="mt-12 bg-white rounded-[40px] p-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-[#003646]">Dicas da Galera</Text>
              <View className="flex-row">
                {[1, 2].map((i) => (
                  <View key={i} className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-gray-300" />
                ))}
                <View className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#F2641F] items-center justify-center">
                  <Text className="text-[10px] text-white font-bold">+24</Text>
                </View>
              </View>
            </View>

            <View className="gap-6">
              <Comment author="@joao_pedro" text="Acorde cedo para ver o sol nascer no ponto mais oriental das Américas!" />
              <Comment author="@alina_traveller" text="Não deixe de caminhar pelas falésias até a Praia do Seixas." />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Check-in Floating Button */}
      <View className="absolute bottom-10 left-6 right-6">
        <TouchableOpacity className="bg-[#FFB700] py-4 rounded-full flex-row items-center justify-center gap-2 shadow-xl shadow-black/50">
          <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#00161e" />
          <Text className="font-black text-[#00161e] tracking-widest uppercase">CHECK-IN NO LOCAL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Comment = ({ author, text }: { author: string; text: string }) => (
  <View className="flex-row gap-4">
    <View className="w-10 h-10 rounded-full bg-gray-200" />
    <View className="flex-1">
      <Text className="font-bold text-[#003646] text-sm">{author}</Text>
      <Text className="text-[#003646]/70 text-sm mt-1 leading-5">{text}</Text>
    </View>
  </View>
);

export default AttractionDetail;