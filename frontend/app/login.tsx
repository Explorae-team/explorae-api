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
} from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import { LoginForm, LoginErrors } from "./login.types";
import { Ionicons } from "@expo/vector-icons";

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
        
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-[#fd6c28] rounded-3xl items-center justify-center shadow-lg -rotate-3">
            <Ionicons name="compass-outline" size={48} color="#003646" />
          </View>
          <Text className="mt-4 font-bold text-3xl tracking-widest text-[#fd6c28] uppercase">
            Exploraê
          </Text>
        </View>

        {/* Central Card */}
        <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[440px] self-center">
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
            {/* Email Field */}
            <View>
              <Text className="text-[#003646] text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">
                E-mail
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-[14px] z-10">
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                </View>
                <TextInput
                  placeholder="aventureiro@explorae.com"
                  placeholderTextColor="#94A3B8"
                  className={`bg-slate-50 pl-12 pr-4 py-4 rounded-2xl text-[#003646] font-semibold ${
                    errors.email ? "border border-red-200" : ""
                  }`}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Field */}
            <View className="mt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-[#003646] text-[10px] font-bold uppercase tracking-widest ml-1">
                  Senha
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#fd6c28] text-[10px] font-bold">Esqueceu?</Text>
                </TouchableOpacity>
              </View>
              <View className="relative">
                <View className="absolute left-4 top-[14px] z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                </View>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  className={`bg-slate-50 pl-12 pr-4 py-4 rounded-2xl text-[#003646] font-semibold ${
                    errors.password ? "border border-red-200" : ""
                  }`}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                />
              </View>
              {errors.password && (
                <Text className="text-red-500 text-[10px] mt-1 ml-1">{errors.password}</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
              className="mt-8 bg-[#F2641F] py-5 rounded-2xl shadow-xl items-center"
            >
              <Text className="text-white font-black tracking-widest uppercase text-sm">
                {loading ? "EXPLORANDO..." : "LOGIN"}
              </Text>
            </TouchableOpacity>
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
