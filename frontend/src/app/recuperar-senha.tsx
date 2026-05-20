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
import { supabase } from '../services/supabase';

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
      className="flex-1 bg-[#003646]"
    >
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40, paddingTop: 20 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Efeito Atmosférico */}
        <View className="absolute top-[-5%] left-[-10%] w-60 h-60 bg-[#fd6c28]/10 rounded-full blur-[80px]" />

        <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[440px] self-center border border-white/20">
          <View className="items-center mb-6">
            <Image
              source={require("../../assets/branding/logo-main.png")}
              style={{ width: 180, height: 60 }}
              resizeMode="contain"
            />
          </View>

          {errors.general && (
            <View className="bg-red-50 p-4 rounded-xl mb-6">
              <Text className="text-red-600 text-xs font-semibold">
                {errors.general}
              </Text>
            </View>
          )}

          {!isSuccess ? (
            <>
              <View className="mb-8">
                <Text className="text-[#003646] font-bold text-2xl mb-1">
                  Recuperar Senha
                </Text>
                <Text className="text-slate-500 text-sm leading-5">
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
              <View className="bg-green-100 p-4 rounded-full mb-6">
                <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              </View>
              <Text className="text-[#003646] font-bold text-2xl mb-2 text-center">
                Link Enviado!
              </Text>
              <Text className="text-slate-500 text-sm text-center mb-8 leading-5">
                Verifique sua caixa de entrada em <Text className="font-bold text-[#003646]">{email}</Text> e siga as instruções para redefinir sua senha.
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
            <Text className="text-[#bde9fe] font-medium text-sm">
              Lembrou a senha?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-[#FFB700] font-bold ml-1 text-sm">
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
