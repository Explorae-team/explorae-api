import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CadastroFormData, CadastroErrorMap } from '../types/cadastro.types';
import { useAuth } from '../contexts/AuthContext';
import AuthInput from '../components/auth/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import Logo from '../components/brand/LogoWithText';
import { colors } from '../constants/colors';

// Tela de cadastro de novos aventureiros do Exploraê.

export default function CadastroScreen() {
  const router = useRouter();
  const { register } = useAuth() as any; 

  const [formData, setFormData] = useState<CadastroFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState<CadastroErrorMap>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const newErrors: CadastroErrorMap = {};

    if (!formData.fullName) newErrors.fullName = 'O nome de explorador é obrigatório';
    if (!formData.email.includes('@')) newErrors.email = 'E-mail inválido para expedição';
    if (formData.password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 dígitos';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas de expedição não coincidem';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos de aventura';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      // Envia a inscrição para a API via AuthContext
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      };
      
      const response = await register(registrationData);

      if (response.success) {
        console.log('Aventura iniciada com sucesso! Redirecionando...');
        router.replace('/login');
      } else {
        setErrors({ email: response.message || 'Erro ao realizar cadastro de aventura' });
      }
    } catch (err: any) {
      setErrors({ email: 'Falha crítica na conexão com a central de comando' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="p-6 relative"
        showsVerticalScrollIndicator={false}
      >
        
        {/* Efeito de luz laranja de fundo */}
        <View className="absolute top-[-10%] left-[-10%] w-[150%] h-[50%] bg-primary opacity-10 rounded-full blur-[120px]" />
        
        <Stack.Screen options={{ headerShown: false }} />

        <View className="bg-surface-container-high rounded-[24px] p-8 border border-white/5 z-20 mb-8 w-full max-w-[520px] self-center">
          <View className="items-center mb-8">
            <Logo size={80} />
          </View>
          <View className="mb-6 items-center">
            <Text className="text-on-surface font-black text-2xl text-center leading-7">
              Crie sua conta para começar a aventura!
            </Text>
            <Text className="text-on-surface-variant text-sm font-medium mt-3 text-center">
              Preencha os dados abaixo para o seu diário de expedição.
            </Text>
          </View>

          <View className="gap-5">
            <AuthInput
              label="Nome Completo"
              iconName="person"
              placeholder="Seu nome de explorador"
              value={formData.fullName}
              onChangeText={(text) => {
                setFormData({ ...formData, fullName: text });
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
              error={errors.fullName}
              autoCapitalize="words"
            />

            <AuthInput
              label="E-mail"
              iconName="mail"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <AuthInput
                  label="Senha"
                  iconName="lock-closed"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  error={errors.password}
                  rightIconName={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              </View>
              <View className="flex-1">
                <AuthInput
                  label="Confirmar"
                  iconName="shield-checkmark"
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  error={errors.confirmPassword}
                  rightIconName={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => {
                const nextVal = !formData.termsAccepted;
                setFormData({ ...formData, termsAccepted: nextVal });
                if (errors.termsAccepted && nextVal) {
                  setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
                }
              }}
              className="flex-row items-center gap-3 mt-2"
            >
              <View className={`w-6 h-6 border-2 rounded-lg items-center justify-center ${formData.termsAccepted ? 'bg-primary border-primary' : 'border-on-background'}`}>
                {formData.termsAccepted && <Ionicons name="checkmark" size={18} color="white" />}
              </View>
              <Text className="text-on-surface-variant text-xs flex-1">
                Aceito os <Text className="text-primary font-bold">Termos e Condições</Text> de expedição.
              </Text>
            </TouchableOpacity>
            {errors.termsAccepted && <Text className="text-error text-[10px] ml-1">{errors.termsAccepted}</Text>}

            <PrimaryButton
              onPress={handleRegister}
              loading={loading}
              title="CRIAR CONTA"
              loadingTitle="DESCOBRINDO..."
              className="mt-4"
              rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
            />
          </View>

          <View className="items-center mt-6 flex-row justify-center">
            <Text className="text-outline font-medium text-xs">
              Já tem uma conta?{' '}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-black text-xs">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Mostra um selo social com a contagem de aventureiros */}
        <View className="items-center mb-8 opacity-60">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-12 h-1 bg-tertiary rounded-full" />
            <Ionicons name="medal" size={24} color={colors.tertiary} />
            <View className="w-12 h-1 bg-on-background/20 rounded-full" />
          </View>
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-background text-center px-10">
            Junte-se a +50.000 exploradores em todo o mundo
          </Text>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}
