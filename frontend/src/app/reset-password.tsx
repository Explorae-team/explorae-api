import React, { useState, useEffect } from 'react';
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
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/auth/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import { supabase } from '../services/supabase';
import api from '../services/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Busca o email do usuário a partir da sessão do Supabase (iniciada pelo link de recuperação)
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setEmail(user.email);
        } else {
          // Se não houver usuário autenticado via fluxo de recuperação, exibe erro
          setError('Link de recuperação expirado ou inválido. Por favor, solicite um novo link.');
        }
      } catch (err) {
        setError('Erro ao validar sessão de recuperação.');
      }
    };
    checkSession();
  }, []);

  const validate = () => {
    if (!password) {
      setError('A nova senha é obrigatória');
      return false;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    setError(null);
    return true;
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
        setError(updateError.message);
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
      setError('Erro ao redefinir a senha. Tente novamente mais tarde.');
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

          {!isSuccess ? (
            <>
              <View className="mb-8">
                <Text className="text-[#003646] font-bold text-2xl mb-1">
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
                    if (error) setError(null);
                  }}
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
                    if (error) setError(null);
                  }}
                  error={error || undefined}
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
                <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              </View>
              <Text className="text-[#003646] font-bold text-2xl mb-2 text-center">
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
