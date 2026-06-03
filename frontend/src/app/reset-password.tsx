import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/auth/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import Logo from '../components/brand/Logo';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { colors } from '../constants/colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const code = params.code as string;
  const exchangeAttempted = useRef(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const processRecovery = async () => {
      // Evita execução duplicada em React Strict Mode (especialmente em ambiente de desenvolvimento Web)
      if (exchangeAttempted.current) return;
      exchangeAttempted.current = true;

      setLoading(true);
      try {
        // Se houver um code na URL (fluxo PKCE), realiza a troca pelo token de sessão
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setErrors({ general: 'Link de recuperação expirado ou inválido. Solicite um novo link.' });
            setLoading(false);
            return;
          }
        }

        // Busca o usuário autenticado na sessão de recuperação
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setEmail(user.email);
          setErrors({});
        } else {
          setErrors({ general: 'Sessão de recuperação inválida ou expirada. Solicite um novo link.' });
        }
      } catch (err) {
        setErrors({ general: 'Erro ao validar a sessão de recuperação.' });
      } finally {
        setLoading(false);
      }
    };

    processRecovery();
  }, [code]);

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!password) {
      newErrors.password = 'A nova senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validate() || !email) return;

    setLoading(true);
    try {
      // 1. Atualiza a senha no Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setErrors({ general: updateError.message });
        setLoading(false);
        return;
      }

      // 2. Atualiza a senha no backend principal (Spring Boot / public.users)
      try {
        await api.post('/api/v1/auth/reset-password', {
          email: email,
          password: password
        });
      } catch (apiError) {
        console.error('Erro ao sincronizar senha no backend principal:', apiError);
      }

      // 3. Efetua logout da sessão do Supabase temporária do fluxo de recuperação
      await supabase.auth.signOut();
      
      setIsSuccess(true);
    } catch (err) {
      setErrors({ general: 'Erro ao redefinir a senha. Tente novamente mais tarde.' });
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

        <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[440px] self-center border border-white/20">
          <View className="items-center mb-8">
            <Logo width={80} height={80} />
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
                <Text className="text-explora-blue font-bold text-2xl mb-1">
                  Nova Senha
                </Text>
                <Text className="text-slate-500 text-sm leading-5">
                  {email ? `Redefinindo a senha para ${email}` : 'Digite e confirme sua nova senha.'}
                </Text>
              </View>

              <View className="space-y-6">
                <AuthInput
                  label="Nova Senha"
                  iconName="lock-closed-outline"
                  placeholder="********"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password || errors.general) setErrors({});
                  }}
                  error={errors.password}
                  autoCapitalize="none"
                />

                <AuthInput
                  label="Confirmar Nova Senha"
                  iconName="lock-closed-outline"
                  placeholder="********"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword || errors.general) setErrors({});
                  }}
                  error={errors.confirmPassword}
                  autoCapitalize="none"
                />

                <PrimaryButton
                  onPress={handleUpdatePassword}
                  loading={loading}
                  title="REDEFINIR SENHA"
                  loadingTitle="REDEFININDO..."
                  className="mt-4"
                  disabled={!email}
                />
              </View>
            </>
          ) : (
            <View className="items-center py-4">
              <View className="bg-green-100 p-4 rounded-full mb-6">
                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              </View>
              <Text className="text-explora-blue font-bold text-2xl mb-2 text-center">
                Senha Redefinida!
              </Text>
              <Text className="text-slate-500 text-sm text-center mb-8 leading-5">
                Sua senha foi atualizada com sucesso. Agora você pode entrar com suas novas credenciais.
              </Text>
              
              <PrimaryButton
                onPress={() => router.replace('/login')}
                title="IR PARA O LOGIN"
                className="w-full"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
