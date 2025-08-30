import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import MyContext from '../../Context/data/MyContext';
import Loader from '../../Components/Loader/Loader';

function Login() {
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        if (!validateEmail(userLogin.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (userLogin.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const userLoginFunction = async () => {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                userLogin.email,
                userLogin.password
            );

            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName,
                    photoURL: userCredential.user.photoURL
                }
            }));

            // Reset form
            setUserLogin({
                email: "",
                password: ""
            });

            toast.success('Login successful! Welcome back.');
            
            // Redirect to home page
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/user-not-found':
                    toast.error('No account found with this email. Please check your email or sign up.');
                    break;
                case 'auth/wrong-password':
                    toast.error('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email address format.');
                    break;
                case 'auth/user-disabled':
                    toast.error('This account has been disabled. Please contact support.');
                    break;
                case 'auth/too-many-requests':
                    toast.error('Too many failed attempts. Please try again later.');
                    break;
                case 'auth/network-request-failed':
                    toast.error('Network error. Please check your connection and try again.');
                    break;
                default:
                    toast.error('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className='login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md'>
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>
                        Login
                    </h2>
                </div>
                
                <div className="mb-3">
                    <input
                        type="email"
                        value={userLogin.email}
                        onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                        name='email'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                        placeholder='Email'
                        required
                    />
                </div>
                
                <div className="mb-5">
                    <input
                        type="password"
                        value={userLogin.password}
                        onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                        placeholder='Password'
                        required
                    />
                </div>
                
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userLoginFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md transition-colors duration-200'
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </div>
                
                <div>
                    <h2 className='text-black'>
                        Don't have an account? {' '}
                        <Link className='text-pink-500 font-bold hover:text-pink-600' to={'/signup'}>
                            Signup
                        </Link>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Login;