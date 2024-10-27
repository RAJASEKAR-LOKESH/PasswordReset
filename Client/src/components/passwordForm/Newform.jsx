import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, Typography, Container,CircularProgress } from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import http from '../../utils/http';

function Newform() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res=await http.post('/user/update-password', { email, token, password: newPassword });
            if (res.status === 200) {
                navigate('/successpage');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid or expired token.");
            } else {
                setError("Failed to reset password.");
            }
            console.log(err);
        }finally {
            setLoading(false); 
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" align="center" sx={{pt:3}} gutterBottom>Reset Password</Typography>
            <form onSubmit={handleSubmit}> 
                <TextField
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    type="password"
                    value={newPassword}
                    error={!!error}
                    helperText={error} 
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
            </form>
        </Container>
    );
}

export default Newform;
