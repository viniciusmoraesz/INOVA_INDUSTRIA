import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FiBarChart2, FiUsers, FiBriefcase, FiHome, FiFilter } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import empresaApi from '../services/empresaApiService';
import projetoApi from '../services/projetoApiService';
import { clienteApiService } from '../services/clienteApiService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #1976d2;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const KPIs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(33,150,243,0.07);
  padding: 2rem 2.5rem;
  min-width: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.7rem;
`;

const CardTitle = styled.div`
  font-size: 1.1rem;
  color: #90caf9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 2.1rem;
  color: #1976d2;
  font-weight: 700;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #90caf9;
  font-size: 1rem;
  background: #f5f7fa;
  color: #1976d2;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const ChartPlaceholder = styled.div`
  background: linear-gradient(135deg, #e3f2fd 60%, #90caf9 100%);
  border-radius: 16px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  font-size: 1.3rem;
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

export default function Dashboard() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    empresas: 0,
    projetos: 0,
    clientes: 0,
    projetosConcluidos: 0,
    projetosAndamento: 0,
    projetosPlanejamento: 0,
    projetosPorStatus: [],
    projetosPorEmpresa: [],
    crescimentoProjetos: [],
    crescimentoClientes: [],
    projetosRaw: [],
    clientesRaw: [],
    empresasRaw: [],
  });
  const [filtroAno, setFiltroAno] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      navigate('/');
      return;
    }
    async function fetchMetrics() {
      try {
        const [empresas, projetos, clientes] = await Promise.all([
          empresaApi.listarEmpresas(),
          projetoApi.listarProjetos(),
          clienteApiService.listarClientes()
        ]);
        // Agrupamento por status de projetos
        const statusCounts = ['CONCLUIDO','EM_ANDAMENTO','PLANEJAMENTO','PAUSADO','CANCELADO'].map(status => ({
          status,
          quantidadeProjetos: projetos.filter(p => p.status === status).length
        }));

        // Agrupamento por role/cargo de clientes
        const clienteRoles = {};
        clientes.forEach(c => {
          const role = c.role || c.cargo || 'OUTRO';
          clienteRoles[role] = (clienteRoles[role] || 0) + 1;
        });
        const clienteRolesArray = Object.entries(clienteRoles).map(([role, quantidade]) => ({ role, quantidadeClientes: quantidade })).sort((a,b) => b.quantidadeClientes - a.quantidadeClientes);

        // Agrupamento por empresa
        const empresaCounts = empresas.map(e => ({
          empresa: e.nomeFantasia || e.razaoSocial,
         quantidadeProjetos: projetos.filter(p => p.idEmpresa === e.idEmpresa).length
        })).sort((a,b) => b.count - a.count).slice(0,6);

        // Crescimento de projetos por dia usando array [ano, mes, dia, ...]
        const projetosPorDia = {};
        projetos.forEach(p => {
          let arr = p.data_cadastro || p.dataCadastro || p.dataCadastroProjeto;
          let diaFormatado = null;
          if (Array.isArray(arr) && arr.length >= 3) {
            // [ano, mes, dia, ...]
            const [ano, mes, dia] = arr;
            diaFormatado = `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
          } else if (arr) {
            // Se vier como string ou Date
            let data;
            if (arr instanceof Date) {
              data = arr;
            } else if (typeof arr === "string") {
              if (arr.includes("-")) {
                data = new Date(arr);
              } else if (arr.includes("/")) {
                const [d, m, a] = arr.split("/");
                data = new Date(`${a}-${m}-${d}`);
              }
            }
            if (data && !isNaN(data)) {
              diaFormatado = data.toISOString().slice(0, 10);
            }
          }
          if (diaFormatado) {
            projetosPorDia[diaFormatado] = (projetosPorDia[diaFormatado] || 0) + 1;
          }
        });
        const crescimentoProjetos = Object.entries(projetosPorDia)
          .map(([dia, quantidade]) => ({ dia, quantidadeProjetos: quantidade }))
          .sort((a, b) => a.dia.localeCompare(b.dia));

        // Crescimento de clientes por dia usando array [ano, mes, dia, ...]
        const clientesPorDia = {};
        clientes.forEach(c => {
          let arr = c.data_cadastro || c.dataCadastro || c.dataCadastroCliente;
          let diaFormatado = null;
          if (Array.isArray(arr) && arr.length >= 3) {
            // [ano, mes, dia, ...]
            const [ano, mes, dia] = arr;
            diaFormatado = `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
          } else if (arr) {
            // Se vier como string ou Date
            let data;
            if (arr instanceof Date) {
              data = arr;
            } else if (typeof arr === "string") {
              if (arr.includes("-")) {
                data = new Date(arr);
              } else if (arr.includes("/")) {
                const [d, m, a] = arr.split("/");
                data = new Date(`${a}-${m}-${d}`);
              }
            }
            if (data && !isNaN(data)) {
              diaFormatado = data.toISOString().slice(0, 10);
            }
          }
          if (diaFormatado) {
            clientesPorDia[diaFormatado] = (clientesPorDia[diaFormatado] || 0) + 1;
          }
        });
        const crescimentoClientes = Object.entries(clientesPorDia)
          .map(([dia, quantidade]) => ({ dia, quantidadeClientes: quantidade }))
          .sort((a, b) => a.dia.localeCompare(b.dia));

        // Empresas com mais projetos (contagem correta)
        const projetosPorEmpresaMap = {};
        projetos.forEach(p => {
          const empresaId = p.idEmpresa || p.empresa?.idEmpresa || p.empresa?.id;
          if (empresaId) {
            projetosPorEmpresaMap[empresaId] = (projetosPorEmpresaMap[empresaId] || 0) + 1;
          }
        });
        const empresasMaisProjetos = empresas.map(e => ({
          empresa: e.nomeFantasia || e.razaoSocial,
          quantidadeProjetos: projetosPorEmpresaMap[e.idEmpresa || e.id] || 0
        })).sort((a,b) => b.quantidadeProjetos - a.quantidadeProjetos).slice(0,6);

        setMetrics({
          empresas: empresas.length,
          projetos: projetos.length,
          clientes: clientes.length,
          projetosConcluidos: projetos.filter(p => p.status === 'CONCLUIDO').length,
          projetosAndamento: projetos.filter(p => p.status === 'EM_ANDAMENTO').length,
          projetosPlanejamento: projetos.filter(p => p.status === 'PLANEJAMENTO').length,
          projetosPorStatus: statusCounts,
          projetosPorEmpresa: empresasMaisProjetos,
          crescimentoProjetos,
          crescimentoClientes,
          clienteRolesArray,
          projetosRaw: projetos,
          clientesRaw: clientes,
          empresasRaw: empresas,
        });
      } catch (err) {
        console.error('Erro ao buscar métricas do dashboard:', err);
      }
    }
    fetchMetrics();
  }, [user, navigate]);

  // Filtragem por ano
  const projetosFiltrados = filtroAno
    ? metrics.projetosRaw.filter(p => {
        const arr = p.data_cadastro || p.dataCadastro || p.dataCadastroProjeto;
        let ano = null;
        if (Array.isArray(arr) && arr.length >= 1) {
          ano = arr[0];
        } else if (typeof arr === 'string') {
          if (arr.includes('-')) {
            ano = Number(arr.split('-')[0]);
          } else if (arr.includes('/')) {
            ano = Number(arr.split('/')[2]);
          }
        } else if (arr instanceof Date) {
          ano = arr.getFullYear();
        }
        return ano === Number(filtroAno);
      })
    : metrics.projetosRaw;

  const clientesFiltrados = filtroAno
    ? metrics.clientesRaw.filter(c => {
        const arr = c.data_cadastro || c.dataCadastro || c.dataCadastroCliente;
        let ano = null;
        if (Array.isArray(arr) && arr.length >= 1) {
          ano = arr[0];
        } else if (typeof arr === 'string') {
          if (arr.includes('-')) {
            ano = Number(arr.split('-')[0]);
          } else if (arr.includes('/')) {
            ano = Number(arr.split('/')[2]);
          }
        } else if (arr instanceof Date) {
          ano = arr.getFullYear();
        }
        return ano === Number(filtroAno);
      })
    : metrics.clientesRaw;

  // Filtragem por ano para empresas
  const empresasFiltradas = filtroAno
    ? metrics.empresasRaw.filter(e => {
        // Verifica se a empresa tem algum projeto no ano filtrado
        return projetosFiltrados.some(p => {
          const empresaId = p.idEmpresa || p.empresa?.idEmpresa || p.empresa?.id;
          return empresaId === (e.idEmpresa || e.id);
        });
      })
    : metrics.empresasRaw;

  // Recalcula métricas e gráficos com base no filtro
  const statusCounts = ['CONCLUIDO','EM_ANDAMENTO','PLANEJAMENTO','PAUSADO','CANCELADO'].map(status => ({
    status,
    quantidadeProjetos: projetosFiltrados.filter(p => p.status === status).length
  }));

  const clienteRoles = {};
  clientesFiltrados.forEach(c => {
    const role = c.role || c.cargo || 'OUTRO';
    clienteRoles[role] = (clienteRoles[role] || 0) + 1;
  });
  const clienteRolesArray = Object.entries(clienteRoles).map(([role, quantidade]) => ({ role, quantidadeClientes: quantidade })).sort((a,b) => b.quantidadeClientes - a.quantidadeClientes);

  // Crescimento de projetos por dia
  const projetosPorDia = {};
  projetosFiltrados.forEach(p => {
    let arr = p.data_cadastro || p.dataCadastro || p.dataCadastroProjeto;
    let diaFormatado = null;
    if (Array.isArray(arr) && arr.length >= 3) {
      const [ano, mes, dia] = arr;
      diaFormatado = `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    } else if (arr) {
      let data;
      if (arr instanceof Date) {
        data = arr;
      } else if (typeof arr === "string") {
        if (arr.includes("-")) {
          data = new Date(arr);
        } else if (arr.includes("/")) {
          const [d, m, a] = arr.split("/");
          data = new Date(`${a}-${m}-${d}`);
        }
      }
      if (data && !isNaN(data)) {
        diaFormatado = data.toISOString().slice(0, 10);
      }
    }
    if (diaFormatado) {
      projetosPorDia[diaFormatado] = (projetosPorDia[diaFormatado] || 0) + 1;
    }
  });
  const crescimentoProjetos = Object.entries(projetosPorDia)
    .map(([dia, quantidade]) => ({ dia, quantidadeProjetos: quantidade }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  // Crescimento de clientes por dia
  const clientesPorDia = {};
  clientesFiltrados.forEach(c => {
    let arr = c.data_cadastro || c.dataCadastro || c.dataCadastroCliente;
    let diaFormatado = null;
    if (Array.isArray(arr) && arr.length >= 3) {
      const [ano, mes, dia] = arr;
      diaFormatado = `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    } else if (arr) {
      let data;
      if (arr instanceof Date) {
        data = arr;
      } else if (typeof arr === "string") {
        if (arr.includes("-")) {
          data = new Date(arr);
        } else if (arr.includes("/")) {
          const [d, m, a] = arr.split("/");
          data = new Date(`${a}-${m}-${d}`);
        }
      }
      if (data && !isNaN(data)) {
        diaFormatado = data.toISOString().slice(0, 10);
      }
    }
    if (diaFormatado) {
      clientesPorDia[diaFormatado] = (clientesPorDia[diaFormatado] || 0) + 1;
    }
  });
  const crescimentoClientes = Object.entries(clientesPorDia)
    .map(([dia, quantidade]) => ({ dia, quantidadeClientes: quantidade }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  // Empresas com mais projetos
  const projetosPorEmpresaMap = {};
  projetosFiltrados.forEach(p => {
    const empresaId = p.idEmpresa || p.empresa?.idEmpresa || p.empresa?.id;
    if (empresaId) {
      projetosPorEmpresaMap[empresaId] = (projetosPorEmpresaMap[empresaId] || 0) + 1;
    }
  });
  const empresasMaisProjetos = metrics.empresasRaw.map(e => ({
    empresa: e.nomeFantasia || e.razaoSocial,
    quantidadeProjetos: projetosPorEmpresaMap[e.idEmpresa || e.id] || 0
  })).sort((a,b) => b.quantidadeProjetos - a.quantidadeProjetos).slice(0,6);

  // Monta novo objeto de métricas filtradas
  const metricsFiltradas = {
    ...metrics,
    empresas: empresasFiltradas.length,
    projetos: projetosFiltrados.length,
    clientes: clientesFiltrados.length,
    projetosConcluidos: projetosFiltrados.filter(p => p.status === 'CONCLUIDO').length,
    projetosAndamento: projetosFiltrados.filter(p => p.status === 'EM_ANDAMENTO').length,
    projetosPlanejamento: projetosFiltrados.filter(p => p.status === 'PLANEJAMENTO').length,
    projetosPorStatus: statusCounts,
    clienteRolesArray,
    crescimentoProjetos,
    crescimentoClientes,
    projetosPorEmpresa: empresasMaisProjetos,
  };

  return (
    <Container>
      <Title>Dashboard Gerencial</Title>
      <Filters>
        <FiFilter size={22} color="#1976d2" />
        <FilterInput
          type="number"
          placeholder="Filtrar por ano"
          value={filtroAno}
          onChange={e => setFiltroAno(e.target.value)}
        />
        {/* Adicione mais filtros conforme necessário */}
      </Filters>
      <KPIs>
        <Card>
          <CardTitle><FiHome /> Empresas</CardTitle>
          <CardValue>{metricsFiltradas.empresas}</CardValue>
        </Card>
        <Card>
          <CardTitle><FiBriefcase /> Projetos</CardTitle>
          <CardValue>{metricsFiltradas.projetos}</CardValue>
        </Card>
        <Card>
          <CardTitle><FiUsers /> Clientes</CardTitle>
          <CardValue>{metricsFiltradas.clientes}</CardValue>
        </Card>
        <Card>
          <CardTitle><FiBarChart2 /> Concluídos</CardTitle>
          <CardValue>{metricsFiltradas.projetosConcluidos}</CardValue>
        </Card>
        <Card>
          <CardTitle><FiBarChart2 /> Em Andamento</CardTitle>
          <CardValue>{metricsFiltradas.projetosAndamento}</CardValue>
        </Card>
        <Card>
          <CardTitle><FiBarChart2 /> Planejamento</CardTitle>
          <CardValue>{metricsFiltradas.projetosPlanejamento}</CardValue>
        </Card>
      </KPIs>
      <ChartsGrid>
        <Section>
          <h2 style={{ color: '#1976d2', fontWeight: 600 }}>Projetos por Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={metricsFiltradas.projetosPorStatus}
                dataKey="quantidadeProjetos"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ status, quantidadeProjetos, percent }) => `${status}: ${quantidadeProjetos} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
                fill="#1976d2"
              >
                {metricsFiltradas.projetosPorStatus.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={['#1976d2','#90caf9','#ffb300','#e57373','#bdbdbd'][idx % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} projetos`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
        <Section>
          <h2 style={{ color: '#1976d2', fontWeight: 600 }}>Clientes por Cargo/Role</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metricsFiltradas.clienteRolesArray} margin={{top:20,right:30,left:0,bottom:5}}>
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidadeClientes" name="Clientes" fill="#ffb300" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section>
          <h2 style={{ color: '#1976d2', fontWeight: 600 }}>Crescimento de Projetos</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={metricsFiltradas.crescimentoProjetos} margin={{top:20,right:30,left:0,bottom:5}}>
              <XAxis dataKey="dia" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantidadeProjetos" name="Projetos" stroke="#1976d2" strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </Section>
        <Section>
          <h2 style={{ color: '#1976d2', fontWeight: 600 }}>Crescimento de Clientes</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={metricsFiltradas.crescimentoClientes} margin={{top:20,right:30,left:0,bottom:5}}>
              <XAxis dataKey="dia" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantidadeClientes" name="Clientes" stroke="#ffb300" strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </ChartsGrid>
      <Section>
        <h2 style={{ color: '#1976d2', fontWeight: 600 }}>Empresas com Mais Projetos</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={metricsFiltradas.projetosPorEmpresa} layout="vertical" margin={{top:20,right:30,left:0,bottom:5}}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="empresa" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidadeProjetos" name="Projetos" fill="#90caf9" radius={[0,8,8,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </Container>
  );
}
