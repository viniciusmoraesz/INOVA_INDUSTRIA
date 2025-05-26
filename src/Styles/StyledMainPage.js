import styled from 'styled-components';

// CONTAINER - PRINCIPAL - Styles
export const MainContainer = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  max-width: 1400px;
  margin: 0 auto;
`;

// 'HERO' - BANNER - Styles
export const HeroBanner = styled.section`
  position: relative;
  margin-bottom: 4rem;
`;

export const BannerImage = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
`;

export const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BannerOverlay = styled.div`
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

export const BannerContent = styled.div`
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

export const BannerTitle = styled.h1`
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

export const BannerText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const CtaButton = styled.button`
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
export const FeaturesSection = styled.section`
  padding: 0 2rem 4rem;
  text-align: center;
`;

export const SectionHeader = styled.div`
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #222;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

export const FeaturesGrid = styled.div`
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

export const FeatureCard = styled.div`
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

export const FeatureImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
`;

export const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${FeatureCard}:hover & {
    transform: scale(1.05);
  }
`;

export const FeatureContent = styled.div`
  padding: 1.5rem;
  text-align: left;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #0066cc;
`;

export const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.5;
`;

// CTA - CORPORAÇÃO - Styles
export const CorporateCta = styled.section`
  background: #f8f9fa;
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 2rem;
`;

export const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const CtaTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #222;
`;

export const CtaText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

export const CtaButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PrimaryCta = styled.button`
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

export const SecondaryCta = styled.button`
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

// Seções de API
export const SuccessCasesSection = styled.section`
  background: #f0f7ff;
  padding: 4rem 2rem;
  text-align: center;
`;

export const ClientsSection = styled.section`
  padding: 4rem 2rem;
  background: white;
  text-align: center;
`;

export const StatsSection = styled.section`
  background: #0066cc;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

export const StatsGrid = styled.div`
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

export const StatItem = styled.div`
  padding: 1.5rem;
`;

export const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

export const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  align-items: center;
  margin-top: 3rem;
`;

export const ClientLogo = styled.img`
  max-width: 150px;
  max-height: 80px;
  margin: 0 auto;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
  }
`;

export const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

export const CaseCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const CaseContent = styled.div`
  padding: 1.5rem;
  text-align: left;
`;

export const CaseTitle = styled.h3`
  color: #0066cc;
  margin-bottom: 0.8rem;
`;

export const CaseDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

export const CaseIndustry = styled.span`
  display: inline-block;
  background: #f0f7ff;
  color: #0066cc;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;
