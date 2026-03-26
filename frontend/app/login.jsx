import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

/**
 * Tela de Login - Task [S1-P2-T3] / [SDGEU-8]
 * Implementação Mobile-First com validações, acessibilidade e design premium.
 */
export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleLogin = () => {
    const { email, password } = formData;
    let newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato de e-mail inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    login();
    router.replace('/dashboard');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Exploraê</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={[styles.input, errors.email ? styles.inputError : null]}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChangeText={(val) => handleInputChange('email', val)}
                accessibilityLabel="Campo de entrada de e-mail"
                accessibilityHint="Digite o seu e-mail cadastrado"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput 
                style={[styles.input, errors.password ? styles.inputError : null]}
                secureTextEntry
                placeholder="Sua senha secreta"
                value={formData.password}
                onChangeText={(val) => handleInputChange('password', val)}
                accessibilityLabel="Campo de entrada de senha"
                accessibilityHint="Digite a sua senha de acesso"
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Botão de Entrar"
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text style={styles.link}> Cadastre-se</Text>
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
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#007AFF', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6C757D', textAlign: 'center', marginBottom: 32 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057' },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#F8F9FA',
  },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 12, fontWeight: '500' },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#6C757D', fontSize: 14 },
  link: { color: '#007AFF', fontSize: 14, fontWeight: '700' },
});
