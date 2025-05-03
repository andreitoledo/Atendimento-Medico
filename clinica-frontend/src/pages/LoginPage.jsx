import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('marcos@clinica.com');
  const [senha, setSenha] = useState('123456');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:44327/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) throw new Error('Falha no login');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>

        {erro && <Alert severity="error">{erro}</Alert>}

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Entrar
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
