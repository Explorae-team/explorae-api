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

/**
 * Tela de Cadastro do Exploraê - Design 'Modern Navigator'
 * Implementado com Tailwind CSS (NativeWind v4)
 */

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

      // Enviando dados reais para o Spring Boot via AuthContext
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      };

      // Removido log inseguro de dados de expedição
      
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
      className="flex-1 bg-[#003646]"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="p-6 relative"
        showsVerticalScrollIndicator={false}
      >
        
        {/* Elementos Atmosféricos (Gradients) */}
        <View className="absolute top-[-10%] left-[-10%] w-[150%] h-[50%] bg-[#fd6c28] opacity-10 rounded-full blur-[120px]" />
        
        <Stack.Screen options={{ headerShown: false }} />

        {/* Main Card */}
        <View className="bg-white rounded-[24px] p-8 shadow-2xl z-20 mb-8 border border-white/20 w-full max-w-[520px] self-center">
          <View className="items-center mb-6">
            <Image 
              source={require("../../assets/branding/logo-main.png")} 
              style={{ width: 180, height: 60 }}
              resizeMode="contain"
            />
          </View>
          <View className="mb-6 items-center">
            <Text className="text-[#003646] font-black text-2xl text-center leading-7">
              Crie sua conta para começar a aventura!
            </Text>
            <Text className="text-[#8b9296] text-sm font-medium mt-3 text-center">
              Preencha os dados abaixo para o seu diário de expedição.
            </Text>
          </View>

          <View className="gap-5">
            <AuthInput
              label="Nome Completo"
              iconName="person"
              placeholder="Seu nome de explorador"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              error={errors.fullName}
              autoCapitalize="words"
            />

            <AuthInput
              label="E-mail"
              iconName="mail"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
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
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  error={errors.confirmPassword}
                  rightIconName={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>
            </View>

            {/* Termos de Aceite */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
              className="flex-row items-center gap-3 mt-2"
            >
              <View className={`w-6 h-6 border-2 rounded-lg items-center justify-center ${formData.termsAccepted ? 'bg-[#fd6c28] border-[#fd6c28]' : 'border-[#bde9fe]'}`}>
                {formData.termsAccepted && <Ionicons name="checkmark" size={18} color="white" />}
              </View>
              <Text className="text-[#8b9296] text-xs flex-1">
                Aceito os <Text className="text-[#fd6c28] font-bold">Termos e Condições</Text> de expedição.
              </Text>
            </TouchableOpacity>
            {errors.termsAccepted && <Text className="text-red-500 text-[10px] ml-1">{errors.termsAccepted}</Text>}

            <PrimaryButton
              onPress={handleRegister}
              loading={loading}
              title="CRIAR CONTA"
              loadingTitle="DESCOBRINDO..."
              className="mt-4"
              rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
            />
          </View>

          {/* Footer Card */}
          <View className="items-center mt-6 flex-row justify-center">
            <Text className="text-[#8b9296] font-medium text-xs">
              Já tem uma conta?{' '}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-[#fd6c28] font-black text-xs">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer Gamification */}
        <View className="items-center mb-8 opacity-60">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-12 h-1 bg-[#ffba26] rounded-full" />
            <Ionicons name="medal" size={24} color="#ffba26" />
            <View className="w-12 h-1 bg-[#bde9fe]/20 rounded-full" />
          </View>
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bde9fe] text-center px-10">
            Junte-se a +50.000 exploradores em todo o mundo
          </Text>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}
