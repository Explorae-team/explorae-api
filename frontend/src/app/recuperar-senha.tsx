import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/auth/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import Logo from '../components/brand/Logo';
import { supabase } from '../services/supabase';
import { colors } from '../constants/colors';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const redirectToUrl = __DEV__ 
        ? 'http://localhost:8081/reset-password' 
        : 'https://explorae.site/reset-password';

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectToUrl,
      });

      if (resetError) {
        const msg = resetError.message;
        // Mapeamento de erros comuns do Supabase
        if (msg.toLowerCase().includes('user') || msg.toLowerCase().includes('email')) {
          setErrors({ email: 'E-mail não cadastrado ou inválido no sistema.' });
        } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many')) {
          setErrors({ general: 'Limite de envio excedido. Tente novamente em alguns minutos.' });
        } else {
          setErrors({ general: msg });
        }
        return;
      }
      
      setIsSuccess(true);
    } catch (err) {
      setErrors({ general: 'Erro ao enviar link. Tente novamente mais tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40, paddingTop: 20 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Efeito Atmosférico */}
        <View className="absolute top-[-5%] left-[-10%] w-60 h-60 bg-primary/10 rounded-full blur-[80px]" />

        <View className="bg-surface-container-high rounded-3xl p-8 w-full max-w-[440px] self-center border border-white/5">
          <View className="items-center mb-8">
            <Logo width={80} height={80} />
          </View>

          {errors.general && (
            <View className="bg-error/10 p-4 rounded-xl mb-6 border border-error/20">
              <Text className="text-error text-xs font-semibold">
                {errors.general}
              </Text>
            </View>
          )}

          {!isSuccess ? (
            <>
              <View className="mb-8">
                <Text className="text-on-surface font-bold text-2xl mb-1">
                  Recuperar Senha
                </Text>
                <Text className="text-on-surface-variant text-sm leading-5">
                  Não se preocupe! Informe seu e-mail abaixo e enviaremos as instruções para você criar uma nova senha.
                </Text>
              </View>

              <View className="space-y-6">
                <AuthInput
                  label="E-mail de Cadastro"
                  iconName="mail-outline"
                  placeholder="aventureiro@explorae.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email || errors.general) setErrors({});
                  }}
                  error={errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <PrimaryButton
                  onPress={handleResetPassword}
                  loading={loading}
                  title="ENVIAR LINK"
                  loadingTitle="ENVIANDO..."
                  className="mt-4"
                  rightIcon={<Ionicons name="paper-plane-outline" size={20} color="white" />}
                />
              </View>
            </>
          ) : (
            <View className="items-center py-4">
              <View className="bg-success/10 p-4 rounded-full mb-6 border border-success/20">
                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              </View>
              <Text className="text-on-surface font-bold text-2xl mb-2 text-center">
                Link Enviado!
              </Text>
              <Text className="text-on-surface-variant text-sm text-center mb-8 leading-5">
                Verifique sua caixa de entrada em <Text className="font-bold text-primary">{email}</Text> e siga as instruções para redefinir sua senha.
              </Text>
              
              <PrimaryButton
                onPress={() => router.replace('/login')}
                title="VOLTAR PARA O LOGIN"
                className="w-full"
              />
            </View>
          )}
        </View>

        {/* Footer Link */}
        {!isSuccess && (
          <View className="mt-10 flex-row justify-center">
            <Text className="text-on-background font-medium text-sm">
              Lembrou a senha?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-explora-gold font-bold ml-1 text-sm">
                  Fazer Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
