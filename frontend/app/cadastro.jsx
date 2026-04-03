import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

/**
 * Tela de Cadastro - Task [SDGEU-19]
 * Integrada com backend real para criação de novas contas.
 */
export default function Register() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;
    let newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name || name.trim().length * 1 < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato de e-mail inválido';
      isValid = false;
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres (requisito backend)';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas devem ser iguais';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // 1. Registrar o usuário
    const regResult = await register({ name, email, password });
    
    if (regResult.success) {
      // 2. Fazer login automático após registro bem-sucedido
      const loginResult = await login(email, password);
      setLoading(false);
      
      if (loginResult.success) {
        router.replace('/dashboard');
      } else {
        Alert.alert('Sucesso', 'Cadastro realizado, mas falha no login automático. Por favor, tente entrar manualmente.');
        router.replace('/login');
      }
    } else {
      setLoading(false);
      Alert.alert('Erro no Cadastro', regResult.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Junte-se à jornada no Exploraê!</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput 
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Como quer ser chamado?"
                value={formData.name}
                onChangeText={(val) => handleInputChange('name', val)}
                accessibilityLabel="Seu nome"
                editable={!loading}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={[styles.input, errors.email ? styles.inputError : null]}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChangeText={(val) => handleInputChange('email', val)}
                accessibilityLabel="Seu e-mail"
                editable={!loading}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput 
                style={[styles.input, errors.password ? styles.inputError : null]}
                secureTextEntry
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChangeText={(val) => handleInputChange('password', val)}
                accessibilityLabel="Crie uma senha forte"
                editable={!loading}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput 
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                secureTextEntry
                placeholder="Repita a mesma senha"
                value={formData.confirmPassword}
                onChangeText={(val) => handleInputChange('confirmPassword', val)}
                accessibilityLabel="Confirme sua senha"
                editable={!loading}
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Começar Aventura</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.link}> Faça login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#34C759', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6C757D', textAlign: 'center', marginBottom: 28, fontWeight: '500' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: '#495057', marginLeft: 4 },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#F8F9FA',
  },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 11, fontWeight: '600', marginLeft: 4 },
  button: {
    backgroundColor: '#34C759',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: { backgroundColor: '#A9E2B8' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#6C757D', fontSize: 14 },
  link: { color: '#007AFF', fontSize: 14, fontWeight: '800' },
});
