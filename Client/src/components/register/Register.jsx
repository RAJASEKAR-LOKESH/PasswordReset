import React, { useContext, useState } from 'react'
import { Button, TextField, Typography, Container, CircularProgress } from '@mui/material'
import AuthContext from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import http from '../../utils/http'


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await http.post('/user/adduser', { email, password });
            await login(email, password);
            navigate('/home'); 
        } catch (err) {
            console.log(err);
        }finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" align="center" gutterBottom> Register </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </TextField>
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
            </form>
        </Container>
    )
}

export default Register