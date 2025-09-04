// Formatar CNPJ: 00.000.000/0000-00
export const formatCNPJ = (value = '') => {
  // Remove tudo que não for dígito
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 14 dígitos
  const limited = numbers.slice(0, 14);
  
  // Aplica a máscara
  return limited
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(\-\d{2})\d+?$/, '$1');
};

// Formatar Telefone: (00) 00000-0000 ou (00) 0000-0000
export const formatPhone = (value = '') => {
  // Remove tudo que não for dígito
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (com DDD e nono dígito)
  const limited = numbers.slice(0, 11);
  
  // Verifica se é celular (com 9º dígito)
  const isMobile = limited.length > 10;
  
  // Aplica a máscara
  if (isMobile) {
    return limited
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  }
  
  return limited
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\-\d{4})\d+?$/, '$1');
};

// Formatar CEP: 00000-000
export const formatCEP = (value = '') => {
  // Remove tudo que não for dígito
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  const limited = numbers.slice(0, 8);
  
  // Aplica a máscara
  return limited
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(\-\d{3})\d+?$/, '$1');
};

// Remove todos os caracteres não numéricos
export const removeMask = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

// Formata Inscrição Estadual (formato genérico: 000.000.000.000)
export const formatInscricaoEstadual = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita o tamanho máximo (normalmente 12 dígitos)
  const limited = numbers.slice(0, 12);
  
  // Aplica a máscara: 000.000.000.000
  return limited
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\.\d{3})(\d)/, '$1.$2');
};

// Formata Inscrição Municipal (formato genérico: 0.000.000-0)
export const formatInscricaoMunicipal = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita o tamanho máximo (normalmente 11 dígitos)
  const limited = numbers.slice(0, 11);
  
  // Aplica a máscara: 0.000.000-0
  return limited
    .replace(/(\d)(\d{3})/, '$1.$2')
    .replace(/(\.\d{3})(\d{3})/, '$1.$2')
    .replace(/(\.\d{3})(\d{1,2})/, '$1-$2');
};
