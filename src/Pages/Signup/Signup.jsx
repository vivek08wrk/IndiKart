import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, fireDB } from '../../Firebase/FirebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import MyContext from '../../Context/data/MyContext';
import Loader from '../../Components/Loader/Loader';

function Signup() {
    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateName = (name) => {
        return name.trim().length >= 2;
    };

    const validateForm = () => {
        if (!validateName(userSignup.name)) {
            toast.error('Name must be at least 2 characters long');
            return false;
        }
        if (!validateEmail(userSignup.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (!validatePassword(userSignup.password)) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const userSignupFunction = async () => {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userSignup.email,
                userSignup.password
            );

            // Update user profile with name
            await updateProfile(userCredential.user, {
                displayName: userSignup.name
            });

            // Create user document in Firestore
            const user = {
                name: userSignup.name,
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            };

            // Save to Firestore
            await setDoc(doc(fireDB, "user", userCredential.user.uid), user);

            // Reset form
            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user"
            });

            toast.success('Account created successfully! Please sign in.');
            
            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error('This email is already registered. Please use a different email or try logging in.');
                    break;
                case 'auth/weak-password':
                    toast.error('Password is too weak. Please choose a stronger password.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email address format.');
                    break;
                case 'auth/operation-not-allowed':
                    toast.error('Email/password accounts are not enabled. Please contact support.');
                    break;
                case 'auth/network-request-failed':
                    toast.error('Network error. Please check your connection and try again.');
                    break;
                default:
                    toast.error('Failed to create account. Please try again.');
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
                        Signup
                    </h2>
                </div>
                
                <div className="mb-3">
                    <input
                        type="text"
                        value={userSignup.name}
                        onChange={(e) => setUserSignup({ ...userSignup, name: e.target.value })}
                        name='name'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                        placeholder='Full Name'
                        required
                        minLength={2}
                    />
                </div>
                
                <div className="mb-3">
                    <input
                        type="email"
                        value={userSignup.email}
                        onChange={(e) => setUserSignup({ ...userSignup, email: e.target.value })}
                        name='email'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                        placeholder='Email'
                        required
                    />
                </div>
                
                <div className="mb-5">
                    <input
                        type="password"
                        value={userSignup.password}
                        onChange={(e) => setUserSignup({ ...userSignup, password: e.target.value })}
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                        placeholder='Password (min 6 characters)'
                        required
                        minLength={6}
                    />
                </div>
                
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userSignupFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md transition-colors duration-200'
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Signup'}
                    </button>
                </div>
                
                <div>
                    <h2 className='text-black'>
                        Have an account? {' '}
                        <Link className='text-pink-500 font-bold hover:text-pink-600' to={'/login'}>
                            Login
                        </Link>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Signup;