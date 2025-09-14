// Função para validar e formatar texto genérico (preserva espaços e caracteres comuns em nomes)
export const sanitizeText = (value = '') => {
  if (typeof value !== 'string') return '';
  // Remove caracteres não permitidos, mas mantém espaços, letras, números e caracteres comuns
  return value
    .replace(/[^\w\sàáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÇÑ'".,-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Valida texto contendo apenas letras, espaços e acentos
export const validateTextOnly = (value) => {
  return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
};

// Valida e formata números (remove qualquer caractere não numérico)
export const formatNumbersOnly = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

// Valida e formata telefone
export const formatPhone = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  
  // Formato: (XX) XXXX-XXXX para telefone fixo ou (XX) 9XXXX-XXXX para celular
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d{0,4})(\d{0,4})/, '($1) $2$3')
      .replace(/(\d{4})(\d{1,4})/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  } else {
    return numbers
      .replace(/(\d{2})(\d{1})(\d{0,4})(\d{0,4})/, '($1) $2$3-$4')
      .replace(/(\-\d{4})\d+?$/, '$1');
  }
};

// Valida telefone (10 ou 11 dígitos, incluindo DDD)
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Validação de e-mail
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validação de CNPJ
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  // Remove todos os caracteres não numéricos
  const cleanCnpj = cnpj.replace(/[^\d]/g, '');
  
  // Verifica o tamanho
  if (cleanCnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleanCnpj)) return false;
  
  // Validação dos dígitos verificadores
  let size = cleanCnpj.length - 2;
  let numbers = cleanCnpj.substring(0, size);
  const digits = cleanCnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  // Cálculo do primeiro dígito verificador
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;
  
  // Cálculo do segundo dígito verificador
  size = size + 1;
  numbers = cleanCnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
};

// Validação de CEP
export const validateCEP = (cep) => {
  return /^\d{5}-?\d{3}$/.test(cep);
};

// Valida número de endereço (apenas números e caracteres comuns como /, -)
export const validateNumber = (number) => {
  if (!number) return true; // Número é opcional
  return /^[0-9\/\-\s]+$/.test(number);
};

// Validação de nome (muito permissiva para nomes de empresas)
export const validateName = (name) => {
  if (!name) return true; // Allow empty strings (handled by required validation)
  // Permite basicamente qualquer caractere, exceto aqueles que podem causar problemas
  return !/[<>{}[\]~`]/.test(name); // Apena bloqueia caracteres que poderiam causar problemas de segurança
};

// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove todos os caracteres não numéricos
  const cleanCpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica o tamanho
  if (cleanCpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cleanCpf)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;
  
  // Cálculo do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;
  
  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;
  
  return true;
};

// Validação de data de nascimento
export const validateBirthDate = (date) => {
  if (!date) return true; // Campo opcional
  
  const birthDate = new Date(date);
  const today = new Date();
  const minAge = 16; // Idade mínima
  const maxAge = 120; // Idade máxima razoável
  
  // Verifica se a data é válida
  if (isNaN(birthDate.getTime())) return false;
  
  // Verifica se o ano está dentro de um range razoável
  const year = birthDate.getFullYear();
  if (year < 1900 || year > 2030) return false;
  
  // Verifica se não é uma data futura
  if (birthDate > today) return false;
  
  // Calcula a idade
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }
  
  // Verifica se a idade está dentro do range aceitável
  return actualAge >= minAge && actualAge <= maxAge;
};

// Validação de senha
export const validatePassword = (password, isRequired = true) => {
  if (!isRequired && !password) return true;
  if (isRequired && !password) return false;
  
  // Mínimo 6 caracteres, pelo menos uma letra e um número
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasMinLength && hasLetter && hasNumber;
};

// Validação de campos obrigatórios
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};
