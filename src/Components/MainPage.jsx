import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
  FiTarget,
  FiArrowRight,
  FiPlay,
  FiCheck,
  FiStar,
  FiGlobe
} from 'react-icons/fi';
// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageContainer = styled.div`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: ${float} 6s ease-in-out infinite;
  }
  
  @media (min-width: 768px) {
    padding: 4rem 3rem;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  animation: ${slideInLeft} 0.8s ease-out 0.2s both;
  
  @media (min-width: 768px) {
    font-size: 3.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  line-height: 1.6;
  animation: ${slideInRight} 0.8s ease-out 0.4s both;
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
`;

const PrimaryButton = styled.button`
  background: white;
  color: #6c5ce7;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StatsSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  background: #f8f9ff;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.15);
    border-color: #6c5ce7;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #6c5ce7;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f5;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #6c5ce7;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const CasesSection = styled.section`
  background: #f8f9ff;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  margin-bottom: 3rem;
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CaseCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CaseTitle = styled.h4`
  font-size: 1.2rem;
  color: #2d3436;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const CaseDescription = styled.p`
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const CaseIndustry = styled.span`
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const CaseResult = styled.span`
  color: #6c5ce7;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ClientsSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f5;
  text-align: center;
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  align-items: center;
  margin-top: 2rem;
`;

const ClientLogo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9ff;
    border-color: #6c5ce7;
    color: #6c5ce7;
    transform: translateY(-2px);
  }
`;

const CtaSection = styled.section`
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%);
    animation: ${float} 8s ease-in-out infinite reverse;
  }
`;

const CtaContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 2.3rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

// Simulações de API
const fetchSuccessCases = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Transformação Digital em Varejo",
          description: "Ajudamos uma grande rede varejista a implementar soluções digitais que aumentaram as vendas online em 240% em 6 meses.",
          industry: "Varejo",
          results: "240% aumento nas vendas online",
          imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 2,
          title: "Otimização de Processos Industriais",
          description: "Consultoria para otimização de cadeia de suprimentos que reduziu custos operacionais em 35% para empresa de manufatura.",
          industry: "Manufatura",
          results: "35% redução de custos",
          imageUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 3,
          title: "Plataforma de Dados Financeiros",
          description: "Desenvolvimento de plataforma de análise de dados para instituição financeira, melhorando a tomada de decisões estratégicas.",
          industry: "Finanças",
        }
      ]);
    }, 1000);
  });
};

const fetchClients = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        'https://via.placeholder.com/150x80?text=Cliente+1',
        'https://via.placeholder.com/150x80?text=Cliente+2',
        'https://via.placeholder.com/150x80?text=Cliente+3',
        'https://via.placeholder.com/150x80?text=Cliente+4',
        'https://via.placeholder.com/150x80?text=Cliente+5',
        'https://via.placeholder.com/150x80?text=Cliente+6'
      ]);
    }, 1000);
  });
};

const fetchStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, value: 150, label: "Projetos Concluídos" },
        { id: 2, value: 85, label: "Clientes Atendidos" },
        { id: 3, value: 24, label: "Especialistas" },
        { id: 4, value: 8, label: "Anos de Experiência" }
      ]);
    }, 800);
  });
};

const MainPage = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState({
    cases: true,
    clients: true,
    stats: true
  });

  const features = [
    {
      id: 1,
      title: "Soluções Inovativas",
      description: "Tecnologia de ponta feita para suas necessidades",
      imageUrl: "../../src/assets/inovação.jpg",
      altText: "Nossas Soluções Inovativas"
    },
    {
      id: 2,
      title: "Profissionalismo",
      description: "Profissionais com décadas de experiência",
      imageUrl: "../../src/assets/profissional.jpg",
      altText: "O nosso profissionalismo"
    },
    {
      id: 3,
      title: "Saltos Sustentável",
      description: "Estratégias pensadas para desenvolvimento sustentável de longo prazo",
      imageUrl: "../../src/assets/crescimento.jpg",
      altText: "Crescimento Sustentável"
    },
    {
      id: 4,
      title: "Foco no Cliente",
      description: "O seu sucesso é o nosso desejo",
      imageUrl: "../../src/assets/cliente.jpg",
      altText: "Foco no Cliente"
    }
  ];

  useEffect(() => {
    // Carregar cases de sucesso
    fetchSuccessCases().then(data => {
      setCases(data);
      setLoading(prev => ({ ...prev, cases: false }));
    });

    // Carregar clientes
    fetchClients().then(data => {
      setClients(data);
      setLoading(prev => ({ ...prev, clients: false }));
    });

    // Carregar estatísticas
    fetchStats().then(data => {
      setStats(data);
      setLoading(prev => ({ ...prev, stats: false }));
    });
  }, []);

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Impulsionando a Inovação Industrial</HeroTitle>
          <HeroSubtitle>
            Transformamos empresas com soluções tecnológicas inovadoras que geram 
            resultados mensuráveis e vantagem competitiva sustentável no mercado.
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton>
              <FiArrowRight size={18} />
              Começar Agora
            </PrimaryButton>
            <SecondaryButton>
              <FiPlay size={16} />
              Ver Demonstração
            </SecondaryButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Seção de Estatísticas */}
      <StatsSection>
        <SectionTitle>Nossos Resultados</SectionTitle>
        <SectionSubtitle>
          Números que comprovam nossa excelência e compromisso com o sucesso dos nossos clientes
        </SectionSubtitle>
        
        {loading.stats ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Carregando estatísticas...
          </div>
        ) : (
          <StatsGrid>
            {stats.map(stat => (
              <StatCard key={stat.id}>
                <StatNumber>{stat.value}+</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        )}
      </StatsSection>

      {/* Seção de Features */}
      <FeaturesSection>
        <SectionTitle>Nossas Especialidades</SectionTitle>
        <SectionSubtitle>
          Oferecemos soluções completas para impulsionar o crescimento e a eficiência da sua empresa
        </SectionSubtitle>
        
        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.id}>
              <FeatureIcon>
                {feature.id === 1 && <FiTrendingUp />}
                {feature.id === 2 && <FiUsers />}
                {feature.id === 3 && <FiAward />}
                {feature.id === 4 && <FiTarget />}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Seção de Cases de Sucesso */}
      <CasesSection>
        <SectionTitle>Cases de Sucesso</SectionTitle>
        <SectionSubtitle>
          Histórias reais de transformação e crescimento dos nossos parceiros
        </SectionSubtitle>
        
        {loading.cases ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Carregando cases de sucesso...
          </div>
        ) : (
          <CasesGrid>
            {cases.map(caseItem => (
              <CaseCard key={caseItem.id}>
                <CaseTitle>{caseItem.title}</CaseTitle>
                <CaseDescription>{caseItem.description}</CaseDescription>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <CaseIndustry>{caseItem.industry}</CaseIndustry>
                  {caseItem.results && <CaseResult>{caseItem.results}</CaseResult>}
                </div>
              </CaseCard>
            ))}
          </CasesGrid>
        )}
      </CasesSection>

      {/* Seção de Clientes */}
      <ClientsSection>
        <SectionTitle>Nossos Parceiros</SectionTitle>
        <SectionSubtitle>
          Empresas que confiam em nossas soluções para alcançar seus objetivos
        </SectionSubtitle>
        
        {loading.clients ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Carregando parceiros...
          </div>
        ) : (
          <ClientsGrid>
            {clients.map((client, index) => (
              <ClientLogo key={index}>
                Cliente {index + 1}
              </ClientLogo>
            ))}
          </ClientsGrid>
        )}
      </ClientsSection>

      {/* CTA Final */}
      <CtaSection>
        <CtaContent>
          <CtaTitle>Pronto para Transformar seu Negócio?</CtaTitle>
          <CtaText>
            Nossa equipe de especialistas está preparada para ajudar você a superar 
            os desafios da transformação digital e alcançar resultados extraordinários.
          </CtaText>
          <CtaButtons>
            <PrimaryButton>
              <FiArrowRight size={18} />
              Fale Conosco
            </PrimaryButton>
            <SecondaryButton>
              <FiGlobe size={16} />
              Saiba Mais
            </SecondaryButton>
          </CtaButtons>
        </CtaContent>
      </CtaSection>
    </PageContainer>
  );
};

export default MainPage;