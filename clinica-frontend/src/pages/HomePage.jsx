import React from 'react';
import Layout from '../components/Layout';
import {
  Box, Typography, Grid, Paper
} from '@mui/material';

const CardInfo = ({ title, value }) => (
  <Paper sx={{ p: 2, textAlign: 'center' }} elevation={3}>
    <Typography variant="subtitle1">{title}</Typography>
    <Typography variant="h5">{value}</Typography>
  </Paper>
);

const HomePage = () => {
  return (
    <Layout>
      <Typography variant="h4" gutterBottom>Dashboard Clínico</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><CardInfo title="Pacientes" value="256" /></Grid>
        <Grid item xs={12} md={3}><CardInfo title="Consultas Hoje" value="12" /></Grid>
        <Grid item xs={12} md={3}><CardInfo title="Pendentes" value="5" /></Grid>
        <Grid item xs={12} md={3}><CardInfo title="Faturamento" value="R$ 1.500,00" /></Grid>
      </Grid>

      
    </Layout>
  );
};

export default HomePage;
