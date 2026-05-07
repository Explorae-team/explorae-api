import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import { LoginForm, LoginErrors } from "./login.types";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "../components/AuthInput";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen() {
  const { login } = useAuth() as any;
  const router = useRouter();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: LoginErrors = {};
    if (!formData.email) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "E-mail inválido";

    if (!formData.password) newErrors.password = "Senha é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        router.replace("/dashboard");
      } else {
        setErrors({ general: response.message || "Erro ao conectar-se" });
      }
    } catch (error) {
      setErrors({ general: "Erro inesperado. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#003646]"
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40, paddingTop: 20 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Background Elements (Representação simplificada de UI em Native) */}
        <View className="absolute top-[-5%] left-[-10%] w-60 h-60 bg-[#fd6c28]/10 rounded-full blur-[80px]" />
        
        {/* Central Card */}
        <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[440px] self-center">
          <View className="items-center mb-6">
            <Image 
              source={require("../../assets/branding/logo-main.png")} 
              style={{ width: 180, height: 60 }}
              resizeMode="contain"
            />
          </View>

          <View className="mb-8">
            <Text className="text-[#003646] font-bold text-2xl mb-1">
              Bem-vindo de volta!
            </Text>
            <Text className="text-slate-500 text-sm">
              Continue sua jornada de onde parou.
            </Text>
          </View>

          {errors.general && (
            <View className="bg-red-50 p-4 rounded-xl mb-6">
              <Text className="text-red-600 text-xs font-semibold">
                {errors.general}
              </Text>
            </View>
          )}

          <View className="space-y-6">
            <AuthInput
              label="E-mail"
              iconName="mail-outline"
              placeholder="aventureiro@explorae.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AuthInput
              label="Senha"
              iconName="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              error={errors.password}
              rightElement={
                <TouchableOpacity>
                  <Text className="text-[#fd6c28] text-[10px] font-bold">Esqueceu?</Text>
                </TouchableOpacity>
              }
            />

            <PrimaryButton 
              onPress={handleLogin} 
              loading={loading} 
              title="LOGIN" 
              loadingTitle="EXPLORANDO..." 
              className="mt-4" 
            />
          </View>
        </View>

        {/* Footer Link */}
        <View className="mt-10 flex-row justify-center">
          <Text className="text-[#bde9fe] font-medium text-sm">
            Não tem uma conta?
          </Text>
          <Link href="/cadastro" asChild>
            <TouchableOpacity>
              <Text className="text-[#FFB700] font-bold ml-1 text-sm">
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
