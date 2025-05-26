import React, { useState, useEffect } from 'react';
import {
  MainContainer,
  HeroBanner,
  BannerImage,
  BannerImg,
  BannerOverlay,
  BannerContent,
  BannerTitle,
  BannerText,
  CtaButton,
  FeaturesSection,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureImageContainer,
  FeatureImage,
  FeatureContent,
  FeatureTitle,
  FeatureDescription,
  CorporateCta,
  CtaContent,
  CtaTitle,
  CtaText,
  CtaButtons,
  PrimaryCta,
  SecondaryCta,
  SuccessCasesSection,
  ClientsSection,
  StatsSection,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel,
  ClientsGrid,
  ClientLogo,
  CasesGrid,
  CaseCard,
  CaseContent,
  CaseTitle,
  CaseDescription,
  CaseIndustry
} from '../Styles/StyledMainPage';



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