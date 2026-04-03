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
 * Tela de Cadastro
 * Implementação Mobile-First com validações, acessibilidade e design premium.
 */
export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRegister = () => {
    const { name, email, password, confirmPassword } = formData;
    let newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name || name.trim().length < 3) {
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

    if (!password || password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
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
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Junte-se à jornada no Exploraê!</Text>

          <View style={styles.form}>
            {/* Campo Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput 
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Seu nome"
                value={formData.name}
                onChangeText={(val) => handleInputChange('name', val)}
                accessibilityLabel="Campo de entrada de nome completo"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Campo E-mail */}
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
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput 
                style={[styles.input, errors.password ? styles.inputError : null]}
                secureTextEntry
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChangeText={(val) => handleInputChange('password', val)}
                accessibilityLabel="Campo de entrada de senha"
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Campo Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput 
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                secureTextEntry
                placeholder="Repita a senha"
                value={formData.confirmPassword}
                onChangeText={(val) => handleInputChange('confirmPassword', val)}
                accessibilityLabel="Campo de entrada para confirmar senha"
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Botão de Registro */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Botão de Cadastrar e Entrar"
            >
              <Text style={styles.buttonText}>Cadastrar e Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* Link para Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
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
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#34C759', textAlign: 'center' }, // Verde para cadastro
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
    backgroundColor: '#34C759',
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
