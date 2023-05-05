import React, { useCallback, useEffect, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow
} from '@coreui/react';
import { useDispatch, useSelector } from "react-redux";
import MiniSpinner from "../../components/spinners/MiniSpinner";
import { login } from "../../redux/actions/authActions";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuth, isLoginLoading, error } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Use useEffect to navigate when authenticated
    useEffect(() => {
        if (isAuth) {
        navigate('/mainscheduling'); // Redirect to the Kanban page
        }
    }, [isAuth, navigate]);

    const onLogin = useCallback(() => {
        dispatch(login(email, password));
    }, [dispatch, email, password]);

    return (
        <div className="c-app c-default-layout d-flex align-items-center justify-content-center vh-100">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="8">
                        <CCardGroup>
                        <CCard className="p-4">
                            <CCardBody>
                            <CForm>
                                <h1>Login</h1>
                                <p className="text-muted">Sign In to your account</p>
                                <CInputGroup className="mb-3">
                                <CInputGroupText />
                                <CFormInput
                                    type="text"
                                    placeholder="Username"
                                    autoComplete="username"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                </CInputGroup>
                                <CInputGroup className="mb-4">
                                <CInputGroupText />
                                <CFormInput
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                </CInputGroup>
                                <CRow>
                                <CCol xs="6">
                                    <CButton color="primary" className="px-4" onClick={onLogin}>
                                    {isLoginLoading ? <MiniSpinner /> : 'Login'}
                                    </CButton>
                                </CCol>
                                <CCol xs="6" className="text-right">
                                    <CButton color="link" className="px-0">Forgot password?</CButton>
                                </CCol>
                                <CCol md={12} className="text-danger mt-3">
                                    {error}
                                </CCol>
                                </CRow>
                            </CForm>
                            </CCardBody>
                        </CCard>
                        <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                            <CCardBody className="text-center">
                            <div>
                                <h2>Crew Control System</h2>
                                {/* Description or additional UI */}
                            </div>
                            </CCardBody>
                        </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
}

export default LoginPage;
