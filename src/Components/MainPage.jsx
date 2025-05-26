import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// CONTAINER - PRINCIPAL - Styles
const MainContainer = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  max-width: 1400px;
  margin: 0 auto;
`;

// 'HERO' - BANNER - Styles
const HeroBanner = styled.section`
  position: relative;
  margin-bottom: 4rem;
`;

const BannerImage = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const BannerText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CtaButton = styled.button`
  background: #0066cc;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0052a3;
  }
`;

// Features - EXIBIÇÃO - Styles
const FeaturesSection = styled.section`
  padding: 0 2rem 4rem;
  text-align: center;
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #222;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${FeatureCard}:hover & {
    transform: scale(1.05);
  }
`;

const FeatureContent = styled.div`
  padding: 1.5rem;
  text-align: left;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #0066cc;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.5;
`;

// CTA - CORPORAÇÃO - Styles
const CorporateCta = styled.section`
  background: #f8f9fa;
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #222;
`;

const CtaText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CtaButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryCta = styled.button`
  background: #0066cc;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0052a3;
  }
`;

const SecondaryCta = styled.button`
  background: white;
  color: #0066cc;
  border: 1px solid #0066cc;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f0f7ff;
  }
`;

// Novos componentes para as seções de API
const SuccessCasesSection = styled.section`
  background: #f0f7ff;
  padding: 4rem 2rem;
  text-align: center;
`;

const ClientsSection = styled.section`
  padding: 4rem 2rem;
  background: white;
  text-align: center;
`;

const StatsSection = styled.section`
  background: #0066cc;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  align-items: center;
  margin-top: 3rem;
`;

const ClientLogo = styled.img`
  max-width: 150px;
  max-height: 80px;
  width: auto;
  height: auto;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
  }
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const CaseCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CaseContent = styled.div`
  padding: 1.5rem;
  text-align: left;
`;

const CaseTitle = styled.h3`
  color: #0066cc;
  margin-bottom: 0.8rem;
`;

const CaseDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const CaseIndustry = styled.span`
  display: inline-block;
  background: #f0f7ff;
  color: #0066cc;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
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
          results: "50% mais rápido na análise",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
      ]);
    }, 800);
  });
};

const fetchClients = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: "Empresa A", 
          logo: "https://via.placeholder.com/150x80?text=Empresa+A" 
        },
        { 
          id: 2, 
          name: "Empresa B", 
          logo: "https://via.placeholder.com/150x80?text=Empresa+B" 
        },
        { 
          id: 3, 
          name: "Empresa C", 
          logo: "https://via.placeholder.com/150x80?text=Empresa+C" 
        },
        { 
          id: 4, 
          name: "Empresa D", 
          logo: "https://via.placeholder.com/150x80?text=Empresa+D" 
        },
        { 
          id: 5, 
          name: "Empresa E", 
          logo: "https://via.placeholder.com/150x80?text=Empresa+E" 
        }
      ]);
    }, 600);
  });
};

const fetchStats = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, value: "150+", label: "Clientes Satisfeitos" },
        { id: 2, value: "95%", label: "Taxa de Retenção" },
        { id: 3, value: "40+", label: "Prêmios Industriais" },
        { id: 4, value: "500M", label: "Em Economia Gerada" }
      ]);
    }, 500);
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
    <MainContainer>
      {/* Seção Banner */}
      <HeroBanner>
        <BannerImage>
          <BannerImg 
            src="../../src/assets/banner.jpg"
            alt="Enterprise Solutions"
          />
          <BannerOverlay>
            <BannerContent>
              <BannerTitle>Impulsionando a transformação de negócios</BannerTitle>
              <BannerText>
                Capacitamos empresas com soluções inovadoras que proporcionam
                resultados mensuráveis e vantagem competitiva sustentável.
              </BannerText>
              <CtaButton>Descubra mais</CtaButton>
            </BannerContent>
          </BannerOverlay>
        </BannerImage>
      </HeroBanner>

      {/* Seção de Estatísticas */}
      <StatsSection>
        <SectionHeader>
          <SectionTitle>Nossos Números</SectionTitle>
          <SectionSubtitle style={{ color: 'rgba(255,255,255,0.8)' }}>
            Resultados mensuráveis que fazem a diferença
          </SectionSubtitle>
        </SectionHeader>
        
        {loading.stats ? (
          <p>Carregando estatísticas...</p>
        ) : (
          <StatsGrid>
            {stats.map(stat => (
              <StatItem key={stat.id}>
                <StatNumber>{stat.value}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsGrid>
        )}
      </StatsSection>

      {/* Seção de Cases de Sucesso */}
      <SuccessCasesSection>
        <SectionHeader>
          <SectionTitle style={{ color: '#0066cc' }}>Cases de Sucesso</SectionTitle>
          <SectionSubtitle>
            Histórias reais de transformação empresarial
          </SectionSubtitle>
        </SectionHeader>
        
        {loading.cases ? (
          <p>Carregando cases...</p>
        ) : (
          <CasesGrid>
            {cases.map(caseItem => (
              <CaseCard key={caseItem.id}>
                <FeatureImageContainer>
                  <FeatureImage 
                    src={caseItem.imageUrl} 
                    alt={caseItem.title}
                  />
                </FeatureImageContainer>
                <CaseContent>
                  <CaseTitle>{caseItem.title}</CaseTitle>
                  <CaseDescription>{caseItem.description}</CaseDescription>
                  <div>
                    <CaseIndustry>{caseItem.industry}</CaseIndustry>
                    <span style={{ color: '#0066cc', fontSize: '0.9rem' }}>{caseItem.results}</span>
                  </div>
                </CaseContent>
              </CaseCard>
            ))}
          </CasesGrid>
        )}
      </SuccessCasesSection>

      {/* Seção de Clientes */}
      <ClientsSection>
        <SectionHeader>
          <SectionTitle>Nossos Parceiros</SectionTitle>
          <SectionSubtitle>
            Empresas que confiam em nossas soluções
          </SectionSubtitle>
        </SectionHeader>
        
        {loading.clients ? (
          <p>Carregando clientes...</p>
        ) : (
          <ClientsGrid>
            {clients.map(client => (
              <ClientLogo 
                key={client.id}
                src={client.logo}
                alt={client.name}
                title={client.name}
              />
            ))}
          </ClientsGrid>
        )}
      </ClientsSection>

      {/* Grid de Features */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>Nossas Capacidades Empresariais</SectionTitle>
          <SectionSubtitle>
            Oferecendo excelência em todos os aspectos das suas operações comerciais
          </SectionSubtitle>
        </SectionHeader>
        
        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.id}>
              <FeatureImageContainer>
                <FeatureImage 
                  src={feature.imageUrl} 
                  alt={feature.altText}
                />
              </FeatureImageContainer>
              <FeatureContent>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureContent>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA corporativa */}
      <CorporateCta>
        <CtaContent>
          <CtaTitle>Pronto para Impulsionar seu Negócio?</CtaTitle>
          <CtaText>
            Nossa equipe de especialistas está pronta para ajudar você a superar os desafios
            da transformação digital e atingir seus objetivos estratégicos.
          </CtaText>
          <CtaButtons>
            <PrimaryCta>Contate-nos</PrimaryCta>
            <SecondaryCta>Descubra mais</SecondaryCta>
          </CtaButtons>
        </CtaContent>
      </CorporateCta>
    </MainContainer>
  );
};

export default MainPage;