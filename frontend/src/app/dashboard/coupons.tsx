import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import { rewardService, Reward, Voucher } from '../../services/rewardService';
import { RewardCard } from '../../components/reward/RewardCard';
import { VoucherCard } from '../../components/reward/VoucherCard';

import { RedeemConfirmationModal } from '../../components/reward/RedeemConfirmationModal';
import { RedeemSuccessModal } from '../../components/reward/RedeemSuccessModal';
import { VoucherQRCodeModal } from '../../components/reward/VoucherQRCodeModal';
import { VoucherHistoryAccordion } from '../../components/reward/VoucherHistoryAccordion';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function CouponsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUserPreferences } = useAuth() as any;

  const [activeTab, setActiveTab] = useState<'STORE' | 'VOUCHERS'>('STORE');

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentVoucher, setRecentVoucher] = useState<Voucher | null>(null);
  const [activeVoucherQRCode, setActiveVoucherQRCode] = useState<Voucher | null>(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setErrorMessage(null);

      if (user) {
        await updateUserPreferences();
      }

      const [rewardsRes, vouchersRes] = await Promise.all([
        rewardService.getRewards(),
        rewardService.getMyVouchers()
      ]);

      if (rewardsRes.success && rewardsRes.data) {
        setRewards(rewardsRes.data);
      } else if (rewardsRes.message) {
        setErrorMessage(rewardsRes.message);
      }

      if (vouchersRes.success && vouchersRes.data) {
        setVouchers(vouchersRes.data);
      }
    } catch (err) {
      console.error('Erro ao buscar dados da loja:', err);
      setErrorMessage('Ocorreu um erro ao carregar as informações da loja.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(true);
  };

  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;

    const userCoins = user?.coins || 0;
    if (userCoins < selectedReward.costInCoins) {
      alert('Moedas insuficientes para resgatar esta recompensa.');
      setSelectedReward(null);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await rewardService.redeemReward(selectedReward.id);

      if (response.success && response.data) {
        const newVoucher = response.data;
        
        setSelectedReward(null);
        setRecentVoucher(newVoucher);

        await updateUserPreferences();
        fetchData(true);
      } else {
        alert(response.message || 'Erro ao realizar o resgate da recompensa.');
      }
    } catch (err) {
      console.error('Falha ao resgatar:', err);
      alert('Erro de conexão ao tentar resgatar recompensa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeVouchers = vouchers.filter(v => v.status === 'ACTIVE');
  const inactiveVouchers = vouchers.filter(v => v.status === 'USED' || v.status === 'EXPIRED');

  return (
    <View className="flex-1 bg-background">
      
      <View
        className="flex-row justify-between items-center px-6 pb-4 border-b border-white/5 bg-background/95 z-10"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/5">
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold font-sans">Loja de Recompensas</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="px-6 pt-4">
        <LinearGradient
          colors={[colors.surfaceContainer, colors.surfaceContainerLow]}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          className="p-5 rounded-2xl border border-white/5"
        >
          <View className="flex-1 pr-4">
            <Text className="text-white text-md font-bold mb-1 font-sans">Minhas Moedas</Text>
            <Text className="text-white/60 text-xs font-sans">
              Explore a cidade, complete desafios e troque seu saldo por vouchers de parceiros locais.
            </Text>
          </View>
          <View className="flex-row items-center bg-primary/10 border border-primary/25 px-3 py-2 rounded-xl">
            <MaterialIcons name="monetization-on" size={22} color={colors.tertiary} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.tertiary }} className="text-lg font-black font-sans">
              {user?.coins || 0}
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View className="flex-row px-6 py-4 mt-2 bg-surface-container/40 border-b border-white/5">
        <TouchableOpacity
          onPress={() => setActiveTab('STORE')}
          className="flex-1 py-3 rounded-xl items-center flex-row justify-center"
          style={{ backgroundColor: activeTab === 'STORE' ? colors.primary : 'transparent' }}
        >
          <Ionicons name="storefront-outline" size={18} color={activeTab === 'STORE' ? colors.background : 'white'} />
          <Text
            className="font-bold ml-2 font-sans text-xs"
            style={{ color: activeTab === 'STORE' ? colors.background : 'white' }}
          >
            Loja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('VOUCHERS')}
          className="flex-1 py-3 rounded-xl items-center flex-row justify-center relative"
          style={{ backgroundColor: activeTab === 'VOUCHERS' ? colors.primary : 'transparent' }}
        >
          <Ionicons name="ticket-outline" size={18} color={activeTab === 'VOUCHERS' ? colors.background : 'white'} />
          <Text
            className="font-bold ml-2 font-sans text-xs"
            style={{ color: activeTab === 'VOUCHERS' ? colors.background : 'white' }}
          >
            Meus Vouchers
          </Text>
          {activeVouchers.length > 0 && (
            <View className="absolute top-1.5 right-4 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
              <Text className="text-[8px] font-bold text-white">{activeVouchers.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-white/60 mt-4 font-sans text-xs">Carregando dados da loja...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 mt-4"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {errorMessage && (
            <View className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-4">
              <Text className="text-red-300 text-xs font-medium text-center">{errorMessage}</Text>
            </View>
          )}

          {activeTab === 'STORE' ? (
            <View>
              {rewards.length === 0 ? (
                <View className="bg-surface-container/40 border border-white/5 rounded-2xl p-8 items-center mt-4">
                  <Ionicons name="basket-outline" size={40} color={colors.outlineVariant} className="mb-3" />
                  <Text className="text-white/60 text-sm font-bold text-center font-sans">Sem recompensas no momento</Text>
                  <Text className="text-white/40 text-xs text-center mt-1 font-sans">Volte mais tarde para conferir as novidades!</Text>
                </View>
              ) : (
                rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onPress={() => setSelectedReward(reward)}
                  />
                ))
              )}
            </View>
          ) : (
            <View>
              {vouchers.length === 0 ? (
                <View className="bg-surface-container/40 border border-white/5 rounded-2xl p-8 items-center mt-4">
                  <Ionicons name="ticket-outline" size={40} color={colors.outlineVariant} className="mb-3" />
                  <Text className="text-white/60 text-sm font-bold text-center font-sans">Nenhum cupom resgatado</Text>
                  <Text className="text-white/40 text-xs text-center mt-1 font-sans">Você ainda não tem cupons ativos. Vá para a aba "Loja" para trocar suas moedas!</Text>
                </View>
              ) : (
                <View>
                  {activeVouchers.length > 0 ? (
                    activeVouchers.map((voucher) => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        onPress={() => setActiveVoucherQRCode(voucher)}
                      />
                    ))
                  ) : (
                    <View className="bg-surface-container/20 border border-dashed border-white/5 rounded-2xl p-6 items-center mb-6">
                      <Text className="text-white/40 text-xs font-sans text-center">Nenhum cupom ativo no momento.</Text>
                    </View>
                  )}

                  <VoucherHistoryAccordion
                    inactiveVouchers={inactiveVouchers}
                    isExpanded={isHistoryExpanded}
                    onToggle={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      <RedeemConfirmationModal
        visible={!!selectedReward}
        reward={selectedReward}
        userCoins={user?.coins || 0}
        isSubmitting={isSubmitting}
        onClose={() => setSelectedReward(null)}
        onConfirm={handleRedeemConfirm}
      />

      <RedeemSuccessModal
        visible={!!recentVoucher}
        voucher={recentVoucher}
        onClose={() => {
          setRecentVoucher(null);
          setActiveTab('VOUCHERS');
        }}
        onShowQRCode={(voucher) => {
          setRecentVoucher(null);
          setTimeout(() => {
            setActiveVoucherQRCode(voucher);
          }, 350);
        }}
      />

      <VoucherQRCodeModal
        visible={!!activeVoucherQRCode}
        voucher={activeVoucherQRCode}
        onClose={() => setActiveVoucherQRCode(null)}
      />

    </View>
  );
}
